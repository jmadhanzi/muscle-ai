import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { PushNotifications, type PermissionStatus } from '@capacitor/push-notifications';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * Deep link URL handler
 * Stores referral code from deep links for processing
 */
function handleDeepLink(url: string): void {
  console.log('Deep link received:', url);
  
  try {
    const urlObj = new URL(url);
    let path = urlObj.pathname;
    const searchParams = urlObj.searchParams;

    // For custom schemes, the "host" might be part of the path
    // e.g., "musclelock://ref/TEST123" has host="ref", pathname="/TEST123"
    // So combine them as "ref/TEST123"
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:' && urlObj.host && !urlObj.host.includes('.')) {
      // Custom scheme with non-domain host, treat host as part of path
      path = urlObj.host + urlObj.pathname;
    }

    console.log('Parsed deep link - protocol:', urlObj.protocol, 'host:', urlObj.host, 'pathname:', urlObj.pathname, 'combined path:', path, 'searchParams:', Object.fromEntries(searchParams));

    // Handle /ref/:code or ref/:code paths
    if (path.startsWith('/ref/') || path.startsWith('ref/')) {
      const referralCode = path.split('/ref/')[1] || path.split('ref/')[1] || searchParams.get('code');
      console.log('Extracted referral code:', referralCode);

      if (referralCode) {
        // Store in sessionStorage for the web view
        sessionStorage.setItem('referral_code', referralCode);
        sessionStorage.setItem('referral_timestamp', Date.now().toString());
        console.log('Referral code stored from deep link:', referralCode);

        // Dispatch custom event to notify React app of deep link
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('deepLinkReceived', {
            detail: { referralCode, url }
          }));
          console.log('Dispatched deepLinkReceived event');
        }, 50);
      } else {
        console.log('No referral code extracted');
      }
    } else {
      console.log('Path does not start with /ref/ or ref/');
    }
  } catch (error) {
    console.error('Error parsing deep link URL:', error);
  }
}

/**
 * Initialize Capacitor plugins
 * This should be called early in the app lifecycle (e.g., in main.tsx)
 */
export async function initializeCapacitor(): Promise<void> {
  // Only run on mobile platforms
  if (!Capacitor.isNativePlatform()) {
    console.log('Running in browser - Capacitor plugins not initialized');
    return;
  }

  try {
    // Initialize Splash Screen
    await SplashScreen.hide();

    // Set up deep link handler
    App.addListener('appUrlOpen', (data) => {
      console.log('appUrlOpen event:', data);
      handleDeepLink(data.url);
    });

    // Initialize Push Notifications
    await setupPushNotifications();

    console.log('Capacitor plugins initialized successfully');
  } catch (error) {
    console.error('Error initializing Capacitor plugins:', error);
  }
}

/**
 * Set up push notifications
 */
async function setupPushNotifications(): Promise<void> {
  // Check permission status
  let permissionStatus: PermissionStatus = await PushNotifications.checkPermissions();

  if (permissionStatus.receive === 'prompt') {
    permissionStatus = await PushNotifications.requestPermissions();
  }

  if (permissionStatus.receive !== 'granted') {
    console.warn('Push notification permission not granted');
    return;
  }

  // Register for push notifications
  await PushNotifications.register();

  // Add listener for push notification received
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push notification received:', notification);
    // Handle the notification - you can integrate with your existing notification system
  });

  // Add listener for push notification action performed
  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('Push notification action performed:', notification);
    // Handle notification tap
  });
}

export { PushNotifications, SplashScreen, StatusBar, App };
