import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function WinItem({ win, index, theme }) {
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.card, opacity: fadeAnim }
      ]}
    >
      <Text style={[styles.date, { color: theme.textSecondary }]}>
        {formatDate(win.date)}
      </Text>
      <Text style={[styles.text, { color: theme.text }]}>
        {win.text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  date: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
  },
  text: {
    fontSize: 17,
    lineHeight: 24,
  },
});