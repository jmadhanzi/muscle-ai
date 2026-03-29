import type { CapacitorConfig } from '@capacitor/cli';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

const config: CapacitorConfig = {
  appId: 'com.muscleai.app',
  appName: 'Muscle AI',
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
  },
  server: {
    androidScheme: 'https',
  },
  ios: {
    contentInset: 'never',
  },
};

export default config;
