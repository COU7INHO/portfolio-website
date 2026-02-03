import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Building2, GraduationCap, ArrowRight } from 'lucide-react';

interface JourneyEntry {
  id: string;
  type: 'work' | 'education';
  title: string;
  subtitle: string;
  years: string;
  startYear: number;
  endYear: number | null;
  description?: string;
}

const journeyData: JourneyEntry[] = [
  {
    id: 'glintt',
    type: 'work' as const,
    title: 'Glintt Global',
    subtitle: 'AI Data Engineer',
    years: '2023 - Present',
    startYear: 2023,
    endYear: null,
    description: 'Building AI-powered healthcare solutions and data pipelines',
  },
  {
    id: 'nonius',
    type: 'work' as const,
    title: 'Nonius',
    subtitle: 'Software Engineer',
    years: '2021 - 2023',
    startYear: 2021,
    endYear: 2023,
    description: 'Developed hospitality technology solutions and guest experience platforms',
  },
  {
    id: 'padrao',
    type: 'work' as const,
    title: 'Padrão Ortopédico',
    subtitle: 'Biomedical Engineer',
    years: '2019 - 2021',
    startYear: 2019,
    endYear: 2021,
    description: 'Applied biomedical engineering to orthopedic solutions',
  },
  {
    id: 'masters',
    type: 'education' as const,
    title: 'Universidade Católica Portuguesa',
    subtitle: "Master's in Biomedical Engineering",
    years: '2017 - 2019',
    startYear: 2017,
    endYear: 2019,
    description: 'Advanced studies in biomedical systems and medical technology',
  },
  {
    id: 'bachelors',
    type: 'education' as const,
    title: 'Universidade Católica Portuguesa',
    subtitle: "Bachelor's in Bioengineering",
    years: '2014 - 2017',
    startYear: 2014,
    endYear: 2017,
    description: 'Foundation in engineering principles and biological systems',
  },
].sort((a, b) => b.startYear - a.startYear);

const SpaceJourney = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [animatedDotProgress, setAnimatedDotProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Animate the traveling dot
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedDotProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Intersection observer for reveal animations
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
    <section id="journey" ref={sectionRef} className="py-12 relative overflow-hidden">
      {/* Subtle nebula effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6">
        <div className="reveal opacity-0 text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Journey Through Space & Time
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            From biomedical engineering to AI — a path of continuous exploration
          </p>
        </div>

        {/* Desktop Journey - Alternating Timeline */}
        <div className="relative hidden md:block max-w-5xl mx-auto">
          {/* Central vertical route line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <div className="h-full w-full bg-gradient-to-b from-primary/10 via-primary/40 to-primary/10" 
                 style={{ boxShadow: '0 0 8px hsl(var(--primary) / 0.3)' }} />
            {/* Animated traveling dot */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary"
              style={{ 
                top: `${animatedDotProgress}%`,
                boxShadow: '0 0 12px hsl(var(--primary))',
              }}
            />
          </div>

          <div className="space-y-4">
            {journeyData.map((entry, index) => {
              const isWork = entry.type === 'work';
              const isLeft = index % 2 === 0;
              const isHovered = hoveredId === entry.id;
              const linkPath = isWork ? `/experience#${entry.id}` : `/education#${entry.id}`;

              return (
                <div
                  key={entry.id}
                  className="reveal opacity-0 relative flex items-center"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Left side content */}
                  <div className={`w-[calc(50%-32px)] ${isLeft ? '' : 'opacity-0 pointer-events-none'}`}>
                    {isLeft && (
                      <Link
                        to={linkPath}
                        className={`block p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 group ${
                          isWork
                            ? 'bg-amber-950/20 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-950/30'
                            : 'bg-blue-950/20 border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-950/30'
                        } ${isHovered ? 'scale-[1.02]' : ''}`}
                        onMouseEnter={() => setHoveredId(entry.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 text-right">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {entry.title}
                            </h3>
                            <p className={`text-sm mt-0.5 ${isWork ? 'text-amber-400' : 'text-blue-400'}`}>
                              {entry.subtitle}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {entry.years}
                            </p>
                            {entry.description && (
                              <p className="text-xs text-muted-foreground/80 mt-2 leading-relaxed">
                                {entry.description}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                        </div>
                      </Link>
                    )}
                  </div>

                  {/* Center planet */}
                  <div className="w-16 flex justify-center z-10">
                    <div
                      className={`relative transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}
                      onMouseEnter={() => setHoveredId(entry.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {/* Orbit ring */}
                      <div
                        className={`absolute -inset-2 rounded-full border transition-all duration-300 ${
                          isWork ? 'border-amber-500/30' : 'border-blue-500/30'
                        } ${isHovered ? 'scale-125 opacity-100' : 'opacity-40'}`}
                      />
                      
                      {/* Planet glow */}
                      <div
                        className={`absolute inset-0 rounded-full blur-lg transition-all duration-300 ${
                          isWork ? 'bg-amber-500/50' : 'bg-blue-500/50'
                        } ${isHovered ? 'opacity-80 scale-125' : 'opacity-30'}`}
                      />

                      {/* Planet body */}
                      <div
                        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isWork
                            ? 'bg-gradient-to-br from-amber-600 to-amber-800'
                            : 'bg-gradient-to-br from-blue-600 to-blue-800'
                        }`}
                        style={{
                          boxShadow: isHovered 
                            ? `0 0 20px ${isWork ? 'rgba(245, 158, 11, 0.5)' : 'rgba(59, 130, 246, 0.5)'}`
                            : `0 0 10px ${isWork ? 'rgba(245, 158, 11, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                        }}
                      >
                        {isWork ? (
                          <Building2 className="w-5 h-5 text-white/90" />
                        ) : (
                          <GraduationCap className="w-5 h-5 text-white/90" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right side content */}
                  <div className={`w-[calc(50%-32px)] ${!isLeft ? '' : 'opacity-0 pointer-events-none'}`}>
                    {!isLeft && (
                      <Link
                        to={linkPath}
                        className={`block p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 group ${
                          isWork
                            ? 'bg-amber-950/20 border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-950/30'
                            : 'bg-blue-950/20 border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-950/30'
                        } ${isHovered ? 'scale-[1.02]' : ''}`}
                        onMouseEnter={() => setHoveredId(entry.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {entry.title}
                            </h3>
                            <p className={`text-sm mt-0.5 ${isWork ? 'text-amber-400' : 'text-blue-400'}`}>
                              {entry.subtitle}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {entry.years}
                            </p>
                            {entry.description && (
                              <p className="text-xs text-muted-foreground/80 mt-2 leading-relaxed">
                                {entry.description}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-sm mt-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-600 to-amber-800" />
              <span className="text-muted-foreground">Work Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-600 to-blue-800" />
              <span className="text-muted-foreground">Education</span>
            </div>
          </div>
        </div>

        {/* Mobile Journey */}
        <div className="md:hidden relative">
          {/* Vertical route line */}
          <div className="absolute left-6 top-0 bottom-0 w-px">
            <div className="h-full w-full bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20" />
            <div 
              className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary"
              style={{ 
                top: `${animatedDotProgress}%`,
                boxShadow: '0 0 8px hsl(var(--primary))',
              }}
            />
          </div>

          <div className="space-y-3 pl-14">
            {journeyData.map((entry, index) => {
              const isWork = entry.type === 'work';
              const linkPath = isWork ? `/experience#${entry.id}` : `/education#${entry.id}`;

              return (
                <div
                  key={entry.id}
                  className="reveal opacity-0 relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Planet on the line */}
                  <div
                    className={`absolute -left-14 top-3 w-7 h-7 rounded-full flex items-center justify-center ${
                      isWork
                        ? 'bg-gradient-to-br from-amber-600 to-amber-800'
                        : 'bg-gradient-to-br from-blue-600 to-blue-800'
                    }`}
                    style={{
                      boxShadow: `0 0 10px ${isWork ? 'rgba(245, 158, 11, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
                    }}
                  >
                    {isWork ? (
                      <Building2 className="w-3.5 h-3.5 text-white/90" />
                    ) : (
                      <GraduationCap className="w-3.5 h-3.5 text-white/90" />
                    )}
                  </div>

                  {/* Card */}
                  <Link
                    to={linkPath}
                    className={`block p-3 rounded-xl border backdrop-blur-sm transition-all duration-300 group ${
                      isWork
                        ? 'bg-amber-950/20 border-amber-500/20 active:bg-amber-950/30'
                        : 'bg-blue-950/20 border-blue-500/20 active:bg-blue-950/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">
                          {entry.title}
                        </h3>
                        <p className={`text-xs mt-0.5 ${isWork ? 'text-amber-400' : 'text-blue-400'}`}>
                          {entry.subtitle}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {entry.years}
                        </p>
                        {entry.description && (
                          <p className="text-xs text-muted-foreground/80 mt-1.5 leading-relaxed">
                            {entry.description}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpaceJourney;
