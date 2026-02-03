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

const MOVE_DELAY = 120; // ms between moves

const PacmanGame = ({ terminalContent, onExit }: PacmanGameProps) => {
  // Parse terminal content into a 2D grid
  const initialGrid = useRef<string[][]>([]);
  const [grid, setGrid] = useState<string[][]>([]);
  const [pacmanPos, setPacmanPos] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState<Direction>('right');
  const [score, setScore] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const moveTimeout = useRef<NodeJS.Timeout | null>(null);
  const isMoving = useRef(false);
  const currentDirection = useRef<Direction | null>(null);

  // Initialize the grid from terminal content
  useEffect(() => {
    const instructionLine = "Press ESC to exit";
    const fullContent = instructionLine + "\n\n" + terminalContent;
    
    const lines = fullContent.split('\n');
    const maxWidth = Math.max(...lines.map(l => l.length), 60);
    
    const newGrid: string[][] = lines.map(line => {
      const chars = line.split('');
      // Pad to max width
      while (chars.length < maxWidth) {
        chars.push(' ');
      }
      return chars;
    });
    
    // Ensure at least some rows
    while (newGrid.length < 20) {
      newGrid.push(Array(maxWidth).fill(' '));
    }
    
    initialGrid.current = newGrid.map(row => [...row]);
    setGrid(newGrid);
    
    // Count total non-space characters
    let count = 0;
    newGrid.forEach(row => {
      row.forEach(char => {
        if (char !== ' ') count++;
      });
    });
    setTotalChars(count);
  }, [terminalContent]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (moveTimeout.current) {
          clearTimeout(moveTimeout.current);
        }
        onExit(score, false);
        return;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        
        const newDir: Direction = 
          e.key === 'ArrowUp' ? 'up' :
          e.key === 'ArrowDown' ? 'down' :
          e.key === 'ArrowLeft' ? 'left' : 'right';
        
        currentDirection.current = newDir;
        setDirection(newDir);
        
        if (!isMoving.current) {
          isMoving.current = true;
          movePacman(newDir);
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
          isMoving.current = false;
          if (moveTimeout.current) {
            clearTimeout(moveTimeout.current);
            moveTimeout.current = null;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current);
      }
    };
  }, [score, onExit]);

  const movePacman = useCallback((dir: Direction) => {
    if (!currentDirection.current) return;

    setPacmanPos(prev => {
      let newX = prev.x;
      let newY = prev.y;

      switch (dir) {
        case 'up':
          newY = prev.y - 1;
          break;
        case 'down':
          newY = prev.y + 1;
          break;
        case 'left':
          newX = prev.x - 1;
          break;
        case 'right':
          newX = prev.x + 1;
          break;
      }

      // Wrap around edges
      if (grid.length > 0) {
        if (newY < 0) newY = grid.length - 1;
        if (newY >= grid.length) newY = 0;
        if (grid[0]) {
          if (newX < 0) newX = grid[0].length - 1;
          if (newX >= grid[0].length) newX = 0;
        }
      }

      return { x: newX, y: newY };
    });

    // Schedule next move
    moveTimeout.current = setTimeout(() => {
      if (currentDirection.current) {
        movePacman(currentDirection.current);
      }
    }, MOVE_DELAY);
  }, [grid]);

  // Eat character at current position
  useEffect(() => {
    if (grid.length === 0) return;

    setGrid(prev => {
      const newGrid = prev.map(row => [...row]);
      if (newGrid[pacmanPos.y] && newGrid[pacmanPos.y][pacmanPos.x]) {
        const char = newGrid[pacmanPos.y][pacmanPos.x];
        if (char !== ' ') {
          newGrid[pacmanPos.y][pacmanPos.x] = ' ';
          setScore(s => s + 1);
        }
      }
      return newGrid;
    });
  }, [pacmanPos]);

  // Check if all characters are eaten
  useEffect(() => {
    if (totalChars > 0 && score >= totalChars) {
      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current);
      }
      onExit(score, true);
    }
  }, [score, totalChars, onExit]);

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] overflow-hidden">
      {/* Score header */}
      <div className="px-4 py-2 text-yellow-400 font-bold border-b border-border/30">
        Score: {score}
      </div>

      {/* Game area */}
      <div className="flex-1 overflow-auto px-4 py-2 font-mono text-sm leading-tight">
        {grid.map((row, y) => (
          <div key={y} className="whitespace-pre">
            {row.map((char, x) => {
              const isPacman = x === pacmanPos.x && y === pacmanPos.y;
              
              if (isPacman) {
                return (
                  <span key={x} className="text-yellow-400 font-bold">
                    {PACMAN_CHARS[direction]}
                  </span>
                );
              }
              
              return (
                <span key={x} className="text-muted-foreground">
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
