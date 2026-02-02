import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import profilePhoto from '@/assets/profile-photo.png';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [displayedName, setDisplayedName] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [typingComplete, setTypingComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  
  const fullName = 'Tiago Coutinho';

  // Typing animation effect
  useEffect(() => {
    let currentIndex = 0;
    
    const typeNextChar = () => {
      if (currentIndex < fullName.length) {
        setDisplayedName(fullName.slice(0, currentIndex + 1));
        currentIndex++;
        // Variable speed between 42-84ms for human-like feel (30% faster)
        const nextDelay = Math.random() * 42 + 42;
        setTimeout(typeNextChar, nextDelay);
      } else {
        // Typing complete
        setTypingComplete(true);
        setShowCursor(false);
        // Show content after 250ms delay
        setTimeout(() => setShowContent(true), 250);
        // Show scroll indicator 500ms after content appears
        setTimeout(() => setShowScrollIndicator(true), 750);
      }
    };
    
    // Start typing after a small initial delay
    const startDelay = setTimeout(() => typeNextChar(), 300);
    
    return () => clearTimeout(startDelay);
  }, []);

  // Track scroll to hide indicator
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = heroRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToNextSection = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="hero" ref={heroRef} className="min-h-[90vh] flex items-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-radial pointer-events-none" />
      
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="order-2 lg:order-1 space-y-5">
            <div className="reveal opacity-0">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground min-h-[1.2em] whitespace-nowrap">
                <span>{displayedName}</span>
                {showCursor && (
                  <span className="animate-pulse text-primary ml-0.5">|</span>
                )}
              </h1>
            </div>
            
            <div 
              className={`transition-opacity duration-500 ease-out ${showContent ? 'opacity-100' : 'opacity-0'}`}
            >
              <p className="text-xl md:text-2xl font-medium">
                <span className="text-primary">AI Data Engineer</span>
                <span className="text-muted-foreground"> @ Glintt Global</span>
              </p>
            </div>

            <div 
              className={`transition-opacity duration-500 ease-out delay-100 ${showContent ? 'opacity-100' : 'opacity-0'}`}
            >
              <Button
                variant="outline"
                size="lg"
                asChild
                className="group border-border hover:border-primary/50 hover:bg-primary/5"
              >
                <a href="/Tiago_Coutinho_CV.pdf" download>
                  <Download className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                  Download CV
                </a>
              </Button>
            </div>
            
          </div>
          
          {/* Right side - Photo */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="reveal opacity-0 relative">
              {/* Photo with soft gradient mask - no visible container */}
              <div className="relative w-72 h-80 md:w-96 md:h-[420px]">
                <img 
                  src={profilePhoto} 
                  alt="Tiago Coutinho" 
                  className="w-full h-full object-cover object-top"
                  style={{
                    maskImage: 'radial-gradient(ellipse 85% 80% at 50% 40%, black 50%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 85% 80% at 50% 40%, black 50%, transparent 100%)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToNextSection}
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-500 cursor-pointer group ${
          showScrollIndicator && !hasScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Scroll to explore"
      >
        <span className="text-sm font-medium tracking-wide">Discover my journey</span>
        <ChevronDown className="w-5 h-5 animate-bounce group-hover:text-primary" />
      </button>
    </section>
  );
};

export default Hero;
