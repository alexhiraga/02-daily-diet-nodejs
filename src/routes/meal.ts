import { FastifyInstance } from "fastify";
import { date, z } from "zod";
import { knex } from "../database";
import { checkSessionIdExists } from "../middleware/check-session-id-exists";
import crypto from 'node:crypto'
import { env } from '../env'
import jwt from 'jsonwebtoken'
import { FastifyRequest } from "fastify"

export async function mealRoutes(app: FastifyInstance) {

    function decryptToken(request: FastifyRequest) {
        // get token from cookies and return the userId
        const token = request.cookies.token

        if(!token) return false
        const userInfo = jwt.verify(token, env.AUTH_SECRET) as any
        const { userId } = userInfo
        return userId
    }

    // // Function to format timestamp to "MM/DD/YYYY"
    // function formatDate(timestamp: number) {
    //     const date = new Date(timestamp);
    //     const day = date.getDate();
    //     const month = date.getMonth() + 1; // Month is zero-based
    //     const year = date.getFullYear();
    //     return `${month}/${day}/${year}`;
    // }

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
            })

            const { name, description, time, isOnDiet } = createMealBodySchema.parse(request.body)
            
            if(!name || !description || !time || !date) return reply.status(400).send({ error: 'Please provide all the infos.'})

            const userId = decryptToken(request)
            if(!userId) return reply.status(404).send({ error: 'User not found.' })

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
        '/update/:mealId',
        {
            preHandler: [checkSessionIdExists]
        },
        async (request, reply) => {
            const editMealBodySchema = z.object({
                name: z.string(),
                description: z.string(),
                time: z.coerce.date(),
                isOnDiet: z.boolean(),
            })
            const editMealParamsSchema = z.object({
                mealId: z.string().uuid(),
            })

            const { name, description, time, isOnDiet } = editMealBodySchema.parse(request.body)
            const { mealId } = editMealParamsSchema.parse(request.params)

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
        '/delete/:mealId',
        {
            preHandler: [checkSessionIdExists]
        },
        async (request, reply) => {
            const deleteParamsSchema = z.object({
                mealId: z.string().uuid(),
            })

            const { mealId } = deleteParamsSchema.parse(request.params)

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
        '/user',
        {
            preHandler: [checkSessionIdExists]
        },
        async (request, reply) => {
            const userQuerySchema = z.object({
                offset: z.string().default('0'),
                limit: z.string().default('10'),
            });
            const { offset, limit } = userQuerySchema.parse(request.query);

            const userId = decryptToken(request)
            if(!userId) return reply.status(404).send({ error: 'User not found.' })

            try {
                const meals = await knex('meal')
                    .select('mealId', 'name', 'description', 'time', 'isOnDiet')
                    .where({ owner: userId })
                    .whereNull('deleted_at')
                    .orderBy('time', 'desc')
                    .offset(Number(offset))
                    .limit(Number(limit))

                const totalMeals = await knex('meal')
                    .where({ owner: userId })
                    .whereNull('deleted_at')
                    .count()
                    .first()

                return reply.status(200).send({ meals, totalMeals: totalMeals && totalMeals["count(*)"] })
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
                    .select('mealId', 'name', 'description', 'date', 'time', 'isOnDiet')
                    .where({ mealId })
                    .whereNull('deleted_at')

                return reply.status(200).send({ meal })
            } catch (error) {
                return reply.status(500).send(error)
            }
        }
    )

    app.get(
        '/summary',
        {
            preHandler: [checkSessionIdExists]
        },
        async (request, reply) => {
            const userId = decryptToken(request)
            if(!userId) return reply.status(404).send({ error: 'User not found.' })

            const summary = await knex('meal')
                .where({
                    owner: userId
                })
                .whereNull('deleted_at')
                .orderBy('time', 'asc')

            if(!summary) return reply.status(404).send()

            let countOnDiet = 0
            let countOffDiet = 0
            const totalMeals = summary.length

            // get the best sequence of meals that is on diet
            const bestSequence = summary.reduce((acc, item) => {
                if(item.isOnDiet === 1) {
                    countOnDiet++
                    acc.currentSequence++
                    acc.maxSequence = Math.max(acc.maxSequence, acc.currentSequence)
                } else {
                    countOffDiet++
                    acc.currentSequence = 0
                }
                return acc
            }, { currentSequence: 0, maxSequence: 0 })

            const onDietPercentage = Number((countOnDiet * 100 / totalMeals).toFixed(2))

            return reply.status(200).send({
                totalMeals,
                countOnDiet,
                countOffDiet,
                bestSequence: bestSequence.maxSequence,
                onDietPercentage
            })
        }
    )

    //just to debug, delete it after
    app.get('/', async (request, reply) => {
        // const sessionId = request.cookies.sessionId
        const meals = await knex('meal')
            

        return reply.status(200).send({ meals })
    })
}