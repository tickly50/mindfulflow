import { useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../utils/db';

/**
 * Custom hook to manage daily local push notifications.
 * It checks the current time against the user-configured notification time
 * and triggers a notification if they match and haven't been triggered yet today.
 */
export const useNotifications = () => {
  // Read notification settings from DB (live updates if they change in Settings modal)
  const settings = useLiveQuery(async () => {
    const enabledSetting = await db.settings.get('notificationsEnabled');
    const timeSetting = await db.settings.get('notificationTime');
    const lastDateSetting = await db.settings.get('lastNotificationDate');
    
    return {
      enabled: enabledSetting?.value || false,
      time: timeSetting?.value || '20:00', // Default to 8 PM
      lastDate: lastDateSetting?.value || null,
    };
  });

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    
    if (Notification.permission === 'granted') return true;
    
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    
    return false;
  }, []);

  const triggerNotification = useCallback(async () => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    // Send the actual notification
    const notification = new Notification('Čas na reflexi 🧘‍♀️', {
      body: 'Jaký jsi měl(a) dnes den? Najdi si minutu na krátký check-in.',
      icon: '/android-chrome-192x192.png', // Typical PWA icon path
      badge: '/favicon-32x32.png',
      tag: 'mindfulflow-daily-reminder', // Prevent duplicates
    });

    notification.onclick = function() {
      window.focus();
      this.close();
    };

    // Record today's date in DB so we don't spam them again today
    const todayStr = new Date().toISOString().split('T')[0];
    await db.settings.put({ key: 'lastNotificationDate', value: todayStr });
  }, []);

  // Poll time every minute to check if we should trigger
  useEffect(() => {
    // If settings haven't loaded, aren't enabled, or permission isn't granted, skip
    if (!settings?.enabled || !('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const checkTime = () => {
      const now = new Date();
      // Format current time as HH:MM
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;
      
      const todayStr = now.toISOString().split('T')[0];

      // If current time matches target time AND we haven't notified today
      if (currentTime === settings.time && settings.lastDate !== todayStr) {
        triggerNotification();
      }
    };

    // Check immediately on mount/settings change
    checkTime();

    // Check every minute
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [settings, triggerNotification]);

  return { requestPermission };
};
