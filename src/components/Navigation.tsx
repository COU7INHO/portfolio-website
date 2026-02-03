import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-full pointer-events-none'
      }`}
    >
      <div className="nav-blur border border-border/50 rounded-full px-6 py-3 shadow-lg shadow-background/50">
        <div className="flex items-center gap-6">
          {isHomePage ? (
            <>
              <button
                onClick={() => scrollToSection('hero')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('journey')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Journey
              </button>
              <button
                onClick={() => scrollToSection('skills')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Skills
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Projects
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                to="/#about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                to="/#journey"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Journey
              </Link>
              <Link
                to="/#skills"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Skills
              </Link>
              <Link
                to="/projects"
                className={`text-sm transition-colors ${
                  location.pathname === '/projects' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Projects
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
