// girl.tv Desktop (MVP)
// MacOS-like browser desktop over Apache Autoindex
//
// Root (Apache directory listing) is assumed to be same-origin at /desktop/
// Subfolders should NOT contain index.html so Autoindex HTML is returned.
//
// NOTE: client storage is only for UI convenience. Never trust it.

const ROOT = "/desktop/";          // Apache directory listing root
const desktopEl = document.getElementById("desktop");
const pathBadge = document.getElementById("pathBadge");

const appleBtn = document.getElementById("apple");
const dropdown = document.getElementById("dropdown");
const menuAbout = document.getElementById("menuAbout");
const menuDesktop = document.getElementById("menuDesktop");
const menuAblage = document.getElementById("menuAblage");
const menuShare = document.getElementById("menuShare");
const menuUpload = document.getElementById("menuUpload");
const menuSync = document.getElementById("menuSync");

const preview = document.getElementById("preview");
const previewTitle = document.getElementById("previewTitle");
const previewContent = document.getElementById("previewContent");
const closeBtn = document.getElementById("closeBtn");

const DEVICE_ID_KEY = "girltv:device-id";
const DB_NAME = "girltv-local-share";
const DB_VERSION = 2;
const DB_STORE = "files";
const RTC_KEY = "girltv:rtc-key";

let swRegistration = null;

let currentPath = ROOT; // always ends with /
let items = [];
let selectedId = null;

// ===== Clock =====
const clockEl = document.getElementById("clock");
function tickClock() {
  if (!clockEl) return;
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const s = `${d.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" })} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  clockEl.textContent = s;
}
tickClock(); setInterval(tickClock, 10_000);

// ===== Helpers =====
function normalizePath(p) {
  if (!p.startsWith("/")) p = "/" + p;
  if (!p.endsWith("/")) p += "/";
  return p;
}

function joinPath(base, name) {
  if (!base.endsWith("/")) base += "/";
  return base + name;
}

function storageKeyForPath(path) {
  return `desktop-layout:${path}`;
}

function isLikelyImage(name) {
  const n = name.toLowerCase();
  return n.endsWith(".png") || n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".webp") || n.endsWith(".gif") || n.endsWith(".avif");
}

function esc(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}

// ===== Device + Local storage helpers =====
function ensureDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    const rand = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    id = `gtv-${rand}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

function openLocalDb() {
  if (!("indexedDB" in window)) return Promise.reject(new Error("IndexedDB not supported"));

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onupgradeneeded = (ev) => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        const store = db.createObjectStore(DB_STORE, { keyPath: "id" });
        store.createIndex("by_path", "path", { unique: false });
      }
      if (ev.oldVersion < 2) {
        const store = req.transaction?.objectStore(DB_STORE);
        if (store && !store.indexNames.contains("by_path")) {
          store.createIndex("by_path", "path", { unique: false });
        }
      }
    };
    req.onsuccess = () => resolve(req.result);
  });
}

async function listLocalEntries(path) {
  const p = normalizePath(path);
  try {
    const db = await openLocalDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, "readonly");
      const store = tx.objectStore(DB_STORE);
      const idx = store.index("by_path");
      const req = idx.getAll(p);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const records = req.result || [];
        const entries = records.map((r) => ({
          id: r.id,
          name: r.name,
          isDir: !!r.isDir,
          isLocal: true,
          path: r.path,
          mime: r.type,
          size: r.size,
          created: r.created,
        }));
        resolve(entries);
      };
    });
  } catch {
    return [];
  }
}

async function getLocalFile(id) {
  try {
    const db = await openLocalDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, "readonly");
      const store = tx.objectStore(DB_STORE);
      const req = store.get(id);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result || null);
    });
  } catch {
    return null;
  }
}

async function findLocalRecord(path, name, isDir = false) {
  const p = normalizePath(path);
  try {
    const db = await openLocalDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, "readonly");
      const store = tx.objectStore(DB_STORE);
      const idx = store.index("by_path");
      const req = idx.getAll(p);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const rec = (req.result || []).find((r) => r.name === name && !!r.isDir === !!isDir);
        resolve(rec || null);
      };
    });
  } catch {
    return null;
  }
}

async function saveLocalFolder(path, name) {
  const p = normalizePath(path);
  const existing = await findLocalRecord(p, name, true);
  const record = {
    id: existing?.id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`),
    path: p,
    name: name || "Ordner",
    type: "inode/directory",
    size: 0,
    created: existing?.created || Date.now(),
    data: null,
    isDir: true,
  };

  const db = await openLocalDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(DB_STORE).put(record);
  });
  return record;
}

async function saveLocalFile(path, file, opts = {}) {
  const p = normalizePath(path);
  const buffer = await file.arrayBuffer();
  const existing = opts.keepName ? await findLocalRecord(p, file.name || "unbenannt", false) : null;
  const record = {
    id: existing?.id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`),
    path: p,
    name: file.name || "unbenannt",
    type: file.type || "application/octet-stream",
    size: file.size || buffer.byteLength,
    created: existing?.created || Date.now(),
    data: buffer,
    isDir: false,
  };

  const db = await openLocalDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(DB_STORE).put(record);
  });

  return record;
}

async function upsertLocalTextFile(path, name, text, type = "text/plain") {
  const p = normalizePath(path);
  const existing = await findLocalRecord(p, name, false);
  const encoder = new TextEncoder();
  const buf = encoder.encode(text);
  const record = {
    id: existing?.id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`),
    path: p,
    name,
    type,
    size: buf.byteLength,
    created: existing?.created || Date.now(),
    data: buf,
    isDir: false,
  };

  const db = await openLocalDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(DB_STORE).put(record);
  });
  return record;
}

function createRtcKey() {
  const rand = crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(4)) : [Date.now(), Math.random() * 1e9, Math.random() * 1e9, Math.random() * 1e9];
  const parts = Array.from(rand).map((n) => n.toString(16).slice(0, 4).padStart(4, "0"));
  return `rtcp-${parts.join("-")}`;
}

function ensureRtcKey() {
  let key = localStorage.getItem(RTC_KEY);
  if (!key) {
    key = createRtcKey();
    localStorage.setItem(RTC_KEY, key);
  }
  return key;
}

async function regenerateRtcKey() {
  const key = createRtcKey();
  localStorage.setItem(RTC_KEY, key);
  await ensureB2BReadme();
  return key;
}

async function ensureB2BReadme() {
  const deviceId = ensureDeviceId();
  const rtcKey = ensureRtcKey();
  const text = `girl.tv Desktop · Browser-zu-Browser (MVP)

Deine Browser-ID (teilen, um dich zu erkennen):
${deviceId}

RTCP Verbindungsschluessel (teilen, wenn ihr euch koppeln wollt):
${rtcKey}

So kannst du eine Browser-zu-Browser Verbindung aufbauen (Konzept-Guide):
1) Beide Parteien oeffnen girl.tv Desktop im Browser (gleiche Version).
2) Beide generieren/teilen ihren RTCP-Schluessel und Browser-ID.
3) Ueber einen separaten Kanal (Chat/Telefon) tauscht ihr die Schluessel aus.
4) Ein Peer baut mit dem gemeinsamen RTCP-Schluessel einen WebRTC-Datenkanal auf.
5) Wenn der Kanal steht, koennen Dateien/Verzeichnisse synchronisiert werden.

Status: Dieser Readme ist lokal gespeichert (offline). RTCP ist hier nur ein Konzept-Token, echte Signalisierung muesst ihr separat bereitstellen (z.B. kleiner HTTPS Signalisierungsserver, WebRTC-DataChannel). Wenn du den Schluessel erneuerst, wird dieser Readme angepasst.`;
  await upsertLocalTextFile(ROOT, "B2B-Readme.txt", text, "text/plain");
}

// ===== Autoindex parsing =====
// Tries to extract links from Apache autoindex page.
async function fetchDirectoryListing(path) {
  const url = path; // same origin
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const html = await res.text();

  const doc = new DOMParser().parseFromString(html, "text/html");
  const anchors = Array.from(doc.querySelectorAll("a[href]"));

  // Common autoindex includes: Parent Directory, query params, etc.
  const entries = [];
  for (const a of anchors) {
    const href = a.getAttribute("href");
    if (!href) continue;

    // Skip sorting links like "?C=N;O=D" etc
    if (href.startsWith("?")) continue;

    // Some autoindex uses absolute, some relative
    const label = (a.textContent || "").trim();

    // Parent dir
    if (label.toLowerCase().includes("parent") || href === "../") continue;

    // Ignore anchors that are just the current dir
    if (href === "./") continue;

    // Clean: decode but keep original for URL join
    let name = href;
    const isDir = name.endsWith("/");
    if (isDir) name = name.slice(0, -1);

    try { name = decodeURIComponent(name); } catch {}

    if (!name || name === "." || name === "..") continue;

    // Avoid duplicates
    if (entries.some(e => e.name === name && e.isDir === isDir)) continue;

    entries.push({
      id: `${name}:${isDir ? "d" : "f"}`,
      name,
      isDir,
      href: href,
    });
  }

  // Sort: dirs first, then files
  entries.sort((a,b) => {
    if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
    return a.name.localeCompare(b.name, "de");
  });

  return entries;
}

// ===== Layout =====
function loadLayout(path) {
  const key = storageKeyForPath(path);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function saveLayout(path, layout) {
  const key = storageKeyForPath(path);
  localStorage.setItem(key, JSON.stringify(layout));
}

function autoGridPositions(entries) {
  // simple grid on the right like macOS
  const marginTop = 10;
  const marginRight = 20;
  const colWidth = 110;
  const rowHeight = 110;

  const desktopRect = desktopEl.getBoundingClientRect();
  const cols = Math.max(1, Math.floor((desktopRect.width - 60) / colWidth));

  // place from top-right to left
  const positions = {};
  let i = 0;
  for (const e of entries) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = desktopRect.width - marginRight - colWidth * (col + 1);
    const y = marginTop + rowHeight * row;
    positions[e.id] = { x: Math.max(10, x), y: Math.max(10, y) };
    i++;
  }
  return positions;
}

// ===== Rendering =====
function clearDesktop() {
  desktopEl.innerHTML = "";
}

function renderItems(path, entries) {
  clearDesktop();
  pathBadge.textContent = path;

  const saved = loadLayout(path);
  const fallback = autoGridPositions(entries);
  const layout = { ...fallback, ...saved };

  for (const e of entries) {
    const pos = layout[e.id] || { x: 20, y: 20 };

    const icon = document.createElement("div");
    icon.className = `icon ${e.isDir ? "folder" : "file"}`;
    icon.style.left = `${pos.x}px`;
    icon.style.top = `${pos.y}px`;
    icon.dataset.id = e.id;

    const thumb = document.createElement("div");
    thumb.className = "thumb";

    if (!e.isDir && !e.isLocal && isLikelyImage(e.name)) {
      const img = document.createElement("img");
      img.alt = e.name;
      img.loading = "lazy";
      img.src = joinPath(path, encodeURI(e.name));
      thumb.appendChild(img);
    } else {
      // simple glyphs; later: replace with svg icons
      thumb.textContent = e.isDir ? "📁" : (e.isLocal ? "💾" : "📄");
      thumb.style.fontSize = "28px";
    }

    const label = document.createElement("div");
    label.className = "label";
    label.textContent = e.isLocal ? `${e.name} (local)` : e.name;

    icon.appendChild(thumb);
    icon.appendChild(label);

    // selection
    icon.addEventListener("pointerdown", (ev) => {
      if (ev.button !== 0) return;
      select(e.id);
    });

    // open on double click
    icon.addEventListener("dblclick", async () => {
      await openEntry(e, path);
    });

    enableDragging(icon, path, layout);
    desktopEl.appendChild(icon);
  }

  // click empty space clears selection
  desktopEl.addEventListener("pointerdown", (ev) => {
    if (ev.target === desktopEl) select(null);
  }, { once: true });
}

function select(id) {
  selectedId = id;
  for (const el of desktopEl.querySelectorAll(".icon")) {
    el.classList.toggle("selected", el.dataset.id === id);
  }
}

// ===== Dragging =====
function enableDragging(iconEl, path, layout) {
  let dragging = false;
  let startX = 0, startY = 0;
  let baseX = 0, baseY = 0;

  const id = iconEl.dataset.id;

  iconEl.addEventListener("pointerdown", (ev) => {
    if (ev.button !== 0) return;
    iconEl.setPointerCapture(ev.pointerId);
    dragging = false;
    startX = ev.clientX;
    startY = ev.clientY;

    const rect = iconEl.getBoundingClientRect();
    const deskRect = desktopEl.getBoundingClientRect();
    baseX = rect.left - deskRect.left;
    baseY = rect.top - deskRect.top;
  });

  iconEl.addEventListener("pointermove", (ev) => {
    if (!iconEl.hasPointerCapture(ev.pointerId)) return;
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;

    // start drag after tiny threshold
    if (!dragging && (Math.abs(dx) + Math.abs(dy)) > 4) dragging = true;
    if (!dragging) return;

    const x = Math.max(0, baseX + dx);
    const y = Math.max(0, baseY + dy);
    iconEl.style.left = `${x}px`;
    iconEl.style.top = `${y}px`;
  });

  iconEl.addEventListener("pointerup", (ev) => {
    if (!iconEl.hasPointerCapture(ev.pointerId)) return;
    iconEl.releasePointerCapture(ev.pointerId);

    if (!dragging) return;

    const left = parseFloat(iconEl.style.left);
    const top = parseFloat(iconEl.style.top);
    layout[id] = { x: left, y: top };

    // persist
    saveLayout(path, layout);
  });
}

// ===== Drag & Drop uploads =====
function enableDesktopDrop() {
  const allow = (ev) => {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "copy";
  };
  desktopEl.addEventListener("dragover", allow);
  document.addEventListener("dragover", allow);
  desktopEl.addEventListener("drop", (ev) => {
    ev.preventDefault();
    handleDrop(ev).catch((e) => console.warn("drop failed", e));
  });
  document.addEventListener("drop", (ev) => {
    ev.preventDefault();
    handleDrop(ev).catch((e) => console.warn("drop failed", e));
  });
}

async function handleDrop(ev) {
  const items = ev.dataTransfer?.items;
  const files = ev.dataTransfer?.files;

  // Prefer directory-aware entries
  if (items && items.length && items[0].webkitGetAsEntry) {
    await handleEntryDrop(items);
    return;
  }

  if (files && files.length) {
    await handleFileListDrop(Array.from(files));
  }
}

async function handleEntryDrop(items) {
  const folders = [];
  const folderKey = new Set();
  const files = [];

  const addFolder = (path, name) => {
    const key = `${normalizePath(path)}|${name}`;
    if (folderKey.has(key)) return;
    folderKey.add(key);
    folders.push({ path: normalizePath(path), name });
  };

  async function walkEntry(entry, basePath) {
    if (entry.isDirectory) {
      addFolder(basePath, entry.name);
      const dirPath = normalizePath(joinPath(basePath, entry.name) + "/");
      const reader = entry.createReader();
      const children = await readAllEntries(reader);
      for (const child of children) {
        await walkEntry(child, dirPath);
      }
    } else if (entry.isFile) {
      const file = await new Promise((resolve, reject) => entry.file(resolve, reject));
      files.push({ path: normalizePath(basePath), file });
    }
  }

  const entries = Array.from(items)
    .map((i) => i.webkitGetAsEntry?.())
    .filter(Boolean);

  for (const entry of entries) {
    await walkEntry(entry, currentPath);
  }

  for (const f of folders) await saveLocalFolder(f.path, f.name);
  for (const f of files) await saveLocalFile(f.path, f.file, { keepName: true });

  await openFolder(currentPath);
  openPreview("Upload", `<pre>${files.length} Datei(en) & ${folders.length} Ordner wurden lokal gespeichert.</pre>`);
}

async function readAllEntries(reader) {
  const out = [];
  async function readBatch() {
    return await new Promise((resolve, reject) => {
      reader.readEntries((entries) => resolve(entries), (err) => reject(err));
    });
  }

  let batch = await readBatch();
  while (batch.length) {
    out.push(...batch);
    batch = await readBatch();
  }
  return out;
}

async function handleFileListDrop(fileList) {
  const folders = [];
  const folderKey = new Set();
  const addFolder = (path, name) => {
    const key = `${normalizePath(path)}|${name}`;
    if (folderKey.has(key)) return;
    folderKey.add(key);
    folders.push({ path: normalizePath(path), name });
  };

  const files = [];
  for (const file of fileList) {
    const rel = file.webkitRelativePath || file.name;
    const parts = rel.split("/").filter(Boolean);
    const name = parts.pop() || file.name;
    let basePath = currentPath;
    for (const folderName of parts) {
      addFolder(basePath, folderName);
      basePath = normalizePath(joinPath(basePath, folderName) + "/");
    }
    files.push({ path: basePath, file: new File([file], name, { type: file.type }) });
  }

  for (const f of folders) await saveLocalFolder(f.path, f.name);
  for (const f of files) await saveLocalFile(f.path, f.file, { keepName: true });

  await openFolder(currentPath);
  openPreview("Upload", `<pre>${files.length} Datei(en) & ${folders.length} Ordner wurden lokal gespeichert.</pre>`);
}

// ===== Preview =====
function openPreview(title, html) {
  previewTitle.textContent = title;
  previewContent.innerHTML = html;
  preview.style.display = "flex";
}

function closePreview() {
  preview.style.display = "none";
  previewTitle.textContent = "";
  previewContent.innerHTML = "";
}
closeBtn.addEventListener("click", closePreview);
preview.addEventListener("click", (ev) => {
  if (ev.target === preview) closePreview();
});

async function openEntry(entry, path) {
  if (entry.isDir) {
    await openFolder(joinPath(path, encodeURI(entry.name)) + "/");
    return;
  }

  if (entry.isLocal) {
    await openLocalFile(entry);
    return;
  }

  await openRemoteFile(path, entry.name);
}

async function openRemoteFile(path, name) {
  const url = joinPath(path, encodeURI(name));

  if (isLikelyImage(name)) {
    openPreview(name, `<img src="${esc(url)}" alt="${esc(name)}">`);
    return;
  }

  // For text-ish files: show a snippet (best effort)
  try {
    const res = await fetch(url, { cache: "no-store" });
    const ct = res.headers.get("content-type") || "";
    const text = await res.text();

    const safe = esc(text.slice(0, 20000));
    openPreview(name, `<pre>${safe}</pre><div style="opacity:.7;font-size:12px;margin-top:10px;">${esc(ct)}</div>`);
  } catch (e) {
    openPreview(name, `<pre>Could not load file.\n${esc(String(e))}</pre>`);
  }
}

async function openLocalFile(entry) {
  const record = await getLocalFile(entry.id);
  if (!record) {
    openPreview(entry.name, `<pre>Lokale Datei wurde nicht gefunden oder konnte nicht geladen werden.</pre>`);
    return;
  }
  if (record.isDir) {
    await openFolder(joinPath(record.path, encodeURI(record.name)) + "/");
    return;
  }

  const blob = new Blob([record.data], { type: record.type || "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  window.open(url, "_blank", "noopener");

  if (record.type && record.type.startsWith("image/")) {
    openPreview(entry.name, `<img src="${esc(url)}" alt="${esc(entry.name)}">`);
    return;
  }

  try {
    const text = await blob.text();
    const safe = esc(text.slice(0, 20000));
    openPreview(entry.name, `<pre>${safe}</pre><div style="opacity:.7;font-size:12px;margin-top:10px;">Lokale Datei · ${esc(record.type || "unknown")} · ${Math.round(record.size / 1024)} KB</div><div style="margin-top:10px;"><a href="${esc(url)}" download="${esc(entry.name)}" style="color:white;">Download</a></div>`);
  } catch {
    openPreview(entry.name, `<pre>Download-only</pre><div style="margin-top:10px;"><a href="${esc(url)}" download="${esc(entry.name)}" style="color:white;">Download</a></div>`);
  }
}

// ===== Navigation =====
async function openFolder(path) {
  currentPath = normalizePath(path);
  const [remoteEntries, localEntries] = await Promise.all([
    fetchDirectoryListing(currentPath).catch((err) => {
      console.warn("Remote listing failed", err);
      return [];
    }),
    listLocalEntries(currentPath),
  ]);
  items = [...remoteEntries, ...localEntries].sort((a, b) => {
    if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
    return a.name.localeCompare(b.name, "de");
  });
  renderItems(currentPath, items);
}

// ===== Menu =====
function toggleDropdown(show) {
  dropdown.style.display = show ? "block" : "none";
  dropdown.setAttribute("aria-hidden", show ? "false" : "true");
}

appleBtn.addEventListener("click", () => {
  const isOpen = dropdown.style.display === "block";
  if (isOpen) toggleDropdown(false);
  else {
    dropdown.innerHTML = `
      <div class="row">
        <div class="emoji">👋</div>
        <div>
          <div class="title">Welcome</div>
          <div class="sub">public data desktop by girl.tv</div>
        </div>
      </div>
      <div class="row" id="ddAbout">
        <div class="emoji">ℹ️</div>
        <div>
          <div class="title">About this Project</div>
          <div class="sub">MacOS-like browser desktop for public directories</div>
        </div>
      </div>
      <div class="row" id="ddRoot">
        <div class="emoji">🖥️</div>
        <div>
          <div class="title"><b>Desktop</b></div>
          <div class="sub">${esc(ROOT)}</div>
        </div>
      </div>
      <div class="row" id="ddUp">
        <div class="emoji">⬆️</div>
        <div>
          <div class="title">Up one level</div>
          <div class="sub">go to parent directory</div>
        </div>
      </div>
    `;
    toggleDropdown(true);

    dropdown.querySelector("#ddAbout")?.addEventListener("click", () => {
      toggleDropdown(false);
      openPreview("About", `<pre>
This is a browser desktop UI that reads Apache directory listings.
Root: ${esc(ROOT)}
Current: ${esc(currentPath)}
      </pre>`);
    });

    dropdown.querySelector("#ddRoot")?.addEventListener("click", async () => {
      toggleDropdown(false);
      await openFolder(ROOT);
    });

    dropdown.querySelector("#ddUp")?.addEventListener("click", async () => {
      toggleDropdown(false);
      const p = parentPath(currentPath);
      await openFolder(p);
    });
  }
});

// close menu on click outside
document.addEventListener("pointerdown", (ev) => {
  if (dropdown.style.display !== "block") return;
  const inside = dropdown.contains(ev.target) || appleBtn.contains(ev.target);
  if (!inside) toggleDropdown(false);
});

// top menu actions
menuAbout.addEventListener("click", () => openPreview("About this Project", `<pre>
Root: ${esc(ROOT)}
Current: ${esc(currentPath)}
Uses Apache Autoindex HTML parsing (MVP).
</pre>`));

menuDesktop.addEventListener("click", async () => {
  await openFolder(ROOT);
});

menuShare.addEventListener("click", () => {
  const id = ensureDeviceId();
  const rtcKey = ensureRtcKey();
  openPreview("Share & RTCP Key", `<div style="display:grid;gap:10px;font-size:13px;line-height:1.4;">
    <div>Browser-ID identifiziert dein Geraet. RTCP-Schluessel ist euer gemeinsamer Token f&uuml;r Browser-zu-Browser.</div>
    <div><b>Browser-ID</b></div>
    <pre style="font-size:14px;">${esc(id)}</pre>
    <button id="copyDeviceId" style="padding:8px 12px;border-radius:10px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.08);color:white;cursor:pointer;">Copy ID</button>
    <div style="margin-top:6px;"><b>RTCP Key</b></div>
    <pre style="font-size:14px;">${esc(rtcKey)}</pre>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button id="copyRtcKey" style="padding:8px 12px;border-radius:10px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.08);color:white;cursor:pointer;">Copy RTCP</button>
      <button id="regenRtcKey" style="padding:8px 12px;border-radius:10px;border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.18);background:rgba(255,255,255,0.14);color:white;cursor:pointer;">Neuen Key erzeugen</button>
    </div>
    <div style="opacity:.7;">Tipp: Nach neuem Key wird der lokale README aktualisiert.</div>
  </div>`);

  const copyBtn = previewContent.querySelector("#copyDeviceId");
  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(id);
      copyBtn.textContent = "Copied";
    } catch (e) {
      copyBtn.textContent = "Copy failed";
      console.warn("Clipboard error", e);
    }
  });

  const copyRtcBtn = previewContent.querySelector("#copyRtcKey");
  copyRtcBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(ensureRtcKey());
      copyRtcBtn.textContent = "Copied";
    } catch (e) {
      copyRtcBtn.textContent = "Copy failed";
    }
  });

  const regenBtn = previewContent.querySelector("#regenRtcKey");
  regenBtn?.addEventListener("click", async () => {
    const newKey = await regenerateRtcKey();
    await ensureB2BReadme();
    previewContent.querySelector("pre:nth-of-type(2)").textContent = newKey;
    copyRtcBtn.textContent = "Copy RTCP";
    regenBtn.textContent = "Neuen Key erzeugt";
  });
});

const uploadInput = document.createElement("input");
uploadInput.type = "file";
uploadInput.multiple = true;
uploadInput.style.display = "none";
uploadInput.addEventListener("change", handleLocalUpload);
document.body.appendChild(uploadInput);

menuUpload.addEventListener("click", () => {
  uploadInput.value = "";
  uploadInput.click();
});

menuSync.addEventListener("click", async () => {
  const msg = await syncWithServer();
  openPreview("Sync with Server", `<pre>${esc(msg)}</pre>`);
});

menuAblage.addEventListener("click", () => {
  openPreview("Ablage (MVP)", `<pre>
"Ablage" can become:
- recently opened files
- pinned folders
- downloads / uploads
- share/connect entries (Phase 2)
</pre>`);
});

async function handleLocalUpload() {
  const files = Array.from(uploadInput.files || []);
  if (!files.length) return;

  let saved = 0;
  for (const f of files) {
    try {
      await saveLocalFile(currentPath, f, { keepName: true });
      saved++;
    } catch (e) {
      console.warn("Could not save local file", e);
    }
  }

  uploadInput.value = "";
  await openFolder(currentPath);
  openPreview("Lokaler Upload", `<pre>${saved} Datei(en) wurden lokal in diesem Browser gespeichert.\nSie bleiben offline und k&ouml;nnen sp&auml;ter zwischen Devices geteilt werden.</pre>`);
}

function parentPath(path) {
  // /desktop/a/b/ -> /desktop/a/
  const p = normalizePath(path);
  if (p === ROOT) return ROOT;
  const trimmed = p.endsWith("/") ? p.slice(0, -1) : p;
  const idx = trimmed.lastIndexOf("/");
  const parent = trimmed.slice(0, idx + 1);
  // prevent walking above ROOT
  if (!parent.startsWith(ROOT)) return ROOT;
  return parent;
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  try {
    swRegistration = await navigator.serviceWorker.register(new URL("./sw.js", location.href));
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
    return swRegistration;
  } catch (e) {
    console.warn("Service worker registration failed", e);
    return null;
  }
}

async function syncWithServer() {
  if (!("serviceWorker" in navigator)) {
    return "Service Worker nicht verfuegbar. Browser laedt Assets direkt.";
  }
  const reg = swRegistration || await registerServiceWorker();
  if (!reg) return "Konnte Service Worker nicht starten.";

  try {
    await reg.update();
  } catch (e) {
    console.warn("SW update failed", e);
  }

  const worker = reg.waiting || reg.installing || reg.active;
  if (worker) worker.postMessage({ type: "REFRESH_ASSETS" });
  if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });

  return "Offline-Shell aktualisiert. Nur nach manuellem Sync wird neuer Code geladen.";
}

// ===== Boot =====
(async function boot() {
  try {
    registerServiceWorker();
    enableDesktopDrop();
    try {
      await ensureB2BReadme();
    } catch (e) {
      console.warn("Could not create README", e);
    }
    await openFolder(ROOT);
  } catch (e) {
    openPreview("Error", `<pre>
Could not open ROOT: ${esc(ROOT)}
${esc(String(e))}
Make sure Apache Autoindex is enabled for ${esc(ROOT)}.
</pre>`);
  }
})();
