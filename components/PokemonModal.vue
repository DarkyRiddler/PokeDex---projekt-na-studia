<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        @click.self="closeModal"
      >
        <div class="bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div v-if="loading" class="p-8 text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 dark:border-yellow-400 mx-auto"></div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">Ładowanie...</p>
          </div>

          <div v-else-if="pokemon" class="p-6">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h2 class="text-3xl font-bold capitalize text-gray-800 dark:text-white">
                  {{ pokemon.name }}
                </h2>
                <p class="text-gray-500 dark:text-gray-400">#{{ pokemon.id.toString().padStart(3, '0') }}</p>
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

            <div class="grid md:grid-cols-2 gap-6">
              <div class="flex flex-col items-center">
                <div class="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-dark-border dark:to-gray-800 rounded-xl p-8 w-full">
                  <img
                    :src="pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default"
                    :alt="pokemon.name"
                    class="w-full h-auto"
                  />
                </div>

                <div class="flex gap-2 mt-4">
                  <span
                    v-for="type in pokemon.types"
                    :key="type.slot"
                    class="px-4 py-2 rounded-full text-sm font-semibold capitalize"
                    :class="getTypeColor(type.type.name)"
                  >
                    {{ type.type.name }}
                  </span>
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Podstawowe informacje</h3>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600 dark:text-gray-400">Wzrost:</span>
                      <span class="font-medium text-gray-800 dark:text-white">{{ (pokemon.height / 10).toFixed(1) }} m</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600 dark:text-gray-400">Waga:</span>
                      <span class="font-medium text-gray-800 dark:text-white">{{ (pokemon.weight / 10).toFixed(1) }} kg</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Umiejętności</h3>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="ability in pokemon.abilities"
                      :key="ability.slot"
                      class="px-3 py-1 bg-gray-100 dark:bg-dark-border rounded-full text-xs font-medium capitalize text-gray-700 dark:text-gray-300"
                    >
                      {{ ability.ability.name.replace('-', ' ') }}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Statystyki</h3>
                  <div class="space-y-3">
                    <div v-for="stat in pokemon.stats" :key="stat.stat.name">
                      <div class="flex justify-between text-sm mb-1">
                        <span class="capitalize text-gray-600 dark:text-gray-400">{{ stat.stat.name.replace('-', ' ') }}</span>
                        <span class="font-medium text-gray-800 dark:text-white">{{ stat.base_stat }}</span>
                      </div>
                      <div class="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2">
                        <div
                          class="bg-primary-500 dark:bg-yellow-500 h-2 rounded-full transition-all"
                          :style="{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 flex gap-3">
              <button
                v-if="!isInTeam(pokemon.id)"
                @click="handleAddToTeam"
                class="flex-1 bg-primary-600 hover:bg-primary-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white dark:text-black font-semibold py-3 rounded-lg transition-colors"
              >
                Dodaj do drużyny
              </button>
              <button
                v-else
                @click="handleRemoveFromTeam"
                class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Usuń z drużyny
              </button>
            </div>

            <div v-if="message" class="mt-3 p-3 rounded-lg text-sm text-center" :class="messageClass">
              {{ message }}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Pokemon } from '~/types/pokemon';

const props = defineProps<{
  pokemonId: number | null;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { getPokemonById } = usePokemonApi();
const { addToTeam, removeFromTeam, isInTeam } = usePokemonTeam();

const pokemon = ref<Pokemon | null>(null);
const loading = ref(false);
const message = ref('');
const messageClass = ref('');

watch(() => props.pokemonId, async (newId) => {
  if (newId && props.isOpen) {
    await loadPokemon(newId);
  }
}, { immediate: true });

watch(() => props.isOpen, (newValue) => {
  if (newValue && props.pokemonId) {
    loadPokemon(props.pokemonId);
  }
  message.value = '';
});

const loadPokemon = async (id: number) => {
  loading.value = true;
  message.value = '';
  try {
    pokemon.value = await getPokemonById(id);
  } catch (error) {
    console.error('Error loading pokemon:', error);
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  emit('close');
};

const handleAddToTeam = () => {
  if (pokemon.value) {
    const result = addToTeam(pokemon.value);
    message.value = result.message;
    messageClass.value = result.success
      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';

    if (result.success) {
      setTimeout(() => {
        message.value = '';
      }, 3000);
    }
  }
};

const handleRemoveFromTeam = () => {
  if (pokemon.value) {
    removeFromTeam(pokemon.value.id);
    message.value = 'Pokemon usunięty z drużyny';
    messageClass.value = 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    setTimeout(() => {
      message.value = '';
    }, 3000);
  }
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

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>
