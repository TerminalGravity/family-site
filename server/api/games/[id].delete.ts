import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Game ID is required'
      })
    }

    await prisma.game.delete({
      where: { id }
    })

    return { message: 'Game deleted successfully' }
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error instanceof Error ? error.message : 'Failed to delete game'
    })
  }
}) 