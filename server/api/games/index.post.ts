import prisma from '~/server/utils/prisma'
import { gameSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = gameSchema.parse(body)

    const game = await prisma.game.create({
      data: validatedData,
      include: {
        ratings: true,
        comments: true
      }
    })

    return game
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error instanceof Error ? error.message : 'Failed to create game'
    })
  }
}) 