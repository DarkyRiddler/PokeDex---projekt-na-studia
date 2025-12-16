export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const userId = 1
  
  try {
    const team = await prisma.team.create({
      data: {
        userId,
        name: body.name,
        pokemons: body.pokemons
      }
    })
    
    return { success: true, team }
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: 'Error creating team'
    })
  }
})