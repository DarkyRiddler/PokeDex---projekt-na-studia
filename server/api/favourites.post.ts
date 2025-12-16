export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const userId = 1 // W praktyce z sesji/JWT
  
  try {
    const favourite = await prisma.favourite.create({
      data: {
        userId,
        pokemonId: body.pokemonId
      }
    })
    
    return { success: true, favourite }
  } catch (error) {
    // Jeśli już istnieje
    throw createError({
      statusCode: 400,
      message: 'Pokemon already in favourites'
    })
  }
})