import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/useChat';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    input,
    setInput,
    isStreaming,
    error,
    sendMessage,
  } = useChat();

  // Hint popup — show once every 10 minutes
  useEffect(() => {
    const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

    const maybeShowHint = () => {
      if (isOpen) return;
      const lastShown = localStorage.getItem('chatHintLastShown');
      if (lastShown && Date.now() - Number(lastShown) < COOLDOWN_MS) return;
      setShowHint(true);
      localStorage.setItem('chatHintLastShown', String(Date.now()));
    };

    const timer = setTimeout(maybeShowHint, 5000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openPanel = () => {
    setShowHint(false);
    setIsOpen(true);
  };

  return (
    <>
      {/* Speech bubble popup */}
      {showHint && !isOpen && (
        <div className="fixed bottom-[5.5rem] right-[5.5rem] z-50 animate-fade-up">
          <div className="relative bg-primary text-primary-foreground rounded-2xl px-5 py-3 shadow-xl shadow-primary/25 cursor-pointer group"
               onClick={openPanel}>
            {/* Speech bubble arrow pointing right toward the button */}
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[10px] border-l-primary" />
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-semibold">Hey! Need some help? 👋</p>
                <p className="text-xs opacity-80">Ask me anything about Tiago</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setShowHint(false); }}
                className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating toggle button — hidden when panel is open */}
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={openPanel}
              className={cn(
                'fixed bottom-[5.5rem] right-5 z-40 w-14 h-14 rounded-xl',
                'backdrop-blur-xl border shadow-lg',
                'flex items-center justify-center',
                'transition-all duration-300 ease-out',
                'hover:scale-110 group',
                'bg-card/80 border-border shadow-black/20 hover:border-primary/50 hover:shadow-primary/20',
                isOpen && 'opacity-0 pointer-events-none'
              )}
              aria-label="Open chat"
            >
              <span className="absolute inset-0 rounded-xl animate-pulse-glow opacity-40 bg-primary/10" />
              <MessageCircle className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-card border-border">
            <p>Chat with me</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Chat panel */}
      <div
        className={cn(
          'fixed bottom-0 right-0 z-50 w-full h-[100dvh] sm:bottom-28 sm:right-5 sm:w-[380px] sm:h-[520px] sm:max-w-[calc(100vw-2.5rem)] sm:max-h-[calc(100vh-8rem)] sm:rounded-2xl',
          'bg-card/95 backdrop-blur-xl border border-border shadow-2xl',
          'flex flex-col overflow-hidden',
          'transition-all duration-300 ease-out origin-bottom-right',
          isOpen
            ? 'scale-100 opacity-100 pointer-events-auto sm:origin-bottom-right'
            : 'scale-90 opacity-0 pointer-events-none sm:origin-bottom-right'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground text-sm">Chat with me</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 py-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center gap-4 mt-8">
              <p className="text-muted-foreground text-sm text-center">
                Ask me anything about my work
              </p>
              <div className="flex flex-col gap-2 w-full">
                {['Who is Tiago?', 'Does he have backend experience?', 'What are his main tools?'].map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-sm px-3 py-2 rounded-xl border border-border bg-secondary/50 hover:bg-secondary hover:border-primary/40 text-foreground transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    'max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap break-words',
                    msg.role === 'user'
                      ? 'ml-auto bg-cyan-600/20 text-foreground'
                      : 'mr-auto bg-secondary text-foreground'
                  )}
                >
                  {msg.role === 'assistant' && isStreaming && i === messages.length - 1 && msg.content === '' ? (
                    <span className="text-muted-foreground italic animate-pulse">Thinking...</span>
                  ) : (
                    <>
                      {msg.content}
                      {msg.role === 'assistant' && isStreaming && i === messages.length - 1 && (
                        <span className="inline-block w-1.5 h-4 ml-0.5 bg-foreground/70 animate-pulse align-middle" />
                      )}
                    </>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Error bar */}
        {error && (
          <div className="mx-4 mb-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs">
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-border px-4 py-3 space-y-2">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={isStreaming}
              className="flex-1 text-sm h-9"
            />
            <Button
              size="icon"
              onClick={() => sendMessage()}
              disabled={isStreaming || !input.trim()}
              className="h-9 w-9 shrink-0"
            >
              {isStreaming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
