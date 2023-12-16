import { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from 'bcrypt'
import { knex } from "../database";
import crypto, { randomUUID } from 'node:crypto'
import { env } from '../env'
import jwt from 'jsonwebtoken'

export async function userRoutes(app: FastifyInstance) {

    function encryptPassword(password: string) {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    app.get('/all', async (request, reply) => {
        // just for debugging, delete it after
        const user = await knex('users')

        return reply.status(200).send({ user })
    })
    
    app.post('/signup', async (request, reply) => {
        const createUserBodySchema = z.object({
            userName: z.string(),
            email: z.string(),
            password: z.string(),
            confirmPassword: z.string()
        })

        const { email, userName, password, confirmPassword } = createUserBodySchema.parse(request.body)

        // check all inputs
        if(!email) return reply.status(400).send({ error: 'Email is required!'})
        if(!userName) return reply.status(400).send({ error: 'User name is required!'})
        if(!password) return reply.status(400).send({ error: 'Password is required!'})

        // check if password has enough characters
        if(password.length < 6) return reply.status(400).send({ error: 'Password must contain at least 6 characters!'})
        if(password.length > 30) return reply.status(400).send({ error: 'Password must contain maximum 30 characters!'})

        // verify password
        if(password !== confirmPassword) {
            return reply.status(400).send({
                error: 'Passwords must match'
            })
        }

        // verify if email is already registered
        const emailAlreadyRegistered = await knex('users')
            .where({ email })
            .first()

        if(emailAlreadyRegistered) {
            return reply.status(400).send({
                error: 'Email already registered!'
            })
        }

        const userId = crypto.randomUUID()

        // insert user in db
        try {
            await knex('users')
                .insert({
                    userId,
                    userName,
                    email,
                    password: encryptPassword(password),
                })

            // Save token in cookies
            const now = Math.floor(Date.now() / 1000)
            const exp = now + (60 * 60 * 24 * 7) // 7 days 

            const payload = {
                userId,
                userName,
                email,
                exp
            }

            reply.cookie('token', jwt.sign(payload, env.AUTH_SECRET), {
                path: '/',
                maxAge: exp,
                sameSite: 'None' as any,
                secure: true
            })
            return reply.status(200).send()
        } catch (error) {
            return reply.status(404).send(error)            
        }
    })
}