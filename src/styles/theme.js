export const getTheme = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return {
    background: isDark ? '#1a1410' : '#faf8f3',
    card: isDark ? '#2a2419' : '#fefdfb',
    text: isDark ? '#faf8f3' : '#2a2419',
    textSecondary: isDark ? '#8a8075' : '#4a4035',
    accent: '#d4916f',
    accentLight: '#e8b89a',
    border: isDark ? '#3a3429' : '#e8e6e1',
    inputBackground: isDark ? '#1a1410' : '#f5f3ee',
    shadow: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(42, 36, 25, 0.08)',
  };
};