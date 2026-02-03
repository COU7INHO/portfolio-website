import { useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import Footer from '@/components/Footer';
import ParticlesBackground from '@/components/ParticlesBackground';
import { Calendar, MapPin } from 'lucide-react';
import { useScrollToTop } from '@/hooks/useScrollToTop';

// Import company logos
import glinttLogo from '@/assets/logos/glintt.png';
import noniusLogo from '@/assets/logos/nonius.png';
import padraoLogo from '@/assets/logos/padrao-ortopedico.png';

interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  years: string;
  location?: string;
  description: string[];
  technologies: string[];
  logo: string;
}

const experiences: ExperienceEntry[] = [
  {
    id: 'glintt',
    company: 'Glintt Global',
    position: 'AI Data Engineer',
    years: '2023 - Present',
    location: 'Porto, Portugal',
    description: [
      'Developing RAG-powered applications for healthcare document processing',
      'Building and maintaining machine learning pipelines for data extraction',
      'Designing scalable architectures for AI-driven solutions',
      'Implementing LLM integrations with LangChain and custom frameworks',
    ],
    technologies: ['Python', 'LangChain', 'FastAPI', 'Elasticsearch', 'Docker', 'Azure'],
    logo: glinttLogo,
  },
  {
    id: 'nonius',
    company: 'Nonius',
    position: 'Software Engineer',
    years: '2021 - 2023',
    location: 'Porto, Portugal',
    description: [
      'Developed backend services for hospitality technology solutions',
      'Implemented RESTful APIs using Django and FastAPI',
      'Worked with PostgreSQL databases and Redis caching',
      'Collaborated on CI/CD pipelines and deployment automation',
    ],
    technologies: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker', 'Git'],
    logo: noniusLogo,
  },
  {
    id: 'padrao',
    company: 'Padrão Ortopédico',
    position: 'Biomedical Engineer',
    years: '2019 - 2021',
    location: 'Porto, Portugal',
    description: [
      'Designed and developed custom orthopedic solutions using CAD software',
      'Implemented 3D printing workflows for prosthetics manufacturing',
      'Conducted quality assurance and testing procedures',
      'Collaborated with medical professionals on patient-specific solutions',
    ],
    technologies: ['Fusion360', 'YOLO', 'Python', 'CAD/CAM'],
    logo: padraoLogo,
  },
];

const Experience = () => {
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
              Professional Experience
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              A journey through AI, software engineering, and biomedical innovation
            </p>
          </div>

          {/* Experience entries */}
          <div className="max-w-4xl mx-auto space-y-8">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                id={exp.id}
                className="reveal opacity-0 group scroll-mt-32"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6 md:p-8 bg-card border border-border rounded-xl card-hover">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Logo */}
                    <div className="w-16 h-16 flex items-center justify-center shrink-0">
                      <img 
                        src={exp.logo} 
                        alt={`${exp.company} logo`}
                        className="w-16 h-16 object-contain mix-blend-screen brightness-110"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {exp.position}
                          </h3>
                          <p className="text-primary font-medium">{exp.company}</p>
                        </div>
                        <div className="flex flex-col md:items-end gap-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {exp.years}
                          </span>
                          {exp.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {exp.location}
                            </span>
                          )}
                        </div>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {exp.description.map((item, i) => (
                          <li key={i} className="text-secondary-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-lg"
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Experience;
