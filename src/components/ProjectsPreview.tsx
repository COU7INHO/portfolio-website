import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, Timer, Zap } from 'lucide-react';

const ProjectsPreview = () => {
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
    <section id="projects" ref={sectionRef} className="py-32 relative">
      <div className="absolute inset-0 gradient-radial opacity-50 pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <div className="reveal opacity-0 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Projects
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Personal projects where I explore new technologies and solve real problems
          </p>
        </div>

        <div className="reveal opacity-0 max-w-4xl mx-auto" style={{ animationDelay: '0.2s' }}>
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card card-hover">
            {/* Project image placeholder */}
            <div className="relative h-48 md:h-64 bg-gradient-to-br from-secondary to-muted overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Timer className="w-10 h-10 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">App Preview</span>
                </div>
              </div>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    Speed Champion
                  </h3>
                  <a 
                    href="https://karts.tiago-coutinho.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1"
                  >
                    karts.tiago-coutinho.com
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <span className="shrink-0 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                  Live
                </span>
              </div>

              <p className="text-secondary-foreground leading-relaxed mb-6">
                A karting lap time tracking app that uses AI and OCR to parse race classifications. 
                Built for competitive friends who want to track and compare their racing performance.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {['AI/OCR', 'React', 'FastAPI', 'PostgreSQL'].map((tech) => (
                  <span 
                    key={tech}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="https://karts.tiago-coutinho.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Zap className="w-4 h-4" />
                  View Project
                </a>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Projects
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsPreview;
