import prisma from '~/server/utils/prisma'
import { photoSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = photoSchema.parse(body)

    const photo = await prisma.photo.create({
      data: validatedData,
      include: {
        comments: true
      }
    })

    return photo
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error instanceof Error ? error.message : 'Failed to create photo'
    })
  }
}) 