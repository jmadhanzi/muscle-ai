import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { AppTrackingTransparency, AppTrackingStatus } from 'capacitor-plugin-app-tracking-transparency';

export type TrackingStatus = 'not-determined' | 'restricted' | 'denied' | 'authorized' | 'not-available';

export function useTrackingPermission() {
  const [status, setStatus] = useState<TrackingStatus>('not-determined');
  const [promptShown, setPromptShown] = useState(false);

  useEffect(() => {
    const requestTrackingPermission = async () => {
      // Only run on iOS native platform
      if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') {
        setStatus('not-available');
        return;
      }

      // Check if we've already requested permission on this device
      const alreadyRequested = localStorage.getItem('att_permission_requested') === 'true';
      if (alreadyRequested) {
        setPromptShown(true);
        return;
      }

      try {
        const result = await AppTrackingTransparency.requestPermission();
        setStatus(result.status as TrackingStatus);
        localStorage.setItem('att_permission_requested', 'true');
        setPromptShown(true);
      } catch (error) {
        console.error('Failed to request tracking permission:', error);
        setStatus('restricted');
      }
    };

    requestTrackingPermission();
  }, []);

  return { status, promptShown };
}
