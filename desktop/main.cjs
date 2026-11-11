const fs = require("node:fs");
const path = require("node:path");
const { app, BrowserWindow, dialog, shell } = require("electron");

function getApplicationUrl() {
  const configPath = app.isPackaged
    ? path.join(process.resourcesPath, "app-config.json")
    : path.join(__dirname, "build", "app-config.json");
  const config = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, "utf8"))
    : { appUrl: process.env.CAREEROS_WEB_URL || "http://localhost:3000" };
  const applicationUrl = new URL(config.appUrl);

  if (!app.isPackaged && applicationUrl.hostname === "localhost" && applicationUrl.protocol === "http:") {
    return applicationUrl;
  }
  if (applicationUrl.protocol !== "https:") {
    throw new Error("The packaged desktop app requires an HTTPS CareerOS URL.");
  }
  return applicationUrl;
}

function openExternalUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "mailto:") shell.openExternal(url.toString());
  } catch {
    // Ignore malformed navigation targets.
  }
}

function createWindow(applicationUrl) {
  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 960,
    minHeight: 640,
    title: "CareerOS",
    backgroundColor: "#090b0b",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    openExternalUrl(url);
    return { action: "deny" };
  });
  window.webContents.on("will-navigate", (event, target) => {
    if (new URL(target).origin !== applicationUrl.origin) {
      event.preventDefault();
      openExternalUrl(target);
    }
  });
  window.webContents.on("will-redirect", (event, target) => {
    if (new URL(target).origin !== applicationUrl.origin) {
      event.preventDefault();
      openExternalUrl(target);
    }
  });
  window.loadURL(applicationUrl.toString()).catch((error) => {
    dialog.showErrorBox("CareerOS could not open", error.message);
  });
}

app.whenReady().then(() => {
  try {
    createWindow(getApplicationUrl());
  } catch (error) {
    dialog.showErrorBox("CareerOS configuration error", error.message);
    app.quit();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(getApplicationUrl());
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});