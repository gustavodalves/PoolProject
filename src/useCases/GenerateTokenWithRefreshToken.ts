import { FastifyInstance } from "fastify"
import { CreateAccessTokenUseCase } from "./CreateAccessToken"

export class GenerateTokenWithRefreshTokenUseCase {
    static execute(fastify: FastifyInstance, refreshToken: string): string | false {
        interface JwtPayload {
            id: string
            type: 'access_token' | 'refresh_token'
            iat: number
            exp: number
        }
    
        const decodedToken = fastify.jwt.decode(refreshToken) as JwtPayload
    
        if(!decodedToken || decodedToken.type !== 'refresh_token') {
            return false
        }
    
        const accessToken = CreateAccessTokenUseCase.execute(fastify, { id: decodedToken.id })
        return accessToken
    }
}
