import { useState, useEffect, useCallback, useRef } from 'react';

interface PacmanGameProps {
  terminalContent: string;
  onExit: (score: number, ateEverything: boolean) => void;
}

type Direction = 'right' | 'left' | 'up' | 'down';

const PACMAN_CHARS: Record<Direction, string> = {
  right: 'ᗧ',
  left: 'ᗤ',
  up: 'ᗢ',
  down: 'ᗣ',
};

const MOVE_DELAY = 100; // ms between moves

const PacmanGame = ({ terminalContent, onExit }: PacmanGameProps) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [pacmanPos, setPacmanPos] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState<Direction>('right');
  const [score, setScore] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const moveInterval = useRef<NodeJS.Timeout | null>(null);
  const currentDirection = useRef<Direction | null>(null);
  const gridRef = useRef<string[][]>([]);
  const scoreRef = useRef(0);

  // Initialize the grid from terminal content
  useEffect(() => {
    // Add the instruction line to the content
    const fullContent = terminalContent + "\n\nPress ESC to exit";
    
    const lines = fullContent.split('\n');
    const maxWidth = Math.max(...lines.map(l => l.length), 80);
    
    const newGrid: string[][] = lines.map(line => {
      const chars = line.split('');
      while (chars.length < maxWidth) {
        chars.push(' ');
      }
      return chars;
    });
    
    // Ensure minimum height
    while (newGrid.length < 25) {
      newGrid.push(Array(maxWidth).fill(' '));
    }
    
    // Find starting position - at the end of the last line with content
    let startY = Math.max(0, lines.length - 3); // Near "Press ESC to exit"
    let startX = 0;
    
    // Look for the prompt line to start pacman there
    for (let y = lines.length - 1; y >= 0; y--) {
      if (lines[y].includes('$')) {
        startY = y;
        startX = lines[y].indexOf('$') + 2;
        break;
      }
    }
    
    gridRef.current = newGrid;
    setGrid(newGrid);
    setPacmanPos({ x: Math.min(startX, maxWidth - 1), y: startY });
    
    // Count total non-space characters
    let count = 0;
    newGrid.forEach(row => {
      row.forEach(char => {
        if (char !== ' ') count++;
      });
    });
    setTotalChars(count);
  }, [terminalContent]);

  // Sync score ref
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Movement function
  const move = useCallback(() => {
    if (!currentDirection.current || gridRef.current.length === 0) return;

    setPacmanPos(prev => {
      let newX = prev.x;
      let newY = prev.y;
      const grid = gridRef.current;

      switch (currentDirection.current) {
        case 'up':
          newY = prev.y - 1;
          if (newY < 0) newY = grid.length - 1;
          break;
        case 'down':
          newY = prev.y + 1;
          if (newY >= grid.length) newY = 0;
          break;
        case 'left':
          newX = prev.x - 1;
          if (newX < 0) newX = grid[0]?.length - 1 || 0;
          break;
        case 'right':
          newX = prev.x + 1;
          if (newX >= (grid[0]?.length || 0)) newX = 0;
          break;
      }

      return { x: newX, y: newY };
    });
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (moveInterval.current) {
          clearInterval(moveInterval.current);
        }
        onExit(scoreRef.current, false);
        return;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        
        const newDir: Direction = 
          e.key === 'ArrowUp' ? 'up' :
          e.key === 'ArrowDown' ? 'down' :
          e.key === 'ArrowLeft' ? 'left' : 'right';
        
        const wasMoving = currentDirection.current !== null;
        currentDirection.current = newDir;
        setDirection(newDir);
        
        // Start movement interval if not already moving
        if (!wasMoving) {
          move(); // Move immediately on first press
          moveInterval.current = setInterval(move, MOVE_DELAY);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const releasedDir: Direction = 
          e.key === 'ArrowUp' ? 'up' :
          e.key === 'ArrowDown' ? 'down' :
          e.key === 'ArrowLeft' ? 'left' : 'right';
        
        if (currentDirection.current === releasedDir) {
          currentDirection.current = null;
          if (moveInterval.current) {
            clearInterval(moveInterval.current);
            moveInterval.current = null;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      if (moveInterval.current) {
        clearInterval(moveInterval.current);
      }
    };
  }, [move, onExit]);

  // Eat character at current position
  useEffect(() => {
    if (gridRef.current.length === 0) return;

    const char = gridRef.current[pacmanPos.y]?.[pacmanPos.x];
    if (char && char !== ' ') {
      // Update grid ref
      gridRef.current[pacmanPos.y][pacmanPos.x] = ' ';
      // Update state for re-render
      setGrid(prev => {
        const newGrid = prev.map(row => [...row]);
        if (newGrid[pacmanPos.y]) {
          newGrid[pacmanPos.y][pacmanPos.x] = ' ';
        }
        return newGrid;
      });
      setScore(s => s + 1);
    }
  }, [pacmanPos]);

  // Check if all characters are eaten
  useEffect(() => {
    if (totalChars > 0 && score >= totalChars) {
      if (moveInterval.current) {
        clearInterval(moveInterval.current);
      }
      onExit(score, true);
    }
  }, [score, totalChars, onExit]);

  if (grid.length === 0) return null;

  return (
    <div className="h-full flex flex-col relative">
      {/* Score overlay */}
      <div className="absolute top-2 right-4 text-yellow-400 font-bold text-sm z-10 bg-[#0d0d0d]/80 px-2 py-1 rounded">
        Score: {score}
      </div>

      {/* Terminal content with pacman overlay */}
      <div className="flex-1 overflow-auto font-mono text-sm leading-tight">
        {grid.map((row, y) => (
          <div key={y} className="whitespace-pre h-[1.25em]">
            {row.map((char, x) => {
              const isPacman = x === pacmanPos.x && y === pacmanPos.y;
              
              if (isPacman) {
                return (
                  <span key={x} className="text-yellow-400 font-bold inline-block w-[1ch]">
                    {PACMAN_CHARS[direction]}
                  </span>
                );
              }
              
              // Color certain characters like the original terminal
              const isPromptChar = char === '$' || char === ':' || char === '~';
              const isBracket = char === '[' || char === ']' || char === '{' || char === '}';
              
              return (
                <span 
                  key={x} 
                  className={`inline-block w-[1ch] ${
                    isPromptChar ? 'text-primary' :
                    isBracket ? 'text-cyan-400' :
                    char === ' ' ? '' : 'text-secondary-foreground'
                  }`}
                >
                  {char}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PacmanGame;
