import { useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ExternalLink, Github, Timer, Zap, Users, BarChart3 } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  status: 'Live' | 'In Development' | 'Archived';
}

const projects: Project[] = [
  {
    title: 'Speed Champion',
    description: 'A karting lap time tracking app that uses AI and OCR to parse race classifications.',
    longDescription: `Speed Champion is a karting lap time tracking application designed for competitive friend groups. 
    The app leverages AI and OCR technology to automatically parse race classification sheets, eliminating manual data entry. 
    Track your performance, compare times with friends, and settle debates about who's really the fastest on the track.`,
    features: [
      'AI-powered OCR for automatic lap time extraction from race sheets',
      'Real-time leaderboards and performance tracking',
      'Head-to-head comparison between drivers',
      'Historical data analysis and performance trends',
      'Mobile-friendly interface for trackside use',
    ],
    technologies: ['React', 'FastAPI', 'PostgreSQL', 'Python', 'OCR/AI', 'Tailwind CSS'],
    liveUrl: 'https://karts.tiago-coutinho.com',
    status: 'Live',
  },
];

const Projects = () => {
  const pageRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-background" ref={pageRef}>
      <Navigation />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="reveal opacity-0 text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Projects
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Personal projects where I explore new technologies and solve real-world problems
            </p>
          </div>

          {/* Projects Grid */}
          <div className="space-y-12">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="reveal opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="group overflow-hidden rounded-2xl border border-border bg-card card-hover">
                  {/* Project Hero */}
                  <div className="relative h-64 md:h-80 bg-gradient-to-br from-secondary to-muted overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <Timer className="w-12 h-12 text-primary" />
                        </div>
                        <span className="text-muted-foreground">Project Screenshot</span>
                      </div>
                    </div>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                    
                    {/* Status badge */}
                    <div className="absolute top-6 right-6">
                      <span className={`px-4 py-1.5 text-sm font-medium rounded-full ${
                        project.status === 'Live' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-primary/10 text-primary border border-primary/20'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                          {project.title}
                        </h2>
                        {project.liveUrl && (
                          <a 
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            {project.liveUrl.replace('https://', '')}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      <div className="flex gap-3">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <Zap className="w-4 h-4" />
                            View Live
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground font-medium rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all"
                          >
                            <Github className="w-4 h-4" />
                            Source
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-lg text-secondary-foreground leading-relaxed mb-8">
                      {project.longDescription}
                    </p>

                    {/* Features */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Key Features
                      </h3>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {project.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-secondary-foreground">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* More projects coming */}
          <div className="reveal opacity-0 mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/50 text-muted-foreground rounded-full border border-border">
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
