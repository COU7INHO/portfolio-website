import { X } from 'lucide-react';
import scrollInstructionsImg from '@/assets/scroll_instructions.png';

interface HandsFreeOnboardingProps {
  onClose: () => void;
}

const HandsFreeOnboarding = ({ onClose }: HandsFreeOnboardingProps) => {
  const handleClose = () => {
    localStorage.setItem('handsFreeOnboarding', Date.now().toString());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative mx-4 max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Image */}
        <img
          src={scrollInstructionsImg}
          alt="Scroll with your index finger - point up or down"
          className="w-full"
        />

        {/* Button */}
        <div className="p-4 pt-0">
          <button
            onClick={handleClose}
            className="w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground transition-all hover:opacity-90"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export const shouldShowOnboarding = (): boolean => {
  const lastShown = localStorage.getItem('handsFreeOnboarding');
  if (!lastShown) return true;

  const oneHourMs = 60 * 60 * 1000;
  const elapsed = Date.now() - parseInt(lastShown, 10);
  return elapsed > oneHourMs;
};

export default HandsFreeOnboarding;
