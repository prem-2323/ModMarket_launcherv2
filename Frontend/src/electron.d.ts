export interface ElectronAPI {
  detectETS2: () => Promise<{
    steamInstalled: boolean
    steamPath: string | null
    ets2Installed: boolean
    ets2Path: string | null
    scanResult?: {
      documentsModFolder: string
      modFolderExists: boolean
      modCount: number
      configFound: boolean
      version: string | null
      screenshotsFolder: string
      screenshotCount: number
    }
  }>
  getETS2Status: () => Promise<unknown>
  ensureModFolder: () => Promise<{ path: string; created: boolean }>
  launchETS2: () => Promise<{ success: boolean; error?: string }>
  launchETS2Direct: (exePath: string) => Promise<{ success: boolean; error?: string }>
  stopETS2: () => Promise<{ success: boolean }>
  isETS2Running: () => Promise<boolean>
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
  selectFolder: (options?: { title?: string; defaultPath?: string }) => Promise<{ canceled: boolean; path: string | null }>
  selectFile: (options?: { title?: string; defaultPath?: string; filters?: Array<{ name: string; extensions: string[] }> }) => Promise<{ canceled: boolean; path: string | null }>
  confirm: (message: string, title?: string) => Promise<boolean>
  alert: (message: string, title?: string) => Promise<void>
  showError: (message: string, title?: string) => Promise<void>
  getSettings: () => Promise<Record<string, unknown>>
  getSetting: (key: string) => Promise<unknown>
  setSetting: (key: string, value: unknown) => Promise<boolean>
  setSettings: (entries: Array<{ key: string; value: unknown }>) => Promise<boolean>
  resetSettings: () => Promise<boolean>
  minimizeWindow: () => void
  maximizeWindow: () => void
  closeWindow: () => void
  isMaximized: () => Promise<boolean>
  onMaximizeChange: (callback: (isMaximized: boolean) => void) => () => void
  getPlatform: () => string
  getAppVersion: () => Promise<string>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
