import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import bcrypt from 'bcrypt'
import { checkSessionIdExists } from "../middleware/check-session-id-exists";
import { env } from '../env'
import jwt from 'jsonwebtoken'

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

        const userInfo = await knex('users')
            .select('userId', 'userName', 'email')
            .where({ email })

        const now = Math.floor(Date.now() / 1000)
        const exp = now + (60 * 60 * 24 * 7) // 7 days 

        const payload = {
            userId: userInfo[0].userId,
            userName: userInfo[0].userName,
            email: userInfo[0].email,
            exp
        }

        reply.cookie('token', jwt.sign(payload, env.AUTH_SECRET), {
            path: '/',
            maxAge: exp,
            sameSite: 'None' as any,
            secure: true
        })
        return reply.status(200).send(
            { 
                userName: userInfo[0].userName,
                email: userInfo[0].email
            }
        )
        // return reply.status(200).send({ token: jwt.sign(payload, env.AUTH_SECRET) })
    })

    app.get(
        '/validateToken', 
        async (request, reply) => {
        // validation for auto logout in front end
        const token = request.cookies.token

        if(!token) return reply.status(404).send({ error: 'Unauthorized' })

        const userInfo = jwt.verify(token, env.AUTH_SECRET) as any
        const { userId, exp } = userInfo

        // checks token exp date and then give user info back
        if(new Date(exp * 1000) > new Date()) {
            const user = await knex('users')
                .select('userName', 'email')
                .where({ userId })
                .first()

            if(!user) return reply.status(404).send({ error: 'User not found' })
            return reply.status(200).send({ user })
        } else {
            return reply.status(400).send({ error: 'User is not logged in' })
        }
    })

    app.post(
        '/logout',
        async (request, reply) => {
            reply.clearCookie('token');

            return reply.status(200).send({ success: true });
        }
    )
}