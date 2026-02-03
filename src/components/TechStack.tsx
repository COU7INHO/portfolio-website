import { useState, useEffect, useRef } from 'react';
import Constellation, { constellationData } from './Constellation';
import { useIsMobile } from '@/hooks/use-mobile';

const TechStack = () => {
  const [activeConstellation, setActiveConstellation] = useState<string | null>(null);
  const [activeStarId, setActiveStarId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const isMobile = useIsMobile();

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: isMobile ? 600 : Math.min(rect.width * 0.6, 500),
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isMobile]);

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

  const handleStarHover = (starId: string | null, constellationName: string | null) => {
    setActiveStarId(starId);
    setActiveConstellation(constellationName);
  };

  // Mobile-adjusted positions
  const getMobileData = (): Record<string, { stars: { id: string; name: string; x: number; y: number }[]; connections: [number, number][] }> => ({
    'Languages & Frameworks': {
      stars: [
        { id: 'python', name: 'Python', x: 0.2, y: 0.08 },
        { id: 'django', name: 'Django', x: 0.12, y: 0.15 },
        { id: 'fastapi', name: 'FastAPI', x: 0.28, y: 0.15 },
      ],
      connections: [[0, 1], [1, 2], [0, 2]],
    },
    'Data & AI': {
      stars: [
        { id: 'elasticsearch', name: 'Elasticsearch', x: 0.55, y: 0.06 },
        { id: 'opensearch', name: 'OpenSearch', x: 0.68, y: 0.10 },
        { id: 'yolo', name: 'YOLO', x: 0.80, y: 0.08 },
        { id: 'pandas', name: 'Pandas', x: 0.75, y: 0.16 },
        { id: 'langchain', name: 'LangChain', x: 0.62, y: 0.18 },
        { id: 'openai', name: 'OpenAI', x: 0.50, y: 0.16 },
        { id: 'jupyter', name: 'Jupyter', x: 0.45, y: 0.12 },
      ],
      connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
    },
    'Cloud & Infrastructure': {
      stars: [
        { id: 'azure', name: 'Azure', x: 0.15, y: 0.32 },
        { id: 'docker', name: 'Docker', x: 0.28, y: 0.38 },
        { id: 'nginx', name: 'Nginx', x: 0.42, y: 0.32 },
        { id: 'kafka', name: 'Kafka', x: 0.56, y: 0.38 },
        { id: 'linux', name: 'Linux', x: 0.70, y: 0.32 },
      ],
      connections: [[0, 1], [1, 2], [2, 3], [3, 4]],
    },
    'Databases': {
      stars: [
        { id: 'postgresql', name: 'PostgreSQL', x: 0.20, y: 0.55 },
        { id: 'redis', name: 'Redis', x: 0.35, y: 0.60 },
        { id: 'mysql', name: 'MySQL', x: 0.50, y: 0.55 },
        { id: 'mongodb', name: 'MongoDB', x: 0.35, y: 0.68 },
      ],
      connections: [[0, 1], [1, 2], [1, 3], [0, 3]],
    },
    'Tools': {
      stars: [
        { id: 'git', name: 'Git', x: 0.60, y: 0.58 },
        { id: 'gitlab', name: 'GitLab', x: 0.75, y: 0.62 },
        { id: 'postman', name: 'Postman', x: 0.68, y: 0.72 },
        { id: 'fusion360', name: 'Fusion360', x: 0.82, y: 0.70 },
      ],
      connections: [[0, 1], [1, 2], [2, 3], [1, 3]],
    },
  });

  const data = isMobile ? getMobileData() : constellationData;

  return (
    <section id="skills" ref={sectionRef} className="py-16 relative">
      <div className="container mx-auto px-6">
        <div className="reveal opacity-0 text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Skills
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Technologies I navigate daily
          </p>
        </div>

        <div 
          ref={containerRef}
          className="reveal opacity-0 relative max-w-5xl mx-auto"
          style={{ animationDelay: '0.2s' }}
        >
          <svg
            width={dimensions.width}
            height={dimensions.height}
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            className="overflow-visible"
          >
            {/* Background subtle grid effect */}
            <defs>
              <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </radialGradient>
            </defs>

            {Object.entries(data).map(([name, { stars, connections }]) => (
              <Constellation
                key={name}
                name={name}
                stars={stars}
                connections={connections}
                isActive={activeConstellation === name}
                activeStarId={activeConstellation === name ? activeStarId : null}
                onStarHover={handleStarHover}
                containerWidth={dimensions.width}
                containerHeight={dimensions.height}
              />
            ))}
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-muted-foreground">
            {Object.keys(data).map((name) => (
              <button
                key={name}
                className={`px-3 py-1 rounded-full border transition-all duration-300 ${
                  activeConstellation === name
                    ? 'border-primary/50 text-primary bg-primary/10'
                    : 'border-border/50 hover:border-primary/30 hover:text-foreground'
                }`}
                onMouseEnter={() => setActiveConstellation(name)}
                onMouseLeave={() => setActiveConstellation(null)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
