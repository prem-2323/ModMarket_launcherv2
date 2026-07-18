import { ipcMain } from 'electron'
import fs from 'fs'
import path from 'path'
import { SETTINGS_FILE, DEFAULT_SETTINGS, getUserDataPath } from '../utils/constants'
import { logger } from '../utils/logger'

function getSettingsPath(): string {
  return path.join(getUserDataPath(), SETTINGS_FILE)
}

function loadSettings(): Record<string, unknown> {
  const settingsPath = getSettingsPath()

  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf-8')
      const parsed = JSON.parse(data)
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
  } catch (err) {
    logger.error('Failed to load settings', err as Error)
  }

  return { ...DEFAULT_SETTINGS }
}

function saveSettings(settings: Record<string, unknown>): boolean {
  try {
    const settingsPath = getSettingsPath()
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf-8')
    logger.info('Settings saved')
    return true
  } catch (err) {
    logger.error('Failed to save settings', err as Error)
    return false
  }
}

export function registerSettingsIPC(): void {
  ipcMain.handle('settings:getAll', async (): Promise<Record<string, unknown>> => {
    return loadSettings()
  })

  ipcMain.handle('settings:get', async (_, key: string): Promise<unknown> => {
    const settings = loadSettings()
    return settings[key] ?? null
  })

  ipcMain.handle('settings:set', async (_, key: string, value: unknown): Promise<boolean> => {
    const settings = loadSettings()
    settings[key] = value
    return saveSettings(settings)
  })

  ipcMain.handle('settings:setMultiple', async (_, entries: Array<{ key: string; value: unknown }>): Promise<boolean> => {
    const settings = loadSettings()
    for (const { key, value } of entries) {
      settings[key] = value
    }
    return saveSettings(settings)
  })

  ipcMain.handle('settings:reset', async (): Promise<boolean> => {
    return saveSettings({ ...DEFAULT_SETTINGS })
  })
}
