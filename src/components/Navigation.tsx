import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isHomePage = location.pathname === '/';

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const desktopLinkClass = 'text-sm text-muted-foreground hover:text-foreground transition-colors';
  const desktopActiveLinkClass = (path: string) =>
    `text-sm transition-colors ${
      location.pathname === path ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
    }`;

  const mobileLinkClass = 'text-3xl font-semibold text-primary hover:opacity-80 transition-opacity';

  const desktopNavItems = isHomePage ? (
    <>
      <button onClick={() => scrollToSection('hero')} className={desktopLinkClass}>Home</button>
      <button onClick={() => scrollToSection('about')} className={desktopLinkClass}>About</button>
      <button onClick={() => scrollToSection('journey')} className={desktopLinkClass}>Work</button>
      <button onClick={() => scrollToSection('education')} className={desktopLinkClass}>Education</button>
      <button onClick={() => scrollToSection('skills')} className={desktopLinkClass}>Skills</button>
      <button onClick={() => scrollToSection('projects')} className={desktopLinkClass}>Projects</button>
      <button onClick={() => scrollToSection('setup')} className={desktopLinkClass}>Setup</button>
      <button onClick={() => scrollToSection('contact')} className={desktopLinkClass}>Contact</button>
    </>
  ) : (
    <>
      <Link to="/" className={desktopLinkClass}>Home</Link>
      <Link to="/#about" className={desktopLinkClass}>About</Link>
      <Link to="/experience" className={desktopActiveLinkClass('/experience')}>Work</Link>
      <Link to="/education" className={desktopActiveLinkClass('/education')}>Education</Link>
      <Link to="/#skills" className={desktopLinkClass}>Skills</Link>
      <Link to="/projects" className={desktopActiveLinkClass('/projects')}>Projects</Link>
      <Link to="/setup" className={desktopActiveLinkClass('/setup')}>Setup</Link>
      <Link to="/#contact" className={desktopLinkClass}>Contact</Link>
    </>
  );

  const mobileNavItems = isHomePage ? (
    <>
      <button onClick={() => scrollToSection('hero')} className={mobileLinkClass}>Home</button>
      <button onClick={() => scrollToSection('about')} className={mobileLinkClass}>About</button>
      <button onClick={() => scrollToSection('journey')} className={mobileLinkClass}>Work</button>
      <button onClick={() => scrollToSection('education')} className={mobileLinkClass}>Education</button>
      <button onClick={() => scrollToSection('skills')} className={mobileLinkClass}>Skills</button>
      <button onClick={() => scrollToSection('projects')} className={mobileLinkClass}>Projects</button>
      <button onClick={() => scrollToSection('setup')} className={mobileLinkClass}>Setup</button>
      <button onClick={() => scrollToSection('contact')} className={mobileLinkClass}>Contact</button>
    </>
  ) : (
    <>
      <Link to="/" className={mobileLinkClass}>Home</Link>
      <Link to="/#about" className={mobileLinkClass}>About</Link>
      <Link to="/experience" className={mobileLinkClass}>Work</Link>
      <Link to="/education" className={mobileLinkClass}>Education</Link>
      <Link to="/#skills" className={mobileLinkClass}>Skills</Link>
      <Link to="/projects" className={mobileLinkClass}>Projects</Link>
      <Link to="/setup" className={mobileLinkClass}>Setup</Link>
      <Link to="/#contact" className={mobileLinkClass}>Contact</Link>
    </>
  );

  return (
    <>
      {/* Desktop nav */}
      <nav
        className={`hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="nav-blur border border-border/50 rounded-full px-6 py-3 shadow-lg shadow-background/50">
          <div className="flex items-center gap-6">{desktopNavItems}</div>
        </div>
      </nav>

      {/* Mobile hamburger */}
      <div
        className={`md:hidden fixed top-4 right-4 z-[60] transition-all duration-300 ${
          isVisible || isMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <button
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          className="nav-blur border border-border/50 rounded-full p-3 shadow-lg shadow-background/50 text-foreground"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile fullscreen overlay */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-md transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-7 px-6">
          {mobileNavItems}
        </div>
      </div>
    </>
  );
};

export default Navigation;
