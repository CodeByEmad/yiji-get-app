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
      if (isIOS) {
        console.log('📱 iOS detected - trying to open iOS app');
        
        let fallbackTimer: number | undefined;
        let appOpened = false;
        
        const cleanup = () => {
          document.removeEventListener('visibilitychange', onVisibilityChange);
          window.removeEventListener('pagehide', onPageHide);
          window.removeEventListener('blur', onPageHide);
        };
        
        const onPageHide = () => {
          console.log('✅ iOS: Page hidden/blurred — app opened, cancelling fallback');
          appOpened = true;
          if (fallbackTimer) {
            clearTimeout(fallbackTimer);
            fallbackTimer = undefined;
          }
          cleanup();
        };
        
        const onVisibilityChange = () => {
          if (document.visibilityState === 'hidden') {
            onPageHide();
          }
        };

        // Listen for signals that the app opened
        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('pagehide', onPageHide);
        window.addEventListener('blur', onPageHide);
        
        // Try to open iOS app
        window.location.href = APP_CONFIG.ios.scheme;
        
        // Fallback to App Store after delay if app didn't open
        fallbackTimer = window.setTimeout(() => {
          if (!appOpened) {
            console.log('📱 App may not be installed, redirecting to App Store');
            cleanup();
            window.location.href = APP_CONFIG.ios.storeUrl;
          }
        }, 2000);
      } else {
        // Check if it's Mac/Apple device (should go to App Store) or Android/other (Play Store)
        const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
        
        if (isMac) {
          console.log('🍎 Mac detected - redirecting to App Store');
          window.location.href = APP_CONFIG.ios.storeUrl;
        } else {
          console.log('🤖 Android/Other detected - trying Android app first');
          // Try Android app first, then Play Store
          window.location.href = APP_CONFIG.android.scheme;
          
          setTimeout(() => {
            console.log('🤖 Redirecting to Play Store');
            window.location.href = APP_CONFIG.android.storeUrl;
          }, 2000);
        }
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