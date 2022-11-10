import Fastify from 'fastify';
import jwt from '@fastify/jwt'

import { env } from './env/config';

import { userRoutes } from './routes/user';
import { authRoutes } from './routes/auth';
import { poolRoutes } from './routes/pools';
import { gameRoutes } from './routes/game';
import { guessRoutes } from './routes/guess';

const bootstrap = async () => {
    const fastify = Fastify({
        logger: true
    })
    
    await fastify.register(jwt, {
        secret: env('JWT_SECRET')
    })

    await fastify.register(userRoutes)
    await fastify.register(authRoutes)
    await fastify.register(poolRoutes)
    await fastify.register(gameRoutes)
    await fastify.register(guessRoutes)

    try {
        await fastify.listen({ port: 3000 });
        console.log('app listening at http://localhost:3000')
    } catch {
        console.error('server no running')
    }
}

bootstrap();
