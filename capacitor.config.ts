import type { CapacitorConfig } from '@capacitor/cli';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';

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
      style: 'light',
      backgroundColor: '#000000',
    },
  },
  server: {
    androidScheme: 'https',
  },
  ios: {
    contentInset: 'always',
  },
};

export default config;
