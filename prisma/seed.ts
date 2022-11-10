import { prisma } from "../src/lib/prisma";

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@exampe.com.br',
      password: 'sdandas-3erqr',
      avatarUrl: 'example.com.br'
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Example',
      code: '908r42',
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-12-03T16:00:00.201Z',
      firstTeamCountryCode: 'BR',
      secondTemCountryCode: 'CM',
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-24T16:00:00.201Z',
      firstTeamCountryCode: 'BR',
      secondTemCountryCode: 'RS',

      guesses: {
        create: {
          firstTeamPoints: 3,
          secondTeamPoints: 1,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  })
}

main();
