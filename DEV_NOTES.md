# LoopX – Dev Notes (future Claude ke liye)

**Read this first before any update.** User = Bir. Replies in Hinglish. App UI fully English.

## Rules from the user
- ALL files in ONE flat folder (no subfolders). He uploads from his phone in one go. Only exception: `.github/workflows/build-apk.yml` (he creates it once by hand via GitHub "Create new file").
- Each feature = its own small file / snippet (easy to understand and update). Never merge everything into one big file.
- Header shows only the text "LoopX" (no logo). Logo only on Home hero card, app icon, favicon.
- Premium, youthful, Billora-style look. 6 themes.
- Give a zip (`loopx.zip`) of the folder at the end. Update MANUAL.md + this file when behaviour changes.

## What it is
Chat-style hub for the user's local n8n. Static site (GitHub Pages) + Android APK built by GitHub Actions (Capacitor 6, Java 17). No backend. All data in `localStorage` key `loopx.v2`.

## File map (script order matters, see index.html)
| File | Job |
|---|---|
| util.js | `$`, `esc`, `ico()` SVG icons (`ICO` map), `toast`, `fmt`, `saveFile` (share/clipboard/download) |
| storage.js | `Store` (`d` = apps, chats, outs, log, theme, activeApp, activeChat) |
| workflow.js | `Starter` = importable n8n starter workflow JSON + download |
| n8n.js | `N8N.send(app, chat, message, extra)` POST, Bearer token, 120s timeout, normalises reply/dashboard |
| dashboard.js | `Dash.show(data)` renders cards / table / text / sandboxed html into `#dash` |
| chat.js | `Chat` centre screen: render, bubble (View output + Copy), send |
| sidebar.js | `THEMES`, `Sidebar` (theme apply, drawer history), `Sheet` (right output panel) |
| screens.js | `Home`, `Flows` (list, edit dialog, test, connect guide), `Outs` |
| wizard.js | `Wizard` 3-step connect dialog (`#wiz`), builds URL from IP, tests via N8N.send, `hint()` turns errors into plain-English fixes |
| voice.js | mic -> SpeechRecognition (lang en-IN) |
| backup.js | export / import `Store.d` |
| main.js | `Main` router `go()`, `refresh()`, `bind()`, init |
| style.css | all styles; theme = CSS vars `--a --a2 --h1 --bg`, `body.dark` for Midnight |
| sw.js | PWA cache (bump `loopx-vN` and file list when adding files) |
| manifest.webmanifest, capacitor.config.json, package.json, build-apk.yml | PWA + APK build |

## Data model
- app: `{id,name,webhook,token,ok}` (ok: null/true/false from last test or send)
- chat: `{id,appId,title,msgs:[{role:'me'|'bot',text,err?,out?}],ts}`
- out: `{id,ts,app,title,data}` (max 60) ; log: `{ts,ok}` (max 200)

## n8n contract
Request POST JSON: `{message, chatId, appId, history[last 10], test?}`.
Response JSON: `{reply?, dashboard?}` (also accepts output/text/message/data, array of 1). `dashboard` = string(html/text) | array(table) | `{title,cards[{label,value}],table[],text,html}`.

## Gotchas
- `localhost` on the phone = the phone. Use computer's Wi-Fi IP. Capacitor config: `androidScheme:"http"`, `cleartext:true`, `CapacitorHttp` enabled (avoids CORS / mixed content). Browser on https GitHub Pages cannot call http LAN IPs (except localhost on desktop Chrome/Firefox).
- Blob downloads do not work in Android WebView -> use `saveFile` (share sheet, else clipboard).
- GitHub web upload skips dot-folders -> that is why the workflow is created by hand.
- Dashboard html is rendered in `sandbox="allow-scripts"` iframe. Use `textContent`, never raw innerHTML with user/n8n data (use `esc`).
- Capacitor 6 needs Java 17; Capacitor 7 needs Java 21 (update workflow if upgrading).
- Nothing was tested on a real device by Claude (no network/emulator in the sandbox).

## How to add a feature (checklist)
1. New file `feature.js` with one global object + `init()`; add `<script>` in index.html before main.js; call init in `Main.init`.
2. Add icon to `ICO` if needed, styles at end of style.css.
3. Add file to `sw.js` list (bump cache name). `build-apk.yml` copies `*.js` automatically; add new non-js assets to its `cp` line.
4. Update MANUAL.md (user steps) and this file (file map). Run `node --check *.js`. Re-zip.

## Ideas not built yet
Per-automation dashboard layouts, file/image attach, streaming replies, scheduled runs, push notifications, PIN lock.

## Splash + icons + APK build
- Icon = `icon-1024.png` (glowing infinity in circle). `icon-192/512.png` for PWA/favicon/in-app splash. `logo.png` (wordmark) only in Home hero.
- In-app splash: `splash.js` + `#splash` div + "polish layer" CSS. Background colour = corner pixel of the icon.
- Native Android icon/splash: `brand_android.py` (runs in CI after `cap add android`) writes mipmap launcher/round/foreground PNGs, `ic_launcher_background.xml`, `drawable/splash.xml` (layer-list, centred logo) and patches `styles.xml` for the Android 12 splash. It deletes same-name files of other extensions first.
- build-apk.yml: if the branded build fails, a FALLBACK step rebuilds with default icon so an APK always exists. Output is `loopx.apk`, uploaded as artifact AND attached to GitHub Release tag `loopx-latest` (needs `permissions: contents: write`).
- User must paste build-apk.yml text into `.github/workflows/build-apk.yml` by hand whenever it changes (phone upload cannot write dot-folders).
- Never tested on a device by Claude. If a build fails, ask for the red step name/screenshot.
