import { FastifyInstance } from "fastify";
import ShortUniqueId from "short-unique-id";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function poolRoutes(fastify: FastifyInstance) {
    fastify.get('/pools/count', async () => {
        const count = await prisma.pool.count();

        return { count }
    })

    fastify.post('/pools', async (request, reply) => {
        const createPoolBody = z.object({
            title: z.string()
        })

        const { title } = createPoolBody.parse(request.body)

        const generate = new ShortUniqueId({ length: 6 });
        const code = generate().toUpperCase()

        let ownerId = null;
        
        try {
            await request.jwtVerify();
            ownerId = request.user.id
        } catch {
            ownerId = undefined
        }

        await prisma.pool.create({
            data: {
                code,
                title,
                ownerId,
            }
        })

        return reply.status(201).send({
            code,
        })
    })

    fastify.post('/pools/join', { onRequest: [authenticate] } , async (request, reply) => {
        const joinPoolBody = z.object({
            code: z.string()
        })

        const { code } = joinPoolBody.parse(request.body)

        const pool = await prisma.pool.findUnique({
            where: {
                code
            },
            include: {
                participants: {
                    where: {
                        userId: request.user.id
                    }
                }
            }
        })

        if(!pool) {
            return reply.status(400).send({
                message: 'Pool not found'
            })
        } else if(pool.participants.length > 0) {
            return reply.status(400).send({
                message: 'You already joined this pool.'
            })
        }

        if (!pool.ownerId) {
            await prisma.pool.update({
                where: {
                    id: pool.id
                },
                data: {
                    ownerId: request.user.id
                }
            })
        }

        await prisma.participant.create({
            data: {
                poolId: pool.id,
                userId: request.user.id
            }
        })

         return reply.status(201).send()
    })

    fastify.get('/pools', { onRequest: [authenticate] } , async (request, reply) => {
        const pools = await prisma.pool.findMany({
            where: {
                participants: {
                    some: {
                        userId: request.user.id
                    }
                }
            }, include: {
                owner: {
                    select: {
                        name: true,
                        id: true,
                    }
                },
                _count: {
                    select: {
                        participants: true
                    }
                },
                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatarUrl: true,
                            }
                        }
                    },
                    take: 4,
                }
            }
        })

        return { pools }
    })

    fastify.get('/pools/:id', { onRequest: [authenticate]}, async request => {
        const getPoolParams = z.object({
            id: z.string()
        })
        const { id } = getPoolParams.parse(request.params)

        const pool = await prisma.pool.findUnique({
            where: {
                id
            }, include: {
                owner: {
                    select: {
                        name: true,
                        id: true,
                    }
                },
                _count: {
                    select: {
                        participants: true
                    }
                },
                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatarUrl: true,
                            }
                        }
                    },
                    take: 4,
                }
            }
        })
        
        return { pool }
    })
}
