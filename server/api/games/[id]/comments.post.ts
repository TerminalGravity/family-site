import prisma from '~/server/utils/prisma'
import { commentSchema } from '~/server/utils/validation'

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
    const validatedData = commentSchema.parse(body)

    const comment = await prisma.comment.create({
      data: {
        ...validatedData,
        gameId
      }
    })

    return comment
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error instanceof Error ? error.message : 'Failed to add comment'
    })
  }
}) 