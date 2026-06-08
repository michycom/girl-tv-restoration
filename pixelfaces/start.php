<?php
// List all .html files in the current directory and output links with target="_blank"

$files = glob(__DIR__ . DIRECTORY_SEPARATOR . '*.html');

if ($files === false) {
    die('Error reading directory.');
}

if (count($files) === 0) {
    echo 'No .html files found.';
    exit;
}

echo "<ul>\n";
foreach ($files as $file) {
    $name = basename($file);
    $href = rawurlencode($name); // safe for spaces/special chars
    echo '  <li><a href="' . $href . '" target="_blank" rel="noopener noreferrer">' 
        . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') 
        . "</a></li>\n";
}
echo "</ul>\n";
?>