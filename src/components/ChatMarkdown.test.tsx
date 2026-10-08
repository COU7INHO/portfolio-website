import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ChatMarkdown from "./ChatMarkdown";

describe("ChatMarkdown", () => {
  it("renders bold and links that open in a new tab", () => {
    const { container } = render(
      <ChatMarkdown content={"**Hi**, see [site](https://a.com)"} />
    );
    expect(container.querySelector("strong")).toHaveTextContent("Hi");
    const anchor = screen.getByRole("link", { name: "site" });
    expect(anchor).toHaveAttribute("href", "https://a.com");
    expect(anchor).toHaveAttribute("target", "_blank");
    expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("escapes HTML instead of rendering it", () => {
    const { container } = render(<ChatMarkdown content={'<img src=x onerror="alert(1)">'} />);
    expect(container.querySelector("img")).toBeNull();
    expect(container).toHaveTextContent('<img src=x onerror="alert(1)">');
  });
});
