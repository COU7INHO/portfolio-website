import { useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import Footer from '@/components/Footer';
import ParticlesBackground from '@/components/ParticlesBackground';
import ProjectCard from '@/components/ProjectCard';
import { useScrollToTop } from '@/hooks/useScrollToTop';

import { projects } from '@/data/projects';

const Projects = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollToTop();

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

    const elements = pageRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background relative" ref={pageRef}>
      <ParticlesBackground />
      <Navigation />
      <BackButton />
      
      <main className="relative z-10 pt-28 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="reveal opacity-0 text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              Projects
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Personal projects where I explore new technologies and solve real-world problems
            </p>
          </div>

          {/* Projects Grid */}
          <div className="space-y-10">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="reveal opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>

          {/* More projects coming */}
          <div className="reveal opacity-0 mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary/50 text-muted-foreground rounded-full border border-border text-sm">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              More projects coming soon
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Projects;
