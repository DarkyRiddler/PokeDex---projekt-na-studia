<template>
  <div>
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-2">Lokalizacje</h1>
      <p class="text-gray-600 dark:text-gray-400">Wybierz generację, aby zobaczyć pokemony z niej</p>
    </div>

    <div v-if="loadingGenerations" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 9" :key="i" class="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg animate-pulse">
        <div class="bg-gray-200 dark:bg-dark-border h-6 rounded mb-2"></div>
        <div class="bg-gray-200 dark:bg-dark-border h-4 rounded w-2/3"></div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <button
        v-for="generation in generations"
        :key="generation.id"
        @click="selectGeneration(generation)"
        class="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all text-left"
        :class="selectedGeneration?.id === generation.id ? 'ring-4 ring-primary-500 dark:ring-yellow-500' : ''"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <svg class="w-8 h-8 text-primary-600 dark:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="text-xl font-semibold capitalize text-gray-800 dark:text-white">
              {{ generation.name.toUpperCase() }} {{ generation.main_region.name }}
            </h3>
          </div>
          <span class="bg-primary-100 dark:bg-yellow-900 text-primary-700 dark:text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">
            {{ generation.pokemonCount }}
          </span>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400">Generacja {{ generation.id }}</p>
      </button>
    </div>

    <div v-if="selectedGeneration" class="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold capitalize text-gray-800 dark:text-white">
          Pokemony z generacji {{ selectedGeneration.name }}
        </h2>
        <button
          @click="clearSelection"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div v-if="loadingPokemon" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="i in 20" :key="i" class="bg-gray-100 dark:bg-dark-border rounded-lg p-4 animate-pulse">
          <div class="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
          <div class="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3"></div>
        </div>
      </div>

      <div v-else-if="generationPokemon.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-gray-600 dark:text-gray-400">Brak dostępnych danych o pokemonach w tej generacji</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <button
          v-for="pokemon in generationPokemon"
          :key="pokemon.id"
          @click="openPokemonModal(pokemon.id)"
          class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-dark-border dark:to-gray-800 rounded-lg p-4 hover:shadow-lg transition-all text-left group"
        >
          <div class="flex items-center gap-3">
            <img
              :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`"
              :alt="pokemon.name"
              class="w-16 h-16 group-hover:scale-110 transition-transform"
            />
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">#{{ pokemon.id.toString().padStart(3, '0') }}</p>
              <p class="font-semibold capitalize text-gray-800 dark:text-white">{{ pokemon.name }}</p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <PokemonModal
      :pokemon-id="selectedPokemonId"
      :is-open="isModalOpen"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
});

const { getGenerations, getGenerationDetails } = usePokemonApi();

interface Generation {
  id: number;
  name: string;
  pokemonCount: number;
}

interface GenerationPokemon {
  id: number;
  name: string;
}

const generations = ref<Generation[]>([]);
const selectedGeneration = ref<Generation | null>(null);
const generationPokemon = ref<GenerationPokemon[]>([]);
const loadingGenerations = ref(true);
const loadingPokemon = ref(false);

const selectedPokemonId = ref<number | null>(null);
const isModalOpen = ref(false);

const loadGenerations = async () => {
  loadingGenerations.value = true;
  try {
    const data = await getGenerations();
    console.log(data);
    const generationPromises = data.results.map(async (gen: any) => {
      const genId = parseInt(gen.url.split('/').filter(Boolean).pop());
      const details = await getGenerationDetails(genId);
      return {
        id: genId,
        name: gen.name,
        main_region: details.main_region,
        pokemonCount: details.pokemon_species.length
      };
    });

    generations.value = await Promise.all(generationPromises);
  } catch (error) {
    console.error('Error loading generations:', error);
  } finally {
    loadingGenerations.value = false;
  }
};


const selectGeneration = async (generation: Generation) => {
  selectedGeneration.value = generation;
  loadingPokemon.value = true;

  try {
    const details = await getGenerationDetails(generation.id);
    generationPokemon.value = details.pokemon_species.map((species: any) => {
      const pokemonId = parseInt(species.url.split('/').filter(Boolean).pop());
      return {
        id: pokemonId,
        name: species.name
      };
    }).sort((a: GenerationPokemon, b: GenerationPokemon) => a.id - b.id);
  } catch (error) {
    console.error('Error loading generation pokemon:', error);
    generationPokemon.value = [];
  } finally {
    loadingPokemon.value = false;
  }
};

const clearSelection = () => {
  selectedGeneration.value = null;
  generationPokemon.value = [];
};

const openPokemonModal = (id: number) => {
  selectedPokemonId.value = id;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedPokemonId.value = null;
};

onMounted(() => {
  loadGenerations();
});
</script>
