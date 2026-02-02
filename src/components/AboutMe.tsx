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
              I build intelligent solutions at the intersection of AI, data engineering, 
              and software development.
            </p>
            
            <p className="text-lg text-secondary-foreground leading-relaxed font-light">
              My expertise lies in RAG-powered applications, machine learning pipelines, 
              and designing scalable software architectures that solve real-world problems.
            </p>
            
            <p className="text-lg text-secondary-foreground leading-relaxed font-light">
              I'm passionate about leveraging cutting-edge technology to create 
              meaningful impact through clean, efficient, and maintainable code.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
