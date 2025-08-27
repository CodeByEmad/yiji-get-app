import { useEffect, useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { Button } from '@/components/ui/button';
import { Smartphone, Download, Apple, Bot } from 'lucide-react';

const APP_CONFIG = {
  ios: {
    scheme: "yiji://", // Custom URL scheme for iOS app
    storeUrl: "https://apps.apple.com/sa/app/yiji-%D9%8A%D8%AC%D9%8A/id6464392688"
  },
  android: {
    scheme: "intent://yiji#Intent;scheme=yiji;package=com.yiji.food;S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.yiji.food;end",
    storeUrl: "https://play.google.com/store/apps/details?id=com.yiji.food"
  }
};

export default function AppDownloadPage() {
  const { isIOS, isAndroid, isMobile } = useDeviceDetection();
  const [redirecting, setRedirecting] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const tryOpenApp = (platform: 'ios' | 'android') => {
    const config = APP_CONFIG[platform];
    console.log(`🎯 Trying to open ${platform} app with scheme: ${config.scheme}`);
    
    if (platform === 'ios') {
      // For iOS: try opening via URL scheme; cancel fallback if app opens (page becomes hidden)
      let fallbackTimer: number | undefined;
      const cleanup = () => {
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('pagehide', onPageHide);
        window.removeEventListener('blur', onPageHide);
      };
      const onPageHide = () => {
        console.log('✅ iOS: Page hidden/blurred — app likely opened, cancelling fallback');
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

      console.log('📲 iOS: Navigating to custom scheme');
      // Kick off app open
      window.location.href = config.scheme;

      // If app didn't open, fallback to App Store
      fallbackTimer = window.setTimeout(() => {
        console.log('📱 iOS app may not be installed, redirecting to App Store');
        cleanup();
        window.location.href = config.storeUrl;
      }, 2000);

      // Listen for signals that the app opened
      document.addEventListener('visibilitychange', onVisibilityChange);
      window.addEventListener('pagehide', onPageHide);
      window.addEventListener('blur', onPageHide);
    } else {
      // For Android: use intent URL that automatically handles fallback
      console.log('🤖 Using Android intent URL with automatic fallback');
      window.location.href = config.scheme;
    }
  };

  useEffect(() => {
    console.log('📱 App Download Page - Device Info:', { isIOS, isAndroid, isMobile });
    
    if (isMobile) {
      console.log('🚀 Mobile device detected - starting app redirect process');
      setRedirecting(true);
      
      const platform = isIOS ? 'ios' : 'android';
      console.log(`🔗 Attempting to open ${platform} app`);
      
      // Add a small delay for better UX
      const timer = setTimeout(() => {
        console.log('⏰ Trying to open app now...');
        tryOpenApp(platform);
        
        // Show fallback after delay in case redirect fails
        setTimeout(() => {
          console.log('⚠️ App redirect may have failed - showing fallback');
          setRedirecting(false);
          setShowFallback(true);
        }, 3000);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // Desktop - show both options immediately
      console.log('🖥️ Desktop device detected - showing both options');
      setShowFallback(true);
    }
  }, [isIOS, isAndroid, isMobile]);

  const handleDownload = (platform: 'ios' | 'android') => {
    window.open(APP_CONFIG[platform].storeUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* App Icon & Logo */}
        <div className="text-center mb-8 animate-pulse">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
            <Smartphone className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Yiji <span className="text-app-secondary">يجي</span>
          </h1>
          <p className="text-muted-foreground">Food Delivery App</p>
        </div>

        {/* Main Card */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-8 shadow-card">
          {redirecting ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-app-primary border-t-transparent"></div>
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Opening Yiji يجي App...
              </h2>
              <p className="text-muted-foreground">
                {isIOS ? 'Trying to open app or redirect to App Store' : 'Trying to open app or redirect to Google Play'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Get Yiji يجي App
                </h2>
                <p className="text-muted-foreground">
                  {isMobile ? 'If the redirect didn\'t work, choose your platform:' : 'Choose your platform to download:'}
                </p>
              </div>

              {showFallback && (
                <div className="space-y-4">
                  <Button
                    variant="ios"
                    size="xl"
                    className="w-full"
                    onClick={() => handleDownload('ios')}
                  >
                    <Apple className="w-6 h-6" />
                    Download on iOS
                    <span className="text-sm opacity-80">(App Store)</span>
                  </Button>

                  <Button
                    variant="android"
                    size="xl"
                    className="w-full"
                    onClick={() => handleDownload('android')}
                  >
                    <Bot className="w-6 h-6" />
                    Download on Android
                    <span className="text-sm opacity-80">(Google Play)</span>
                  </Button>
                </div>
              )}

              {!showFallback && !redirecting && (
                <div className="text-center">
                  <Button
                    variant="download"
                    size="xl"
                    className="w-full mb-4"
                    onClick={() => setShowFallback(true)}
                  >
                    <Download className="w-6 h-6" />
                    Show Download Options
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto bg-app-primary/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">🚚</span>
            </div>
            <p className="text-sm text-muted-foreground">Fast Delivery</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto bg-app-primary/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">🍕</span>
            </div>
            <p className="text-sm text-muted-foreground">Great Food</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto bg-app-primary/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">⭐</span>
            </div>
            <p className="text-sm text-muted-foreground">Top Rated</p>
          </div>
        </div>
      </div>
    </div>
  );
}