import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  useColorScheme,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import WinInput from '../components/WinInput';
import { storage } from '../utils/storage';
import { getTheme } from '../styles/theme';

export default function HomeScreen({ navigation }) {
  const [wins, setWins] = useState([]);
  const [hasWinToday, setHasWinToday] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [streak, setStreak] = useState(0);
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    loadData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadData = async () => {
    const allWins = await storage.getAllWins();
    setWins(allWins);
    setHasWinToday(await storage.hasWinToday());
    setStreak(await storage.getStreak());
  };

  const handleSave = async (text) => {
    await storage.saveWin(text);
    await loadData();
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const goToAllWins = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('All Wins');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Small Wins</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            One moment at a time
          </Text>
          
          {/* Streak Badge */}
          {streak > 0 && (
            <View style={[styles.streakBadge, { backgroundColor: theme.accent + '20' }]}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={[styles.streakText, { color: theme.accent }]}>
                {streak} day streak!
              </Text>
            </View>
          )}
        </View>

        {/* Success Message */}
        {showSuccess && (
          <Animated.View 
            style={[styles.successMessage, { backgroundColor: theme.accentLight }]}
          >
            <Text style={[styles.successText, { color: theme.text }]}>
              ✓ Saved! Keep collecting the good things.
            </Text>
          </Animated.View>
        )}

        {/* Input */}
        <WinInput 
          onSave={handleSave}
          hasWinToday={hasWinToday}
          theme={theme}
        />

        {/* View All Button */}
        {wins.length > 0 && (
          <TouchableOpacity
            style={[styles.viewAllButton, { borderColor: theme.accent }]}
            onPress={goToAllWins}
            activeOpacity={0.7}
          >
            <Text style={[styles.viewAllText, { color: theme.accent }]}>
              See all the good things ({wins.length})
            </Text>
          </TouchableOpacity>
        )}

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.statNumber, { color: theme.accent }]}>
              {wins.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Total Wins
            </Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.statNumber, { color: theme.accent }]}>
              {wins.filter(w => w.date === new Date().toISOString().split('T')[0]).length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Today
            </Text>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  streakEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  streakText: {
    fontSize: 15,
    fontWeight: '600',
  },
  successMessage: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  successText: {
    fontWeight: '500',
  },
  viewAllButton: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  viewAllText: {
    fontSize: 17,
    fontWeight: '600',
  },
  quickStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
});