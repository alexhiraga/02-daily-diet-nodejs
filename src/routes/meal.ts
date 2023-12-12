import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { checkSessionIdExists } from "../middleware/check-session-id-exists";
import crypto from 'node:crypto'

export async function mealRoutes(app: FastifyInstance) {

    async function checkUserSession(sessionId: string | undefined, userId: string) {
        // Checks if the user has the same sessionId in db and in cookies
        if(!sessionId) return false

        const userSessionId = await knex('users')
            .select('sessionId')
            .where({ userId })
            .whereNull('deleted_at')
            .first()
        
        if(userSessionId === sessionId) return true
        else return false
    }

    app.post(
        '/create', 
        {
            preHandler: [checkSessionIdExists]
        },
        async (request, reply) => {
            const createMealBodySchema = z.object({
                name: z.string(),
                description: z.string(),
                time: z.coerce.date(),
                isOnDiet: z.boolean(),
                userId: z.string().uuid()
            })

            let sessionId = request.cookies.sessionId
            
            const { name, description, time, isOnDiet, userId } = createMealBodySchema.parse(request.body)
            
            if(!checkUserSession(sessionId, userId)) return reply.status(401).send({ error: 'Unauthorized' })

            if(!name || !description || !time) return reply.status(400).send({ error: 'Please provide all the infos.'})

            const mealId = crypto.randomUUID()

            try {
                await knex('meal')
                    .insert({
                        mealId,
                        owner: userId,
                        name,
                        description,
                        time,
                        isOnDiet
                    })

                return reply.status(201).send({ mealId })
            } catch (error) {
                return reply.status(500).send(error)
            }
        }
    )

    app.put(
        '/update',
        {
            preHandler: [checkSessionIdExists]
        },
        async (request, reply) => {
            const editMealBodySchema = z.object({
                mealId: z.string().uuid(),
                name: z.string(),
                description: z.string(),
                time: z.coerce.date(),
                isOnDiet: z.number(),
                userId: z.string().uuid()
            })

            const { mealId, name, description, time, isOnDiet, userId } = editMealBodySchema.parse(request.body)

            const sessionId = request.cookies.sessionId
            if(!checkUserSession(sessionId, userId)) return reply.status(401).send({ error: 'Unauthorized' })

            try {
                await knex('meal')
                    .update({
                        name,
                        description,
                        time,
                        isOnDiet
                    })
                    .where({ mealId })
                    .then(_ => reply.status(200).send())
            } catch (error) {
                return reply.status(500).send(error)
            }
        }
    )

    app.put(
        '/delete',
        {
            preHandler: [checkSessionIdExists]
        },
        async (request, reply) => {
            const deleteBodySchema = z.object({
                mealId: z.string().uuid(),
                userId: z.string().uuid()
            })

            const { mealId, userId } = deleteBodySchema.parse(request.body)

            const sessionId = request.cookies.sessionId
            if(!checkUserSession(sessionId, userId)) return reply.status(401).send({ error: 'Unauthorized' })

            try {
                await knex('meal')
                    .update({ deleted_at: new Date() })
                    .where({ mealId })
                    .then(_ => reply.status(200).send())
            } catch (error) {
                return reply.status(500).send(error)
            }
        }
    )

    app.get(
        '/user/:userId',
        {
            preHandler: [checkSessionIdExists]
        },
        async (request, reply) => {
            const userIdParamsSchema = z.object({
                userId: z.string().uuid(),
            })

            const { userId } = userIdParamsSchema.parse(request.params)

            const sessionId = request.cookies.sessionId
            if(!checkUserSession(sessionId, userId)) return reply.status(401).send({ error: 'Unauthorized' })

            try {
                const userMeals = await knex('meal')
                    .select('mealId', 'name', 'description', 'time', 'isOnDiet')
                    .where({ owner: userId })
                    .whereNull('deleted_at')

                return reply.status(200).send({ userMeals })
            } catch (error) {
                return reply.status(500).send(error)
            }
        }
    )

    app.get(
        '/:mealId',
        {
            preHandler: [checkSessionIdExists]
        },
        async (request, reply) => {
            const mealIdParamsSchema = z.object({
                mealId: z.string().uuid()
            })

            const { mealId } = mealIdParamsSchema.parse(request.params)

            try {
                const meal = await knex('meal')
                    .select('mealId', 'name', 'description', 'time', 'isOnDiet')
                    .where({ mealId })
                    .whereNull('deleted_at')

                return reply.status(200).send({ meal })
            } catch (error) {
                return reply.status(500).send(error)
            }
        }
    )

    // app.get(
    //     '/summary',
    //     {
    //         preHandler: [checkSessionIdExists]
    //     },
    //     async (request, reply) => {
    //         const { sessionId } = request.cookies

    //         const summary = await knex('meal')
    //             .where({})
    //     }
    // )

    //just to debug, delete it after
    app.get('/', async (request, reply) => {
        // const sessionId = request.cookies.sessionId
        const meals = await knex('meal')
            

        return reply.status(200).send({ meals })
    })
}