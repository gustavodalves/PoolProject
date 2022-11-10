import { PrismaClient } from "@prisma/client"
import { PrismaUserMiddleware } from "../middlewares/prisma/user"

export const prisma = new PrismaClient({
    log: ['query']
});

prisma.$use(PrismaUserMiddleware.encrypt);
