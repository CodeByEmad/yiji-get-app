import { useEffect } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

const APP_CONFIG = {
  ios: {
    scheme: "yiji://",
    storeUrl: "https://apps.apple.com/sa/app/yiji-%D9%8A%D8%AC%D9%8A/id6464392688"
  },
  android: {
    scheme: "intent://yiji#Intent;scheme=yiji;package=com.yiji.food;S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.yiji.food;end",
    storeUrl: "https://play.google.com/store/apps/details?id=com.yiji.food"
  }
};

export default function AppDownloadPage() {
  const { isIOS, isAndroid } = useDeviceDetection();

  useEffect(() => {
    console.log('🎯 Starting app redirect for all devices');
    
    const tryOpenApp = () => {
      const isMac = /Mac/.test(navigator.userAgent) && !/iPhone|iPad|iPod/.test(navigator.userAgent);
      
      if (isIOS || isMac) {
        const deviceType = isIOS ? 'iOS' : 'Mac';
        console.log(`🍎 ${deviceType} detected - trying to open iOS app first`);
        
        let fallbackTimer: number | undefined;
        let appOpened = false;
        let startTime = Date.now();
        
        const cleanup = () => {
          document.removeEventListener('visibilitychange', onVisibilityChange);
          window.removeEventListener('pagehide', onPageHide);
          window.removeEventListener('blur', onPageHide);
          window.removeEventListener('focus', onFocus);
        };
        
        const onAppOpened = () => {
          console.log(`✅ ${deviceType}: App opened successfully`);
          appOpened = true;
          if (fallbackTimer) {
            clearTimeout(fallbackTimer);
            fallbackTimer = undefined;
          }
          cleanup();
        };
        
        const onPageHide = () => {
          console.log(`🔄 ${deviceType}: Page hidden - app might have opened`);
          onAppOpened();
        };
        
        const onFocus = () => {
          // If we regain focus quickly (within 3 seconds), app likely didn't open
          const timeElapsed = Date.now() - startTime;
          if (timeElapsed < 3000) {
            console.log(`🔄 ${deviceType}: Quick focus return (${timeElapsed}ms) - app may not be installed`);
          }
        };
        
        const onVisibilityChange = () => {
          if (document.visibilityState === 'hidden') {
            onPageHide();
          }
        };

        // Listen for app opening signals
        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('pagehide', onPageHide);
        window.addEventListener('blur', onPageHide);
        window.addEventListener('focus', onFocus);
        
        // Try to open iOS app using iframe to avoid "invalid address" alert
        try {
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.style.position = 'absolute';
          iframe.style.left = '-9999px';
          iframe.src = APP_CONFIG.ios.scheme;
          document.body.appendChild(iframe);
          
          // Clean up iframe after attempt
          setTimeout(() => {
            if (iframe.parentNode) {
              iframe.parentNode.removeChild(iframe);
            }
          }, 1000);
        } catch (e) {
          console.log(`⚠️ ${deviceType}: Error opening app, will fallback to store`);
        }
        
        // Fallback to App Store after delay if app didn't open
        fallbackTimer = window.setTimeout(() => {
          if (!appOpened) {
            console.log(`🍎 ${deviceType}: App not opened after 3s, redirecting to App Store`);
            cleanup();
            window.location.href = APP_CONFIG.ios.storeUrl;
          }
        }, 3000);
      } else if (isAndroid) {
        console.log('🤖 Android detected - trying Android app first');
        
        let fallbackTimer: number | undefined;
        let appOpened = false;
        let startTime = Date.now();
        
        const cleanup = () => {
          document.removeEventListener('visibilitychange', onVisibilityChange);
          window.removeEventListener('pagehide', onPageHide);
          window.removeEventListener('blur', onPageHide);
          window.removeEventListener('focus', onFocus);
        };
        
        const onAppOpened = () => {
          console.log('✅ Android: App opened successfully');
          appOpened = true;
          if (fallbackTimer) {
            clearTimeout(fallbackTimer);
            fallbackTimer = undefined;
          }
          cleanup();
        };
        
        const onPageHide = () => {
          console.log('🔄 Android: Page hidden - app might have opened');
          onAppOpened();
        };
        
        const onFocus = () => {
          // If we regain focus quickly (within 3 seconds), app likely didn't open
          const timeElapsed = Date.now() - startTime;
          if (timeElapsed < 3000) {
            console.log(`🔄 Android: Quick focus return (${timeElapsed}ms) - app may not be installed`);
          }
        };
        
        const onVisibilityChange = () => {
          if (document.visibilityState === 'hidden') {
            onPageHide();
          }
        };

        // Listen for app opening signals
        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('pagehide', onPageHide);
        window.addEventListener('blur', onPageHide);
        window.addEventListener('focus', onFocus);
        
        // Try Android app using intent URL - safer approach
        try {
          // Use the intent URL which has built-in fallback
          window.location.href = APP_CONFIG.android.scheme;
        } catch (e) {
          console.log('⚠️ Android: Error with intent URL, fallback to Play Store');
          cleanup();
          window.location.href = APP_CONFIG.android.storeUrl;
          return;
        }
        
        // Fallback to Play Store after delay if app didn't open
        fallbackTimer = window.setTimeout(() => {
          if (!appOpened) {
            console.log('🤖 Android: App not opened after 3s, redirecting to Play Store');
            cleanup();
            window.location.href = APP_CONFIG.android.storeUrl;
          }
        }, 3000);
      } else {
        // Non-Android, non-Apple devices (e.g., Windows/Linux desktop)
        console.log('🖥️ Other device detected - redirecting to Play Store');
        window.location.href = APP_CONFIG.android.storeUrl;
      }
    };

    // Small delay to ensure page loads
    const timer = setTimeout(tryOpenApp, 500);
    return () => clearTimeout(timer);
  }, [isIOS, isAndroid]);

  // Simple loading message while redirect happens
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to app...</p>
      </div>
    </div>
  );
}