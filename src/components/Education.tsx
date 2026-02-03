import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Import university logo
import ucpLogo from '@/assets/logos/universidade-catolica.png';

interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  years: string;
  description: string;
  logo: string;
}

const educationData: EducationEntry[] = [
  {
    id: 'masters',
    degree: "Master's Degree in Biomedical Engineering",
    institution: 'Universidade Católica Portuguesa',
    years: '2020 - 2022',
    description: 'Advanced studies in biology, computational methods, and data processing applied to healthcare, with a thesis focused on developing a software solution for gait analysis in lower limb amputees using computer vision and signal processing',
    logo: ucpLogo,
  },
  {
    id: 'bachelors',
    degree: "Bachelor's Degree in Bioengineering",
    institution: 'Universidade Católica Portuguesa',
    years: '2017 - 2020',
    description: 'Foundations in biology, biomedical sciences, signal processing, and programming, building a multidisciplinary profile that bridges life sciences with technology and software development',
    logo: ucpLogo,
  },
];

const Education = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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

    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="education" ref={sectionRef} className="py-16 relative">
      <div className="container mx-auto px-6">
        <div className="reveal opacity-0 text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Education
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Academic foundation in biomedical engineering and technology
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px timeline-glow hidden md:block" />
          
          {/* Mobile line */}
          <div className="absolute left-8 top-0 bottom-0 w-px timeline-glow md:hidden" />

          <div className="space-y-8">
            {educationData.map((entry, index) => (
              <div
                key={entry.degree}
                className={`reveal opacity-0 relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 -translate-x-1/2 z-10">
                  <div className="w-4 h-4 bg-primary rounded-full glow-primary" />
                </div>

                {/* Card */}
                <div
                  className={`ml-20 md:ml-0 md:w-[calc(50%-40px)] ${
                    index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                  }`}
                >
                  <Link
                    to={`/education#${entry.id}`}
                    className="group block p-5 bg-card border border-border rounded-xl card-hover"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 flex items-center justify-center shrink-0">
                        <img 
                          src={entry.logo} 
                          alt={`${entry.institution} logo`}
                          className="w-12 h-12 object-contain mix-blend-screen brightness-110"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {entry.degree}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {entry.institution}
                        </p>
                        <p className="text-primary/80 text-sm mt-2 font-medium">
                          {entry.years}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
