import { useState, useRef, useEffect } from 'react';
import { iconMap } from './Constellation';

const rows: { techs: string[]; speed: string }[] = [
  {
    techs: ['Python', 'Django', 'Django REST Framework', 'FastAPI', 'Git', 'GitLab', 'Postman', 'Socket.IO', 'Linux'],
    speed: '35s',
  },
  {
    techs: ['YOLO', 'OpenCV', 'Pandas', 'Scikit-learn', 'LangChain', 'LangGraph', 'OpenAI', 'Claude Code', 'Hugging Face'],
    speed: '45s',
  },
  {
    techs: ['Azure', 'Docker', 'Kafka', 'Nginx', 'Celery', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'OpenSearch', 'Weaviate'],
    speed: '40s',
  },
];

interface TechItemProps {
  name: string;
  isHovered: boolean;
  isAnyHovered: boolean;
  onHover: (name: string | null) => void;
}

const TechItem = ({ name, isHovered, isAnyHovered, onHover }: TechItemProps) => {
  const icon = iconMap[name];

  return (
    <div
      onMouseEnter={() => onHover(name)}
      onMouseLeave={() => onHover(null)}
      className="flex flex-col items-center cursor-default select-none px-5"
      style={{
        gap: 8,
        opacity: isAnyHovered && !isHovered ? 0.28 : 1,
        transform: isHovered ? 'scale(1.22) translateY(-5px)' : 'scale(1) translateY(0)',
        transition: 'opacity 0.2s ease-out, transform 0.2s ease-out, filter 0.2s ease-out',
        color: 'hsl(var(--primary))',
        filter: isHovered
          ? 'drop-shadow(0 0 10px hsl(187 85% 53%)) drop-shadow(0 0 20px hsl(187 85% 53% / 0.55))'
          : 'drop-shadow(0 0 4px hsl(187 85% 53% / 0.35))',
      }}
    >
      {/* Fixed 32×32 box so every icon occupies the same height */}
      <div
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.55rem',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Fixed-height label so text baseline aligns across all items in the row */}
      <span
        style={{
          fontSize: '0.68rem',
          fontWeight: 500,
          lineHeight: 1,
          height: '0.68rem',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          color: isHovered ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
          transition: 'color 0.2s ease-out',
        }}
      >
        {name}
      </span>
    </div>
  );
};

interface TickerRowProps {
  techs: string[];
  speed: string;
  hoveredTech: string | null;
  onHover: (name: string | null) => void;
}

const TickerRow = ({ techs, speed, hoveredTech, onHover }: TickerRowProps) => (
  <div
    style={{
      overflow: 'hidden',
      maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
    }}
  >
    <div
      className="flex items-center py-3"
      style={{
        width: 'max-content',
        animation: `marquee ${speed} linear infinite`,
        animationPlayState: hoveredTech ? 'paused' : 'running',
      }}
    >
      {[...techs, ...techs].map((name, i) => (
        <TechItem
          key={`${name}-${i}`}
          name={name}
          isHovered={hoveredTech === name}
          isAnyHovered={hoveredTech !== null}
          onHover={onHover}
        />
      ))}
    </div>
  </div>
);

const TechStack = () => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
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
    <section id="skills" ref={sectionRef} className="py-16 relative">
      <div className="container mx-auto px-6">
        <div className="reveal opacity-0 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Skills
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Technologies I navigate daily
          </p>
        </div>

        <div
          className="reveal opacity-0 max-w-4xl mx-auto flex flex-col gap-1"
          style={{ animationDelay: '0.2s' }}
        >
          {rows.map((row, i) => (
            <TickerRow
              key={i}
              techs={row.techs}
              speed={row.speed}
              hoveredTech={hoveredTech}
              onHover={setHoveredTech}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
