import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const photos = await prisma.photo.findMany({
      include: {
        comments: true
      },
      orderBy: {
        dinnerDate: 'desc'
      }
    })
    return photos
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch photos'
    })
  }
}) 