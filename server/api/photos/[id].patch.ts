import prisma from '~/server/utils/prisma'
import { photoSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Photo ID is required'
      })
    }

    const body = await readBody(event)
    const validatedData = photoSchema.partial().parse(body)

    const photo = await prisma.photo.update({
      where: { id },
      data: validatedData,
      include: {
        comments: true
      }
    })

    return photo
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error instanceof Error ? error.message : 'Failed to update photo'
    })
  }
}) 