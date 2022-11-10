import '@fastify/jwt';
import 'fastify'

declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: {
            id: string;
            type: string;
            audience?: string,
        }
    }
}
