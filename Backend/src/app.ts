import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import modRoutes from './routes/mod.routes'
import reviewRoutes from './routes/review.routes'
import favoriteRoutes from './routes/favorite.routes'
import adminRoutes from './routes/admin.routes'
import { errorHandler } from './middleware/error.middleware'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/mods', modRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/admin', adminRoutes)

app.use(errorHandler)

export default app
