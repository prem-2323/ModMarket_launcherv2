import { ipcMain, dialog, BrowserWindow } from 'electron'
import { logger } from '../utils/logger'

export interface DialogFilters {
  name: string
  extensions: string[]
}

export function registerDialogIPC(): void {
  ipcMain.handle('dialog:selectFolder', async (_, options?: { title?: string; defaultPath?: string }): Promise<{ canceled: boolean; path: string | null }> => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) {
      logger.warn('No focused window for dialog')
      return { canceled: true, path: null }
    }

    try {
      const result = await dialog.showOpenDialog(win, {
        title: options?.title || 'Select Folder',
        defaultPath: options?.defaultPath,
        properties: ['openDirectory'],
      })

      logger.info(`Folder dialog result: ${result.canceled ? 'canceled' : result.filePaths[0]}`)
      return {
        canceled: result.canceled,
        path: result.canceled ? null : result.filePaths[0],
      }
    } catch (err) {
      logger.error('Folder dialog error', err as Error)
      return { canceled: true, path: null }
    }
  })

  ipcMain.handle('dialog:selectFile', async (_, options?: { title?: string; defaultPath?: string; filters?: DialogFilters[] }): Promise<{ canceled: boolean; path: string | null }> => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) {
      logger.warn('No focused window for dialog')
      return { canceled: true, path: null }
    }

    try {
      const result = await dialog.showOpenDialog(win, {
        title: options?.title || 'Select File',
        defaultPath: options?.defaultPath,
        filters: options?.filters,
        properties: ['openFile'],
      })

      return {
        canceled: result.canceled,
        path: result.canceled ? null : result.filePaths[0],
      }
    } catch (err) {
      logger.error('File dialog error', err as Error)
      return { canceled: true, path: null }
    }
  })

  ipcMain.handle('dialog:confirm', async (_, message: string, title?: string): Promise<boolean> => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return false

    try {
      const result = await dialog.showMessageBox(win, {
        type: 'question',
        buttons: ['Yes', 'No'],
        defaultId: 1,
        title: title || 'Confirm',
        message,
      })

      return result.response === 0
    } catch (err) {
      logger.error('Confirm dialog error', err as Error)
      return false
    }
  })

  ipcMain.handle('dialog:alert', async (_, message: string, title?: string): Promise<void> => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return

    try {
      await dialog.showMessageBox(win, {
        type: 'info',
        buttons: ['OK'],
        title: title || 'Alert',
        message,
      })
    } catch (err) {
      logger.error('Alert dialog error', err as Error)
    }
  })

  ipcMain.handle('dialog:error', async (_, message: string, title?: string): Promise<void> => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return

    try {
      await dialog.showMessageBox(win, {
        type: 'error',
        buttons: ['OK'],
        title: title || 'Error',
        message,
      })
    } catch (err) {
      logger.error('Error dialog error', err as Error)
    }
  })
}
