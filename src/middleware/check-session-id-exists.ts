import { FastifyReply, FastifyRequest } from "fastify"
import { env } from '../env'
import jwt from 'jsonwebtoken'
import { knex } from "../database";

export async function checkSessionIdExists(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies.token

    if(!token) {
        return reply.status(401).send({
            error: 'Unauthorized'
        })
    }
    
    const userInfo = jwt.verify(token, env.AUTH_SECRET) as any
    const { userId, exp } = userInfo

    // checks token exp date and user in db
    if(new Date(exp * 1000) > new Date()) {
        const user = await knex('users')
            .where({ userId })
            .first()

        if(!user) return reply.status(404).send({ error: 'User not found' })
    } else {
        return reply.status(400).send({ error: 'User is not logged in' })
    }
}