import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import WinItem from '../components/WinItem';
import { storage } from '../utils/storage';
import { getTheme } from '../styles/theme';

export default function AllWinsScreen() {
  const [wins, setWins] = useState([]);
  const [randomWin, setRandomWin] = useState(null);
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  useEffect(() => {
    loadWins();
  }, []);

  const loadWins = async () => {
    const allWins = await storage.getAllWins();
    setWins(allWins.reverse());
  };

  const showRandomWin = () => {
    if (wins.length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const random = wins[Math.floor(Math.random() * wins.length)];
      setRandomWin(random);
      setTimeout(() => setRandomWin(null), 5000);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {wins.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No wins yet
          </Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Start collecting the moments that matter
          </Text>
        </View>
      ) : (
        <>
          {/* Random Win Feature */}
          <View style={styles.randomWinContainer}>
            <TouchableOpacity
              style={[styles.randomButton, { backgroundColor: theme.accent }]}
              onPress={showRandomWin}
              activeOpacity={0.8}
            >
              <Text style={styles.randomButtonText}>✨ Random Memory</Text>
            </TouchableOpacity>
            
            {randomWin && (
              <View style={[styles.randomWinCard, { backgroundColor: theme.accentLight }]}>
                <Text style={[styles.randomWinDate, { color: theme.textSecondary }]}>
                  {new Date(randomWin.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
                <Text style={[styles.randomWinText, { color: theme.text }]}>
                  {randomWin.text}
                </Text>
              </View>
            )}
          </View>

          <FlatList
            data={wins}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <WinItem win={item} index={index} theme={theme} />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  randomWinContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  randomButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  randomButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  randomWinCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
  },
  randomWinDate: {
    fontSize: 13,
    marginBottom: 6,
  },
  randomWinText: {
    fontSize: 17,
    lineHeight: 24,
  },
});