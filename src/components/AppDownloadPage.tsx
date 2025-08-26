import { useEffect, useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { Button } from '@/components/ui/button';
import { Smartphone, Download, Apple, Bot } from 'lucide-react';

const DOWNLOAD_LINKS = {
  ios: "https://apps.apple.com/sa/app/yiji-%D9%8A%D8%AC%D9%8A/id6464392688",
  android: "https://play.google.com/store/apps/details?id=com.yiji.food"
};

export default function AppDownloadPage() {
  const { isIOS, isAndroid, isMobile } = useDeviceDetection();
  const [redirecting, setRedirecting] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    console.log('📱 App Download Page - Device Info:', { isIOS, isAndroid, isMobile });
    
    if (isMobile) {
      console.log('🚀 Mobile device detected - starting redirect process');
      setRedirecting(true);
      
      const redirectUrl = isIOS ? DOWNLOAD_LINKS.ios : DOWNLOAD_LINKS.android;
      console.log('🔗 Redirect URL:', redirectUrl);
      
      // Add a small delay for better UX
      const timer = setTimeout(() => {
        console.log('⏰ Redirecting now...');
        window.location.href = redirectUrl;
        
        // Show fallback after another delay in case redirect fails
        setTimeout(() => {
          console.log('⚠️ Redirect may have failed - showing fallback');
          setRedirecting(false);
          setShowFallback(true);
        }, 2000);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      // Desktop - show both options immediately
      console.log('🖥️ Desktop device detected - showing both options');
      setShowFallback(true);
    }
  }, [isIOS, isAndroid, isMobile]);

  const handleDownload = (platform: 'ios' | 'android') => {
    window.open(DOWNLOAD_LINKS[platform], '_blank');
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
                Redirecting to {isIOS ? 'App Store' : 'Google Play'}...
              </h2>
              <p className="text-muted-foreground">
                Taking you to the right store for your device
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