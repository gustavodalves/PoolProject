import { FastifyInstance } from "fastify";

export class CreateAccessTokenUseCase {
    static execute(fastify: FastifyInstance, payload: { id: string }) {
        const token = fastify.jwt.sign({ ...payload, type: 'access_token' }, {
            expiresIn: '1h'
        })
    return token
  }
}
