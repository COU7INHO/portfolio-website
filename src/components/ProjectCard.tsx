import { useState } from 'react';
import { ExternalLink, Github, Zap, BarChart3, Code2, Wrench } from 'lucide-react';
import { ProjectGallery, ProjectImagePreview } from './ProjectGallery';

export interface Project {
  title: string;
  description: string;
  longDescription: string;
  howItWasBuilt: string;
  features: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  githubBackendUrl?: string;
  githubFrontendUrl?: string;
  status: 'Live' | 'In Development' | 'Archived';
  screenshots?: string[];
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card card-hover">
        {/* Header: Title + Status */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground hover:text-primary transition-colors">
              {project.title}
            </h2>
            {project.liveUrl && (
              <a 
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline text-sm mt-1"
              >
                {project.liveUrl.replace('https://', '')}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full shrink-0 ${
            project.status === 'Live' 
              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
              : project.status === 'In Development'
              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
              : 'bg-muted text-muted-foreground border border-border'
          }`}>
            {project.status}
          </span>
        </div>

        {/* Preview Image - Clickable for Gallery */}
        <ProjectImagePreview 
          screenshots={project.screenshots || []} 
          onOpenGallery={openGallery}
        />

        {/* Content */}
        <div className="p-6 md:p-8 pt-6">
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
          <div className="mb-6">
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

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
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
            {project.githubBackendUrl && (
              <a
                href={project.githubBackendUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all text-sm"
              >
                <Github className="w-4 h-4" />
                Backend
              </a>
            )}
            {project.githubFrontendUrl && (
              <a
                href={project.githubFrontendUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all text-sm"
              >
                <Github className="w-4 h-4" />
                Frontend
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Lightbox */}
      <ProjectGallery
        screenshots={project.screenshots || []}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        initialIndex={galleryIndex}
      />
    </>
  );
};

export default ProjectCard;
