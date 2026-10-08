import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useChat } from "./useChat";

const encoder = new TextEncoder();

// A streaming response that sends one chunk, then stays open until aborted
function mockStreamingFetch() {
  return vi.fn((_url: string, init?: RequestInit) => {
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode("Hello"));
        init?.signal?.addEventListener("abort", () => {
          controller.error(new DOMException("Aborted", "AbortError"));
        });
      },
    });
    return Promise.resolve(new Response(body, { status: 200 }));
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useChat resetConversation", () => {
  it("clears messages, input and error", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(new Response(null, { status: 500 }))));
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("Hi");
    });
    act(() => result.current.setInput("draft"));
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.error).not.toBeNull();

    act(() => result.current.resetConversation());

    expect(result.current.messages).toEqual([]);
    expect(result.current.input).toBe("");
    expect(result.current.error).toBeNull();
  });

  it("aborts an in-flight answer without showing an error or late chunks", async () => {
    const fetchMock = mockStreamingFetch();
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() => useChat());

    let pending: Promise<void> = Promise.resolve();
    act(() => {
      pending = result.current.sendMessage("Hi");
    });
    await waitFor(() => expect(result.current.messages[1]?.content).toBe("Hello"));
    expect(result.current.isStreaming).toBe(true);

    act(() => result.current.resetConversation());
    await act(async () => {
      await pending;
    });

    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true);
    expect(result.current.messages).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isStreaming).toBe(false);
  });
});
