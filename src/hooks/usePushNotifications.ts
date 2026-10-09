import { useState, useEffect, useCallback } from 'react';

export type NotificationPermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermissionState>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Check support
    if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission as NotificationPermissionState);

      // Register Service Worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          setSwRegistration(reg);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });

      // Listen for message from service worker when notification was clicked
      const handleSwMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'NOTIFICATION_ACTION_CLICK') {
          console.log('[PWA] Notification action received:', event.data.action);
        }
      };

      navigator.serviceWorker.addEventListener('message', handleSwMessage);
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleSwMessage);
      };
    } else {
      setIsSupported(false);
      setPermission('unsupported');
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result as NotificationPermissionState);
      return result === 'granted';
    } catch (error) {
      console.error('[PWA] Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const sendPushNotification = useCallback(
    async (title: string, body: string, options?: { tag?: string; url?: string; sound?: boolean }) => {
      if (!isSupported) return false;

      // If not granted, try to request or bail
      if (Notification.permission !== 'granted') {
        const granted = await requestPermission();
        if (!granted) return false;
      }

      const notifOptions = {
        body,
        icon: '/icon.svg',
        badge: '/icon.svg',
        vibrate: [200, 100, 200],
        tag: options?.tag || `insta-${Date.now()}`,
        renotify: true,
        data: { url: options?.url || '/' },
        actions: [
          { action: 'ver_solicitud', title: '📲 Ver Estado' },
          { action: 'abrir_chat', title: '💬 Hablar con Asesor' }
        ]
      };

      try {
        if (swRegistration && 'showNotification' in swRegistration) {
          await swRegistration.showNotification(title, notifOptions);
          return true;
        } else if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION',
            title,
            options: notifOptions
          });
          return true;
        } else {
          // Fallback to standard Notification
          new Notification(title, {
            body: notifOptions.body,
            icon: notifOptions.icon
          });
          return true;
        }
      } catch (err) {
        console.warn('[PWA] Failed to dispatch push notification:', err);
        return false;
      }
    },
    [isSupported, swRegistration, requestPermission]
  );

  return {
    permission,
    isSupported,
    requestPermission,
    sendPushNotification,
    isGranted: permission === 'granted'
  };
}
