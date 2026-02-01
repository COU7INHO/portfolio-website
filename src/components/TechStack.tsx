import { useState, useEffect, useRef } from 'react';
import { 
  SiPython, SiDjango, SiFastapi, SiElasticsearch, SiPandas, 
  SiDocker, SiPostgresql, SiGit, SiRedis, SiLinux
} from 'react-icons/si';
import { Cloud, Box, Cpu, Layers, Workflow } from 'lucide-react';

interface Technology {
  name: string;
  icon: React.ReactNode;
  color: string;
}

const technologies: Technology[] = [
  { name: 'Linux', icon: <SiLinux />, color: '#FCC624' },
  { name: 'Python', icon: <SiPython />, color: '#3776AB' },
  { name: 'Django', icon: <SiDjango />, color: '#092E20' },
  { name: 'FastAPI', icon: <SiFastapi />, color: '#009688' },
  { name: 'Elasticsearch', icon: <SiElasticsearch />, color: '#005571' },
  { name: 'OpenSearch', icon: <Layers />, color: '#005EB8' },
  { name: 'YOLO', icon: <Cpu />, color: '#FF6F00' },
  { name: 'Pandas', icon: <SiPandas />, color: '#150458' },
  { name: 'Azure', icon: <Cloud />, color: '#0078D4' },
  { name: 'Fusion360', icon: <Box />, color: '#FF6D00' },
  { name: 'Docker', icon: <SiDocker />, color: '#2496ED' },
  { name: 'PostgreSQL', icon: <SiPostgresql />, color: '#4169E1' },
  { name: 'Git', icon: <SiGit />, color: '#F05032' },
  { name: 'LangChain', icon: <Workflow />, color: '#1C3C3C' },
  { name: 'Redis', icon: <SiRedis />, color: '#DC382D' },
];

const TechStack = () => {
  const [activeTech, setActiveTech] = useState<Technology | null>(null);
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
    <section id="tech" ref={sectionRef} className="py-16 relative">
      <div className="container mx-auto px-6">
        <div className="reveal opacity-0 text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Tech Stack
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Technologies I work with daily to build intelligent solutions
          </p>
        </div>

        <div className="reveal opacity-0 relative max-w-lg mx-auto" style={{ animationDelay: '0.2s' }}>
          {/* Orbital container */}
          <div className="relative aspect-square">
            {/* Center circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className={`w-28 h-28 md:w-36 md:h-36 rounded-full border-2 border-border bg-card flex flex-col items-center justify-center transition-all duration-300 ${
                  activeTech ? 'border-primary/50 glow-primary-subtle' : ''
                }`}
              >
                {activeTech ? (
                  <>
                    <div className="text-4xl md:text-5xl mb-2" style={{ color: activeTech.color }}>
                      {activeTech.icon}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {activeTech.name}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground text-center px-4">
                    Hover to explore
                  </span>
                )}
              </div>
            </div>

            {/* Orbital ring */}
            <div className="absolute inset-6 md:inset-8 rounded-full border border-border/30" />

            {/* Technology icons */}
            {technologies.map((tech, index) => {
              const angle = (index / technologies.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 44; // percentage from center
              const x = 50 + radius * Math.cos(angle);
              const y = 50 + radius * Math.sin(angle);

              return (
                <button
                  key={tech.name}
                  className="absolute orbit-item w-12 h-12 md:w-14 md:h-14 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-card border border-border flex items-center justify-center text-2xl md:text-3xl hover:border-primary/50 hover:glow-primary-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    color: tech.color,
                  }}
                  onMouseEnter={() => setActiveTech(tech)}
                  onMouseLeave={() => setActiveTech(null)}
                  onFocus={() => setActiveTech(tech)}
                  onBlur={() => setActiveTech(null)}
                  aria-label={tech.name}
                >
                  {tech.icon}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
