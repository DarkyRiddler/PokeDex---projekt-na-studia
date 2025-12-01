<template>
  <div>
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-2">Umiejętności</h1>
      <p class="text-gray-600 dark:text-gray-400">Przeglądaj wszystkie umiejętności pokemonów</p>
    </div>

    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="i in 20" :key="i" class="bg-white dark:bg-dark-card rounded-xl p-4 shadow-lg animate-pulse">
        <div class="bg-gray-200 dark:bg-dark-border h-5 rounded mb-2"></div>
        <div class="bg-gray-200 dark:bg-dark-border h-3 rounded w-2/3"></div>
      </div>
    </div>

    <div v-else>
      <div class="mb-6 flex items-center gap-4">
        <div class="flex-1 relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Szukaj umiejętności..."
            class="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-yellow-500"
          />
          <svg class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <button
          @click="showOnlyTeamAbilities = !showOnlyTeamAbilities"
          class="px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap"
          :class="showOnlyTeamAbilities
            ? 'bg-primary-600 dark:bg-yellow-500 text-white dark:text-black shadow-lg'
            : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border'"
        >
          {{ showOnlyTeamAbilities ? 'Wszystkie' : 'W drużynie' }}
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <button
          v-for="ability in filteredAbilities"
          :key="ability.id"
          @click="openAbilityModal(ability)"
          class="bg-white dark:bg-dark-card rounded-xl p-4 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all text-left group relative"
        >
          <div v-if="ability.isInTeam" class="absolute top-3 right-3">
            <span class="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              W drużynie
            </span>
          </div>

          <div class="flex items-start gap-3">
            <div class="bg-gradient-to-br from-primary-100 to-primary-200 dark:from-yellow-900 dark:to-yellow-800 rounded-lg p-3">
              <svg class="w-6 h-6 text-primary-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>

            <div class="flex-1">
              <h3 class="text-lg font-semibold capitalize text-gray-800 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-yellow-400 transition-colors">
                {{ ability.name.replace('-', ' ') }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">ID: {{ ability.id }}</p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <div v-if="selectedAbility" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" @click.self="closeModal">
      <div class="bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div v-if="loadingDetails" class="p-8 text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 dark:border-yellow-400 mx-auto"></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">Ładowanie szczegółów...</p>
        </div>

        <div v-else-if="abilityDetails" class="p-6">
          <div class="flex justify-between items-start mb-6">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h2 class="text-3xl font-bold capitalize text-gray-800 dark:text-white">
                  {{ abilityDetails.name.replace('-', ' ') }}
                </h2>
                <span v-if="isAbilityInTeam(abilityDetails.id)" class="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
                  W drużynie
                </span>
              </div>
              <p class="text-gray-500 dark:text-gray-400">ID: {{ abilityDetails.id }}</p>
            </div>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Opis</h3>
              <div class="bg-blue-50 dark:bg-dark-border rounded-lg p-4">
                <p class="text-gray-700 dark:text-gray-300">
                  {{ getEnglishDescription(abilityDetails) }}
                </p>
              </div>
            </div>

            <div v-if="getTeamPokemonWithAbility(abilityDetails.id).length > 0">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Pokemony z twojej drużyny</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div
                  v-for="pokemon in getTeamPokemonWithAbility(abilityDetails.id)"
                  :key="pokemon.id"
                  class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-3 flex items-center gap-3"
                >
                  <img
                    :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`"
                    :alt="pokemon.name"
                    class="w-12 h-12"
                  />
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">#{{ pokemon.id.toString().padStart(3, '0') }}</p>
                    <p class="font-semibold capitalize text-gray-800 dark:text-white text-sm">{{ pokemon.name }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="abilityDetails.pokemon && abilityDetails.pokemon.length > 0">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Pokemony z tą umiejętnością ({{ abilityDetails.pokemon.length }})
              </h3>
              <div class="bg-gray-50 dark:bg-dark-border rounded-lg p-4 max-h-64 overflow-y-auto">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  <span
                    v-for="(poke, index) in abilityDetails.pokemon.slice(0, 50)"
                    :key="index"
                    class="text-sm capitalize text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-card px-3 py-2 rounded-lg"
                  >
                    {{ poke.pokemon.name }}
                  </span>
                </div>
                <p v-if="abilityDetails.pokemon.length > 50" class="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                  i {{ abilityDetails.pokemon.length - 50 }} więcej...
                </p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 dark:bg-dark-border rounded-lg p-4">
                <h4 class="font-semibold text-gray-800 dark:text-white mb-2">Generacja</h4>
                <p class="text-gray-600 dark:text-gray-400 capitalize">
                  {{ abilityDetails.generation?.name || 'N/A' }}
                </p>
              </div>

              <div class="bg-gray-50 dark:bg-dark-border rounded-lg p-4">
                <h4 class="font-semibold text-gray-800 dark:text-white mb-2">Ukryta</h4>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ abilityDetails.is_main_series ? 'Tak' : 'Nie' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
});

const { getAbilities, getAbilityDetails } = usePokemonApi();
const { team } = usePokemonTeam();

interface Ability {
  id: number;
  name: string;
  isInTeam: boolean;
}

interface AbilityDetails {
  id: number;
  name: string;
  effect_entries: Array<{
    effect: string;
    short_effect: string;
    language: { name: string };
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
  }>;
  pokemon: Array<{
    pokemon: { name: string; url: string };
    is_hidden: boolean;
  }>;
  generation: { name: string };
  is_main_series: boolean;
}

const abilities = ref<Ability[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const showOnlyTeamAbilities = ref(false);

const selectedAbility = ref<Ability | null>(null);
const abilityDetails = ref<AbilityDetails | null>(null);
const loadingDetails = ref(false);

const teamAbilityIds = computed(() => {
  const abilityIds = new Set<number>();
  team.value.forEach(pokemon => {
    pokemon.abilities.forEach(ability => {
      const abilityId = parseInt(ability.ability.url.split('/').filter(Boolean).pop() || '0');
      abilityIds.add(abilityId);
    });
  });
  return abilityIds;
});

const filteredAbilities = computed(() => {
  let filtered = abilities.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(ability =>
      ability.name.toLowerCase().includes(query)
    );
  }

  if (showOnlyTeamAbilities.value) {
    filtered = filtered.filter(ability => ability.isInTeam);
  }

  return filtered;
});

const loadAbilities = async () => {
  loading.value = true;
  try {
    const data = await getAbilities();
    abilities.value = data.results.map((ability: any, index: number) => {
      const abilityId = index + 1;
      return {
        id: abilityId,
        name: ability.name,
        isInTeam: teamAbilityIds.value.has(abilityId)
      };
    });
  } catch (error) {
    console.error('Error loading abilities:', error);
  } finally {
    loading.value = false;
  }
};

const openAbilityModal = async (ability: Ability) => {
  selectedAbility.value = ability;
  loadingDetails.value = true;

  try {
    abilityDetails.value = await getAbilityDetails(ability.id);
  } catch (error) {
    console.error('Error loading ability details:', error);
  } finally {
    loadingDetails.value = false;
  }
};

const closeModal = () => {
  selectedAbility.value = null;
  abilityDetails.value = null;
};

const getEnglishDescription = (details: AbilityDetails) => {
  const englishEffect = details.effect_entries.find(entry => entry.language.name === 'en');
  if (englishEffect) {
    return englishEffect.short_effect || englishEffect.effect;
  }

  const englishFlavor = details.flavor_text_entries.find(entry => entry.language.name === 'en');
  return englishFlavor?.flavor_text || 'No description available';
};

const isAbilityInTeam = (abilityId: number) => {
  return teamAbilityIds.value.has(abilityId);
};

const getTeamPokemonWithAbility = (abilityId: number) => {
  return team.value.filter(pokemon =>
    pokemon.abilities.some(ability => {
      const id = parseInt(ability.ability.url.split('/').filter(Boolean).pop() || '0');
      return id === abilityId;
    })
  );
};

watch(team, () => {
  abilities.value = abilities.value.map(ability => ({
    ...ability,
    isInTeam: teamAbilityIds.value.has(ability.id)
  }));
}, { deep: true });

onMounted(() => {
  loadAbilities();
});
</script>
