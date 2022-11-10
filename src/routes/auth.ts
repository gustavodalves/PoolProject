import { FastifyInstance } from "fastify";
import { z } from "zod";

import { prisma } from "../lib/prisma";
import { authenticate  } from "../plugins/authenticate";
import { CreateAccessTokenUseCase } from "../useCases/CreateAccessToken";
import { CreateRefreshTokenUseCase } from "../useCases/CreateRefreshToken";
import { ComparePasswordUseCase } from "../useCases/ComparePassword";
import { GenerateTokenWithRefreshTokenUseCase } from "../useCases/GenerateTokenWithRefreshToken";

export async function authRoutes(fastify: FastifyInstance) {
    fastify.get('/me', {
        onRequest: [authenticate]
    }, async ({ user: { id }}) => {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })

        return {
            ...user,
            password: undefined,
        }
    })

    fastify.post('/login', async (request, reply) => {
        const createLoginBody = z.object({
            email: z.string().email(),
            password: z.string()
        })

        const { email, password } = createLoginBody.parse(request.body)
        const user = await prisma.user.findUnique({ where: {
            email
        }})

        if(!user) {
            return reply.status(400).send({ message: 'user not exists', field: 'email' })
        }

        const isHashValid = ComparePasswordUseCase.execute(password, user.password)

        if(!isHashValid) {
            return reply.status(400).send({ message: 'password not valid', field: 'password' })
        }

        const accessToken = CreateAccessTokenUseCase.execute(fastify, { id: user.id })
        const refreshToken = CreateRefreshTokenUseCase.execute(fastify, { id: user.id })

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        }
    })

    fastify.post('/refresh-token', async (request, reply) => {
        const { authorization: refreshToken } = request.headers
        const access_token = GenerateTokenWithRefreshTokenUseCase.execute(fastify, refreshToken ?? '');

        if(!access_token) {
            return reply.status(401).send({
                status: 401,
                message: 'Invalid refresh token'
            })
        }

        return {
            access_token
        }
    })
}
