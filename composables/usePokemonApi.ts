import type { Pokemon, PokemonListResponse } from '~/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const usePokemonApi = () => {
  const getPokemonList = async (limit: number = 50, offset: number = 0): Promise<PokemonListResponse> => {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    return await response.json();
  };

  const getPokemonById = async (id: number): Promise<Pokemon> => {
    const response = await fetch(`${BASE_URL}/pokemon/${id}`);
    return await response.json();
  };

  const getPokemonByName = async (name: string): Promise<Pokemon> => {
    const response = await fetch(`${BASE_URL}/pokemon/${name}`);
    return await response.json();
  };

  const getGenerations = async () => {
    const response = await fetch(`${BASE_URL}/generation`);
    return await response.json();
  };

  const getGenerationDetails = async (generationId: number) => {
    const response = await fetch(`${BASE_URL}/generation/${generationId}`);
    return await response.json();
  };

  const getAbilities = async (limit: number = 367, offset: number = 0) => {
    const response = await fetch(`${BASE_URL}/ability?limit=${limit}&offset=${offset}`);
    return await response.json();
  };

  const getAbilityDetails = async (abilityId: number | string) => {
    const response = await fetch(`${BASE_URL}/ability/${abilityId}`);
    return await response.json();
  };

  const getTypes = async () => {
    const response = await fetch(`${BASE_URL}/type`);
    return await response.json();
  };

  const getPokemonByType = async (typeId: number) => {
    const response = await fetch(`${BASE_URL}/type/${typeId}`);
    return await response.json();
  };

  return {
    getPokemonList,
    getPokemonById,
    getPokemonByName,
    getGenerations,
    getGenerationDetails,
    getAbilities,
    getAbilityDetails,
    getTypes,
    getPokemonByType
  };
};
