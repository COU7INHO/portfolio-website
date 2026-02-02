import { useState, useEffect, useRef } from 'react';
import { 
  SiPython, SiDjango, SiFastapi, SiElasticsearch, SiPandas, 
  SiDocker, SiPostgresql, SiGit, SiRedis, SiLinux, SiPostman,
  SiJupyter, SiOpenai, SiGitlab, SiApachekafka, SiNginx, SiMysql, SiMongodb
} from 'react-icons/si';
import { Cloud, Box, Cpu, Layers, Workflow } from 'lucide-react';

interface Technology {
  name: string;
  icon: React.ReactNode;
  color: string;
}

// Outer ring technologies (larger radius)
const outerRingTech: Technology[] = [
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

// Inner ring technologies (smaller radius)
const innerRingTech: Technology[] = [
  { name: 'Postman', icon: <SiPostman />, color: '#FF6C37' },
  { name: 'Jupyter', icon: <SiJupyter />, color: '#F37626' },
  { name: 'OpenAI', icon: <SiOpenai />, color: '#412991' },
  { name: 'GitLab', icon: <SiGitlab />, color: '#FC6D26' },
  { name: 'Kafka', icon: <SiApachekafka />, color: '#231F20' },
  { name: 'Nginx', icon: <SiNginx />, color: '#009639' },
  { name: 'MySQL', icon: <SiMysql />, color: '#4479A1' },
  { name: 'MongoDB', icon: <SiMongodb />, color: '#47A248' },
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

  // Ellipse radii (percentages from center)
  const outerRadiusX = 46; // horizontal radius for outer ring
  const outerRadiusY = 42; // vertical radius for outer ring
  const innerRadiusX = 28; // horizontal radius for inner ring
  const innerRadiusY = 24; // vertical radius for inner ring

  return (
    <section id="skills" ref={sectionRef} className="py-16 relative">
      <div className="container mx-auto px-6">
        <div className="reveal opacity-0 text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Skills
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Technologies I work with daily to build intelligent solutions
          </p>
        </div>

        <div className="reveal opacity-0 relative max-w-4xl mx-auto" style={{ animationDelay: '0.2s' }}>
          {/* Elliptical orbital container - wider than tall */}
          <div className="relative w-full" style={{ paddingBottom: '55%' }}>
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

            {/* Inner elliptical ring */}
            <div 
              className="absolute border border-border/30 rounded-[50%]"
              style={{
                left: `${50 - innerRadiusX}%`,
                right: `${50 - innerRadiusX}%`,
                top: `${50 - innerRadiusY}%`,
                bottom: `${50 - innerRadiusY}%`,
              }}
            />
            
            {/* Outer elliptical ring */}
            <div 
              className="absolute border border-border/30 rounded-[50%]"
              style={{
                left: `${50 - outerRadiusX}%`,
                right: `${50 - outerRadiusX}%`,
                top: `${50 - outerRadiusY}%`,
                bottom: `${50 - outerRadiusY}%`,
              }}
            />

            {/* Inner ring technology icons */}
            {innerRingTech.map((tech, index) => {
              const angle = (index / innerRingTech.length) * 2 * Math.PI - Math.PI / 2;
              const x = 50 + innerRadiusX * Math.cos(angle);
              const y = 50 + innerRadiusY * Math.sin(angle);

              return (
                <button
                  key={tech.name}
                  className="absolute orbit-item w-11 h-11 md:w-14 md:h-14 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-card border border-border flex items-center justify-center text-xl md:text-3xl hover:border-primary/50 hover:glow-primary-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
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

            {/* Outer ring technology icons */}
            {outerRingTech.map((tech, index) => {
              const angle = (index / outerRingTech.length) * 2 * Math.PI - Math.PI / 2;
              const x = 50 + outerRadiusX * Math.cos(angle);
              const y = 50 + outerRadiusY * Math.sin(angle);

              return (
                <button
                  key={tech.name}
                  className="absolute orbit-item w-12 h-12 md:w-16 md:h-16 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-card border border-border flex items-center justify-center text-2xl md:text-4xl hover:border-primary/50 hover:glow-primary-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
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
