import React from 'react';
import { 
  SiPython, SiDjango, SiFastapi, SiElasticsearch, SiPandas, 
  SiDocker, SiPostgresql, SiGit, SiRedis, SiLinux, SiPostman,
  SiJupyter, SiOpenai, SiGitlab, SiApachekafka, SiNginx, SiMysql, SiMongodb
} from 'react-icons/si';
import { Cloud, Box, Cpu, Layers, Workflow } from 'lucide-react';

interface Star {
  id: string;
  name: string;
  icon?: React.ReactNode;
  x: number;
  y: number;
}

interface ConstellationProps {
  name: string;
  stars: Star[];
  connections: [number, number][];
  isActive: boolean;
  activeStarId: string | null;
  onStarHover: (starId: string | null, constellationName: string | null) => void;
  containerWidth: number;
  containerHeight: number;
  isZoomed: boolean;
  isHidden: boolean;
}

// Icon mapping
export const iconMap: Record<string, React.ReactNode> = {
  'Python': <SiPython />,
  'Django': <SiDjango />,
  'FastAPI': <SiFastapi />,
  'Elasticsearch': <SiElasticsearch />,
  'OpenSearch': <Layers size={16} />,
  'YOLO': <Cpu size={16} />,
  'Pandas': <SiPandas />,
  'LangChain': <Workflow size={16} />,
  'OpenAI': <SiOpenai />,
  'Jupyter': <SiJupyter />,
  'Azure': <Cloud size={16} />,
  'Docker': <SiDocker />,
  'Nginx': <SiNginx />,
  'Kafka': <SiApachekafka />,
  'Linux': <SiLinux />,
  'PostgreSQL': <SiPostgresql />,
  'Redis': <SiRedis />,
  'MySQL': <SiMysql />,
  'MongoDB': <SiMongodb />,
  'Git': <SiGit />,
  'GitLab': <SiGitlab />,
  'Postman': <SiPostman />,
  'Fusion360': <Box size={16} />,
};

const Constellation = ({
  name,
  stars,
  connections,
  isActive,
  activeStarId,
  onStarHover,
  containerWidth,
  containerHeight,
  isZoomed,
  isHidden,
}: ConstellationProps) => {
  // Check if the currently hovered star belongs to this constellation
  const isStarInThisConstellation = (starId: string | null): boolean => {
    if (!starId) return false;
    return stars.some(s => s.id === starId);
  };

  const hasHoveredStar = isStarInThisConstellation(activeStarId);

  // Find which star indices are connected to the hovered star
  const getConnectedStarIds = (hoveredStarId: string | null): Set<string> => {
    if (!hoveredStarId || !isStarInThisConstellation(hoveredStarId)) return new Set();
    const hoveredIndex = stars.findIndex(s => s.id === hoveredStarId);
    if (hoveredIndex === -1) return new Set();
    
    const connectedIds = new Set<string>();
    connections.forEach(([a, b]) => {
      if (a === hoveredIndex) connectedIds.add(stars[b]?.id || '');
      if (b === hoveredIndex) connectedIds.add(stars[a]?.id || '');
    });
    return connectedIds;
  };

  const connectedStarIds = getConnectedStarIds(activeStarId);

  // Check if a connection involves the hovered star
  const isConnectionHighlighted = (startIdx: number, endIdx: number): boolean => {
    if (!activeStarId || !isStarInThisConstellation(activeStarId)) return false;
    const hoveredIndex = stars.findIndex(s => s.id === activeStarId);
    return startIdx === hoveredIndex || endIdx === hoveredIndex;
  };

  return (
    <g 
      className="constellation-group"
      style={{
        opacity: isHidden ? 0 : 1,
        pointerEvents: isHidden ? 'none' : 'auto',
        transition: 'opacity 0.4s ease-out',
      }}
    >
      {/* Connection lines */}
      {connections.map(([startIdx, endIdx], idx) => {
        const startStar = stars[startIdx];
        const endStar = stars[endIdx];
        if (!startStar || !endStar) return null;
        
        const isHighlighted = isConnectionHighlighted(startIdx, endIdx);
        
        return (
          <line
            key={`line-${idx}`}
            x1={startStar.x * containerWidth}
            y1={startStar.y * containerHeight}
            x2={endStar.x * containerWidth}
            y2={endStar.y * containerHeight}
            stroke="hsl(var(--primary))"
            strokeWidth={isHighlighted ? 2 : isActive || isZoomed ? 1.5 : 1}
            strokeOpacity={isHighlighted ? 0.8 : isActive || isZoomed ? 0.5 : 0.1}
            style={{ transition: 'all 0.3s ease-out' }}
          />
        );
      })}

      {/* Stars with icons */}
      {stars.map((star) => {
        const isHovered = activeStarId === star.id;
        const isConnected = connectedStarIds.has(star.id);
        const cx = star.x * containerWidth;
        const cy = star.y * containerHeight;
        const icon = iconMap[star.name];
        
        // Size calculations - larger when zoomed
        const baseIconSize = isZoomed ? 22 : 18;
        const iconSize = isHovered ? baseIconSize + 8 : isActive || isConnected ? baseIconSize + 2 : baseIconSize;
        const glowSize = isHovered ? 35 : isActive || isConnected ? 24 : 14;
        const hitAreaSize = 40; // Larger hit area for easier hovering
        
        return (
          <g key={star.id}>
            {/* Outer glow effect */}
            <circle
              cx={cx}
              cy={cy}
              r={glowSize}
              fill="hsl(var(--primary))"
              opacity={isHovered ? 0.35 : isActive || isConnected ? 0.18 : 0.06}
              style={{ transition: 'all 0.3s ease-out' }}
            />
            
            {/* Invisible hit area for better hover detection */}
            <circle
              cx={cx}
              cy={cy}
              r={hitAreaSize}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => onStarHover(star.id, name)}
              onMouseLeave={() => onStarHover(null, null)}
            />
            
            {/* Icon container */}
            <foreignObject
              x={cx - iconSize / 2}
              y={cy - iconSize / 2}
              width={iconSize}
              height={iconSize}
              className="overflow-visible pointer-events-none"
            >
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  color: 'hsl(var(--primary))',
                  opacity: isHovered ? 1 : isActive || isConnected ? 0.9 : 0.5,
                  transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                  filter: isHovered 
                    ? 'drop-shadow(0 0 10px hsl(187 85% 53%)) drop-shadow(0 0 15px white)' 
                    : isActive || isConnected
                      ? 'drop-shadow(0 0 6px hsl(187 85% 53%))' 
                      : 'drop-shadow(0 0 3px hsl(187 85% 53% / 0.5))',
                  transition: 'all 0.2s ease-out',
                }}
              >
                <div style={{ fontSize: iconSize * 0.85 }}>
                  {icon}
                </div>
              </div>
            </foreignObject>
          </g>
        );
      })}

      {/* Constellation name - show when active or zoomed, but not when hovering a star */}
      {(isActive || isZoomed) && !hasHoveredStar && (
        <text
          x={stars.reduce((acc, s) => acc + s.x, 0) / stars.length * containerWidth}
          y={Math.min(...stars.map(s => s.y)) * containerHeight - 35}
          textAnchor="middle"
          fill="hsl(var(--foreground))"
          fontSize={isZoomed ? 16 : 14}
          fontWeight={600}
          opacity={0.9}
          className="pointer-events-none"
          style={{ 
            textShadow: '0 0 10px hsl(187 85% 53% / 0.5)',
            transition: 'all 0.3s ease-out',
          }}
        >
          {name}
        </text>
      )}
    </g>
  );
};

// Constellation definitions with normalized positions (0-1)
export const constellationData: Record<string, { 
  stars: { id: string; name: string; x: number; y: number; icon?: React.ReactNode }[]; 
  connections: [number, number][];
}> = {
  'Languages & Frameworks': {
    stars: [
      { id: 'python', name: 'Python', x: 0.12, y: 0.25 },
      { id: 'django', name: 'Django', x: 0.08, y: 0.45 },
      { id: 'fastapi', name: 'FastAPI', x: 0.16, y: 0.55 },
    ],
    connections: [[0, 1], [1, 2], [0, 2]],
  },
  'Data & AI': {
    stars: [
      { id: 'elasticsearch', name: 'Elasticsearch', x: 0.28, y: 0.18 },
      { id: 'opensearch', name: 'OpenSearch', x: 0.35, y: 0.22 },
      { id: 'yolo', name: 'YOLO', x: 0.42, y: 0.28 },
      { id: 'pandas', name: 'Pandas', x: 0.38, y: 0.38 },
      { id: 'langchain', name: 'LangChain', x: 0.32, y: 0.48 },
      { id: 'openai', name: 'OpenAI', x: 0.26, y: 0.55 },
      { id: 'jupyter', name: 'Jupyter', x: 0.22, y: 0.65 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
  },
  'Cloud & Infrastructure': {
    stars: [
      { id: 'azure', name: 'Azure', x: 0.52, y: 0.15 },
      { id: 'docker', name: 'Docker', x: 0.58, y: 0.28 },
      { id: 'nginx', name: 'Nginx', x: 0.65, y: 0.18 },
      { id: 'kafka', name: 'Kafka', x: 0.72, y: 0.30 },
      { id: 'linux', name: 'Linux', x: 0.78, y: 0.20 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  'Databases': {
    stars: [
      { id: 'postgresql', name: 'PostgreSQL', x: 0.68, y: 0.50 },
      { id: 'redis', name: 'Redis', x: 0.75, y: 0.58 },
      { id: 'mysql', name: 'MySQL', x: 0.82, y: 0.52 },
      { id: 'mongodb', name: 'MongoDB', x: 0.75, y: 0.68 },
    ],
    connections: [[0, 1], [1, 2], [1, 3], [0, 3]],
  },
  'Tools': {
    stars: [
      { id: 'git', name: 'Git', x: 0.48, y: 0.62 },
      { id: 'gitlab', name: 'GitLab', x: 0.55, y: 0.70 },
      { id: 'postman', name: 'Postman', x: 0.52, y: 0.82 },
      { id: 'fusion360', name: 'Fusion360', x: 0.62, y: 0.78 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [1, 3]],
  },
};

export default Constellation;
