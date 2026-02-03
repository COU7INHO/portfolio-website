import { useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import Footer from '@/components/Footer';
import ParticlesBackground from '@/components/ParticlesBackground';
import ProjectCard, { Project } from '@/components/ProjectCard';
import { useScrollToTop } from '@/hooks/useScrollToTop';

import kartsMainPage from '@/assets/karts-main-page.png';
import kartsRacePage from '@/assets/karts-race-page.png';

const projects: Project[] = [
  {
    title: 'Speed Champion',
    description: 'A karting lap time tracking app that uses AI and OCR to parse race classifications.',
    longDescription: `Speed Champion is a karting lap time tracking app built for competitive friend groups. It uses AI-powered OCR (Mistral OCR) to automatically read and parse race classification sheets, eliminating the need for manual data entry. Track your performance, compare lap times with friends, and settle the debate about who's really the fastest on the track.`,
    howItWasBuilt: `The frontend was built with React and TypeScript using Lovable, an AI-powered development tool, styled with Tailwind CSS for a clean and responsive interface. The backend runs on Django and Django REST Framework, handling the OCR processing pipeline powered by Mistral's OCR API to extract lap times and driver data from race sheet images. All data is stored in PostgreSQL with optimized queries for fast access to historical race data. The entire application is self-hosted on a Raspberry Pi 5, running behind Nginx as a reverse proxy — a compact and efficient home server setup that keeps the project running 24/7.`,
    features: [
      'AI-powered OCR (Mistral) for automatic lap time extraction from race sheets',
      'Real-time leaderboards and performance tracking',
      'Head-to-head comparison between drivers',
      'Historical data analysis and performance trends',
      'Mobile-friendly interface for trackside use',
      'Self-hosted on a Raspberry Pi 5',
    ],
    technologies: ['React', 'TypeScript', 'Django', 'Django REST Framework', 'Python', 'PostgreSQL', 'Mistral OCR', 'Tailwind CSS', 'Nginx', 'Raspberry Pi', 'Docker'],
    liveUrl: 'https://karts.tiago-coutinho.com',
    githubBackendUrl: 'https://github.com/COU7INHO/karst-app-backend',
    githubFrontendUrl: 'https://github.com/COU7INHO/speedway-stats',
    status: 'Live',
    screenshots: [kartsMainPage, kartsRacePage],
  },
];

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
