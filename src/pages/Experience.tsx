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
    years: 'Jul 2025 - Present',
    location: 'Porto, Portugal',
    description: [
      'Led the architecture design and development of an AI-powered address recognition pipeline, orchestrating OCR, NER, YOLO-based models, and classification models to extract and validate unstructured address data from physical documents, with Kafka and Redis handling thousands of data events per minute and OpenSearch powering fuzzy search across millions of records',
      'Design and develop end-to-end RAG pipelines, from automated document ingestion and OCR-based text extraction, through chunking strategies using LangChain, to vector database population with Weaviate, enabling intelligent document retrieval and Q&A over enterprise knowledge bases',
      'Design and implement multi-agent orchestration systems that process real-time voice input to progressively build and structure technical requirements specifications, coordinating specialised agents across transcription, interpretation, and document generation stages using LangGraph and Azure Agent Framework',
      'Develop causal inference and counterfactual ML models to optimise marketing campaign strategies, enabling data-driven personalisation',
      'Deploy and manage AI solutions in cloud-native environments (Azure, Docker), ensuring reliability, observability, and scalability',
    ],
    technologies: ['Python', 'Docker', 'OpenSearch', 'Azure', 'YOLO', 'Kafka', 'Redis', 'LangChain', 'LangGraph', 'Weaviate', 'Django', 'Django REST Framework', 'PostgreSQL', 'Pandas', 'Scikit-learn'],
    logo: glinttLogo,
  },
  {
    id: 'nonius',
    company: 'Nonius',
    position: 'Software Engineer',
    years: 'Feb 2024 - Jun 2025',
    location: 'Porto, Portugal',
    description: [
      'Develop and maintain high-performance APIs using Django and Django REST Framework to support casting services (e.g., Chromecast, AirPlay), handling thousands of daily requests',
      'Optimize real-time communication and event propagation using Socket.IO, improving the system\'s capacity to handle 4x more simultaneous WebSocket connections',
      'Lead a project responsible for preparing and deploying devices for in-loco use in hotels, hospitals, and healthcare facilities',
      'Work across the full data pipeline: from ingesting raw data from customer devices into Elasticsearch, to processing and delivering it efficiently to the end user — applying practical ETL principles',
      'Lead performance improvements by optimizing Elasticsearch queries and database operations, achieving up to 80% faster responses on critical endpoints',
    ],
    technologies: ['Python', 'Django', 'Django REST Framework', 'MySQL', 'Elasticsearch', 'Socket.IO', 'Pandas'],
    logo: noniusLogo,
  },
  {
    id: 'padrao-dev',
    company: 'Padrão Ortopédico',
    position: 'Software Developer',
    years: 'Nov 2022 - Feb 2024',
    location: 'Porto, Portugal',
    description: [
      'Developed a real-time biomechanical analysis system for lower limb amputees, applying a YOLO-based computer vision model to capture and interpret gait data from live video input',
      'Engineered a full ML data pipeline, from raw computer vision output through signal processing and filtering techniques, transforming noisy data into clinically structured gait assessments',
      'Designed and implemented a clinical-grade GUI to visualise processed biomechanical data, built for usability by healthcare professionals in a medical setting',
    ],
    technologies: ['Python', 'Pandas', 'YOLO', 'Cloud Computing'],
    logo: padraoLogo,
  },
  {
    id: 'padrao-intern',
    company: 'Padrão Ortopédico',
    position: 'Biomedical Engineer (Internship)',
    years: 'Feb 2022 - Jul 2022',
    location: 'Porto, Portugal',
    description: [
      'Built a Python web app to process gait data and generate assessments of lower limb amputees using input from a third-party tool',
    ],
    technologies: ['Python', 'Pandas'],
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
