import { FastifyRequest } from "fastify";

export async function authenticate(request: FastifyRequest) {
    await request.jwtVerify();
    if(request.user.type === 'access_token') {
        return
    }
    throw new Error('That token is not access token')
}
