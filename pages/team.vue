<template>
  <div>
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-2">Twoja Drużyna</h1>
      <p class="text-gray-600 dark:text-gray-400">Maksymalnie 6 pokemonów w drużynie</p>
    </div>

    <div v-if="team.length === 0" class="bg-white dark:bg-dark-card rounded-xl p-12 shadow-lg text-center">
      <svg class="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Brak pokemonów w drużynie</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">Dodaj pokemony ze strony głównej</p>
      <NuxtLink
        to="/"
        class="inline-block bg-primary-600 hover:bg-primary-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white dark:text-black font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Przeglądaj Pokemony
      </NuxtLink>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div
          v-for="pokemon in team"
          :key="pokemon.id"
          @click="openPokemonModal(pokemon.id)"
          class="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all cursor-pointer group"
        >
          <div class="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-dark-border dark:to-gray-800 rounded-lg p-6 mb-4">
            <img
              :src="pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default"
              :alt="pokemon.name"
              class="w-full h-auto group-hover:scale-110 transition-transform"
            />
          </div>

          <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">#{{ pokemon.id.toString().padStart(3, '0') }}</p>
          <h3 class="text-xl font-semibold capitalize text-gray-800 dark:text-white mb-3">{{ pokemon.name }}</h3>

          <div class="flex gap-2 mb-4">
            <span
              v-for="type in pokemon.types"
              :key="type.slot"
              class="px-3 py-1 rounded-full text-xs font-semibold capitalize"
              :class="getTypeColor(type.type.name)"
            >
              {{ type.type.name }}
            </span>
          </div>

          <button
            @click.stop="handleRemoveFromTeam(pokemon.id)"
            class="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            Usuń z drużyny
          </button>
        </div>
      </div>

      <div class="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Pokrycie typów</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Twoja drużyna ma pokemony następujących typów</p>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div
            v-for="typeInfo in typeCoverage"
            :key="typeInfo.type"
            class="p-4 rounded-lg text-center transition-all"
            :class="typeInfo.active
              ? 'bg-primary-100 dark:bg-yellow-900 border-2 border-primary-500 dark:border-yellow-500'
              : 'bg-gray-100 dark:bg-dark-border border-2 border-transparent opacity-50'"
          >
            <span
              class="inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize mb-2"
              :class="getTypeColor(typeInfo.type)"
            >
              {{ typeInfo.type }}
            </span>
            <p class="text-xs font-medium" :class="typeInfo.active ? 'text-primary-700 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-500'">
              {{ typeInfo.active ? 'Aktywny' : 'Brak' }}
            </p>
          </div>
        </div>

        <div class="mt-6 p-4 bg-blue-50 dark:bg-dark-border rounded-lg">
          <div class="flex items-start gap-3">
            <svg class="w-6 h-6 text-blue-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-white mb-1">Informacja o pokryciu typów</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Twoja drużyna ma pokemony {{ activeTypesCount }} z {{ totalTypes }} możliwych typów.
                Zróżnicowana drużyna jest silniejsza w walce!
              </p>
            </div>
          </div>
        </div>
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

const { team, removeFromTeam, getAllTypes } = usePokemonTeam();

const selectedPokemonId = ref<number | null>(null);
const isModalOpen = ref(false);

const typeCoverage = computed(() => getAllTypes());
const activeTypesCount = computed(() => typeCoverage.value.filter(t => t.active).length);
const totalTypes = computed(() => typeCoverage.value.length);

const openPokemonModal = (id: number) => {
  selectedPokemonId.value = id;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedPokemonId.value = null;
};

const handleRemoveFromTeam = (pokemonId: number) => {
  removeFromTeam(pokemonId);
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    normal: 'bg-gray-400 text-white',
    fire: 'bg-orange-500 text-white',
    water: 'bg-blue-500 text-white',
    electric: 'bg-yellow-400 text-gray-800',
    grass: 'bg-green-500 text-white',
    ice: 'bg-cyan-400 text-white',
    fighting: 'bg-red-600 text-white',
    poison: 'bg-purple-500 text-white',
    ground: 'bg-yellow-600 text-white',
    flying: 'bg-indigo-400 text-white',
    psychic: 'bg-pink-500 text-white',
    bug: 'bg-lime-500 text-white',
    rock: 'bg-yellow-700 text-white',
    ghost: 'bg-purple-700 text-white',
    dragon: 'bg-indigo-600 text-white',
    dark: 'bg-gray-700 text-white',
    steel: 'bg-gray-500 text-white',
    fairy: 'bg-pink-400 text-white'
  };
  return colors[type] || 'bg-gray-400 text-white';
};
</script>
