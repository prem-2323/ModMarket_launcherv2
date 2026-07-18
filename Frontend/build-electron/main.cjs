"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// electron/main.ts
var import_electron7 = require("electron");
var import_path9 = __toESM(require("path"), 1);
var import_fs7 = __toESM(require("fs"), 1);

// electron/ipc/ets2.ts
var import_electron2 = require("electron");

// electron/services/steam.ts
var import_fs2 = __toESM(require("fs"), 1);
var import_path3 = __toESM(require("path"), 1);

// electron/utils/logger.ts
var import_fs = __toESM(require("fs"), 1);
var import_path2 = __toESM(require("path"), 1);

// electron/utils/constants.ts
var import_path = __toESM(require("path"), 1);
var import_electron = require("electron");
var APP_NAME = "ModMarket Launcher";
var APP_VERSION = "2.0.0";
var ETS2_STEAM_URL = "steam://run/227300";
var ETS2_DOCUMENTS_RELATIVE = import_path.default.join(
  "Euro Truck Simulator 2",
  "mod"
);
var SETTINGS_FILE = "settings.json";
var LOG_DIR = "logs";
var LOG_FILE = "launcher.log";
var STORAGE_KEYS = {
  DOWNLOAD_FOLDER: "downloadFolder",
  ETS2_PATH: "ets2Path",
  STEAM_PATH: "steamPath",
  THEME: "theme",
  LANGUAGE: "language",
  AUTO_LAUNCH: "autoLaunch",
  AUTO_UPDATE: "autoUpdate",
  PERF_MODE: "perfMode",
  AUDIO_ENABLED: "audioEnabled"
};
var DEFAULT_SETTINGS = {
  [STORAGE_KEYS.DOWNLOAD_FOLDER]: "",
  [STORAGE_KEYS.ETS2_PATH]: "",
  [STORAGE_KEYS.STEAM_PATH]: "",
  [STORAGE_KEYS.THEME]: "dark",
  [STORAGE_KEYS.LANGUAGE]: "English (US)",
  [STORAGE_KEYS.AUTO_LAUNCH]: false,
  [STORAGE_KEYS.AUTO_UPDATE]: true,
  [STORAGE_KEYS.PERF_MODE]: true,
  [STORAGE_KEYS.AUDIO_ENABLED]: true
};
function getUserDataPath() {
  return import_electron.app.getPath("userData");
}
function getDocumentsPath() {
  return import_electron.app.getPath("documents");
}

// electron/utils/logger.ts
var Logger = class {
  logPath;
  stream = null;
  constructor() {
    const logDir = import_path2.default.join(getUserDataPath(), LOG_DIR);
    if (!import_fs.default.existsSync(logDir)) {
      import_fs.default.mkdirSync(logDir, { recursive: true });
    }
    this.logPath = import_path2.default.join(logDir, LOG_FILE);
    this.stream = import_fs.default.createWriteStream(this.logPath, { flags: "a" });
  }
  formatMessage(level, message) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }
  write(level, message) {
    const formatted = this.formatMessage(level, message);
    console.log(formatted);
    if (this.stream) {
      this.stream.write(formatted + "\n");
    }
  }
  info(message) {
    this.write("INFO" /* INFO */, message);
  }
  warn(message) {
    this.write("WARN" /* WARN */, message);
  }
  error(message, error) {
    const msg = error ? `${message}: ${error.message}
${error.stack}` : message;
    this.write("ERROR" /* ERROR */, msg);
  }
  debug(message) {
    if (process.env.NODE_ENV === "development") {
      this.write("DEBUG" /* DEBUG */, message);
    }
  }
  close() {
    if (this.stream) {
      this.stream.end();
      this.stream = null;
    }
  }
};
var logger = new Logger();

// electron/services/steam.ts
var STEAM_PATHS = [
  "C:\\Program Files (x86)\\Steam",
  "C:\\Program Files\\Steam",
  "D:\\Program Files (x86)\\Steam",
  "D:\\Program Files\\Steam",
  (process.env["ProgramFiles(x86)"] || "") + "\\Steam",
  (process.env["ProgramFiles"] || "") + "\\Steam"
];
function getLibraryFoldersVdf(steamPath) {
  const vdfPath = import_path3.default.join(steamPath, "steamapps", "libraryfolders.vdf");
  if (!import_fs2.default.existsSync(vdfPath)) return [];
  try {
    const content = import_fs2.default.readFileSync(vdfPath, "utf-8");
    const libraries = [];
    const pathRegex = /"path"\s+"([^"]+)"/g;
    let match;
    while ((match = pathRegex.exec(content)) !== null) {
      libraries.push(match[1].replace(/\\\\/g, "\\"));
    }
    return libraries;
  } catch (err) {
    logger.error("Failed to parse libraryfolders.vdf", err);
    return [];
  }
}
function findETS2InLibrary(libraryPath) {
  const commonPath = import_path3.default.join(libraryPath, "steamapps", "common", "Euro Truck Simulator 2");
  if (import_fs2.default.existsSync(commonPath)) {
    const exePath = import_path3.default.join(commonPath, "eurotrucks2.exe");
    if (import_fs2.default.existsSync(exePath)) return commonPath;
  }
  return null;
}
function detectSteamAndETS2() {
  logger.info("Scanning for Steam and ETS2 installation...");
  for (const steamPath of STEAM_PATHS) {
    if (!steamPath) continue;
    const resolvedPath = steamPath.replace(/\\/g, "\\");
    const steamExe = import_path3.default.join(resolvedPath, "steam.exe");
    if (import_fs2.default.existsSync(steamExe)) {
      logger.info(`Steam found at: ${resolvedPath}`);
      const libraries = getLibraryFoldersVdf(resolvedPath);
      libraries.push(resolvedPath);
      for (const lib of libraries) {
        const ets2Path = findETS2InLibrary(lib);
        if (ets2Path) {
          logger.info(`ETS2 found at: ${ets2Path}`);
          return {
            steamInstalled: true,
            steamPath: resolvedPath,
            ets2Installed: true,
            ets2Path
          };
        }
      }
      return {
        steamInstalled: true,
        steamPath: resolvedPath,
        ets2Installed: false,
        ets2Path: null
      };
    }
  }
  logger.warn("Steam not found in standard locations");
  return {
    steamInstalled: false,
    steamPath: null,
    ets2Installed: false,
    ets2Path: null
  };
}

// electron/services/gameScanner.ts
var import_fs3 = __toESM(require("fs"), 1);
var import_path4 = __toESM(require("path"), 1);
function scanETS2Documents() {
  const documentsModFolder = import_path4.default.join(getDocumentsPath(), ETS2_DOCUMENTS_RELATIVE);
  const screenshotsFolder = import_path4.default.join(getDocumentsPath(), "Euro Truck Simulator 2", "screenshot");
  let modFolderExists = false;
  let modCount = 0;
  let configFound = false;
  let version = null;
  let screenshotCount = 0;
  try {
    modFolderExists = import_fs3.default.existsSync(documentsModFolder);
    if (modFolderExists) {
      const files = import_fs3.default.readdirSync(documentsModFolder);
      modCount = files.filter(
        (f) => import_fs3.default.statSync(import_path4.default.join(documentsModFolder, f)).isFile() && [".scs", ".zip"].includes(import_path4.default.extname(f).toLowerCase())
      ).length;
    }
  } catch (err) {
    logger.error("Failed to scan mod folder", err);
  }
  try {
    const configPath = import_path4.default.join(getDocumentsPath(), "Euro Truck Simulator 2", "config.cfg");
    configFound = import_fs3.default.existsSync(configPath);
    if (configFound) {
      const content = import_fs3.default.readFileSync(configPath, "utf-8");
      const versionMatch = content.match(/g_config_version:\s*"([^"]+)"/);
      if (versionMatch) version = versionMatch[1];
    }
  } catch (err) {
    logger.error("Failed to read config.cfg", err);
  }
  try {
    if (import_fs3.default.existsSync(screenshotsFolder)) {
      screenshotCount = import_fs3.default.readdirSync(screenshotsFolder).length;
    }
  } catch {
    screenshotCount = 0;
  }
  return {
    documentsModFolder,
    modFolderExists,
    modCount,
    configFound,
    version,
    screenshotsFolder,
    screenshotCount
  };
}

// electron/services/downloadFolder.ts
var import_fs4 = __toESM(require("fs"), 1);
var import_path5 = __toESM(require("path"), 1);
function getDefaultModFolder() {
  return import_path5.default.join(getDocumentsPath(), ETS2_DOCUMENTS_RELATIVE);
}
function ensureModFolder(customPath) {
  const targetPath = customPath || getDefaultModFolder();
  if (import_fs4.default.existsSync(targetPath)) {
    logger.info(`Mod folder exists at: ${targetPath}`);
    return { exists: true, path: targetPath, created: false };
  }
  try {
    import_fs4.default.mkdirSync(targetPath, { recursive: true });
    logger.info(`Created mod folder at: ${targetPath}`);
    return { exists: true, path: targetPath, created: true };
  } catch (err) {
    logger.error("Failed to create mod folder", err);
    return { exists: false, path: targetPath, created: false };
  }
}

// electron/ipc/ets2.ts
function registerETS2IPC() {
  import_electron2.ipcMain.handle("ets2:detect", async () => {
    logger.info("IPC: ets2:detect called");
    const detection = detectSteamAndETS2();
    if (detection.ets2Installed) {
      const scan = scanETS2Documents();
      const modFolder = ensureModFolder();
      return {
        ...detection,
        scanResult: {
          ...scan,
          modFolderExists: modFolder.exists
        }
      };
    }
    return detection;
  });
  import_electron2.ipcMain.handle("ets2:status", async () => {
    logger.info("IPC: ets2:status called");
    return scanETS2Documents();
  });
  import_electron2.ipcMain.handle("ets2:ensureModFolder", async () => {
    logger.info("IPC: ets2:ensureModFolder called");
    const result = ensureModFolder();
    return { path: result.path, created: result.created };
  });
}

// electron/ipc/launch.ts
var import_electron3 = require("electron");
var import_child_process = require("child_process");
var import_path6 = __toESM(require("path"), 1);
var gameProcess = null;
function registerLaunchIPC() {
  import_electron3.ipcMain.handle("ets2:launch", async () => {
    logger.info("IPC: ets2:launch called");
    try {
      const detection = detectSteamAndETS2();
      if (!detection.steamInstalled) {
        return { success: false, error: "Steam not installed" };
      }
      if (!detection.ets2Installed) {
        return { success: false, error: "ETS2 not installed" };
      }
      await import_electron3.shell.openExternal(ETS2_STEAM_URL);
      logger.info("ETS2 launched via Steam URL");
      return { success: true };
    } catch (err) {
      const error = err;
      logger.error("Failed to launch ETS2", error);
      return { success: false, error: error.message };
    }
  });
  import_electron3.ipcMain.handle("ets2:launchDirect", async (_, exePath) => {
    logger.info(`IPC: ets2:launchDirect called with path: ${exePath}`);
    try {
      if (gameProcess) {
        return { success: false, error: "Game already running" };
      }
      gameProcess = (0, import_child_process.spawn)(import_path6.default.join(exePath, "eurotrucks2.exe"), [], {
        cwd: exePath,
        detached: true,
        stdio: "ignore"
      });
      gameProcess.on("exit", (code) => {
        logger.info(`ETS2 process exited with code ${code}`);
        gameProcess = null;
      });
      gameProcess.on("error", (err) => {
        logger.error("ETS2 process error", err);
        gameProcess = null;
      });
      logger.info("ETS2 launched directly");
      return { success: true };
    } catch (err) {
      const error = err;
      logger.error("Failed to launch ETS2 directly", error);
      return { success: false, error: error.message };
    }
  });
  import_electron3.ipcMain.handle("ets2:stop", async () => {
    logger.info("IPC: ets2:stop called");
    if (gameProcess) {
      gameProcess.kill("SIGTERM");
      gameProcess = null;
      logger.info("ETS2 process terminated");
      return { success: true };
    }
    return { success: false };
  });
  import_electron3.ipcMain.handle("ets2:isRunning", async () => {
    if (gameProcess) {
      try {
        return gameProcess.exitCode === null;
      } catch {
        return false;
      }
    }
    return false;
  });
}

// electron/ipc/filesystem.ts
var import_electron4 = require("electron");
var import_fs5 = __toESM(require("fs"), 1);
var import_path7 = __toESM(require("path"), 1);
function registerFilesystemIPC() {
  import_electron4.ipcMain.handle("fs:readFile", async (_, filePath) => {
    try {
      const data = import_fs5.default.readFileSync(filePath, "utf-8");
      return { success: true, data };
    } catch (err) {
      const error = err;
      logger.error(`Failed to read file: ${filePath}`, error);
      return { success: false, error: error.message };
    }
  });
  import_electron4.ipcMain.handle("fs:writeFile", async (_, filePath, data) => {
    try {
      import_fs5.default.writeFileSync(filePath, data, "utf-8");
      logger.info(`Written file: ${filePath}`);
      return { success: true };
    } catch (err) {
      const error = err;
      logger.error(`Failed to write file: ${filePath}`, error);
      return { success: false, error: error.message };
    }
  });
  import_electron4.ipcMain.handle("fs:deleteFile", async (_, filePath) => {
    try {
      if (import_fs5.default.existsSync(filePath)) {
        import_fs5.default.unlinkSync(filePath);
        logger.info(`Deleted file: ${filePath}`);
        return { success: true };
      }
      return { success: false, error: "File not found" };
    } catch (err) {
      const error = err;
      logger.error(`Failed to delete file: ${filePath}`, error);
      return { success: false, error: error.message };
    }
  });
  import_electron4.ipcMain.handle("fs:fileExists", async (_, filePath) => {
    return import_fs5.default.existsSync(filePath);
  });
  import_electron4.ipcMain.handle("fs:readDirectory", async (_, dirPath) => {
    try {
      if (!import_fs5.default.existsSync(dirPath)) {
        return { success: false, error: "Directory not found" };
      }
      const files = import_fs5.default.readdirSync(dirPath);
      return { success: true, files };
    } catch (err) {
      const error = err;
      logger.error(`Failed to read directory: ${dirPath}`, error);
      return { success: false, error: error.message };
    }
  });
  import_electron4.ipcMain.handle("fs:ensureDir", async (_, dirPath) => {
    try {
      import_fs5.default.mkdirSync(dirPath, { recursive: true });
      return { success: true };
    } catch (err) {
      const error = err;
      return { success: false, error: error.message };
    }
  });
  import_electron4.ipcMain.handle("fs:copyFile", async (_, source, destination) => {
    try {
      import_fs5.default.copyFileSync(source, destination);
      logger.info(`Copied file from ${source} to ${destination}`);
      return { success: true };
    } catch (err) {
      const error = err;
      logger.error(`Failed to copy file`, error);
      return { success: false, error: error.message };
    }
  });
  import_electron4.ipcMain.handle("fs:getModFolder", async () => {
    return import_path7.default.join(getDocumentsPath(), "Euro Truck Simulator 2", "mod");
  });
  import_electron4.ipcMain.handle("fs:openFolder", async (_, folderPath) => {
    try {
      const { shell: shell2 } = require("electron");
      await shell2.openPath(folderPath);
      logger.info(`Opened folder: ${folderPath}`);
      return { success: true };
    } catch (err) {
      const error = err;
      logger.error(`Failed to open folder: ${folderPath}`, error);
      return { success: false, error: error.message };
    }
  });
  import_electron4.ipcMain.handle("fs:openExternal", async (_, url) => {
    const { shell: shell2 } = require("electron");
    await shell2.openExternal(url);
  });
}

// electron/ipc/dialog.ts
var import_electron5 = require("electron");
function registerDialogIPC() {
  import_electron5.ipcMain.handle("dialog:selectFolder", async (_, options) => {
    const win = import_electron5.BrowserWindow.getFocusedWindow();
    if (!win) {
      logger.warn("No focused window for dialog");
      return { canceled: true, path: null };
    }
    try {
      const result = await import_electron5.dialog.showOpenDialog(win, {
        title: options?.title || "Select Folder",
        defaultPath: options?.defaultPath,
        properties: ["openDirectory"]
      });
      logger.info(`Folder dialog result: ${result.canceled ? "canceled" : result.filePaths[0]}`);
      return {
        canceled: result.canceled,
        path: result.canceled ? null : result.filePaths[0]
      };
    } catch (err) {
      logger.error("Folder dialog error", err);
      return { canceled: true, path: null };
    }
  });
  import_electron5.ipcMain.handle("dialog:selectFile", async (_, options) => {
    const win = import_electron5.BrowserWindow.getFocusedWindow();
    if (!win) {
      logger.warn("No focused window for dialog");
      return { canceled: true, path: null };
    }
    try {
      const result = await import_electron5.dialog.showOpenDialog(win, {
        title: options?.title || "Select File",
        defaultPath: options?.defaultPath,
        filters: options?.filters,
        properties: ["openFile"]
      });
      return {
        canceled: result.canceled,
        path: result.canceled ? null : result.filePaths[0]
      };
    } catch (err) {
      logger.error("File dialog error", err);
      return { canceled: true, path: null };
    }
  });
  import_electron5.ipcMain.handle("dialog:confirm", async (_, message, title) => {
    const win = import_electron5.BrowserWindow.getFocusedWindow();
    if (!win) return false;
    try {
      const result = await import_electron5.dialog.showMessageBox(win, {
        type: "question",
        buttons: ["Yes", "No"],
        defaultId: 1,
        title: title || "Confirm",
        message
      });
      return result.response === 0;
    } catch (err) {
      logger.error("Confirm dialog error", err);
      return false;
    }
  });
  import_electron5.ipcMain.handle("dialog:alert", async (_, message, title) => {
    const win = import_electron5.BrowserWindow.getFocusedWindow();
    if (!win) return;
    try {
      await import_electron5.dialog.showMessageBox(win, {
        type: "info",
        buttons: ["OK"],
        title: title || "Alert",
        message
      });
    } catch (err) {
      logger.error("Alert dialog error", err);
    }
  });
  import_electron5.ipcMain.handle("dialog:error", async (_, message, title) => {
    const win = import_electron5.BrowserWindow.getFocusedWindow();
    if (!win) return;
    try {
      await import_electron5.dialog.showMessageBox(win, {
        type: "error",
        buttons: ["OK"],
        title: title || "Error",
        message
      });
    } catch (err) {
      logger.error("Error dialog error", err);
    }
  });
}

// electron/ipc/settings.ts
var import_electron6 = require("electron");
var import_fs6 = __toESM(require("fs"), 1);
var import_path8 = __toESM(require("path"), 1);
function getSettingsPath() {
  return import_path8.default.join(getUserDataPath(), SETTINGS_FILE);
}
function loadSettings() {
  const settingsPath = getSettingsPath();
  try {
    if (import_fs6.default.existsSync(settingsPath)) {
      const data = import_fs6.default.readFileSync(settingsPath, "utf-8");
      const parsed = JSON.parse(data);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (err) {
    logger.error("Failed to load settings", err);
  }
  return { ...DEFAULT_SETTINGS };
}
function saveSettings(settings) {
  try {
    const settingsPath = getSettingsPath();
    import_fs6.default.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), "utf-8");
    logger.info("Settings saved");
    return true;
  } catch (err) {
    logger.error("Failed to save settings", err);
    return false;
  }
}
function registerSettingsIPC() {
  import_electron6.ipcMain.handle("settings:getAll", async () => {
    return loadSettings();
  });
  import_electron6.ipcMain.handle("settings:get", async (_, key) => {
    const settings = loadSettings();
    return settings[key] ?? null;
  });
  import_electron6.ipcMain.handle("settings:set", async (_, key, value) => {
    const settings = loadSettings();
    settings[key] = value;
    return saveSettings(settings);
  });
  import_electron6.ipcMain.handle("settings:setMultiple", async (_, entries) => {
    const settings = loadSettings();
    for (const { key, value } of entries) {
      settings[key] = value;
    }
    return saveSettings(settings);
  });
  import_electron6.ipcMain.handle("settings:reset", async () => {
    return saveSettings({ ...DEFAULT_SETTINGS });
  });
}

// electron/main.ts
var mainWindow = null;
var isDev = !import_electron7.app.isPackaged;
function createWindow() {
  logger.info("Creating BrowserWindow");
  mainWindow = new import_electron7.BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: `${APP_NAME} v${APP_VERSION}`,
    backgroundColor: "#0B0F19",
    show: false,
    frame: false,
    webPreferences: {
      preload: isDev ? import_path9.default.join(__dirname, "..", "build-electron", "preload.cjs") : import_path9.default.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false
    }
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
    logger.info("Window shown");
  });
  const distPath = import_path9.default.join(__dirname, "..", "dist", "index.html");
  const distExists = import_fs7.default.existsSync(distPath);
  const startUrl = isDev && !distExists ? "http://localhost:3000" : `file://${distPath}`;
  mainWindow.loadURL(startUrl);
  if (isDev && process.env.OPEN_DEVTOOLS === "true") {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  mainWindow.on("maximize", () => {
    mainWindow?.webContents.send("window:maximizeChange", true);
  });
  mainWindow.on("unmaximize", () => {
    mainWindow?.webContents.send("window:maximizeChange", false);
  });
  registerWindowControls();
  setupApplicationMenu();
}
function registerWindowControls() {
  import_electron7.ipcMain.on("window:minimize", () => {
    mainWindow?.minimize();
  });
  import_electron7.ipcMain.on("window:maximize", () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });
  import_electron7.ipcMain.on("window:close", () => {
    mainWindow?.close();
  });
  import_electron7.ipcMain.handle("window:isMaximized", () => {
    return mainWindow?.isMaximized() ?? false;
  });
}
function setupApplicationMenu() {
  if (!isDev) {
    import_electron7.Menu.setApplicationMenu(null);
  }
}
function registerAllIPC() {
  logger.info("Registering IPC handlers");
  registerETS2IPC();
  registerLaunchIPC();
  registerFilesystemIPC();
  registerDialogIPC();
  registerSettingsIPC();
  import_electron7.ipcMain.handle("app:getVersion", () => APP_VERSION);
}
import_electron7.app.commandLine.appendSwitch("disable-features", "Autofill");
var cacheDir = import_path9.default.join(import_electron7.app.getPath("userData"), "Cache");
import_electron7.app.setPath("cache", cacheDir);
if (!import_fs7.default.existsSync(cacheDir)) {
  import_fs7.default.mkdirSync(cacheDir, { recursive: true });
}
import_electron7.app.whenReady().then(() => {
  logger.info(`${APP_NAME} v${APP_VERSION} starting...`);
  registerAllIPC();
  createWindow();
  import_electron7.app.on("activate", () => {
    if (import_electron7.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
import_electron7.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    import_electron7.app.quit();
  }
});
import_electron7.app.on("before-quit", () => {
  logger.info("Application quitting...");
  logger.close();
});
//# sourceMappingURL=main.cjs.map
