import { Prisma } from '@prisma/client';
import { EncryptPasswordUseCase } from '../../useCases/EncryptPassword';

export class PrismaUserMiddleware {
    static async encrypt(params: Prisma.MiddlewareParams, next: any): Promise<Prisma.Middleware> {
        if(params.action === 'create' && params.model === 'User') {
            const { password } = params.args.data
            const hashedPassword = EncryptPasswordUseCase.execute(password)
            params.args.data.password = hashedPassword
        }

        return await next(params)
    }
}
