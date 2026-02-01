import { useEffect, useRef } from 'react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

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

  return (
    <section id="hero" ref={heroRef} className="min-h-screen flex items-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-radial pointer-events-none" />
      
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left side - Content */}
          <div className="order-2 lg:order-1 space-y-6">
            <div className="reveal opacity-0">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
                Tiago
                <br />
                <span className="text-glow">Coutinho</span>
              </h1>
            </div>
            
            <div className="reveal opacity-0" style={{ animationDelay: '0.1s' }}>
              <p className="text-xl md:text-2xl font-medium">
                <span className="text-primary">AI Data Engineer</span>
                <span className="text-muted-foreground"> @ Glintt Global</span>
              </p>
            </div>
            
            <div className="reveal opacity-0" style={{ animationDelay: '0.2s' }}>
              <p className="text-lg text-secondary-foreground leading-relaxed max-w-lg">
                Building intelligent solutions at the intersection of AI, data engineering, 
                and software development. Specialized in RAG-powered applications, 
                machine learning pipelines, and scalable software architectures.
              </p>
            </div>
            
            <div className="reveal opacity-0 flex gap-4 pt-4" style={{ animationDelay: '0.3s' }}>
              <a
                href="#journey"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity glow-primary-subtle"
              >
                View Journey
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-medium rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                See Projects
              </a>
            </div>
          </div>
          
          {/* Right side - Photo */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="reveal opacity-0 relative">
              {/* Glow effect behind photo */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-75" />
              
              {/* Photo container with gradient fade */}
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                {/* Placeholder profile - professional silhouette */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-secondary to-muted gradient-fade-edges flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-b from-muted/50 to-transparent flex items-end justify-center">
                    <svg 
                      className="w-3/4 h-3/4 text-muted-foreground/30" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Decorative particles */}
                <div className="absolute -top-4 -right-4 w-3 h-3 bg-primary/60 rounded-full animate-pulse" />
                <div className="absolute top-1/4 -right-8 w-2 h-2 bg-primary/40 rounded-full" />
                <div className="absolute -bottom-2 right-1/4 w-2 h-2 bg-primary/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/3 -left-6 w-2 h-2 bg-primary/30 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
