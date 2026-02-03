import { useState, useMemo } from 'react';
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
}

const Constellation = ({
  name,
  stars,
  connections,
  isActive,
  activeStarId,
  onStarHover,
  containerWidth,
  containerHeight,
}: ConstellationProps) => {
  return (
    <g className="constellation-group">
      {/* Connection lines */}
      {connections.map(([startIdx, endIdx], idx) => {
        const startStar = stars[startIdx];
        const endStar = stars[endIdx];
        if (!startStar || !endStar) return null;
        
        return (
          <line
            key={`line-${idx}`}
            x1={startStar.x * containerWidth}
            y1={startStar.y * containerHeight}
            x2={endStar.x * containerWidth}
            y2={endStar.y * containerHeight}
            stroke="hsl(var(--primary))"
            strokeWidth={isActive ? 1.5 : 1}
            strokeOpacity={isActive ? 0.6 : 0.1}
            className="transition-all duration-500"
          />
        );
      })}

      {/* Stars */}
      {stars.map((star) => {
        const isHovered = activeStarId === star.id;
        const cx = star.x * containerWidth;
        const cy = star.y * containerHeight;
        
        return (
          <g key={star.id}>
            {/* Glow effect */}
            <circle
              cx={cx}
              cy={cy}
              r={isHovered ? 20 : isActive ? 12 : 8}
              fill="hsl(var(--primary))"
              opacity={isHovered ? 0.3 : isActive ? 0.15 : 0.05}
              className="transition-all duration-300"
            />
            
            {/* Main star */}
            <circle
              cx={cx}
              cy={cy}
              r={isHovered ? 6 : isActive ? 4 : 3}
              fill={isActive ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.4)"}
              className="transition-all duration-300 cursor-pointer"
              style={{
                filter: isHovered 
                  ? 'drop-shadow(0 0 8px hsl(var(--primary))) drop-shadow(0 0 15px white)' 
                  : isActive 
                    ? 'drop-shadow(0 0 4px hsl(var(--primary)))' 
                    : 'none',
              }}
              onMouseEnter={() => onStarHover(star.id, name)}
              onMouseLeave={() => onStarHover(null, null)}
            />
            
            {/* Twinkle animation overlay */}
            <circle
              cx={cx}
              cy={cy}
              r={isActive ? 4 : 3}
              fill="white"
              opacity={0}
              className="animate-twinkle"
              style={{ animationDelay: `${Math.random() * 3}s` }}
            />

            {/* Tooltip */}
            {isHovered && (
              <g>
                <rect
                  x={cx - 50}
                  y={cy - 35}
                  width={100}
                  height={24}
                  rx={4}
                  fill="hsl(var(--card))"
                  stroke="hsl(var(--border))"
                  strokeWidth={1}
                />
                <text
                  x={cx}
                  y={cy - 19}
                  textAnchor="middle"
                  fill="hsl(var(--foreground))"
                  fontSize={12}
                  fontWeight={500}
                  className="pointer-events-none"
                >
                  {star.name}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Constellation name */}
      {isActive && (
        <text
          x={stars.reduce((acc, s) => acc + s.x, 0) / stars.length * containerWidth}
          y={Math.min(...stars.map(s => s.y)) * containerHeight - 25}
          textAnchor="middle"
          fill="hsl(var(--foreground))"
          fontSize={14}
          fontWeight={600}
          opacity={0.9}
          className="transition-opacity duration-300"
          style={{ textShadow: '0 0 10px hsl(var(--primary) / 0.5)' }}
        >
          {name}
        </text>
      )}
    </g>
  );
};

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  'Python': <SiPython />,
  'Django': <SiDjango />,
  'FastAPI': <SiFastapi />,
  'Elasticsearch': <SiElasticsearch />,
  'OpenSearch': <Layers />,
  'YOLO': <Cpu />,
  'Pandas': <SiPandas />,
  'LangChain': <Workflow />,
  'OpenAI': <SiOpenai />,
  'Jupyter': <SiJupyter />,
  'Azure': <Cloud />,
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
  'Fusion360': <Box />,
};

// Constellation definitions with normalized positions (0-1)
export const constellationData = {
  'Languages & Frameworks': {
    // Orion-like shape
    stars: [
      { id: 'python', name: 'Python', x: 0.12, y: 0.25 },
      { id: 'django', name: 'Django', x: 0.08, y: 0.45 },
      { id: 'fastapi', name: 'FastAPI', x: 0.16, y: 0.55 },
    ],
    connections: [[0, 1], [1, 2], [0, 2]] as [number, number][],
  },
  'Data & AI': {
    // Big Dipper shape
    stars: [
      { id: 'elasticsearch', name: 'Elasticsearch', x: 0.28, y: 0.18 },
      { id: 'opensearch', name: 'OpenSearch', x: 0.35, y: 0.22 },
      { id: 'yolo', name: 'YOLO', x: 0.42, y: 0.28 },
      { id: 'pandas', name: 'Pandas', x: 0.38, y: 0.38 },
      { id: 'langchain', name: 'LangChain', x: 0.32, y: 0.48 },
      { id: 'openai', name: 'OpenAI', x: 0.26, y: 0.55 },
      { id: 'jupyter', name: 'Jupyter', x: 0.22, y: 0.65 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]] as [number, number][],
  },
  'Cloud & Infrastructure': {
    // Cassiopeia W shape
    stars: [
      { id: 'azure', name: 'Azure', x: 0.52, y: 0.15 },
      { id: 'docker', name: 'Docker', x: 0.58, y: 0.28 },
      { id: 'nginx', name: 'Nginx', x: 0.65, y: 0.18 },
      { id: 'kafka', name: 'Kafka', x: 0.72, y: 0.30 },
      { id: 'linux', name: 'Linux', x: 0.78, y: 0.20 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4]] as [number, number][],
  },
  'Databases': {
    // Southern Cross shape
    stars: [
      { id: 'postgresql', name: 'PostgreSQL', x: 0.68, y: 0.50 },
      { id: 'redis', name: 'Redis', x: 0.75, y: 0.58 },
      { id: 'mysql', name: 'MySQL', x: 0.82, y: 0.52 },
      { id: 'mongodb', name: 'MongoDB', x: 0.75, y: 0.68 },
    ],
    connections: [[0, 1], [1, 2], [1, 3], [0, 3]] as [number, number][],
  },
  'Tools': {
    // Leo-like shape
    stars: [
      { id: 'git', name: 'Git', x: 0.48, y: 0.62 },
      { id: 'gitlab', name: 'GitLab', x: 0.55, y: 0.70 },
      { id: 'postman', name: 'Postman', x: 0.52, y: 0.82 },
      { id: 'fusion360', name: 'Fusion360', x: 0.62, y: 0.78 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [1, 3]] as [number, number][],
  },
};

// Add icons to stars
Object.keys(constellationData).forEach((key) => {
  const constellation = constellationData[key as keyof typeof constellationData];
  constellation.stars = constellation.stars.map((star) => ({
    ...star,
    icon: iconMap[star.name] || null,
  }));
});

export default Constellation;
