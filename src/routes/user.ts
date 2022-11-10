import { FastifyInstance } from "fastify";
import { z } from "zod";

import { prisma } from "../lib/prisma";

export async function userRoutes(fastify: FastifyInstance) {
    fastify.post('/user', async (request, reply) => {
        const createUserBody = z.object({
            name: z.string(),
            email: z.string(),
            password: z.string(),
        })

        const { name, email, password } = createUserBody.parse(request.body)
        const user = await prisma.user.create({
            data: { name, email, password },
        })

        return reply.status(200).send(user)
    })
}
