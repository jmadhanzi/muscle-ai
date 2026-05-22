import type { CapacitorConfig } from '@capacitor/cli';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

const config: CapacitorConfig = {
  appId: 'com.jmadhanzi.musclelockai',
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
    iosScheme: 'http',
  },
  ios: {
    contentInset: 'never',
    scheme: 'musclelock',
  },
};

export default config;
