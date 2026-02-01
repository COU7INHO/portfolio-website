import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';

interface TimelineEntry {
  company: string;
  position: string;
  years: string;
  logo?: string;
}

const timelineData: TimelineEntry[] = [
  {
    company: 'Glintt Global',
    position: 'AI Data Engineer',
    years: '2023 - Present',
  },
  {
    company: 'Nonius',
    position: 'Software Engineer',
    years: '2021 - 2023',
  },
  {
    company: 'Padrão Ortopédico',
    position: 'Biomedical Engineer',
    years: '2019 - 2021',
  },
];

const Timeline = () => {
  const timelineRef = useRef<HTMLDivElement>(null);

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

    const elements = timelineRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="journey" ref={timelineRef} className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="reveal opacity-0 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Professional Journey
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Building expertise across AI, data engineering, and biomedical technology
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px timeline-glow hidden md:block" />
          
          {/* Mobile line */}
          <div className="absolute left-8 top-0 bottom-0 w-px timeline-glow md:hidden" />

          <div className="space-y-12">
            {timelineData.map((entry, index) => (
              <div
                key={entry.company}
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
                    to="/experience"
                    className="group block p-6 bg-card border border-border rounded-xl card-hover"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {entry.company}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {entry.position}
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

export default Timeline;
