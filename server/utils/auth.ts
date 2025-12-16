import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

// Hashowanie hasła
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

// Weryfikacja hasła
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}