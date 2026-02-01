import { useEffect, useRef } from 'react';
import profilePhoto from '@/assets/profile-photo.png';

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
    <section id="hero" ref={heroRef} className="min-h-[90vh] flex items-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-radial pointer-events-none" />
      
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="order-2 lg:order-1 space-y-5">
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
          </div>
          
          {/* Right side - Photo */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="reveal opacity-0 relative">
              {/* Photo container with gradient fade edges */}
              <div className="relative w-72 h-80 md:w-96 md:h-[420px]">
                <div className="w-full h-full rounded-xl overflow-hidden">
                  <img 
                    src={profilePhoto} 
                    alt="Tiago Coutinho" 
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Gradient fade edges - blends into dark background */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent" />
                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent" />
                    <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
