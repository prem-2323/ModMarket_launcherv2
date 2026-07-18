import fs from 'fs'
import path from 'path'
import { ETS2_DOCUMENTS_RELATIVE, getDocumentsPath } from '../utils/constants'
import { logger } from '../utils/logger'

export interface ETS2Config {
  installPath: string
  modFolderPath: string
  version?: string
}

export interface ScanResult {
  documentsModFolder: string
  modFolderExists: boolean
  modCount: number
  configFound: boolean
  version: string | null
  screenshotsFolder: string
  screenshotCount: number
}

export function scanETS2Documents(): ScanResult {
  const documentsModFolder = path.join(getDocumentsPath(), ETS2_DOCUMENTS_RELATIVE)
  const screenshotsFolder = path.join(getDocumentsPath(), 'Euro Truck Simulator 2', 'screenshot')

  let modFolderExists = false
  let modCount = 0
  let configFound = false
  let version: string | null = null
  let screenshotCount = 0

  try {
    modFolderExists = fs.existsSync(documentsModFolder)
    if (modFolderExists) {
      const files = fs.readdirSync(documentsModFolder)
      modCount = files.filter(
        (f) =>
          fs.statSync(path.join(documentsModFolder, f)).isFile() &&
          ['.scs', '.zip'].includes(path.extname(f).toLowerCase())
      ).length
    }
  } catch (err) {
    logger.error('Failed to scan mod folder', err as Error)
  }

  try {
    const configPath = path.join(getDocumentsPath(), 'Euro Truck Simulator 2', 'config.cfg')
    configFound = fs.existsSync(configPath)
    if (configFound) {
      const content = fs.readFileSync(configPath, 'utf-8')
      const versionMatch = content.match(/g_config_version:\s*"([^"]+)"/)
      if (versionMatch) version = versionMatch[1]
    }
  } catch (err) {
    logger.error('Failed to read config.cfg', err as Error)
  }

  try {
    if (fs.existsSync(screenshotsFolder)) {
      screenshotCount = fs.readdirSync(screenshotsFolder).length
    }
  } catch {
    screenshotCount = 0
  }

  return {
    documentsModFolder,
    modFolderExists,
    modCount,
    configFound,
    version,
    screenshotsFolder,
    screenshotCount,
  }
}
