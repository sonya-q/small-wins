const NOTIFICATION_TIME_KEY = 'small-wins-notification-time';
const DEFAULT_NOTIFICATION_HOUR = 20; // 8 PM

export const notifications = {
  requestPermission: async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  },

  scheduleDaily: () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      // Get stored notification time or use default
      const hour = parseInt(localStorage.getItem(NOTIFICATION_TIME_KEY) || DEFAULT_NOTIFICATION_HOUR);
      
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hour, 0, 0, 0);
      
      // If time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      const timeUntilNotification = scheduledTime - now;
      
      setTimeout(() => {
        notifications.sendNotification();
        // Reschedule for tomorrow
        setInterval(() => {
          notifications.sendNotification();
        }, 24 * 60 * 60 * 1000); // Every 24 hours
      }, timeUntilNotification);
    }
  },

  sendNotification: () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Small Wins', {
        body: 'Name one moment worth keeping.',
        icon: '/icon.png',
        badge: '/badge.png',
        tag: 'daily-win',
        requireInteraction: false
      });
    }
  },

  setNotificationTime: (hour) => {
    localStorage.setItem(NOTIFICATION_TIME_KEY, hour.toString());
    notifications.scheduleDaily(); // Reschedule with new time
  },

  getNotificationTime: () => {
    return parseInt(localStorage.getItem(NOTIFICATION_TIME_KEY) || DEFAULT_NOTIFICATION_HOUR);
  }
};