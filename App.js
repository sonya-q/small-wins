import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Appearance } from 'react-native';
import * as Notifications from 'expo-notifications';

import HomeScreen from './src/screens/HomeScreen';
import AllWinsScreen from './src/screens/AllWinsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import StatsScreen from './src/screens/StatsScreen';
import { storage } from './src/utils/storage';
import { notifications } from './src/utils/notifications';

// Configure how notifications should be handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Tab = createBottomTabNavigator();

export default function App() {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    // Load theme preference
    storage.getTheme().then(theme => {
      if (theme) {
        setColorScheme(theme);
      }
    });

    // Set up notifications
    notifications.registerForPushNotifications();
    notifications.scheduleDaily();

    // Listen for theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      storage.getTheme().then(theme => {
        if (!theme) { // Only auto-update if user hasn't set a preference
          setColorScheme(colorScheme);
        }
      });
    });

    return () => subscription.remove();
  }, []);

  const isDark = colorScheme === 'dark';

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: '#d4916f',
          background: isDark ? '#1a1410' : '#faf8f3',
          card: isDark ? '#2a2419' : '#fefdfb',
          text: isDark ? '#faf8f3' : '#2a2419',
          border: isDark ? '#3a3429' : '#e8e6e1',
          notification: '#d4916f',
        },
      }}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#d4916f',
          tabBarInactiveTintColor: isDark ? '#8a8075' : '#6a6055',
          tabBarStyle: {
            backgroundColor: isDark ? '#2a2419' : '#fefdfb',
            borderTopColor: isDark ? '#3a3429' : '#e8e6e1',
          },
          headerStyle: {
            backgroundColor: isDark ? '#2a2419' : '#fefdfb',
          },
          headerTintColor: isDark ? '#faf8f3' : '#2a2419',
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
            headerShown: false,
          }}
        />
        <Tab.Screen 
          name="All Wins" 
          component={AllWinsScreen}
          options={{
            tabBarIcon: ({ color }) => <TabIcon name="list" color={color} />,
          }}
        />
        <Tab.Screen 
          name="Stats" 
          component={StatsScreen}
          options={{
            tabBarIcon: ({ color }) => <TabIcon name="chart" color={color} />,
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color }) => <TabIcon name="settings" color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Simple icon component (you can replace with react-native-vector-icons if you want)
const TabIcon = ({ name, color }) => {
  const icons = {
    home: '🏠',
    list: '📝',
    chart: '📊',
    settings: '⚙️',
  };
  
  return <Text style={{ fontSize: 24 }}>{icons[name]}</Text>;
};

const { Text } = require('react-native');