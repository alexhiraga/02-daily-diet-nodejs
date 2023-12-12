import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { userRoutes } from './routes/user'
import { authRoutes } from './routes/auth'
import { mealRoutes } from './routes/meal'

export const app = fastify()

app.register(cookie)

app.register(authRoutes)

app.register(userRoutes, {
  prefix: 'user',
})

app.register(mealRoutes, {
    prefix: 'meal'
})
