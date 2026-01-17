import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
  useColorScheme,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { storage } from '../utils/storage';
import { notifications } from '../utils/notifications';
import { getTheme } from '../styles/theme';

export default function SettingsScreen() {
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const colorScheme = useColorScheme();
  const theme = getTheme(darkMode ? 'dark' : colorScheme);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const time = await notifications.getNotificationTime();
    const date = new Date();
    date.setHours(time, 0, 0, 0);
    setNotificationTime(date);

    const savedTheme = await storage.getTheme();
    setDarkMode(savedTheme === 'dark');
  };

  const handleTimeChange = async (event, selectedDate) => {
    setShowTimePicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      setNotificationTime(selectedDate);
      const hour = selectedDate.getHours();
      await notifications.setNotificationTime(hour);
      await notifications.scheduleDaily();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const toggleDarkMode = async (value) => {
    setDarkMode(value);
    await storage.setTheme(value ? 'dark' : 'light');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const clearAllData = async () => {
    if (Platform.OS === 'ios') {
      // On iOS, you might want to use ActionSheet
      const confirmed = confirm('Clear all wins? This cannot be undone.');
      if (confirmed) {
        await storage.clearAll();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Notifications
          </Text>
          
          <TouchableOpacity
            style={[styles.settingRow, { backgroundColor: theme.card }]}
            onPress={() => setShowTimePicker(true)}
            activeOpacity={0.7}
          >
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Daily Reminder
              </Text>
              <Text style={[styles.settingValue, { color: theme.textSecondary }]}>
                {notificationTime.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Time Picker */}
        {showTimePicker && (
          <DateTimePicker
            value={notificationTime}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Appearance
          </Text>
          
          <View style={[styles.settingRow, { backgroundColor: theme.card }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Dark Mode
              </Text>
              <Text style={[styles.settingHint, { color: theme.textSecondary }]}>
                Easier on the eyes at night
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: theme.accent }}
              thumbColor={darkMode ? theme.accentLight : '#f4f3f4'}
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            About
          </Text>
          
          <View style={[styles.settingRow, { backgroundColor: theme.card }]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Version
            </Text>
            <Text style={[styles.settingValue, { color: theme.textSecondary }]}>
              1.0.0
            </Text>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#e74c3c' }]}>
            Danger Zone
          </Text>
          
          <TouchableOpacity
            style={[styles.settingRow, { backgroundColor: theme.card }]}
            onPress={clearAllData}
            activeOpacity={0.7}
          >
            <Text style={[styles.settingLabel, { color: '#e74c3c' }]}>
              Clear All Data
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.footer, { color: theme.textSecondary }]}>
          Made with ❤️ for celebrating life's small victories
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 15,
    marginTop: 2,
  },
  settingHint: {
    fontSize: 13,
    marginTop: 2,
  },
  arrow: {
    fontSize: 20,
    color: '#999',
  },
  footer: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
    marginBottom: 40,
  },
});