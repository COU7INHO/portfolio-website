import { useState, useEffect, useRef, useMemo } from 'react';
import { X } from 'lucide-react';
import Constellation, { constellationData } from './Constellation';
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
    if (!zoomedConstellation) {
      setHoveredConstellation(constellationName);
    }
  };

  // Fix #1 & #2: Direct switching between categories, toggle same category to zoom out
  const handleCategoryClick = (category: string) => {
    if (zoomedConstellation === category) {
      // Clicking same category = zoom out
      setZoomedConstellation(null);
    } else {
      // Clicking different category = zoom directly to it
      setZoomedConstellation(category);
      setHoveredConstellation(null);
      setActiveStarId(null);
    }
  };

  const handleSvgClick = (e: React.MouseEvent) => {
    // Only zoom out if clicking on the SVG background, not on stars
    if (e.target === e.currentTarget && zoomedConstellation) {
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

  // Fix #4: Calculate dynamic zoom level based on constellation size
  const getZoomTransform = useMemo(() => {
    if (!zoomedConstellation) return { transform: 'scale(1) translate(0px, 0px)' };
    
    const constellation = data[zoomedConstellation];
    if (!constellation) return { transform: 'scale(1) translate(0px, 0px)' };
    
    const bounds = getConstellationBounds(constellation.stars);
    
    // Calculate zoom level that fits the constellation with generous padding
    // We want at least 20% padding on each side
    const paddingRatio = 0.20;
    const availableWidth = 1 - (paddingRatio * 2);
    const availableHeight = 1 - (paddingRatio * 2);
    
    // Ensure minimum bounds size to avoid division issues
    const boundsWidth = Math.max(bounds.width, 0.08);
    const boundsHeight = Math.max(bounds.height, 0.08);
    
    const scaleX = availableWidth / boundsWidth;
    const scaleY = availableHeight / boundsHeight;
    
    // Use the smaller scale to ensure it fits both dimensions
    // Cap at maximum of 2.0x (reduced from 2.5), minimum of 1.2x
    const zoom = Math.min(Math.max(Math.min(scaleX, scaleY), 1.2), 2.0);
    
    // Calculate translation to center the constellation
    // The translation needs to account for the scale
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
          {/* Close button when zoomed */}
          {zoomedConstellation && (
            <button
              onClick={() => setZoomedConstellation(null)}
              className="absolute top-2 right-2 z-30 p-2 rounded-full bg-card/90 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300"
              aria-label="Close zoom"
            >
              <X size={18} />
            </button>
          )}

          {/* SVG Container - removed overflow:hidden to allow tooltips */}
          <div 
            className="relative rounded-lg"
            style={{ height: dimensions.height }}
          >
            <svg
              width={dimensions.width}
              height={dimensions.height}
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
              className="overflow-visible cursor-pointer"
              onClick={handleSvgClick}
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

              {/* Invisible background rect for click detection */}
              <rect
                x={0}
                y={0}
                width={dimensions.width}
                height={dimensions.height}
                fill="transparent"
              />

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

            {/* Tooltip overlay - rendered outside SVG to avoid clipping */}
            {activeStarId && (
              <TooltipOverlay
                starId={activeStarId}
                data={data}
                dimensions={dimensions}
                zoomTransform={getZoomTransform.transform}
                isZoomed={!!zoomedConstellation}
              />
            )}
          </div>

          {/* Category buttons - z-index ensures they're clickable */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 text-sm relative z-20">
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

// Separate tooltip component rendered outside SVG
interface TooltipOverlayProps {
  starId: string;
  data: Record<string, { stars: { id: string; name: string; x: number; y: number }[]; connections: [number, number][] }>;
  dimensions: { width: number; height: number };
  zoomTransform: string;
  isZoomed: boolean;
}

const TooltipOverlay = ({ starId, data, dimensions, zoomTransform, isZoomed }: TooltipOverlayProps) => {
  // Find the star across all constellations
  let starData: { name: string; x: number; y: number } | null = null;
  
  for (const constellation of Object.values(data)) {
    const found = constellation.stars.find(s => s.id === starId);
    if (found) {
      starData = found;
      break;
    }
  }
  
  if (!starData) return null;
  
  // Parse transform to get scale and translate values
  const scaleMatch = zoomTransform.match(/scale\(([^)]+)\)/);
  const translateMatch = zoomTransform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
  
  const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
  const translateX = translateMatch ? parseFloat(translateMatch[1]) : 0;
  const translateY = translateMatch ? parseFloat(translateMatch[2]) : 0;
  
  // Calculate position with transform applied
  const baseX = starData.x * dimensions.width;
  const baseY = starData.y * dimensions.height;
  
  // Apply the same transform as the SVG
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  
  const transformedX = centerX + (baseX - centerX + translateX) * scale;
  const transformedY = centerY + (baseY - centerY + translateY) * scale;
  
  // Position tooltip below the star
  const tooltipY = transformedY + (isZoomed ? 35 : 25);
  
  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{
        left: transformedX,
        top: tooltipY,
        transform: 'translateX(-50%)',
      }}
    >
      <div
        className="px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap"
        style={{
          background: 'hsl(var(--card) / 0.95)',
          border: '1px solid hsl(var(--primary) / 0.4)',
          color: 'hsl(var(--foreground))',
          boxShadow: '0 4px 12px hsl(var(--background) / 0.8)',
        }}
      >
        {starData.name}
      </div>
    </div>
  );
};

export default TechStack;
