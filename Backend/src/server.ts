import app from './app'
import { config } from './config/env'
import { connectDB } from './config/database'
import { logger } from './utils/logger'

async function start(): Promise<void> {
  logger.info('Connecting to MongoDB...')
  await connectDB()

  app.listen(config.port, () => {
    logger.info(`ModMarket Backend running on http://localhost:${config.port}`)
  })
}

start()
