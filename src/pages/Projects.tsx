import { useEffect, useRef, useState } from 'react';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import Footer from '@/components/Footer';
import ParticlesBackground from '@/components/ParticlesBackground';
import { ExternalLink, Github, Timer, Zap, BarChart3, Code2, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';

import kartsMainPage from '@/assets/karts-main-page.png';
import kartsRacePage from '@/assets/karts-race-page.png';

interface Project {
  title: string;
  description: string;
  longDescription: string;
  howItWasBuilt: string;
  features: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  status: 'Live' | 'In Development' | 'Archived';
  screenshots?: string[];
}

const projects: Project[] = [
  {
    title: 'Speed Champion',
    description: 'A karting lap time tracking app that uses AI and OCR to parse race classifications.',
    longDescription: `Speed Champion is a karting lap time tracking application designed for competitive friend groups. 
    The app leverages AI and OCR technology to automatically parse race classification sheets, eliminating manual data entry. 
    Track your performance, compare times with friends, and settle debates about who's really the fastest on the track.`,
    howItWasBuilt: `The application was built with a modern stack focusing on performance and user experience. 
    The frontend uses React with TypeScript for type safety and Tailwind CSS for rapid UI development. 
    The backend is powered by FastAPI (Python) which handles the AI/OCR processing pipeline. 
    Images are processed using computer vision techniques to extract lap times and driver information from race sheets. 
    All data is stored in PostgreSQL with proper indexing for fast queries on historical data. 
    The OCR pipeline uses a combination of image preprocessing, text detection, and custom parsing logic to accurately extract structured data from various race sheet formats.`,
    features: [
      'AI-powered OCR for automatic lap time extraction from race sheets',
      'Real-time leaderboards and performance tracking',
      'Head-to-head comparison between drivers',
      'Historical data analysis and performance trends',
      'Mobile-friendly interface for trackside use',
    ],
    technologies: ['React', 'TypeScript', 'FastAPI', 'Python', 'PostgreSQL', 'OCR/AI', 'Tailwind CSS', 'Docker'],
    liveUrl: 'https://karts.tiago-coutinho.com',
    githubUrl: '#',
    status: 'Live',
    screenshots: [kartsMainPage, kartsRacePage],
  },
];

const ProjectScreenshots = ({ screenshots }: { screenshots: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  };

  if (!screenshots || screenshots.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Timer className="w-10 h-10 text-primary" />
          </div>
          <span className="text-muted-foreground text-sm">Project Screenshot</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <img
        src={screenshots[currentIndex]}
        alt={`Screenshot ${currentIndex + 1}`}
        className="w-full h-full object-cover object-top transition-opacity duration-300"
      />
      
      {screenshots.length > 1 && (
        <>
          {/* Navigation arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {screenshots.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'bg-primary w-4' 
                    : 'bg-foreground/30 hover:bg-foreground/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

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
                <div className="group overflow-hidden rounded-2xl border border-border bg-card card-hover">
                  {/* Project Hero with Screenshots */}
                  <div className="relative h-48 md:h-72 bg-gradient-to-br from-secondary to-muted overflow-hidden">
                    <ProjectScreenshots screenshots={project.screenshots || []} />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent pointer-events-none" />
                    
                    {/* Status badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        project.status === 'Live' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-primary/10 text-primary border border-primary/20'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
                      <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                          {project.title}
                        </h2>
                        {project.liveUrl && (
                          <a 
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                          >
                            {project.liveUrl.replace('https://', '')}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <div className="flex gap-3">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity text-sm"
                          >
                            <Zap className="w-4 h-4" />
                            View Live
                          </a>
                        )}
                        {project.githubUrl && project.githubUrl !== '#' && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all text-sm"
                          >
                            <Github className="w-4 h-4" />
                            Source
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-secondary-foreground leading-relaxed mb-6">
                      {project.longDescription}
                    </p>

                    {/* How it was built */}
                    <div className="mb-6">
                      <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-primary" />
                        How It Was Built
                      </h3>
                      <p className="text-secondary-foreground leading-relaxed text-sm">
                        {project.howItWasBuilt}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        Key Features
                      </h3>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {project.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-secondary-foreground text-sm">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-primary" />
                        Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-lg"
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
