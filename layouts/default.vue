<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-dark-bg dark:to-gray-900">
    <div class="flex min-h-screen">
      <aside class="w-64 bg-white dark:bg-dark-card shadow-xl fixed h-full z-10 flex flex-col">
        <div class="p-6 border-b border-gray-200 dark:border-dark-border">
          <h1 class="text-2xl font-bold text-primary-600 dark:text-yellow-400">Pokedex</h1>
        </div>

        <nav class="flex-1 p-4">
          <NuxtLink
            to="/"
            class="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all hover:bg-primary-50 dark:hover:bg-dark-border"
            :class="route.path === '/' ? 'bg-primary-100 dark:bg-dark-border text-primary-700 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span class="font-medium">Pokemony</span>
          </NuxtLink>

          <NuxtLink
            to="/team"
            class="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all hover:bg-primary-50 dark:hover:bg-dark-border"
            :class="route.path === '/team' ? 'bg-primary-100 dark:bg-dark-border text-primary-700 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span class="font-medium">Twoja Drużyna</span>
            <span v-if="team.length > 0" class="ml-auto bg-primary-500 dark:bg-yellow-500 text-white dark:text-black text-xs px-2 py-1 rounded-full">
              {{ team.length }}
            </span>
          </NuxtLink>

          <NuxtLink
            to="/locations"
            class="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all hover:bg-primary-50 dark:hover:bg-dark-border"
            :class="route.path === '/locations' ? 'bg-primary-100 dark:bg-dark-border text-primary-700 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span class="font-medium">Lokalizacje</span>
          </NuxtLink>

          <NuxtLink
            to="/abilities"
            class="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all hover:bg-primary-50 dark:hover:bg-dark-border"
            :class="route.path === '/abilities' ? 'bg-primary-100 dark:bg-dark-border text-primary-700 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <span class="font-medium">Umiejętności</span>
          </NuxtLink>
        </nav>

        <div class="p-4 border-t border-gray-200 dark:border-dark-border">
          <button
            @click="toggleDarkMode"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-100 dark:bg-dark-border hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
          >
            <svg v-if="!isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <span class="font-medium">{{ isDark ? 'Tryb jasny' : 'Tryb ciemny' }}</span>
          </button>
        </div>
      </aside>

      <main class="flex-1 ml-64 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { isDark, toggleDarkMode } = useDarkMode();
const { team } = usePokemonTeam();
</script>
