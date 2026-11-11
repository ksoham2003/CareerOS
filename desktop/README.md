# CareerOS Desktop

Cross-platform Electron wrapper for the hosted CareerOS application. It contains no database credentials and loads the same HTTPS app used by the browser.

## Development

From this directory, install dependencies with `npm install`. Start the web app in `web/`, then run `npm start`. The desktop window defaults to `http://localhost:3000` for local development; set `CAREEROS_WEB_URL` to override it.

## Installers

Deploy CareerOS first. Set the deployed HTTPS origin, then run only the matching command on its native operating system:

```powershell
$env:CAREEROS_WEB_URL = "https://your-careeros-domain.example"
npm run package:win
```

On macOS, set `CAREEROS_WEB_URL` in the shell and run `npm run package:mac`. On Linux, set it and run `npm run package:linux`.

Windows creates `CareerOS-win-x64.exe`, macOS creates a universal `CareerOS-mac-universal.dmg` and ZIP, and Linux creates `CareerOS-linux-x64.AppImage` in `release/`. Publishing a `desktop-v*` tag builds on native Windows, macOS, and Linux runners and attaches all artifacts to one GitHub Release.

Configure `WINDOWS_DESKTOP_DOWNLOAD_URL`, `MACOS_DESKTOP_DOWNLOAD_URL`, and `LINUX_DESKTOP_DOWNLOAD_URL` in the web deployment using matching `releases/latest/download/` asset paths to enable the homepage links. macOS builds are not signed or notarized yet and may show Gatekeeper warnings.