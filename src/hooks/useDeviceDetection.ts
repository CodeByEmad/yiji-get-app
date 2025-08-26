import { useEffect, useState } from 'react';

export interface DeviceInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  userAgent: string;
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    userAgent: ''
  });

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
    
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isAndroid = /android/i.test(userAgent);
    const isMobile = isIOS || isAndroid;

    // Debug logging
    console.log('🔍 Device Detection Results:');
    console.log('User Agent:', userAgent);
    console.log('Is iOS:', isIOS);
    console.log('Is Android:', isAndroid);
    console.log('Is Mobile:', isMobile);
    console.log('Will redirect:', isMobile);

    setDeviceInfo({
      isIOS,
      isAndroid,
      isMobile,
      userAgent
    });
  }, []);

  return deviceInfo;
}