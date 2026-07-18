const LOG_LEVELS = ['INFO', 'WARN', 'ERROR'] as const
type LogLevel = (typeof LOG_LEVELS)[number]

function formatMessage(level: LogLevel, message: string): string {
  const timestamp = new Date().toISOString()
  return `[${timestamp}] [${level}] [Backend] ${message}`
}

export const logger = {
  info(message: string): void {
    console.log(formatMessage('INFO', message))
  },
  warn(message: string): void {
    console.warn(formatMessage('WARN', message))
  },
  error(message: string, error?: Error): void {
    const msg = error ? `${message}: ${error.message}` : message
    console.error(formatMessage('ERROR', msg))
  },
}
