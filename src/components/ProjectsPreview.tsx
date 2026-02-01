import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Folder } from 'lucide-react';

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
    <section id="projects" ref={sectionRef} className="py-16 relative">
      <div className="absolute inset-0 gradient-radial opacity-50 pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <div className="reveal opacity-0 text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Projects
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Personal projects where I explore new technologies and solve real problems
          </p>
        </div>

        <div className="reveal opacity-0 max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
          <Link
            to="/projects"
            className="group flex items-center justify-center gap-4 p-8 bg-card border border-border rounded-xl card-hover"
          >
            <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center">
              <Folder className="w-8 h-8 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                View All Projects
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Explore my work and technical implementations
              </p>
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all ml-auto" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsPreview;
