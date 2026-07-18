import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import path from 'path'
import fs from 'fs'
import { registerETS2IPC } from './ipc/ets2'
import { registerLaunchIPC } from './ipc/launch'
import { registerFilesystemIPC } from './ipc/filesystem'
import { registerDialogIPC } from './ipc/dialog'
import { registerSettingsIPC } from './ipc/settings'
import { logger } from './utils/logger'
import { APP_NAME, APP_VERSION } from './utils/constants'

let mainWindow: BrowserWindow | null = null

const isDev = !app.isPackaged

function createWindow(): void {
  logger.info('Creating BrowserWindow')

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: `${APP_NAME} v${APP_VERSION}`,
    backgroundColor: '#0B0F19',
    show: false,
    frame: false,
    webPreferences: {
      preload: isDev
        ? path.join(__dirname, '..', 'build-electron', 'preload.cjs')
        : path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    logger.info('Window shown')
  })

  const distPath = path.join(__dirname, '..', 'dist', 'index.html')
  const distExists = fs.existsSync(distPath)

  const startUrl = isDev && !distExists
    ? 'http://localhost:3000'
    : `file://${distPath}`

  mainWindow.loadURL(startUrl)

  if (isDev && process.env.OPEN_DEVTOOLS === 'true') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('window:maximizeChange', true)
  })

  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('window:maximizeChange', false)
  })

  registerWindowControls()
  setupApplicationMenu()
}

function registerWindowControls(): void {
  ipcMain.on('window:minimize', () => {
    mainWindow?.minimize()
  })

  ipcMain.on('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow?.maximize()
    }
  })

  ipcMain.on('window:close', () => {
    mainWindow?.close()
  })

  ipcMain.handle('window:isMaximized', () => {
    return mainWindow?.isMaximized() ?? false
  })
}

function setupApplicationMenu(): void {
  if (!isDev) {
    Menu.setApplicationMenu(null)
  }
}

function registerAllIPC(): void {
  logger.info('Registering IPC handlers')
  registerETS2IPC()
  registerLaunchIPC()
  registerFilesystemIPC()
  registerDialogIPC()
  registerSettingsIPC()

  ipcMain.handle('app:getVersion', () => APP_VERSION)
}

app.commandLine.appendSwitch('disable-features', 'Autofill')

const cacheDir = path.join(app.getPath('userData'), 'Cache')
app.setPath('cache', cacheDir)
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true })
}

app.whenReady().then(() => {
  logger.info(`${APP_NAME} v${APP_VERSION} starting...`)

  registerAllIPC()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  logger.info('Application quitting...')
  logger.close()
})
