import type { Pokemon } from '~/types/pokemon';

export const usePokemonTeam = () => {
  const team = useState<Pokemon[]>('pokemonTeam', () => {
    if (process.client) {
      const saved = localStorage.getItem('pokemonTeam');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const addToTeam = (pokemon: Pokemon) => {
    if (team.value.length >= 6) {
      return { success: false, message: 'Drużyna może mieć maksymalnie 6 pokemonów' };
    }

    if (team.value.find(p => p.id === pokemon.id)) {
      return { success: false, message: 'Ten pokemon jest już w drużynie' };
    }

    team.value.push(pokemon);
    saveTeam();
    return { success: true, message: 'Pokemon dodany do drużyny' };
  };

  const removeFromTeam = (pokemonId: number) => {
    team.value = team.value.filter(p => p.id !== pokemonId);
    saveTeam();
  };

  const isInTeam = (pokemonId: number) => {
    return team.value.some(p => p.id === pokemonId);
  };

  const saveTeam = () => {
    if (process.client) {
      localStorage.setItem('pokemonTeam', JSON.stringify(team.value));
    }
  };

  const getAllTypes = () => {
    const allPokemonTypes = [
      'normal', 'fire', 'water', 'electric', 'grass', 'ice',
      'fighting', 'poison', 'ground', 'flying', 'psychic',
      'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];

    const teamTypes = new Set<string>();
    team.value.forEach(pokemon => {
      pokemon.types.forEach(type => {
        teamTypes.add(type.type.name);
      });
    });

    return allPokemonTypes.map(type => ({
      type,
      active: teamTypes.has(type)
    }));
  };

  return {
    team,
    addToTeam,
    removeFromTeam,
    isInTeam,
    getAllTypes
  };
};
