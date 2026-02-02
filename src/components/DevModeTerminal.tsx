import { useState, useEffect, useRef, useCallback } from 'react';
import { useTerminal, TerminalLine } from '@/hooks/useTerminal';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DevModeTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

const asciiLogo = `
████████╗ ██████╗
╚══██╔══╝██╔════╝
   ██║   ██║        Tiago Coutinho
   ██║   ██║        AI Data Engineer
   ██║   ╚██████╗   Portfolio Terminal v1.0
   ╚═╝    ╚═════╝
`;

const bootSequence = [
  { text: 'Initializing portfolio...', progress: 10 },
  { text: 'Loading experience... done', progress: 40 },
  { text: 'Loading skills... done', progress: 60 },
  { text: 'Loading projects... done', progress: 80 },
  { text: 'Starting terminal...', progress: 100 },
];

const ProgressBar = ({ progress }: { progress: number }) => {
  const filled = Math.floor(progress / 10);
  const empty = 10 - filled;
  return (
    <span className="text-primary">
      [{'\u25A0'.repeat(filled)}{'\u25A1'.repeat(empty)}]
    </span>
  );
};

const DevModeTerminal = ({ isOpen, onClose }: DevModeTerminalProps) => {
  const [bootPhase, setBootPhase] = useState<'booting' | 'welcome' | 'ready'>('booting');
  const [bootStep, setBootStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { lines, prompt, executeCommand, navigateHistory, autocomplete } = useTerminal(onClose);

  // Boot sequence
  useEffect(() => {
    if (!isOpen) {
      setBootPhase('booting');
      setBootStep(0);
      return;
    }

    if (bootPhase === 'booting') {
      const timer = setInterval(() => {
        setBootStep(prev => {
          if (prev >= bootSequence.length - 1) {
            clearInterval(timer);
            setTimeout(() => setBootPhase('welcome'), 500);
            return prev;
          }
          return prev + 1;
        });
      }, 600);
      return () => clearInterval(timer);
    }

    if (bootPhase === 'welcome') {
      const timer = setTimeout(() => setBootPhase('ready'), 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, bootPhase]);

  // Focus input and scroll to bottom
  useEffect(() => {
    if (bootPhase === 'ready' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [bootPhase, lines]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, bootPhase]);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputValue);
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = navigateHistory('up');
      setInputValue(prev);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = navigateHistory('down');
      setInputValue(next);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const completed = autocomplete(inputValue);
      setInputValue(completed);
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [inputValue, executeCommand, navigateHistory, autocomplete, onClose]);

  // Global escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Keep focus on terminal
  const handleContainerClick = () => {
    if (bootPhase === 'ready') {
      inputRef.current?.focus();
    }
  };

  const renderLine = (line: TerminalLine) => {
    switch (line.type) {
      case 'input':
        return (
          <div key={line.id} className="flex gap-2">
            <span className="text-primary shrink-0">{line.prompt}</span>
            <span className="text-foreground">{line.content}</span>
          </div>
        );
      case 'output':
        return (
          <div key={line.id} className="text-secondary-foreground whitespace-pre-wrap">
            {line.content}
          </div>
        );
      case 'error':
        return (
          <div key={line.id} className="text-red-400 whitespace-pre-wrap">
            {line.content}
          </div>
        );
      case 'success':
        return (
          <div key={line.id} className="text-green-400 whitespace-pre-wrap">
            {line.content}
          </div>
        );
      case 'directory':
        return (
          <div key={line.id} className="whitespace-pre-wrap">
            {line.content.split('  ').map((item, i) => {
              const isCyan = item.includes('\x1b[36m');
              const cleanItem = item.replace(/\x1b\[\d+m/g, '');
              return (
                <span key={i} className={`${isCyan ? 'text-cyan-400' : 'text-foreground'} mr-4`}>
                  {cleanItem}
                </span>
              );
            })}
          </div>
        );
      case 'json':
        return (
          <div key={line.id} className="font-mono text-sm">
            <JsonRenderer json={line.content} />
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#0d0d0d] font-mono text-sm overflow-hidden transition-opacity duration-300"
      onClick={handleContainerClick}
    >
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="h-full w-full" style={{ 
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' 
        }} />
      </div>

      <div className="h-full flex flex-col p-4 md:p-6 relative">
        {/* Terminal header bar */}
        <div className="flex items-center gap-2 pb-3 border-b border-border/30 mb-4">
          <div className="flex gap-1.5">
            <button 
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
              aria-label="Close terminal"
            />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-muted-foreground text-xs ml-3">tiago@portfolio — bash</span>
        </div>

        {/* Terminal content */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
        >
          {bootPhase === 'booting' && (
            <div className="space-y-2">
              {bootSequence.slice(0, bootStep + 1).map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <ProgressBar progress={step.progress} />
                  <span className="text-muted-foreground">{step.text}</span>
                </div>
              ))}
            </div>
          )}

          {bootPhase === 'welcome' && (
            <div className="text-primary animate-fade-in">
              <pre className="text-xs md:text-sm leading-tight">{asciiLogo}</pre>
              <div className="mt-4 space-y-1 text-secondary-foreground">
                <p>Welcome! Type '<span className="text-primary">help</span>' to see available commands.</p>
                <p>Press <span className="text-primary">ESC</span> or type '<span className="text-primary">exit</span>' to return to the normal site.</p>
              </div>
            </div>
          )}

          {bootPhase === 'ready' && (
            <div className="space-y-1">
              {/* Welcome message */}
              <pre className="text-primary text-xs md:text-sm leading-tight mb-4">{asciiLogo}</pre>
              <div className="mb-4 space-y-1 text-secondary-foreground">
                <p>Welcome! Type '<span className="text-primary">help</span>' to see available commands.</p>
                <p>Press <span className="text-primary">ESC</span> or type '<span className="text-primary">exit</span>' to return to the normal site.</p>
              </div>

              {/* Command history */}
              {lines.map(renderLine)}

              {/* Current input */}
              <div className="flex gap-2 items-center">
                <span className="text-primary shrink-0">{prompt}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none text-foreground caret-primary"
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                <span className="animate-pulse text-primary">▋</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// JSON syntax highlighting component
const JsonRenderer = ({ json }: { json: string }) => {
  try {
    const parsed = JSON.parse(json);
    return <pre className="whitespace-pre-wrap">{formatJson(parsed, 0)}</pre>;
  } catch {
    return <pre className="text-foreground whitespace-pre-wrap">{json}</pre>;
  }
};

const formatJson = (obj: any, indent: number): React.ReactNode[] => {
  const spaces = '  '.repeat(indent);
  const result: React.ReactNode[] = [];
  
  if (Array.isArray(obj)) {
    result.push(<span key="open" className="text-foreground">[</span>);
    result.push('\n');
    obj.forEach((item, i) => {
      result.push(spaces + '  ');
      if (typeof item === 'string') {
        result.push(<span key={`item-${i}`} className="text-yellow-400">"{item}"</span>);
      } else {
        result.push(...formatJson(item, indent + 1));
      }
      if (i < obj.length - 1) result.push(',');
      result.push('\n');
    });
    result.push(spaces);
    result.push(<span key="close" className="text-foreground">]</span>);
  } else if (typeof obj === 'object' && obj !== null) {
    result.push(<span key="open" className="text-foreground">{'{'}</span>);
    result.push('\n');
    const keys = Object.keys(obj);
    keys.forEach((key, i) => {
      result.push(spaces + '  ');
      result.push(<span key={`key-${key}`} className="text-cyan-400">"{key}"</span>);
      result.push(<span className="text-foreground">: </span>);
      const value = obj[key];
      if (typeof value === 'string') {
        result.push(<span key={`val-${key}`} className="text-yellow-400">"{value}"</span>);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        result.push(<span key={`val-${key}`} className="text-purple-400">{String(value)}</span>);
      } else if (Array.isArray(value) || typeof value === 'object') {
        result.push(...formatJson(value, indent + 1));
      }
      if (i < keys.length - 1) result.push(',');
      result.push('\n');
    });
    result.push(spaces);
    result.push(<span key="close" className="text-foreground">{'}'}</span>);
  }
  
  return result;
};

export default DevModeTerminal;
