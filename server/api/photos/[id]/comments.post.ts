import prisma from '~/server/utils/prisma'
import { commentSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const photoId = getRouterParam(event, 'id')
    if (!photoId) {
      throw createError({
        statusCode: 400,
        message: 'Photo ID is required'
      })
    }

    const body = await readBody(event)
    const validatedData = commentSchema.parse(body)

    const comment = await prisma.comment.create({
      data: {
        ...validatedData,
        photoId
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