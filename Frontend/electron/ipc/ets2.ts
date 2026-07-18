import { ipcMain } from 'electron'
import { detectSteamAndETS2 } from '../services/steam'
import { scanETS2Documents, type ScanResult } from '../services/gameScanner'
import { ensureModFolder } from '../services/downloadFolder'
import { logger } from '../utils/logger'

export interface ETS2DetectionResult {
  steamInstalled: boolean
  steamPath: string | null
  ets2Installed: boolean
  ets2Path: string | null
  scanResult?: ScanResult
}

export function registerETS2IPC(): void {
  ipcMain.handle('ets2:detect', async (): Promise<ETS2DetectionResult> => {
    logger.info('IPC: ets2:detect called')
    const detection = detectSteamAndETS2()

    if (detection.ets2Installed) {
      const scan = scanETS2Documents()
      const modFolder = ensureModFolder()

      return {
        ...detection,
        scanResult: {
          ...scan,
          modFolderExists: modFolder.exists,
        },
      }
    }

    return detection
  })

  ipcMain.handle('ets2:status', async (): Promise<ScanResult> => {
    logger.info('IPC: ets2:status called')
    return scanETS2Documents()
  })

  ipcMain.handle('ets2:ensureModFolder', async (): Promise<{ path: string; created: boolean }> => {
    logger.info('IPC: ets2:ensureModFolder called')
    const result = ensureModFolder()
    return { path: result.path, created: result.created }
  })
}
