import fs from 'fs'
import path from 'path'
import { ETS2_DOCUMENTS_RELATIVE, getDocumentsPath } from '../utils/constants'
import { logger } from '../utils/logger'

export function getDefaultModFolder(): string {
  return path.join(getDocumentsPath(), ETS2_DOCUMENTS_RELATIVE)
}

export interface ModFolderResult {
  exists: boolean
  path: string
  created: boolean
}

export function ensureModFolder(customPath?: string): ModFolderResult {
  const targetPath = customPath || getDefaultModFolder()

  if (fs.existsSync(targetPath)) {
    logger.info(`Mod folder exists at: ${targetPath}`)
    return { exists: true, path: targetPath, created: false }
  }

  try {
    fs.mkdirSync(targetPath, { recursive: true })
    logger.info(`Created mod folder at: ${targetPath}`)
    return { exists: true, path: targetPath, created: true }
  } catch (err) {
    logger.error('Failed to create mod folder', err as Error)
    return { exists: false, path: targetPath, created: false }
  }
}

export function listModFiles(modFolderPath: string): string[] {
  try {
    if (!fs.existsSync(modFolderPath)) return []
    return fs.readdirSync(modFolderPath).filter((f) => {
      const ext = path.extname(f).toLowerCase()
      return ext === '.scs' || ext === '.zip'
    })
  } catch (err) {
    logger.error('Failed to list mod files', err as Error)
    return []
  }
}

export function copyFileToModFolder(sourcePath: string, modFolderPath: string): boolean {
  try {
    const fileName = path.basename(sourcePath)
    const destPath = path.join(modFolderPath, fileName)
    fs.copyFileSync(sourcePath, destPath)
    logger.info(`Copied ${fileName} to mod folder`)
    return true
  } catch (err) {
    logger.error('Failed to copy file to mod folder', err as Error)
    return false
  }
}

export function deleteModFile(fileName: string, modFolderPath: string): boolean {
  try {
    const filePath = path.join(modFolderPath, fileName)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      logger.info(`Deleted mod file: ${fileName}`)
      return true
    }
    return false
  } catch (err) {
    logger.error('Failed to delete mod file', err as Error)
    return false
  }
}
