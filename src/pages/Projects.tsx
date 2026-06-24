import { useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import Footer from '@/components/Footer';
import ParticlesBackground from '@/components/ParticlesBackground';
import ProjectCard, { Project } from '@/components/ProjectCard';
import { useScrollToTop } from '@/hooks/useScrollToTop';

import kartsMainPage from '@/assets/karts-main-page.png';
import kartsRacePage from '@/assets/karts-race-page.png';
import imlensMain from '@/assets/imlens-main.png';
import imlensResults from '@/assets/imlens-results.png';
import imlensSettings from '@/assets/imlens-settings.png';
import imlensUsage from '@/assets/imlens-usage.png';
import imlensLogin from '@/assets/imlens-login.png';
import githubDisciplineHero from '@/assets/github-discipline-hero.png';
import githubDisciplineRepositorySetup from '@/assets/github-discipline-repository-setup.png';
import githubDisciplinePullRequests from '@/assets/github-discipline-pull-requests.png';

const projects: Project[] = [
  {
    title: 'The GitHub Discipline',
    description: 'A field manual that helps engineering teams build better habits for managing code on GitHub, from intent to production.',
    longDescription: `Most teams know git, but knowing git is not the same as having a healthy workflow. The GitHub Discipline is a guide that focuses on the habits and concepts behind good code management rather than the raw mechanics of the tool. It walks through the full journey of a change, from capturing work as intent in an issue, to branching, opening pull requests, reviewing code, merging, and shipping to production. Everything is framework-agnostic and meant to be adapted to each team's reality rather than followed as dogma. The goal is simple: give teams a structured, opinionated starting point so they can stop arguing about process and start improving their flow.`,
    howItWasBuilt: `The site is built with Astro 4 in a static-first, content-focused setup, so the entire guide is generated as pure HTML at build time with no runtime framework overhead. Styling is hand-rolled CSS with custom properties, no Tailwind and no CSS-in-JS. Interactivity is kept deliberately minimal and treated as small islands of vanilla JavaScript: a scroll progress bar, sidebar section tracking, and copy buttons on code blocks. The whole guide lives in a single, searchable, version-controllable Astro file, and because the output is just static files it can be hosted anywhere, from Nginx to GitHub Pages, Netlify, or Vercel. The design philosophy treats the guide as a magazine to be read rather than an application to be run.`,
    features: [
      'Nine-chapter guide covering repository setup, branching, issues, PRs, code review, merging, and AI agents',
      'Framework-agnostic practices teams can adapt to their own reality',
      'Static HTML generated at build time with no runtime framework overhead',
      'Minimal JavaScript islands: scroll progress, sidebar tracking, and copy buttons',
      'Single-file, searchable, version-controllable architecture',
      'Pure static output that runs on any host',
      'Self-hosted on a Raspberry Pi 5',
    ],
    technologies: ['Astro', 'TypeScript', 'CSS', 'Static Site Generation'],
    liveUrl: 'https://github-discipline.tiago-coutinho.com',
    githubUrl: 'https://github.com/COU7INHO/github-discipline',
    status: 'Live',
    screenshots: [githubDisciplineHero, githubDisciplineRepositorySetup, githubDisciplinePullRequests],
  },
  {
    title: 'IMLens',
    description: 'Natural language photo search for Immich, powered by local AI models running entirely on your own hardware.',
    longDescription: `Immich is a fantastic open-source, self-hosted photo and video library, the go-to choice for anyone who wants to keep a local backup of their memories without handing them over to Google Photos or iCloud. It handles uploads from your phone, organises everything by date and people, and gives you full control over your data. But there's one thing it can't do, and honestly almost no photo app out there can: actually understand what's in your photos. You know the photo exists, you just can't find it. You don't remember when it was taken or which album it's in. You only remember it was a sunset, that Sarah was there, or that it was somewhere in Italy. Immich's search is limited to dates, people, and albums, so the photo stays buried. IMLens fills that gap. It uses a local Vision Language Model to read and describe every photo in your Immich library, stores those descriptions as searchable embeddings, and lets you find photos by describing what you're looking for in plain English. No cloud, no subscriptions, everything runs on your own hardware.`,
    howItWasBuilt: `IMLens is built around a fully local AI pipeline. During indexing, photos are pulled from Immich and passed through a Vision Language Model running on Ollama, which generates a detailed description of each image. Those descriptions are converted into vector embeddings and stored in Weaviate, a vector database optimised for semantic search. When a user types a query, a second local LLM parses the natural language into structured filters (people, dates, locations, albums), which are then combined with semantic similarity in a hybrid search against Weaviate. The backend is Django and the whole stack is orchestrated with Docker. A smart RAM management mode swaps models in and out of memory so the project runs comfortably on a Raspberry Pi 5 with 8 GB of RAM, but the architecture is hardware agnostic: with a more powerful machine you can plug in larger and more capable models, get richer photo descriptions and more accurate query parsing, and really push how much the system can do. No data ever leaves the user's network.`,
    features: [
      'Natural language photo search powered by local Vision Language Models',
      'Fully local pipeline, no cloud and no data leaving your network',
      'Hybrid semantic and metadata search via Weaviate vector database',
      'Person aliases mapping nicknames ("mom", "my sister") to Immich identities',
      'Automatic daily sync with configurable off-peak indexing windows',
      'VPN fallback URL with automatic failover for remote Immich access',
      'Smart RAM management that swaps models in and out for low-memory hardware',
      'Self-hosted on a Raspberry Pi 5',
    ],
    technologies: ['Python', 'Django', 'Ollama', 'Weaviate', 'Vision Language Models', 'LLMs', 'Vector Embeddings', 'Semantic Search', 'RAG', 'Hybrid Search', 'Prompt Engineering', 'Docker', 'Raspberry Pi'],
    githubUrl: 'https://github.com/COU7INHO/imlens',
    screenshots: [imlensMain, imlensResults, imlensSettings, imlensUsage, imlensLogin],
  },
  {
    title: 'Speed Champion',
    description: 'A karting lap time tracking app that uses AI and OCR to parse race classifications.',
    longDescription: `Speed Champion is a karting lap time tracking app built for competitive friend groups. It uses AI-powered OCR (Mistral OCR) to automatically read and parse race classification sheets, eliminating the need for manual data entry. Track your performance, compare lap times with friends, and settle the debate about who's really the fastest on the track.`,
    howItWasBuilt: `The frontend was built with React and TypeScript using Lovable, an AI-powered development tool, styled with Tailwind CSS for a clean and responsive interface. The backend runs on Django and Django REST Framework, handling the OCR processing pipeline powered by Mistral's OCR API to extract lap times and driver data from race sheet images. All data is stored in PostgreSQL with optimized queries for fast access to historical race data. The entire application is self-hosted on a Raspberry Pi 5, running behind Nginx as a reverse proxy — a compact and efficient home server setup that keeps the project running 24/7.`,
    features: [
      'AI-powered OCR (Mistral) for automatic lap time extraction from race sheets',
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
