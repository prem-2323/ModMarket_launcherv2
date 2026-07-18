import { contextBridge, ipcRenderer } from 'electron'

export interface ElectronAPI {
  // ETS2
  detectETS2: () => Promise<unknown>
  getETS2Status: () => Promise<unknown>
  ensureModFolder: () => Promise<{ path: string; created: boolean }>

  // Launch
  launchETS2: () => Promise<{ success: boolean; error?: string }>
  launchETS2Direct: (exePath: string) => Promise<{ success: boolean; error?: string }>
  stopETS2: () => Promise<{ success: boolean }>
  isETS2Running: () => Promise<boolean>

  // Filesystem
  readFile: (path: string) => Promise<{ success: boolean; data?: string; error?: string }>
  writeFile: (path: string, data: string) => Promise<{ success: boolean; error?: string }>
  deleteFile: (path: string) => Promise<{ success: boolean; error?: string }>
  fileExists: (path: string) => Promise<boolean>
  readDirectory: (path: string) => Promise<{ success: boolean; files?: string[]; error?: string }>
  ensureDir: (path: string) => Promise<{ success: boolean; error?: string }>
  copyFile: (source: string, destination: string) => Promise<{ success: boolean; error?: string }>
  getModFolder: () => Promise<string>
  openFolder: (path: string) => Promise<{ success: boolean; error?: string }>
  openExternal: (url: string) => Promise<void>

  // Dialogs
  selectFolder: (options?: { title?: string; defaultPath?: string }) => Promise<{ canceled: boolean; path: string | null }>
  selectFile: (options?: { title?: string; defaultPath?: string; filters?: Array<{ name: string; extensions: string[] }> }) => Promise<{ canceled: boolean; path: string | null }>
  confirm: (message: string, title?: string) => Promise<boolean>
  alert: (message: string, title?: string) => Promise<void>
  showError: (message: string, title?: string) => Promise<void>

  // Settings
  getSettings: () => Promise<Record<string, unknown>>
  getSetting: (key: string) => Promise<unknown>
  setSetting: (key: string, value: unknown) => Promise<boolean>
  setSettings: (entries: Array<{ key: string; value: unknown }>) => Promise<boolean>
  resetSettings: () => Promise<boolean>

  // Window controls
  minimizeWindow: () => void
  maximizeWindow: () => void
  closeWindow: () => void
  isMaximized: () => Promise<boolean>
  onMaximizeChange: (callback: (isMaximized: boolean) => void) => () => void

  // Platform
  getPlatform: () => string
  getAppVersion: () => Promise<string>
}

const electronAPI: ElectronAPI = {
  // ETS2
  detectETS2: () => ipcRenderer.invoke('ets2:detect'),
  getETS2Status: () => ipcRenderer.invoke('ets2:status'),
  ensureModFolder: () => ipcRenderer.invoke('ets2:ensureModFolder'),

  // Launch
  launchETS2: () => ipcRenderer.invoke('ets2:launch'),
  launchETS2Direct: (exePath: string) => ipcRenderer.invoke('ets2:launchDirect', exePath),
  stopETS2: () => ipcRenderer.invoke('ets2:stop'),
  isETS2Running: () => ipcRenderer.invoke('ets2:isRunning'),

  // Filesystem
  readFile: (path: string) => ipcRenderer.invoke('fs:readFile', path),
  writeFile: (path: string, data: string) => ipcRenderer.invoke('fs:writeFile', path, data),
  deleteFile: (path: string) => ipcRenderer.invoke('fs:deleteFile', path),
  fileExists: (path: string) => ipcRenderer.invoke('fs:fileExists', path),
  readDirectory: (path: string) => ipcRenderer.invoke('fs:readDirectory', path),
  ensureDir: (path: string) => ipcRenderer.invoke('fs:ensureDir', path),
  copyFile: (source: string, destination: string) => ipcRenderer.invoke('fs:copyFile', source, destination),
  getModFolder: () => ipcRenderer.invoke('fs:getModFolder'),
  openFolder: (folderPath: string) => ipcRenderer.invoke('fs:openFolder', folderPath),
  openExternal: (url: string) => ipcRenderer.invoke('fs:openExternal', url),

  // Dialogs
  selectFolder: (options) => ipcRenderer.invoke('dialog:selectFolder', options),
  selectFile: (options) => ipcRenderer.invoke('dialog:selectFile', options),
  confirm: (message: string, title?: string) => ipcRenderer.invoke('dialog:confirm', message, title),
  alert: (message: string, title?: string) => ipcRenderer.invoke('dialog:alert', message, title),
  showError: (message: string, title?: string) => ipcRenderer.invoke('dialog:error', message, title),

  // Settings
  getSettings: () => ipcRenderer.invoke('settings:getAll'),
  getSetting: (key: string) => ipcRenderer.invoke('settings:get', key),
  setSetting: (key: string, value: unknown) => ipcRenderer.invoke('settings:set', key, value),
  setSettings: (entries: Array<{ key: string; value: unknown }>) => ipcRenderer.invoke('settings:setMultiple', entries),
  resetSettings: () => ipcRenderer.invoke('settings:reset'),

  // Window controls
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  onMaximizeChange: (callback: (isMaximized: boolean) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, isMaximized: boolean) => callback(isMaximized)
    ipcRenderer.on('window:maximizeChange', handler)
    return () => {
      ipcRenderer.removeListener('window:maximizeChange', handler)
    }
  },

  // Platform
  getPlatform: () => process.platform,
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
