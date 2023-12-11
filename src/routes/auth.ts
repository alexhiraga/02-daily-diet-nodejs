import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import bcrypt from 'bcrypt'

export async function authRoutes(app: FastifyInstance) {
    app.post('/signin', async (request, reply) => {
        const loginUserBodySchema = z.object({
            email: z.string(),
            password: z.string(),
        })

        const { email, password } = loginUserBodySchema.parse(request.body)

        if(!email && !password) return reply.status(400).send({ error: 'Email and password are required!'})

        // Check if user exists in db
        const user = await knex('users')
            .where({ email })
            .first()

        if(!user) return reply.status(400).send({ error: 'Invalid email or password'})

        // Check if password is correct
        if(!bcrypt.compareSync(password, user.password)) {
            return reply.status(401).send({ error: 'Invalid email or password'})
        }

        // Login successful
        const sessionId = randomUUID()

        reply.cookie('sessionId', sessionId, {
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        })
    
        return reply.status(200).send()
        return reply.status(200).send(sessionId) //testar
    })

    app.post('/validateToken', async (request, reply) => {
        // validation for auto logout in front end
        const loginUserBodySchema = z.object({
            sessionId: z.string(),
        })

        const { sessionId } = loginUserBodySchema.parse(request.body)

        if(!sessionId) {
            return reply.status(400).send({ error: 'User is not logged in'})
        }

        return reply.status(201).send()
    })
}