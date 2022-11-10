import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify: FastifyInstance) {
    fastify.post('/guess',{ onRequest: [authenticate]},async (request, reply) => {
        const createGuessBody = z.object({
            poolId: z.string(),
            gameId: z.string(),
            firstTeamPoints: z.number(),
            secondTeamPoints: z.number(),
        })

        const { poolId, gameId, firstTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body)

        const participant = await prisma.participant.findUnique({
            where: {
                userId_poolId: {
                    poolId,
                    userId: request.user.id,
                }
            }
        })

        if(!participant) {
            return reply.status(400).send({
                message: 'User not is participant of that pool'
            })
        }

        const guess = await prisma.guess.findUnique({
            where: {
                participantsId_gameId: {
                    participantsId: participant.id,
                    gameId
                }
            }
        })

        if(guess) {
            return reply.status(400).send({
                message: 'User already send a guess to this game on this pool'
            })
        }

        const game = await prisma.game.findUnique({
            where: {
                id: gameId
            }
        })

        if(!game) {
            return reply.status(400).send({
                message: 'Game not found'
            })
        }

        if(game.date < new Date()) {
            return reply.status(400).send({
                message: 'Cannot send guesses after the game date'
            })
        }

        const newGuess = await prisma.guess.create({
            data: {
                gameId,
                participantsId: participant.id,
                firstTeamPoints,
                secondTeamPoints
            }
        })

        return reply.status(201).send(newGuess)

    })
}
