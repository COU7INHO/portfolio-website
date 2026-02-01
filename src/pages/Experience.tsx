import { useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Building2, GraduationCap, Calendar, MapPin } from 'lucide-react';

interface ExperienceEntry {
  company: string;
  position: string;
  years: string;
  location?: string;
  description: string[];
  technologies: string[];
}

interface EducationEntry {
  institution: string;
  degree: string;
  years: string;
  description?: string;
}

const experiences: ExperienceEntry[] = [
  {
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
  },
  {
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
  },
  {
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
  },
];

const education: EducationEntry[] = [
  {
    institution: 'Universidade Católica Portuguesa',
    degree: "Master's Degree in Biomedical Engineering",
    years: '2017 - 2019',
    description: 'Thesis focused on machine learning applications in medical imaging and diagnostics.',
  },
  {
    institution: 'Universidade Católica Portuguesa',
    degree: "Bachelor's Degree in Bioengineering",
    years: '2014 - 2017',
    description: 'Foundation in engineering principles applied to biological and medical systems.',
  },
];

const Experience = () => {
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
              Experience & Education
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              A journey through AI, software engineering, and biomedical innovation
            </p>
          </div>

          {/* Professional Experience */}
          <section className="mb-24">
            <h2 className="reveal opacity-0 text-2xl font-bold text-foreground mb-12 flex items-center gap-3">
              <Building2 className="w-6 h-6 text-primary" />
              Professional Experience
            </h2>

            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div
                  key={exp.company}
                  className="reveal opacity-0 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-6 md:p-8 bg-card border border-border rounded-xl card-hover">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Logo placeholder */}
                      <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                        <Building2 className="w-8 h-8 text-primary" />
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
          </section>

          {/* Education */}
          <section>
            <h2 className="reveal opacity-0 text-2xl font-bold text-foreground mb-12 flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-primary" />
              Education
            </h2>

            <div className="space-y-8">
              {education.map((edu, index) => (
                <div
                  key={edu.degree}
                  className="reveal opacity-0 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-6 md:p-8 bg-card border border-border rounded-xl card-hover">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Logo placeholder */}
                      <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                        <GraduationCap className="w-8 h-8 text-primary" />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {edu.degree}
                            </h3>
                            <p className="text-primary font-medium">{edu.institution}</p>
                          </div>
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {edu.years}
                          </span>
                        </div>

                        {edu.description && (
                          <p className="text-secondary-foreground">{edu.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Experience;
