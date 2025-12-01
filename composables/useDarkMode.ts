export const useDarkMode = () => {
  const isDark = useState('darkMode', () => {
    if (process.client) {
      const saved = localStorage.getItem('darkMode');
      return saved ? saved === 'true' : false;
    }
    return false;
  });

  const toggleDarkMode = () => {
    isDark.value = !isDark.value;
    if (process.client) {
      localStorage.setItem('darkMode', isDark.value.toString());
      updateDarkModeClass();
    }
  };

  const updateDarkModeClass = () => {
    if (process.client) {
      if (isDark.value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  onMounted(() => {
    updateDarkModeClass();
  });

  return {
    isDark,
    toggleDarkMode
  };
};
