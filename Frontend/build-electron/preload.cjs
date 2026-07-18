"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// electron/preload.ts
var preload_exports = {};
module.exports = __toCommonJS(preload_exports);
var import_electron = require("electron");
var electronAPI = {
  // ETS2
  detectETS2: () => import_electron.ipcRenderer.invoke("ets2:detect"),
  getETS2Status: () => import_electron.ipcRenderer.invoke("ets2:status"),
  ensureModFolder: () => import_electron.ipcRenderer.invoke("ets2:ensureModFolder"),
  // Launch
  launchETS2: () => import_electron.ipcRenderer.invoke("ets2:launch"),
  launchETS2Direct: (exePath) => import_electron.ipcRenderer.invoke("ets2:launchDirect", exePath),
  stopETS2: () => import_electron.ipcRenderer.invoke("ets2:stop"),
  isETS2Running: () => import_electron.ipcRenderer.invoke("ets2:isRunning"),
  // Filesystem
  readFile: (path) => import_electron.ipcRenderer.invoke("fs:readFile", path),
  writeFile: (path, data) => import_electron.ipcRenderer.invoke("fs:writeFile", path, data),
  deleteFile: (path) => import_electron.ipcRenderer.invoke("fs:deleteFile", path),
  fileExists: (path) => import_electron.ipcRenderer.invoke("fs:fileExists", path),
  readDirectory: (path) => import_electron.ipcRenderer.invoke("fs:readDirectory", path),
  ensureDir: (path) => import_electron.ipcRenderer.invoke("fs:ensureDir", path),
  copyFile: (source, destination) => import_electron.ipcRenderer.invoke("fs:copyFile", source, destination),
  getModFolder: () => import_electron.ipcRenderer.invoke("fs:getModFolder"),
  openFolder: (folderPath) => import_electron.ipcRenderer.invoke("fs:openFolder", folderPath),
  openExternal: (url) => import_electron.ipcRenderer.invoke("fs:openExternal", url),
  // Dialogs
  selectFolder: (options) => import_electron.ipcRenderer.invoke("dialog:selectFolder", options),
  selectFile: (options) => import_electron.ipcRenderer.invoke("dialog:selectFile", options),
  confirm: (message, title) => import_electron.ipcRenderer.invoke("dialog:confirm", message, title),
  alert: (message, title) => import_electron.ipcRenderer.invoke("dialog:alert", message, title),
  showError: (message, title) => import_electron.ipcRenderer.invoke("dialog:error", message, title),
  // Settings
  getSettings: () => import_electron.ipcRenderer.invoke("settings:getAll"),
  getSetting: (key) => import_electron.ipcRenderer.invoke("settings:get", key),
  setSetting: (key, value) => import_electron.ipcRenderer.invoke("settings:set", key, value),
  setSettings: (entries) => import_electron.ipcRenderer.invoke("settings:setMultiple", entries),
  resetSettings: () => import_electron.ipcRenderer.invoke("settings:reset"),
  // Window controls
  minimizeWindow: () => import_electron.ipcRenderer.send("window:minimize"),
  maximizeWindow: () => import_electron.ipcRenderer.send("window:maximize"),
  closeWindow: () => import_electron.ipcRenderer.send("window:close"),
  isMaximized: () => import_electron.ipcRenderer.invoke("window:isMaximized"),
  onMaximizeChange: (callback) => {
    const handler = (_event, isMaximized) => callback(isMaximized);
    import_electron.ipcRenderer.on("window:maximizeChange", handler);
    return () => {
      import_electron.ipcRenderer.removeListener("window:maximizeChange", handler);
    };
  },
  // Platform
  getPlatform: () => process.platform,
  getAppVersion: () => import_electron.ipcRenderer.invoke("app:getVersion")
};
import_electron.contextBridge.exposeInMainWorld("electronAPI", electronAPI);
//# sourceMappingURL=preload.cjs.map
