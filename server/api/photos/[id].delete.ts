import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Photo ID is required'
      })
    }

    await prisma.photo.delete({
      where: { id }
    })

    return { message: 'Photo deleted successfully' }
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error instanceof Error ? error.message : 'Failed to delete photo'
    })
  }
}) 