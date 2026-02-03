import { useEffect, useRef } from 'react';

const AboutMe = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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

    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-16 relative">
      <div className="container mx-auto px-6">
        <div className="reveal opacity-0 text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            About Me
          </h2>
        </div>

        <div className="reveal opacity-0 max-w-2xl mx-auto">
          <div className="space-y-5 text-center">
            <p className="text-lg text-secondary-foreground leading-relaxed font-light">
              I'm a Software Engineer turned AI Data Engineer with a background in Biomedical Engineering. 
              My journey started in biology and healthcare, where I discovered a passion for building 
              software that turns complex data into meaningful insights.
            </p>
            
            <p className="text-lg text-secondary-foreground leading-relaxed font-light">
              From developing computer vision applications for clinical gait analysis to optimizing 
              high-performance APIs handling thousands of daily requests, I've always been drawn to 
              solving real-world problems through code.
            </p>
            
            <p className="text-lg text-secondary-foreground leading-relaxed font-light">
              Currently at Glintt Global, I work on AI-powered solutions involving RAG architectures, 
              machine learning pipelines, and intelligent data orchestration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
