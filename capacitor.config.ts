import type { CapacitorConfig } from '@capacitor/cli';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Purchases } from '@revenuecat/purchases-capacitor';

const config: CapacitorConfig = {
  appId: 'com.jmadhanzi.musclelockai',
  appName: 'MuscleLock AI',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: true,
    },
    StatusBar: {
      style: Style.Default,
      backgroundColor: '#050a0f',
      overlaysWebView: false
    },
    Purchases: {},
  },
  server: {
    androidScheme: 'https',
    iosScheme: 'http',
  },
  ios: {
    contentInset: 'never',
    scheme: 'musclelock',
  },
};

export default config;
