import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const games = await prisma.game.findMany({
      include: {
        ratings: true,
        comments: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return games
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch games'
    })
  }
}) 