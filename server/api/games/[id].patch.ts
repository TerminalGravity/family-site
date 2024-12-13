import prisma from '~/server/utils/prisma'
import { gameSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Game ID is required'
      })
    }

    const body = await readBody(event)
    const validatedData = gameSchema.partial().parse(body)

    const game = await prisma.game.update({
      where: { id },
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
      message: error instanceof Error ? error.message : 'Failed to update game'
    })
  }
}) 