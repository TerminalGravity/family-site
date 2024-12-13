import prisma from '~/server/utils/prisma'
import { ratingSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const gameId = getRouterParam(event, 'id')
    if (!gameId) {
      throw createError({
        statusCode: 400,
        message: 'Game ID is required'
      })
    }

    const body = await readBody(event)
    const validatedData = ratingSchema.parse(body)

    const rating = await prisma.rating.create({
      data: {
        ...validatedData,
        gameId
      }
    })

    return rating
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error instanceof Error ? error.message : 'Failed to add rating'
    })
  }
}) 