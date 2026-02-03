import { useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import Footer from '@/components/Footer';
import ParticlesBackground from '@/components/ParticlesBackground';
import { Calendar } from 'lucide-react';
import { useScrollToTop } from '@/hooks/useScrollToTop';

// Import university logo
import ucpLogo from '@/assets/logos/universidade-catolica.jpg';

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  years: string;
  description?: string;
  logo: string;
}

const education: EducationEntry[] = [
  {
    id: 'masters',
    institution: 'Universidade Católica Portuguesa',
    degree: "Master's Degree in Biomedical Engineering",
    years: '2017 - 2019',
    description: 'Thesis focused on machine learning applications in medical imaging and diagnostics.',
    logo: ucpLogo,
  },
  {
    id: 'bachelors',
    institution: 'Universidade Católica Portuguesa',
    degree: "Bachelor's Degree in Bioengineering",
    years: '2014 - 2017',
    description: 'Foundation in engineering principles applied to biological and medical systems.',
    logo: ucpLogo,
  },
];

const EducationPage = () => {
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
              Education
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Academic foundation in biomedical engineering and technology
            </p>
          </div>

          {/* Education entries */}
          <div className="max-w-4xl mx-auto space-y-8">
            {education.map((edu, index) => (
              <div
                key={edu.id}
                id={edu.id}
                className="reveal opacity-0 group scroll-mt-32"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6 md:p-8 bg-card border border-border rounded-xl card-hover">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Logo */}
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 bg-white/90 border border-border/50 overflow-hidden">
                      <img 
                        src={edu.logo} 
                        alt={`${edu.institution} logo`}
                        className="w-12 h-12 object-contain"
                      />
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EducationPage;
