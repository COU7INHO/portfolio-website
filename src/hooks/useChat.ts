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
  const abortRef = useRef<AbortController | null>(null);

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

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch('https://backend.tiago-coutinho.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: outgoing, provider }),
        signal: controller.signal,
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
        // The conversation was reset while waiting: drop this chunk
        if (controller.signal.aborted) break;
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
      // Aborted by a reset: the conversation is already cleared, not an error
      if (controller.signal.aborted) return;
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
      // Skip if a reset already took over (it clears isStreaming itself)
      if (abortRef.current === controller) {
        abortRef.current = null;
        setIsStreaming(false);
      }
    }
  }, [input, isStreaming, provider]);

  const resetConversation = useCallback(() => {
    // Abort any in-flight answer so no late chunk lands in the new conversation
    abortRef.current?.abort();
    abortRef.current = null;
    messagesRef.current = [];
    setMessages([]);
    setInput('');
    setError(null);
    setIsStreaming(false);
  }, []);

  return {
    messages,
    input,
    setInput,
    provider,
    setProvider,
    isStreaming,
    error,
    sendMessage,
    resetConversation,
  };
}
