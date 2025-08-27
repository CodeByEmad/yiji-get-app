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
        // Try to open iOS app
        window.location.href = APP_CONFIG.ios.scheme;
        
        // Fallback to App Store after delay
        setTimeout(() => {
          console.log('📱 Redirecting to App Store');
          window.location.href = APP_CONFIG.ios.storeUrl;
        }, 2000);
      } else {
        console.log('🤖 Android/Other detected - trying Android app first');
        // For Android or unknown devices, try Android intent first
        window.location.href = APP_CONFIG.android.scheme;
        
        // Fallback to Play Store after delay (for non-Android devices)
        setTimeout(() => {
          console.log('🤖 Redirecting to Play Store');
          window.location.href = APP_CONFIG.android.storeUrl;
        }, 2000);
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