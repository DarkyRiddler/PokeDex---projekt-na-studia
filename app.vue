<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { isDark } = useDarkMode();

onMounted(() => {
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  }
});
</script>
