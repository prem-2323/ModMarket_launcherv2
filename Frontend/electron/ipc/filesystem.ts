import { ipcMain } from 'electron'
import fs from 'fs'
import path from 'path'
import { logger } from '../utils/logger'
import { getDocumentsPath } from '../utils/constants'

export function registerFilesystemIPC(): void {
  ipcMain.handle('fs:readFile', async (_, filePath: string): Promise<{ success: boolean; data?: string; error?: string }> => {
    try {
      const data = fs.readFileSync(filePath, 'utf-8')
      return { success: true, data }
    } catch (err) {
      const error = err as Error
      logger.error(`Failed to read file: ${filePath}`, error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('fs:writeFile', async (_, filePath: string, data: string): Promise<{ success: boolean; error?: string }> => {
    try {
      fs.writeFileSync(filePath, data, 'utf-8')
      logger.info(`Written file: ${filePath}`)
      return { success: true }
    } catch (err) {
      const error = err as Error
      logger.error(`Failed to write file: ${filePath}`, error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('fs:deleteFile', async (_, filePath: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        logger.info(`Deleted file: ${filePath}`)
        return { success: true }
      }
      return { success: false, error: 'File not found' }
    } catch (err) {
      const error = err as Error
      logger.error(`Failed to delete file: ${filePath}`, error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('fs:fileExists', async (_, filePath: string): Promise<boolean> => {
    return fs.existsSync(filePath)
  })

  ipcMain.handle('fs:readDirectory', async (_, dirPath: string): Promise<{ success: boolean; files?: string[]; error?: string }> => {
    try {
      if (!fs.existsSync(dirPath)) {
        return { success: false, error: 'Directory not found' }
      }
      const files = fs.readdirSync(dirPath)
      return { success: true, files }
    } catch (err) {
      const error = err as Error
      logger.error(`Failed to read directory: ${dirPath}`, error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('fs:ensureDir', async (_, dirPath: string): Promise<{ success: boolean; error?: string }> => {
    try {
      fs.mkdirSync(dirPath, { recursive: true })
      return { success: true }
    } catch (err) {
      const error = err as Error
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('fs:copyFile', async (_, source: string, destination: string): Promise<{ success: boolean; error?: string }> => {
    try {
      fs.copyFileSync(source, destination)
      logger.info(`Copied file from ${source} to ${destination}`)
      return { success: true }
    } catch (err) {
      const error = err as Error
      logger.error(`Failed to copy file`, error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('fs:getModFolder', async (): Promise<string> => {
    return path.join(getDocumentsPath(), 'Euro Truck Simulator 2', 'mod')
  })

  ipcMain.handle('fs:openFolder', async (_, folderPath: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { shell } = require('electron')
      await shell.openPath(folderPath)
      logger.info(`Opened folder: ${folderPath}`)
      return { success: true }
    } catch (err) {
      const error = err as Error
      logger.error(`Failed to open folder: ${folderPath}`, error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('fs:openExternal', async (_, url: string): Promise<void> => {
    const { shell } = require('electron')
    await shell.openExternal(url)
  })
}
