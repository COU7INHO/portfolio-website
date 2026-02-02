import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FloatingDevModeButtonProps {
  onClick: () => void;
  isTerminalOpen: boolean;
}

const FloatingDevModeButton = ({ onClick, isTerminalOpen }: FloatingDevModeButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        // Show floating button when hero bottom is above viewport (scrolled past hero)
        setIsVisible(heroBottom < 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render if terminal is open or not visible
  if (isTerminalOpen) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={`fixed bottom-5 right-5 z-40 w-14 h-14 rounded-xl 
              bg-card/80 backdrop-blur-xl border border-border
              shadow-lg shadow-black/20
              flex items-center justify-center
              transition-all duration-300 ease-out
              hover:scale-110 hover:border-primary/50 hover:shadow-primary/20
              group
              ${isVisible 
                ? 'opacity-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            aria-label="Enter Dev Mode"
          >
            {/* Pulse glow ring */}
            <span className="absolute inset-0 rounded-xl animate-pulse-glow opacity-50" />
            
            {/* Icon */}
            <Terminal className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-card border-border">
          <p>Enter Dev Mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FloatingDevModeButton;
