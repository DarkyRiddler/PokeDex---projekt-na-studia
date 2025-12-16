export interface SafeUser {
  id: number
  login: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface Favourite {
  id: number
  userId: number
  pokemonId: number
}

export interface Team {
  id: number
  name?: string
  userId: number
  pokemons: number[]
}

export interface CreateUserDTO {
  login: string
  email: string
  password: string
}

export interface CreateFavouriteDTO {
  pokemonId: number
}

export interface CreateTeamDTO {
  name?: string
  pokemons: number[]
}