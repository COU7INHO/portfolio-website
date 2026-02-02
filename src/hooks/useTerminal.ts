import { useState, useCallback, useRef } from 'react';
import { fileSystem, projectUrls, socialLinks, FileSystemEntry } from '@/data/terminalFileSystem';

export interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'error' | 'success' | 'directory' | 'json';
  content: string;
  prompt?: string;
}

interface UseTerminalReturn {
  lines: TerminalLine[];
  currentPath: string[];
  prompt: string;
  commandHistory: string[];
  historyIndex: number;
  addLine: (line: Omit<TerminalLine, 'id'>) => void;
  executeCommand: (command: string) => void;
  clearTerminal: () => void;
  navigateHistory: (direction: 'up' | 'down') => string;
  autocomplete: (partial: string) => string;
}

let lineIdCounter = 0;

export const useTerminal = (onExit: () => void): UseTerminalReturn => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const getPrompt = useCallback((path: string[]) => {
    const pathStr = path.length === 0 ? '~' : `~/${path.join('/')}`;
    return `tiago@portfolio:${pathStr}$`;
  }, []);

  const prompt = getPrompt(currentPath);

  const addLine = useCallback((line: Omit<TerminalLine, 'id'>) => {
    setLines(prev => [...prev, { ...line, id: ++lineIdCounter }]);
  }, []);

  const getCurrentDirectory = useCallback((): FileSystemEntry | null => {
    let current = fileSystem;
    for (const dir of currentPath) {
      const found = current.children?.find(
        c => c.type === 'directory' && c.name.toLowerCase() === dir.toLowerCase()
      );
      if (!found) return null;
      current = found;
    }
    return current;
  }, [currentPath]);

  const clearTerminal = useCallback(() => {
    setLines([]);
  }, []);

  const executeCommand = useCallback((input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Add to history
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Add the input line
    addLine({ type: 'input', content: trimmed, prompt });

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        handleHelp();
        break;
      case 'ls':
        handleLs();
        break;
      case 'cd':
        handleCd(args[0] || '');
        break;
      case 'pwd':
        handlePwd();
        break;
      case 'cat':
        handleCat(args.join(' '));
        break;
      case 'clear':
        clearTerminal();
        break;
      case 'exit':
        onExit();
        break;
      case 'github':
        handleGithub();
        break;
      case 'linkedin':
        handleLinkedin();
        break;
      case 'open':
        handleOpen(args.join(' '));
        break;
      case 'rm':
        handleRm();
        break;
      default:
        addLine({
          type: 'error',
          content: `bash: ${command}: command not found\nType 'help' to see available commands.`
        });
    }
  }, [addLine, prompt, currentPath, onExit]);

  const handleHelp = useCallback(() => {
    addLine({
      type: 'output',
      content: `
Available commands:

  Navigation:
    ls                    List directory contents
    cd <dir>              Change directory (about, work, education, skills, projects)
    cd ..                 Go back to parent directory
    pwd                   Print current directory path
    cat <file>            Display file contents

  Actions:
    open <project>        Open project website (use in projects/)
    github                Open GitHub profile
    linkedin              Open LinkedIn profile
    clear                 Clear terminal screen
    help                  Show this help message
    exit                  Exit Dev Mode and return to normal site

  Tips:
    - Use TAB for autocomplete
    - Use ↑↓ arrows to navigate command history
    - Press ESC to exit anytime`
    });
  }, [addLine]);

  const handleLs = useCallback(() => {
    const current = getCurrentDirectory();
    if (!current || !current.children) {
      addLine({ type: 'error', content: 'Cannot read directory' });
      return;
    }

    const dirs = current.children
      .filter(c => c.type === 'directory')
      .map(c => c.name);
    const files = current.children
      .filter(c => c.type === 'file')
      .map(c => c.name);

    const output = [...dirs.map(d => `\x1b[36m${d}\x1b[0m`), ...files].join('  ');
    addLine({ type: 'directory', content: output || '(empty directory)' });
  }, [getCurrentDirectory, addLine]);

  const handleCd = useCallback((target: string) => {
    if (!target || target === '~') {
      setCurrentPath([]);
      return;
    }

    if (target === '..') {
      setCurrentPath(prev => prev.slice(0, -1));
      return;
    }

    // Handle absolute paths from ~
    if (target.startsWith('~/')) {
      const parts = target.slice(2).split('/').filter(Boolean);
      let current = fileSystem;
      const newPath: string[] = [];
      
      for (const part of parts) {
        const found = current.children?.find(
          c => c.type === 'directory' && c.name.toLowerCase() === part.toLowerCase()
        );
        if (!found) {
          addLine({
            type: 'error',
            content: `bash: cd: ${target}: No such directory\nAvailable: about, work, education, skills, projects`
          });
          return;
        }
        newPath.push(found.name);
        current = found;
      }
      setCurrentPath(newPath);
      return;
    }

    const currentDir = getCurrentDirectory();
    if (!currentDir) {
      addLine({ type: 'error', content: 'Current directory not found' });
      return;
    }

    const targetDir = currentDir.children?.find(
      c => c.type === 'directory' && c.name.toLowerCase() === target.toLowerCase()
    );

    if (targetDir) {
      setCurrentPath(prev => [...prev, targetDir.name]);
    } else {
      const available = currentDir.children
        ?.filter(c => c.type === 'directory')
        .map(c => c.name)
        .join(', ') || 'none';
      addLine({
        type: 'error',
        content: `bash: cd: ${target}: No such directory\nAvailable: ${available}`
      });
    }
  }, [getCurrentDirectory, addLine]);

  const handlePwd = useCallback(() => {
    const pathStr = currentPath.length === 0 
      ? '/home/tiago/portfolio' 
      : `/home/tiago/portfolio/${currentPath.join('/')}`;
    addLine({ type: 'output', content: pathStr });
  }, [currentPath, addLine]);

  const handleCat = useCallback((filename: string) => {
    if (!filename) {
      addLine({ type: 'error', content: 'cat: missing file operand' });
      return;
    }

    const currentDir = getCurrentDirectory();
    if (!currentDir) {
      addLine({ type: 'error', content: 'Current directory not found' });
      return;
    }

    const file = currentDir.children?.find(
      c => c.type === 'file' && c.name.toLowerCase() === filename.toLowerCase()
    );

    if (!file) {
      addLine({ type: 'error', content: `cat: ${filename}: No such file or directory` });
      return;
    }

    // Special handling for .skill files
    if (file.name.endsWith('.skill')) {
      addLine({
        type: 'error',
        content: `Permission denied. These skills are proprietary. Contact me for licensing ;)`
      });
      return;
    }

    if (file.content) {
      // Check if it's JSON
      if (file.name.endsWith('.json')) {
        addLine({ type: 'json', content: file.content });
      } else {
        addLine({ type: 'output', content: file.content });
      }
    } else {
      addLine({ type: 'output', content: '(empty file)' });
    }
  }, [getCurrentDirectory, addLine]);

  const handleGithub = useCallback(() => {
    addLine({ type: 'success', content: 'Opening GitHub profile...' });
    window.open(socialLinks.github, '_blank');
  }, [addLine]);

  const handleLinkedin = useCallback(() => {
    addLine({ type: 'success', content: 'Opening LinkedIn profile...' });
    window.open(socialLinks.linkedin, '_blank');
  }, [addLine]);

  const handleOpen = useCallback((projectName: string) => {
    if (!projectName) {
      addLine({ type: 'error', content: 'open: missing project name' });
      return;
    }

    const normalizedName = projectName.toLowerCase().replace(/\.json$/, '');
    const url = projectUrls[normalizedName];

    if (url) {
      addLine({ type: 'success', content: `Opening ${projectName}...` });
      window.open(url, '_blank');
    } else {
      addLine({ type: 'error', content: `Project not found: ${projectName}` });
    }
  }, [addLine]);

  const handleRm = useCallback(() => {
    addLine({
      type: 'error',
      content: `Nice try! But you don't have permission to delete anything here.\nThis portfolio is protected. Maybe try 'cat' instead? :)`
    });
  }, [addLine]);

  const navigateHistory = useCallback((direction: 'up' | 'down'): string => {
    if (commandHistory.length === 0) return '';

    let newIndex: number;
    if (direction === 'up') {
      newIndex = historyIndex === -1 
        ? commandHistory.length - 1 
        : Math.max(0, historyIndex - 1);
    } else {
      newIndex = historyIndex === -1 
        ? -1 
        : Math.min(commandHistory.length - 1, historyIndex + 1);
    }

    setHistoryIndex(newIndex);
    return newIndex === -1 ? '' : commandHistory[newIndex];
  }, [commandHistory, historyIndex]);

  const autocomplete = useCallback((partial: string): string => {
    const parts = partial.split(/\s+/);
    
    // Command autocomplete
    if (parts.length === 1) {
      const commands = ['ls', 'cd', 'pwd', 'cat', 'clear', 'help', 'exit', 'github', 'linkedin', 'open'];
      const match = commands.find(c => c.startsWith(parts[0].toLowerCase()));
      if (match) return match;
    }

    // Argument autocomplete
    if (parts.length === 2) {
      const cmd = parts[0].toLowerCase();
      const arg = parts[1].toLowerCase();
      const currentDir = getCurrentDirectory();

      if (cmd === 'cd') {
        const dirs = currentDir?.children
          ?.filter(c => c.type === 'directory')
          .map(c => c.name) || [];
        const match = dirs.find(d => d.toLowerCase().startsWith(arg));
        if (match) return `${cmd} ${match}`;
      }

      if (cmd === 'cat' || cmd === 'open') {
        const files = currentDir?.children
          ?.filter(c => c.type === 'file')
          .map(c => c.name) || [];
        const match = files.find(f => f.toLowerCase().startsWith(arg));
        if (match) return `${cmd} ${match}`;
      }
    }

    return partial;
  }, [getCurrentDirectory]);

  return {
    lines,
    currentPath,
    prompt,
    commandHistory,
    historyIndex,
    addLine,
    executeCommand,
    clearTerminal,
    navigateHistory,
    autocomplete
  };
};
