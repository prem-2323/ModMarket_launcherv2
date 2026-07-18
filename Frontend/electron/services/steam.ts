import fs from 'fs'
import path from 'path'
import { ETS2_APP_ID } from '../utils/constants'
import { logger } from '../utils/logger'

const STEAM_PATHS = [
  'C:\\Program Files (x86)\\Steam',
  'C:\\Program Files\\Steam',
  'D:\\Program Files (x86)\\Steam',
  'D:\\Program Files\\Steam',
  (process.env['ProgramFiles(x86)'] || '') + '\\Steam',
  (process.env['ProgramFiles'] || '') + '\\Steam',
]

function getLibraryFoldersVdf(steamPath: string): string[] {
  const vdfPath = path.join(steamPath, 'steamapps', 'libraryfolders.vdf')
  if (!fs.existsSync(vdfPath)) return []

  try {
    const content = fs.readFileSync(vdfPath, 'utf-8')
    const libraries: string[] = []
    const pathRegex = /"path"\s+"([^"]+)"/g
    let match: RegExpExecArray | null
    while ((match = pathRegex.exec(content)) !== null) {
      libraries.push(match[1].replace(/\\\\/g, '\\'))
    }
    return libraries
  } catch (err) {
    logger.error('Failed to parse libraryfolders.vdf', err as Error)
    return []
  }
}

function findETS2InLibrary(libraryPath: string): string | null {
  const commonPath = path.join(libraryPath, 'steamapps', 'common', 'Euro Truck Simulator 2')
  if (fs.existsSync(commonPath)) {
    const exePath = path.join(commonPath, 'eurotrucks2.exe')
    if (fs.existsSync(exePath)) return commonPath
  }
  return null
}

export interface SteamDetectionResult {
  steamInstalled: boolean
  steamPath: string | null
  ets2Installed: boolean
  ets2Path: string | null
}

export function detectSteamAndETS2(): SteamDetectionResult {
  logger.info('Scanning for Steam and ETS2 installation...')

  for (const steamPath of STEAM_PATHS) {
    if (!steamPath) continue
    const resolvedPath = steamPath.replace(/\\/g, '\\')
    const steamExe = path.join(resolvedPath, 'steam.exe')

    if (fs.existsSync(steamExe)) {
      logger.info(`Steam found at: ${resolvedPath}`)

      const libraries = getLibraryFoldersVdf(resolvedPath)
      libraries.push(resolvedPath)

      for (const lib of libraries) {
        const ets2Path = findETS2InLibrary(lib)
        if (ets2Path) {
          logger.info(`ETS2 found at: ${ets2Path}`)
          return {
            steamInstalled: true,
            steamPath: resolvedPath,
            ets2Installed: true,
            ets2Path,
          }
        }
      }

      return {
        steamInstalled: true,
        steamPath: resolvedPath,
        ets2Installed: false,
        ets2Path: null,
      }
    }
  }

  logger.warn('Steam not found in standard locations')
  return {
    steamInstalled: false,
    steamPath: null,
    ets2Installed: false,
    ets2Path: null,
  }
}

export function getSteamExePath(steamPath: string): string {
  return path.join(steamPath, 'steam.exe')
}
