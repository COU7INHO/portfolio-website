import { useState } from 'react';
import { Hand, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useHandGesture } from '@/hooks/useHandGesture';
import HandsFreeOnboarding, { shouldShowOnboarding } from './HandsFreeOnboarding';

const HandsFreeButton = () => {
  const { isActive, start, stop, gesture, videoRef } = useHandGesture();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleClick = () => {
    if (isActive) {
      stop();
    } else {
      if (shouldShowOnboarding()) {
        setShowOnboarding(true);
      } else {
        start();
      }
    }
  };

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    start();
  };

  const GestureIcon = () => {
    if (!isActive) return <Hand className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />;
    if (gesture === 'up') return <ArrowUp className="w-6 h-6 text-green-400 animate-bounce" />;
    if (gesture === 'down') return <ArrowDown className="w-6 h-6 text-green-400 animate-bounce" />;
    return <Hand className="w-6 h-6 text-green-400" />;
  };

  return (
    <>
      {/* Hidden video element for camera capture */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="hidden"
      />

      {/* Onboarding popup */}
      {showOnboarding && <HandsFreeOnboarding onClose={handleOnboardingClose} />}

      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleClick}
              className={`fixed bottom-5 right-5 z-40 w-14 h-14 rounded-xl
                backdrop-blur-xl border
                shadow-lg
                flex items-center justify-center
                transition-all duration-300 ease-out
                hover:scale-110
                group
                ${isActive
                  ? 'bg-green-500/20 border-green-500/60 shadow-green-500/30'
                  : 'bg-card/80 border-border shadow-black/20 hover:border-primary/50 hover:shadow-primary/20'
                }`}
              aria-label={isActive ? 'Disable hands-free scroll' : 'Enable hands-free scroll'}
            >
              {isActive && (
                <span className="absolute inset-0 rounded-xl animate-pulse-glow opacity-50 bg-green-500/10" />
              )}
              <GestureIcon />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-card border-border">
            <p>{isActive ? 'Click to disable hands-free scroll' : 'Hands-free scroll (camera)'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default HandsFreeButton;
