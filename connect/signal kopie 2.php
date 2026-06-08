<?php
declare(strict_types=1);

const SIGNAL_TTL_SECONDS = 900;
const SIGNAL_ID_BYTES = 9;
const SIGNAL_STORAGE_DIR = __DIR__ . '/storage/sessions';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

try {
    ensure_storage_dir();
    cleanup_expired_sessions();

    $method = strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? 'GET'));
    if ($method === 'GET') {
        handle_get();
    }
    if ($method === 'POST') {
        handle_post();
    }

    respond(405, [
        'ok' => false,
        'error' => 'Methode nicht erlaubt.',
    ]);
} catch (Throwable $e) {
    respond(500, [
        'ok' => false,
        'error' => 'Serverfehler: ' . $e->getMessage(),
    ]);
}

function handle_get(): void
{
    $id = normalize_session_id($_GET['id'] ?? '');
    if ($id === '') {
        respond(400, [
            'ok' => false,
            'error' => 'Session-ID fehlt.',
        ]);
    }

    $session = load_session($id);
    if ($session === null || is_expired($session)) {
        delete_session($id);
        respond(404, [
            'ok' => false,
            'error' => 'Kurzlink nicht gefunden oder abgelaufen.',
        ]);
    }

    respond(200, present_session($session));
}

function handle_post(): void
{
    $action = trim((string)($_GET['action'] ?? ''));
    $payload = read_json_request();

    if ($action === 'create') {
        create_session($payload);
    }
    if ($action === 'answer') {
        store_answer($payload);
    }

    respond(400, [
        'ok' => false,
        'error' => 'Unbekannte Aktion.',
    ]);
}

function create_session(array $payload): void
{
    $offer = trim((string)($payload['offer'] ?? ''));
    if ($offer === '') {
        respond(400, [
            'ok' => false,
            'error' => 'Offer fehlt.',
        ]);
    }

    $expiresTs = time() + SIGNAL_TTL_SECONDS;
    $session = [
        'id' => create_session_id(),
        'mode' => normalize_mode($payload['mode'] ?? 'wan'),
        'offer' => $offer,
        'answer' => '',
        'createdAt' => now_iso(),
        'updatedAt' => now_iso(),
        'expiresTs' => $expiresTs,
        'expiresAt' => gmdate(DATE_ATOM, $expiresTs),
    ];

    save_session($session);
    respond(200, present_session($session));
}

function store_answer(array $payload): void
{
    $id = normalize_session_id($payload['id'] ?? '');
    $answer = trim((string)($payload['answer'] ?? ''));
    if ($id === '') {
        respond(400, [
            'ok' => false,
            'error' => 'Session-ID fehlt.',
        ]);
    }
    if ($answer === '') {
        respond(400, [
            'ok' => false,
            'error' => 'Answer fehlt.',
        ]);
    }

    $session = load_session($id);
    if ($session === null || is_expired($session)) {
        delete_session($id);
        respond(404, [
            'ok' => false,
            'error' => 'Kurzlink nicht gefunden oder abgelaufen.',
        ]);
    }

    $expiresTs = time() + SIGNAL_TTL_SECONDS;
    $session['answer'] = $answer;
    $session['updatedAt'] = now_iso();
    $session['answerUpdatedAt'] = now_iso();
    $session['expiresTs'] = $expiresTs;
    $session['expiresAt'] = gmdate(DATE_ATOM, $expiresTs);

    save_session($session);
    respond(200, present_session($session));
}

function read_json_request(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        respond(400, [
            'ok' => false,
            'error' => 'Ungueltiges JSON.',
        ]);
    }

    return $decoded;
}

function normalize_session_id($value): string
{
    $id = trim((string)$value);
    if ($id === '' || !preg_match('/^[A-Za-z0-9_-]{6,64}$/', $id)) {
        return '';
    }
    return $id;
}

function normalize_mode($value): string
{
    return trim((string)$value) === 'lan' ? 'lan' : 'wan';
}

function create_session_id(): string
{
    do {
        $id = rtrim(strtr(base64_encode(random_bytes(SIGNAL_ID_BYTES)), '+/', '-_'), '=');
    } while (file_exists(session_path($id)));

    return $id;
}

function present_session(array $session): array
{
    $response = [
        'ok' => true,
        'id' => (string)$session['id'],
        'link' => build_public_link((string)$session['id']),
        'mode' => normalize_mode($session['mode'] ?? 'wan'),
        'hasAnswer' => !empty($session['answer']),
        'createdAt' => (string)($session['createdAt'] ?? ''),
        'updatedAt' => (string)($session['updatedAt'] ?? ''),
        'expiresAt' => (string)($session['expiresAt'] ?? ''),
    ];

    if (!empty($session['offer'])) {
        $response['offer'] = (string)$session['offer'];
    }
    if (!empty($session['answer'])) {
        $response['answer'] = (string)$session['answer'];
    }

    return $response;
}

function load_session(string $id): ?array
{
    $path = session_path($id);
    if (!is_file($path)) {
        return null;
    }

    $raw = file_get_contents($path);
    if ($raw === false || $raw === '') {
        return null;
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : null;
}

function save_session(array $session): void
{
    $path = session_path((string)$session['id']);
    $json = json_encode($session, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if ($json === false) {
        throw new RuntimeException('Session konnte nicht serialisiert werden.');
    }

    $tmp = $path . '.tmp';
    if (file_put_contents($tmp, $json, LOCK_EX) === false) {
        throw new RuntimeException('Kurzlink-Speicher ist nicht schreibbar.');
    }
    if (!rename($tmp, $path)) {
        @unlink($tmp);
        throw new RuntimeException('Kurzlink-Datei konnte nicht gespeichert werden.');
    }
}

function delete_session(string $id): void
{
    $path = session_path($id);
    if (is_file($path)) {
        @unlink($path);
    }
}

function cleanup_expired_sessions(): void
{
    foreach (glob(SIGNAL_STORAGE_DIR . '/*.json') ?: [] as $path) {
        $raw = file_get_contents($path);
        if ($raw === false || $raw === '') {
            @unlink($path);
            continue;
        }

        $decoded = json_decode($raw, true);
        if (!is_array($decoded) || is_expired($decoded)) {
            @unlink($path);
        }
    }
}

function is_expired(array $session): bool
{
    $expiresTs = (int)($session['expiresTs'] ?? 0);
    return $expiresTs > 0 && $expiresTs < time();
}

function ensure_storage_dir(): void
{
    if (is_dir(SIGNAL_STORAGE_DIR)) {
        return;
    }

    if (!mkdir(SIGNAL_STORAGE_DIR, 0775, true) && !is_dir(SIGNAL_STORAGE_DIR)) {
        throw new RuntimeException('Kurzlink-Speicherverzeichnis konnte nicht erstellt werden.');
    }
}

function session_path(string $id): string
{
    return SIGNAL_STORAGE_DIR . '/' . $id . '.json';
}

function now_iso(): string
{
    return gmdate(DATE_ATOM);
}

function build_public_link(string $id): string
{
    $scriptName = str_replace('\\', '/', (string)($_SERVER['SCRIPT_NAME'] ?? '/signal.php'));
    $basePath = rtrim(dirname($scriptName), '/');
    $basePrefix = $basePath === '' ? '' : rtrim($basePath, '/');
    $scheme = detect_scheme();
    $host = (string)($_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? '');
    if ($host === '') {
        return ($basePrefix !== '' ? $basePrefix : '') . '?s=' . rawurlencode($id);
    }

    return $scheme . '://' . $host . $basePrefix . '?s=' . rawurlencode($id);
}

function detect_scheme(): string
{
    $forwarded = trim((string)($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? ''));
    if ($forwarded !== '') {
        $proto = strtolower(trim(explode(',', $forwarded)[0]));
        if ($proto === 'http' || $proto === 'https') {
            return $proto;
        }
    }

    $https = strtolower((string)($_SERVER['HTTPS'] ?? ''));
    if ($https === 'on' || $https === '1') {
        return 'https';
    }

    if ((string)($_SERVER['SERVER_PORT'] ?? '') === '443') {
        return 'https';
    }

    return 'http';
}

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}
