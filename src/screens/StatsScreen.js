import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { storage } from '../utils/storage';
import { getTheme } from '../styles/theme';

export default function StatsScreen() {
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    thisMonth: 0,
    streak: 0,
    longestStreak: 0,
    avgPerWeek: 0,
  });
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const wins = await storage.getAllWins();
    const streak = await storage.getStreak();
    const longestStreak = await storage.getLongestStreak();

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeek = wins.filter(w => new Date(w.date) >= weekAgo).length;
    const thisMonth = wins.filter(w => new Date(w.date) >= monthAgo).length;

    // Calculate average per week
    const oldestWin = wins[0];
    const weeksSinceStart = oldestWin 
      ? Math.max(1, Math.floor((now - new Date(oldestWin.date)) / (7 * 24 * 60 * 60 * 1000)))
      : 1;
    const avgPerWeek = wins.length / weeksSinceStart;

    setStats({
      total: wins.length,
      thisWeek,
      thisMonth,
      streak,
      longestStreak,
      avgPerWeek: avgPerWeek.toFixed(1),
    });
  };

  const StatCard = ({ title, value, subtitle, emoji }) => (
    <View style={[styles.statCard, { backgroundColor: theme.card }]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.statValue, { color: theme.accent }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: theme.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, { color: theme.textSecondary }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.header, { color: theme.text }]}>
          Your Journey
        </Text>
        <Text style={[styles.subheader, { color: theme.textSecondary }]}>
          Every small win counts
        </Text>

        <View style={styles.grid}>
          <StatCard
            emoji="🎯"
            value={stats.total}
            title="Total Wins"
            subtitle="All time"
          />
          <StatCard
            emoji="🔥"
            value={stats.streak}
            title="Current Streak"
            subtitle="days in a row"
          />
          <StatCard
            emoji="⭐"
            value={stats.longestStreak}
            title="Best Streak"
            subtitle="your record"
          />
          <StatCard
            emoji="📅"
            value={stats.thisWeek}
            title="This Week"
            subtitle="last 7 days"
          />
          <StatCard
            emoji="📊"
            value={stats.avgPerWeek}
            title="Weekly Average"
            subtitle="wins per week"
          />
          <StatCard
            emoji="📈"
            value={stats.thisMonth}
            title="This Month"
            subtitle="last 30 days"
          />
        </View>

        {stats.streak >= 7 && (
          <View style={[styles.achievement, { backgroundColor: theme.accentLight }]}>
            <Text style={styles.achievementEmoji}>🏆</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.achievementTitle, { color: theme.text }]}>
                Week Warrior!
              </Text>
              <Text style={[styles.achievementText, { color: theme.textSecondary }]}>
                You've logged wins for 7 days straight. Keep it up!
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subheader: {
    fontSize: 16,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 4,
  },
  emoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  achievement: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  achievementEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementText: {
    fontSize: 14,
  },
});