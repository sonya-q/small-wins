import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const NOTIFICATION_TIME_KEY = '@small-wins:notification-time';
const DEFAULT_HOUR = 20; // 8 PM

export const notifications = {
  registerForPushNotifications: async () => {
    if (!Device.isDevice) {
      console.log('Notifications only work on physical devices');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push notification permissions');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#d4916f',
      });
    }

    return true;
  },

  scheduleDaily: async () => {
    try {
      // Cancel existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      const hour = await notifications.getNotificationTime();
      
      // Schedule daily notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Small Wins',
          body: 'Name one moment worth keeping.',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour,
          minute: 0,
          repeats: true,
        },
      });

      console.log(`Notification scheduled for ${hour}:00 daily`);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  },

  setNotificationTime: async (hour) => {
    try {
      await AsyncStorage.setItem(NOTIFICATION_TIME_KEY, hour.toString());
    } catch (error) {
      console.error('Error saving notification time:', error);
    }
  },

  getNotificationTime: async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATION_TIME_KEY);
      return stored ? parseInt(stored) : DEFAULT_HOUR;
    } catch (error) {
      return DEFAULT_HOUR;
    }
  },
};