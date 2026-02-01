import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const isHomePage = location.pathname === '/';

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-full pointer-events-none'
      }`}
    >
      <div className="nav-blur border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col items-center gap-3">
            <Link 
              to="/" 
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
            >
              TC
            </Link>
            
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
                    onClick={() => scrollToSection('journey')}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Experience
                  </button>
                  <button
                    onClick={() => scrollToSection('education')}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Education
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
                    to="/experience"
                    className={`text-sm transition-colors ${
                      location.pathname === '/experience' 
                        ? 'text-primary' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Experience
                  </Link>
                  <Link
                    to="/#education"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Education
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
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
