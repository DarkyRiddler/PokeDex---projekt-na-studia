import { hashPassword } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Hashowanie hasła
  const hashedPassword = await hashPassword(body.password)
  
  try {
    const user = await prisma.user.create({
      data: {
        login: body.login,
        email: body.email,
        password: hashedPassword  // Hash zamiast plain text!
      }
    })
    
    // Nie zwracaj hasła nawet zahashowanego
    const { password, ...userWithoutPassword } = user
    
    return {
      success: true,
      user: userWithoutPassword
    }
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: 'User already exists'
    })
  }
})