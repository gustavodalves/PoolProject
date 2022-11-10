import { FastifyInstance } from "fastify";

export class CreateRefreshTokenUseCase {
    static execute(fastify: FastifyInstance, payload: { id: string }) {
        const token = fastify.jwt.sign({ ...payload, type: 'refresh_token' }, {
            expiresIn: '24d'
        })
        return token
    }
}
