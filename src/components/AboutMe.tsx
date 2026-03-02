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
              I'm an AI Data Engineer focused on building production-grade AI systems.
              I design RAG pipelines over enterprise knowledge bases, document intelligence solutions
              combining OCR and NER, and multi-agent orchestration frameworks that automate
              complex, multi-step workflows.
            </p>

            <p className="text-lg text-secondary-foreground leading-relaxed font-light">
              I work across the full stack of modern AI engineering: large language models,
              vector databases, event-driven pipelines, and cloud-native infrastructure,
              putting the pieces together into systems that run reliably at scale.
            </p>

            <p className="text-lg text-secondary-foreground leading-relaxed font-light">
              I come from a Biomedical Engineering background, which is where I first got hooked on
              turning messy real-world data into something useful. That same instinct drives everything
              I build today.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
