import fastify from 'fastify'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors'

import { userRoutes } from './routes/user'
import { authRoutes } from './routes/auth'
import { mealRoutes } from './routes/meal'

export const app = fastify()

app.register(cookie)

app.register(cors, {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
})

app.register(authRoutes)

app.register(userRoutes)

app.register(mealRoutes, {
    prefix: 'meal'
})
