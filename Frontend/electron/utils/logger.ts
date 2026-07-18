import fs from 'fs'
import path from 'path'
import { LOG_DIR, LOG_FILE, getUserDataPath } from './constants'

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

class Logger {
  private logPath: string
  private stream: fs.WriteStream | null = null

  constructor() {
    const logDir = path.join(getUserDataPath(), LOG_DIR)
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }
    this.logPath = path.join(logDir, LOG_FILE)
    this.stream = fs.createWriteStream(this.logPath, { flags: 'a' })
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString()
    return `[${timestamp}] [${level}] ${message}`
  }

  private write(level: LogLevel, message: string): void {
    const formatted = this.formatMessage(level, message)
    console.log(formatted)
    if (this.stream) {
      this.stream.write(formatted + '\n')
    }
  }

  info(message: string): void {
    this.write(LogLevel.INFO, message)
  }

  warn(message: string): void {
    this.write(LogLevel.WARN, message)
  }

  error(message: string, error?: Error): void {
    const msg = error ? `${message}: ${error.message}\n${error.stack}` : message
    this.write(LogLevel.ERROR, msg)
  }

  debug(message: string): void {
    if (process.env.NODE_ENV === 'development') {
      this.write(LogLevel.DEBUG, message)
    }
  }

  close(): void {
    if (this.stream) {
      this.stream.end()
      this.stream = null
    }
  }
}

export const logger = new Logger()
