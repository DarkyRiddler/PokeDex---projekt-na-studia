<template>
  <div>
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-2">Wszystkie Pokemony</h1>
      <p class="text-gray-600 dark:text-gray-400">Kliknij na pokemona, aby zobaczyć szczegóły</p>
    </div>

    <div class="mb-6 space-y-4">
      <div class="flex items-center gap-4">
        <div class="flex-1 relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Szukaj po nazwie lub ID (np. pikachu lub #025)..."
            class="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-yellow-500"
            @keyup.enter="handleSearch"
          />
          <svg class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="px-6 py-3 bg-gray-200 dark:bg-dark-border text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          Wyczyść
        </button>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Żywioły:</span>
        <button
          @click="selectedType = null"
          class="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          :class="selectedType === null
            ? 'bg-primary-600 dark:bg-yellow-500 text-white dark:text-black shadow-lg'
            : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border'"
        >
          Wszystkie
        </button>
        <button
          v-for="type in pokemonTypes"
          :key="type.id"
          @click="selectType(type.id)"
          class="px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
          :class="selectedType === type.id
            ? 'bg-primary-600 dark:bg-yellow-500 text-white dark:text-black shadow-lg'
            : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border'"
        >
          {{ type.name }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div v-for="i in 50" :key="i" class="bg-white dark:bg-dark-card rounded-xl p-4 shadow-lg animate-pulse">
        <div class="bg-gray-200 dark:bg-dark-border rounded-lg h-48 mb-4"></div>
        <div class="bg-gray-200 dark:bg-dark-border h-4 rounded mb-2"></div>
        <div class="bg-gray-200 dark:bg-dark-border h-3 rounded w-2/3"></div>
      </div>
    </div>

    <div v-else-if="pokemonList.length === 0" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p class="text-gray-600 dark:text-gray-400">Nie znaleziono pokemonów</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div
        v-for="pokemon in pokemonList"
        :key="pokemon.id"
        @click="openPokemonModal(pokemon.id)"
        class="bg-white dark:bg-dark-card rounded-xl p-4 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all cursor-pointer group"
      >
        <div class="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-dark-border dark:to-gray-800 rounded-lg p-4 mb-4">
          <img
            :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`"
            :alt="pokemon.name"
            class="w-full h-auto group-hover:scale-110 transition-transform"
          />
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">#{{ pokemon.id.toString().padStart(3, '0') }}</p>
        <h3 class="text-lg font-semibold capitalize text-gray-800 dark:text-white">{{ pokemon.name }}</h3>

        <button
          @click.stop="handleQuickAdd(pokemon.id)"
          class="mt-3 w-full bg-primary-500 hover:bg-primary-600 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white dark:text-black text-sm font-medium py-2 rounded-lg transition-colors"
        >
          {{ isInTeam(pokemon.id) ? 'W drużynie' : 'Dodaj do drużyny' }}
        </button>
      </div>
    </div>

    <div v-if="!searchQuery && !selectedType && pokemonList.length > 0" class="mt-8 flex justify-center items-center gap-4">
      <button
        @click="previousPage"
        :disabled="currentPage === 1"
        class="px-6 py-3 bg-white dark:bg-dark-card text-primary-600 dark:text-yellow-400 font-semibold rounded-lg shadow hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Poprzednia
      </button>

      <div class="flex gap-2">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          class="px-4 py-3 rounded-lg font-semibold transition-all"
          :class="currentPage === page
            ? 'bg-primary-600 dark:bg-yellow-500 text-white dark:text-black shadow-lg'
            : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'"
        >
          {{ page }}
        </button>
      </div>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-6 py-3 bg-white dark:bg-dark-card text-primary-600 dark:text-yellow-400 font-semibold rounded-lg shadow hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Następna
      </button>
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

const { getPokemonList, getPokemonById, getPokemonByName, getTypes, getPokemonByType } = usePokemonApi();
const { isInTeam } = usePokemonTeam();

interface PokemonBasic {
  id: number;
  name: string;
}

interface PokemonType {
  id: number;
  name: string;
}

const pokemonList = ref<PokemonBasic[]>([]);
const allPokemon = ref<PokemonBasic[]>([]);
const pokemonTypes = ref<PokemonType[]>([]);
const loading = ref(true);
const currentPage = ref(1);
const itemsPerPage = 50;
const totalPokemon = 1010;
const totalPages = Math.ceil(totalPokemon / itemsPerPage);

const searchQuery = ref('');
const selectedType = ref<number | null>(null);

const selectedPokemonId = ref<number | null>(null);
const isModalOpen = ref(false);
const scrollPosition = ref(0);

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages, currentPage.value + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const loadTypes = async () => {
  try {
    const data = await getTypes();
    pokemonTypes.value = data.results
      .map((type: any, index: number) => ({
        id: index + 1,
        name: type.name
      }))
      .filter((type: PokemonType) => type.id <= 18);
  } catch (error) {
    console.error('Error loading types:', error);
  }
};

const loadPokemon = async () => {
  loading.value = true;
  const offset = (currentPage.value - 1) * itemsPerPage;

  try {
    const data = await getPokemonList(itemsPerPage, offset);
    pokemonList.value = data.results.map((pokemon, index) => ({
      id: offset + index + 1,
      name: pokemon.name
    }));
  } catch (error) {
    console.error('Error loading pokemon:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    loadPokemon();
    return;
  }

  loading.value = true;
  try {
    let query = searchQuery.value.trim().toLowerCase();

    if (query.startsWith('#')) {
      query = query.substring(1);
    }

    const isNumeric = /^\d+$/.test(query);

    if (isNumeric) {
      const id = parseInt(query);
      if (id > 0 && id <= totalPokemon) {
        try {
          const pokemon = await getPokemonById(id);
          pokemonList.value = [{ id: pokemon.id, name: pokemon.name }];
        } catch (error) {
          pokemonList.value = [];
        }
      } else {
        pokemonList.value = [];
      }
    } else {
      try {
        const pokemon = await getPokemonByName(query);
        pokemonList.value = [{ id: pokemon.id, name: pokemon.name }];
      } catch (error) {
        pokemonList.value = [];
      }
    }
  } catch (error) {
    console.error('Error searching pokemon:', error);
    pokemonList.value = [];
  } finally {
    loading.value = false;
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  selectedType.value = null;
  loadPokemon();
};

const selectType = async (typeId: number) => {
  selectedType.value = typeId;
  loading.value = true;

  try {
    const data = await getPokemonByType(typeId);
    pokemonList.value = data.pokemon
      .map((p: any) => {
        const id = parseInt(p.pokemon.url.split('/').filter(Boolean).pop());
        return { id, name: p.pokemon.name };
      })
      .filter((p: PokemonBasic) => p.id <= totalPokemon)
      .sort((a: PokemonBasic, b: PokemonBasic) => a.id - b.id);
  } catch (error) {
    console.error('Error loading pokemon by type:', error);
    pokemonList.value = [];
  } finally {
    loading.value = false;
  }
};

const openPokemonModal = (id: number) => {
  scrollPosition.value = window.scrollY;
  selectedPokemonId.value = id;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedPokemonId.value = null;
  nextTick(() => {
    window.scrollTo(0, scrollPosition.value);
  });
};

const handleQuickAdd = async (id: number) => {
  openPokemonModal(id);
};

const nextPage = () => {
  if (currentPage.value < totalPages) {
    currentPage.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

watch(currentPage, () => {
  if (!searchQuery.value && !selectedType.value) {
    loadPokemon();
  }
});

watch(searchQuery, (newValue) => {
  if (!newValue) {
    loadPokemon();
  }
});

onMounted(() => {
  loadTypes();
  loadPokemon();
});
</script>
