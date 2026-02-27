import { useState, useCallback, useRef } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type Provider = 'openai' | 'local';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [provider, setProvider] = useState<Provider>('openai');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  const sendMessage = useCallback(async (text?: string) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || isStreaming) return;

    setError(null);

    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    const assistantStub: ChatMessage = { role: 'assistant', content: '' };

    // Build outgoing from ref (always current) before adding the stub
    const outgoing = [...messagesRef.current, userMessage];

    setMessages((prev) => {
      const next = [...prev, userMessage, assistantStub];
      messagesRef.current = next;
      return next;
    });
    if (!text) setInput('');
    setIsStreaming(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: outgoing, provider }),
      });

      if (!response.ok) {
        let msg = response.status === 422 ? 'Invalid request.' : `Server error (${response.status})`;
        if (response.status === 429) {
          try {
            const body = await response.json();
            msg = body?.detail ?? 'Rate limit reached. Please wait a moment.';
          } catch {
            msg = 'Rate limit reached. Please wait a moment.';
          }
        }
        throw new Error(msg);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last?.role === 'assistant') {
              updated[updated.length - 1] = {
                ...last,
                content: last.content + chunk,
              };
            }
            messagesRef.current = updated;
            return updated;
          });
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Connection error. Is the server running?';
      setError(message);
      // Remove empty assistant stub on error
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && last.content === '') {
          const next = prev.slice(0, -1);
          messagesRef.current = next;
          return next;
        }
        return prev;
      });
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages, provider]);

  return { messages, input, setInput, provider, setProvider, isStreaming, error, sendMessage };
}
