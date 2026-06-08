# girl.tv Desktop — MVP (Static Frontend + Apache Autoindex)

This is a minimal, working prototype that renders an Apache directory listing (Autoindex)
as a macOS-like "Desktop" in the browser.

## Files
- `index.html` — UI (wallpaper, top menubar, desktop, modal preview)
- `app.js` — logic (fetch+parse autoindex HTML, render icons, drag layout in localStorage)

## Server requirements (Apache)
You need:
- a public directory root at `/desktop/`
- **Autoindex enabled**
- no `index.html` inside subfolders (so Apache shows its directory listing HTML)

Example Apache config snippet (conceptual):

```
Alias /desktop /var/www/desktop
<Directory /var/www/desktop>
  Options Indexes FollowSymLinks
  AllowOverride None
  Require all granted
</Directory>
```

## Run
Deploy `index.html` and `app.js` to your web root, and serve `/desktop/` as described.

Open:
- `https://YOURDOMAIN/`

## Notes
- This MVP parses Autoindex HTML via DOMParser and <a href="..."> links.
  Different Autoindex templates may require parser tweaks.
- Icon positions are stored per-directory in `localStorage`.
- This is read-only. Upload/rename/delete is not implemented.

## Next upgrades (roadmap)
- Service Worker caching + versioning
- Robust autoindex parsing across templates
- Finder windows, breadcrumbs, search, context menu
- "Connect" (WebRTC) module + signaling server + TURN for reliability
