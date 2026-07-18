import { ipcMain, shell } from 'electron'
import { spawn, type ChildProcess } from 'child_process'
import path from 'path'
import { ETS2_APP_ID, ETS2_STEAM_URL } from '../utils/constants'
import { detectSteamAndETS2 } from '../services/steam'
import { logger } from '../utils/logger'

let gameProcess: ChildProcess | null = null

export function registerLaunchIPC(): void {
  ipcMain.handle('ets2:launch', async (): Promise<{ success: boolean; error?: string }> => {
    logger.info('IPC: ets2:launch called')

    try {
      const detection = detectSteamAndETS2()

      if (!detection.steamInstalled) {
        return { success: false, error: 'Steam not installed' }
      }

      if (!detection.ets2Installed) {
        return { success: false, error: 'ETS2 not installed' }
      }

      await shell.openExternal(ETS2_STEAM_URL)
      logger.info('ETS2 launched via Steam URL')

      return { success: true }
    } catch (err) {
      const error = err as Error
      logger.error('Failed to launch ETS2', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('ets2:launchDirect', async (_, exePath: string): Promise<{ success: boolean; error?: string }> => {
    logger.info(`IPC: ets2:launchDirect called with path: ${exePath}`)

    try {
      if (gameProcess) {
        return { success: false, error: 'Game already running' }
      }

      gameProcess = spawn(path.join(exePath, 'eurotrucks2.exe'), [], {
        cwd: exePath,
        detached: true,
        stdio: 'ignore',
      })

      gameProcess.on('exit', (code) => {
        logger.info(`ETS2 process exited with code ${code}`)
        gameProcess = null
      })

      gameProcess.on('error', (err) => {
        logger.error('ETS2 process error', err)
        gameProcess = null
      })

      logger.info('ETS2 launched directly')
      return { success: true }
    } catch (err) {
      const error = err as Error
      logger.error('Failed to launch ETS2 directly', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('ets2:stop', async (): Promise<{ success: boolean }> => {
    logger.info('IPC: ets2:stop called')

    if (gameProcess) {
      gameProcess.kill('SIGTERM')
      gameProcess = null
      logger.info('ETS2 process terminated')
      return { success: true }
    }

    return { success: false }
  })

  ipcMain.handle('ets2:isRunning', async (): Promise<boolean> => {
    if (gameProcess) {
      try {
        return gameProcess.exitCode === null
      } catch {
        return false
      }
    }
    return false
  })
}
