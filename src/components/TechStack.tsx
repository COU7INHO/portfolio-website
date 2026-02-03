import { useState, useEffect, useRef, useMemo } from 'react';
import { X } from 'lucide-react';
import Constellation, { constellationData, iconMap } from './Constellation';
import { useIsMobile } from '@/hooks/use-mobile';

// Helper to calculate constellation bounds
const getConstellationBounds = (stars: { x: number; y: number }[]) => {
  const minX = Math.min(...stars.map(s => s.x));
  const maxX = Math.max(...stars.map(s => s.x));
  const minY = Math.min(...stars.map(s => s.y));
  const maxY = Math.max(...stars.map(s => s.y));
  return { 
    minX, maxX, minY, maxY, 
    width: maxX - minX, 
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };
};

const TechStack = () => {
  const [hoveredConstellation, setHoveredConstellation] = useState<string | null>(null);
  const [zoomedConstellation, setZoomedConstellation] = useState<string | null>(null);
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
    // Allow hover constellation highlight even when zoomed (for tooltip display)
    if (!zoomedConstellation) {
      setHoveredConstellation(constellationName);
    }
  };

  // Issue 1 & 2: Direct switching between categories, toggle same category to zoom out
  const handleCategoryClick = (category: string) => {
    if (zoomedConstellation === category) {
      // Clicking same category = zoom out
      setZoomedConstellation(null);
    } else {
      // Clicking different category = zoom directly to it (even if already zoomed)
      setZoomedConstellation(category);
      setHoveredConstellation(null);
    }
  };

  const handleBackdropClick = () => {
    if (zoomedConstellation) {
      setZoomedConstellation(null);
    }
  };

  // Mobile-adjusted positions
  const getMobileData = (): Record<string, { 
    stars: { id: string; name: string; x: number; y: number }[]; 
    connections: [number, number][];
  }> => ({
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

  // Issue 4: Calculate dynamic zoom level based on constellation size
  const getZoomTransform = useMemo(() => {
    if (!zoomedConstellation) return { transform: 'scale(1) translate(0, 0)' };
    
    const constellation = data[zoomedConstellation];
    if (!constellation) return { transform: 'scale(1) translate(0, 0)' };
    
    const bounds = getConstellationBounds(constellation.stars);
    
    // Calculate zoom level that fits the constellation with padding
    const paddingRatio = 0.25; // 25% padding on each side
    const availableWidth = 1 - (paddingRatio * 2);
    const availableHeight = 1 - (paddingRatio * 2);
    
    // Ensure minimum bounds size to avoid division issues
    const boundsWidth = Math.max(bounds.width, 0.1);
    const boundsHeight = Math.max(bounds.height, 0.1);
    
    const scaleX = availableWidth / boundsWidth;
    const scaleY = availableHeight / boundsHeight;
    
    // Use the smaller scale to ensure it fits both dimensions
    // Cap at maximum of 2.5x, minimum of 1.3x
    const zoom = Math.min(Math.max(Math.min(scaleX, scaleY), 1.3), 2.5);
    
    // Calculate translation to center the constellation
    const translateX = (0.5 - bounds.centerX) * dimensions.width;
    const translateY = (0.5 - bounds.centerY) * dimensions.height;
    
    return {
      transform: `scale(${zoom}) translate(${translateX / zoom}px, ${translateY / zoom}px)`,
    };
  }, [zoomedConstellation, dimensions, data]);

  const activeConstellation = zoomedConstellation || hoveredConstellation;

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
          {/* Zoom backdrop - click to close */}
          {zoomedConstellation && (
            <div 
              className="absolute inset-0 z-10 cursor-pointer"
              onClick={handleBackdropClick}
            />
          )}

          {/* Close button when zoomed */}
          {zoomedConstellation && (
            <button
              onClick={() => setZoomedConstellation(null)}
              className="absolute top-2 right-2 z-20 p-2 rounded-full bg-card/80 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300"
              aria-label="Close zoom"
            >
              <X size={18} />
            </button>
          )}

          <div 
            className="overflow-hidden rounded-lg"
            style={{ height: dimensions.height }}
          >
            <svg
              width={dimensions.width}
              height={dimensions.height}
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
              className="overflow-visible"
              style={{
                ...getZoomTransform,
                transformOrigin: 'center center',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
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
                  activeStarId={activeStarId}
                  onStarHover={handleStarHover}
                  containerWidth={dimensions.width}
                  containerHeight={dimensions.height}
                  isZoomed={zoomedConstellation === name}
                  isHidden={zoomedConstellation !== null && zoomedConstellation !== name}
                />
              ))}
            </svg>
          </div>

          {/* Category buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 text-sm">
            {Object.keys(data).map((name) => (
              <button
                key={name}
                onClick={() => handleCategoryClick(name)}
                className={`px-4 py-1.5 rounded-full border transition-all duration-300 ${
                  zoomedConstellation === name
                    ? 'border-primary text-primary bg-primary/20 shadow-lg shadow-primary/20'
                    : activeConstellation === name
                      ? 'border-primary/50 text-primary bg-primary/10'
                      : 'border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                }`}
                onMouseEnter={() => !zoomedConstellation && setHoveredConstellation(name)}
                onMouseLeave={() => !zoomedConstellation && setHoveredConstellation(null)}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Zoom instruction hint */}
          {!zoomedConstellation && (
            <p className="text-center text-xs text-muted-foreground/60 mt-4">
              Click a category to zoom in
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
