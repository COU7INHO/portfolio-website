import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide when navbar appears (after scrolling 100px)
      if (currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Link
      to="/"
      className={`fixed top-4 left-4 z-50 nav-blur border border-border/50 rounded-full px-4 py-2 
        flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground 
        transition-all duration-300 shadow-lg shadow-background/50 ${
        isVisible 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 -translate-x-4 pointer-events-none'
      }`}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Back</span>
    </Link>
  );
};

export default BackButton;