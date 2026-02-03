import { useState, useEffect, useRef, useMemo } from 'react';
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [animatedDotProgress, setAnimatedDotProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate planet sizes based on duration
  const getPlanetSize = (entry: JourneyEntry) => {
    const duration = (entry.endYear || 2024) - entry.startYear;
    const baseSize = 48;
    const sizeMultiplier = Math.min(1 + duration * 0.1, 1.5);
    return baseSize * sizeMultiplier;
  };

  // Animate the traveling dot
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedDotProgress((prev) => (prev >= 100 ? 0 : prev + 0.3));
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

  // Generate curved path for desktop
  const generatePath = useMemo(() => {
    const points: { x: number; y: number }[] = [];
    const totalEntries = journeyData.length;
    
    journeyData.forEach((_, index) => {
      const progress = index / (totalEntries - 1);
      const x = 10 + progress * 80; // 10% to 90% of width
      const y = 15 + index * (70 / (totalEntries - 1)); // Distribute vertically
      // Add wave effect
      const wave = Math.sin(progress * Math.PI * 2) * 8;
      points.push({ x: x + wave, y });
    });

    if (points.length < 2) return '';

    // Create smooth curve through points
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const midX = (current.x + next.x) / 2;
      const midY = (current.y + next.y) / 2;
      
      // Control points for smooth curves
      const cp1x = current.x + (midX - current.x) * 0.5;
      const cp1y = current.y;
      const cp2x = midX - (midX - current.x) * 0.5;
      const cp2y = midY;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${midX} ${midY}`;
      
      if (i < points.length - 2) {
        const cp3x = midX + (next.x - midX) * 0.5;
        const cp3y = midY;
        const cp4x = next.x - (next.x - midX) * 0.5;
        const cp4y = next.y;
        path += ` C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${next.x} ${next.y}`;
      } else {
        path += ` L ${next.x} ${next.y}`;
      }
    }

    return path;
  }, []);

  // Get position for each planet
  const getPlanetPosition = (index: number) => {
    const totalEntries = journeyData.length;
    const progress = index / (totalEntries - 1);
    const x = 10 + progress * 80;
    const y = 15 + index * (70 / (totalEntries - 1));
    const wave = Math.sin(progress * Math.PI * 2) * 8;
    return { x: x + wave, y };
  };

  // Get position along path for animated dot
  const getAnimatedDotPosition = () => {
    const totalEntries = journeyData.length;
    const progress = animatedDotProgress / 100;
    const index = progress * (totalEntries - 1);
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.min(lowerIndex + 1, totalEntries - 1);
    const t = index - lowerIndex;

    const pos1 = getPlanetPosition(lowerIndex);
    const pos2 = getPlanetPosition(upperIndex);

    return {
      x: pos1.x + (pos2.x - pos1.x) * t,
      y: pos1.y + (pos2.y - pos1.y) * t,
    };
  };

  const handlePlanetClick = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const dotPos = getAnimatedDotPosition();

  return (
    <section id="journey" ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Subtle nebula effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6">
        <div className="reveal opacity-0 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Journey Through Space & Time
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            From biomedical engineering to AI — a path of continuous exploration
          </p>
        </div>

        {/* Desktop Journey Map */}
        <div 
          ref={containerRef}
          className="relative hidden md:block h-[600px] max-w-6xl mx-auto"
        >
          {/* SVG Route */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              </linearGradient>
              <filter id="routeGlow">
                <feGaussianBlur stdDeviation="0.3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Main route line */}
            <path
              d={generatePath}
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="0.3"
              strokeDasharray="1 0.5"
              filter="url(#routeGlow)"
              className="opacity-60"
            />

            {/* Animated traveling dot */}
            <circle
              cx={dotPos.x}
              cy={dotPos.y}
              r="0.8"
              fill="hsl(var(--primary))"
              className="animate-pulse"
            >
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>

          {/* Planets */}
          {journeyData.map((entry, index) => {
            const pos = getPlanetPosition(index);
            const size = getPlanetSize(entry);
            const isExpanded = expandedId === entry.id;
            const isWork = entry.type === 'work';
            const linkPath = isWork ? `/experience#${entry.id}` : `/education#${entry.id}`;

            return (
              <div
                key={entry.id}
                className="reveal opacity-0 absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Planet container */}
                <div
                  className={`relative cursor-pointer transition-all duration-500 ${
                    isExpanded ? 'scale-110' : 'hover:scale-105'
                  }`}
                  onClick={() => handlePlanetClick(entry.id)}
                >
                  {/* Orbit ring */}
                  <div
                    className={`absolute inset-0 rounded-full border transition-all duration-500 ${
                      isWork 
                        ? 'border-amber-500/30' 
                        : 'border-blue-500/30'
                    } ${isExpanded ? 'scale-150 opacity-100' : 'scale-125 opacity-50'}`}
                    style={{
                      width: size + 20,
                      height: size + 20,
                      left: -10,
                      top: -10,
                    }}
                  />

                  {/* Planet glow */}
                  <div
                    className={`absolute rounded-full blur-xl transition-all duration-500 ${
                      isWork 
                        ? 'bg-amber-500/40' 
                        : 'bg-blue-500/40'
                    } ${isExpanded ? 'opacity-80 scale-125' : 'opacity-40'}`}
                    style={{
                      width: size,
                      height: size,
                    }}
                  />

                  {/* Planet body */}
                  <div
                    className={`relative rounded-full flex items-center justify-center transition-all duration-500 ${
                      isWork
                        ? 'bg-gradient-to-br from-amber-600/90 to-amber-800/90 shadow-amber-500/30'
                        : 'bg-gradient-to-br from-blue-600/90 to-blue-800/90 shadow-blue-500/30'
                    } shadow-lg ${isExpanded ? 'shadow-2xl' : ''}`}
                    style={{
                      width: size,
                      height: size,
                    }}
                  >
                    {isWork ? (
                      <Building2 className="w-1/2 h-1/2 text-white/90" />
                    ) : (
                      <GraduationCap className="w-1/2 h-1/2 text-white/90" />
                    )}
                  </div>

                  {/* Year label */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                      isExpanded ? 'opacity-0' : 'opacity-80'
                    } ${isWork ? 'text-amber-400' : 'text-blue-400'}`}
                    style={{ top: size + 8 }}
                  >
                    {entry.years.split(' - ')[0]}
                  </div>
                </div>

                {/* Expanded info card */}
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
                    isExpanded
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 -translate-y-4 pointer-events-none'
                  }`}
                  style={{ top: size + 16, width: 280 }}
                >
                  <Link
                    to={linkPath}
                    className={`block p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 group ${
                      isWork
                        ? 'bg-amber-950/50 border-amber-500/30 hover:border-amber-500/50'
                        : 'bg-blue-950/50 border-blue-500/30 hover:border-blue-500/50'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {entry.title}
                        </h3>
                        <p className={`text-sm mt-1 ${isWork ? 'text-amber-400' : 'text-blue-400'}`}>
                          {entry.subtitle}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {entry.years}
                        </p>
                        {entry.description && (
                          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                            {entry.description}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 text-sm">
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
          <div className="absolute left-8 top-0 bottom-0 w-px">
            <div className="h-full w-full bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20" />
            {/* Animated dot for mobile */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary animate-pulse"
              style={{ top: `${animatedDotProgress}%` }}
            />
          </div>

          <div className="space-y-6 pl-16">
            {journeyData.map((entry, index) => {
              const isExpanded = expandedId === entry.id;
              const isWork = entry.type === 'work';
              const linkPath = isWork ? `/experience#${entry.id}` : `/education#${entry.id}`;

              return (
                <div
                  key={entry.id}
                  className="reveal opacity-0 relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Planet dot on the line */}
                  <div
                    className={`absolute -left-16 top-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isWork
                        ? 'bg-gradient-to-br from-amber-600 to-amber-800 shadow-amber-500/30'
                        : 'bg-gradient-to-br from-blue-600 to-blue-800 shadow-blue-500/30'
                    } shadow-lg ${isExpanded ? 'scale-125 shadow-xl' : ''}`}
                    onClick={() => handlePlanetClick(entry.id)}
                  >
                    {isWork ? (
                      <Building2 className="w-4 h-4 text-white/90" />
                    ) : (
                      <GraduationCap className="w-4 h-4 text-white/90" />
                    )}
                  </div>

                  {/* Card */}
                  <div
                    className={`p-4 rounded-xl border backdrop-blur-sm cursor-pointer transition-all duration-300 ${
                      isWork
                        ? 'bg-amber-950/30 border-amber-500/20'
                        : 'bg-blue-950/30 border-blue-500/20'
                    } ${isExpanded ? 'border-opacity-50' : ''}`}
                    onClick={() => handlePlanetClick(entry.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {entry.title}
                        </h3>
                        <p className={`text-sm mt-1 ${isWork ? 'text-amber-400' : 'text-blue-400'}`}>
                          {entry.subtitle}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {entry.years}
                        </p>
                      </div>
                    </div>

                    {/* Expanded content */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        isExpanded ? 'max-h-40 mt-3 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      {entry.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {entry.description}
                        </p>
                      )}
                      <Link
                        to={linkPath}
                        className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${
                          isWork 
                            ? 'text-amber-400 hover:text-amber-300' 
                            : 'text-blue-400 hover:text-blue-300'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        View details
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
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
