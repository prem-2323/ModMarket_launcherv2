import path from 'path'
import { app } from 'electron'

export const APP_NAME = 'ModMarket Launcher'
export const APP_VERSION = '2.0.0'
export const ETS2_APP_ID = '227300'
export const ETS2_GAME_EXE = 'eurotrucks2.exe'
export const ETS2_STEAM_URL = 'steam://run/227300'

export const ETS2_DOCUMENTS_RELATIVE = path.join(
  'Euro Truck Simulator 2',
  'mod'
)

export const SETTINGS_FILE = 'settings.json'
export const LOG_DIR = 'logs'
export const LOG_FILE = 'launcher.log'

export const STORAGE_KEYS = {
  DOWNLOAD_FOLDER: 'downloadFolder',
  ETS2_PATH: 'ets2Path',
  STEAM_PATH: 'steamPath',
  THEME: 'theme',
  LANGUAGE: 'language',
  AUTO_LAUNCH: 'autoLaunch',
  AUTO_UPDATE: 'autoUpdate',
  PERF_MODE: 'perfMode',
  AUDIO_ENABLED: 'audioEnabled',
} as const

export const DEFAULT_SETTINGS = {
  [STORAGE_KEYS.DOWNLOAD_FOLDER]: '',
  [STORAGE_KEYS.ETS2_PATH]: '',
  [STORAGE_KEYS.STEAM_PATH]: '',
  [STORAGE_KEYS.THEME]: 'dark',
  [STORAGE_KEYS.LANGUAGE]: 'English (US)',
  [STORAGE_KEYS.AUTO_LAUNCH]: false,
  [STORAGE_KEYS.AUTO_UPDATE]: true,
  [STORAGE_KEYS.PERF_MODE]: true,
  [STORAGE_KEYS.AUDIO_ENABLED]: true,
} as const

export function getUserDataPath(): string {
  return app.getPath('userData')
}

export function getDocumentsPath(): string {
  return app.getPath('documents')
}
