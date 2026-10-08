import { describe, it, expect } from "vitest";
import { parseChatMarkdown, safeHref } from "./chatMarkdown";

const text = (value: string) => ({ type: "text", value });
const link = (href: string, t: string) => ({ type: "link", href, text: t });

describe("parseChatMarkdown", () => {
  it("returns plain text untouched, newlines included", () => {
    expect(parseChatMarkdown("Hello\n\nworld")).toEqual([text("Hello\n\nworld")]);
    expect(parseChatMarkdown("")).toEqual([]);
  });

  it("parses bold", () => {
    expect(parseChatMarkdown("I use **Python** daily")).toEqual([
      text("I use "),
      { type: "bold", children: [text("Python")] },
      text(" daily"),
    ]);
  });

  it("parses several bold spans", () => {
    const nodes = parseChatMarkdown("**a** and **b**");
    expect(nodes).toEqual([
      { type: "bold", children: [text("a")] },
      text(" and "),
      { type: "bold", children: [text("b")] },
    ]);
  });

  it("does not treat spaced asterisks as bold", () => {
    expect(parseChatMarkdown("2 ** 3 ** 4")).toEqual([text("2 ** 3 ** 4")]);
    expect(parseChatMarkdown("****")).toEqual([text("****")]);
  });

  it("parses markdown links", () => {
    expect(parseChatMarkdown("See [my site](https://tiago-coutinho.com).")).toEqual([
      text("See "),
      link("https://tiago-coutinho.com", "my site"),
      text("."),
    ]);
  });

  it("parses links inside bold", () => {
    expect(parseChatMarkdown("**[GitHub](https://github.com/COU7INHO)**")).toEqual([
      { type: "bold", children: [link("https://github.com/COU7INHO", "GitHub")] },
    ]);
  });

  it("allows mailto links", () => {
    expect(parseChatMarkdown("[email me](mailto:a@b.com)")).toEqual([
      link("mailto:a@b.com", "email me"),
    ]);
  });

  it("drops unsafe link schemes and keeps the label", () => {
    expect(parseChatMarkdown("[click](javascript:alert(1))")).toEqual([
      text("[click](javascript:alert(1))"),
    ]);
    expect(parseChatMarkdown("[click](javascript:alert)")).toEqual([text("click")]);
    expect(parseChatMarkdown("[x](data:text/html,hi)")).toEqual([text("x")]);
    expect(parseChatMarkdown("[x](/relative)")).toEqual([text("x")]);
  });

  it("never produces raw HTML", () => {
    expect(parseChatMarkdown("<b>hi</b><script>x</script>")).toEqual([
      text("<b>hi</b><script>x</script>"),
    ]);
  });

  it("autolinks bare URLs and trims trailing punctuation", () => {
    expect(parseChatMarkdown("Visit https://tiago-coutinho.com, thanks!")).toEqual([
      text("Visit "),
      link("https://tiago-coutinho.com", "https://tiago-coutinho.com"),
      text(", thanks!"),
    ]);
    expect(parseChatMarkdown("(see https://example.com/a)")).toEqual([
      text("(see "),
      link("https://example.com/a", "https://example.com/a"),
      text(")"),
    ]);
    expect(parseChatMarkdown("https://en.wikipedia.org/wiki/Foo_(bar).")).toEqual([
      link("https://en.wikipedia.org/wiki/Foo_(bar)", "https://en.wikipedia.org/wiki/Foo_(bar)"),
      text("."),
    ]);
  });

  it("autolinks www URLs with https", () => {
    expect(parseChatMarkdown("go to www.example.com")).toEqual([
      text("go to "),
      link("https://www.example.com", "www.example.com"),
    ]);
  });

  it("autolinks emails", () => {
    expect(parseChatMarkdown("Mail tiago.c@gmail.com.")).toEqual([
      text("Mail "),
      link("mailto:tiago.c@gmail.com", "tiago.c@gmail.com"),
      text("."),
    ]);
  });

  it("does not autolink inside markdown link labels", () => {
    expect(parseChatMarkdown("[https://a.com](https://b.com)")).toEqual([
      link("https://b.com", "https://a.com"),
    ]);
  });

  it("autolinks inside bold", () => {
    expect(parseChatMarkdown("**https://a.com**")).toEqual([
      { type: "bold", children: [link("https://a.com", "https://a.com")] },
    ]);
  });

  describe("partial input while streaming", () => {
    it("keeps an unclosed bold as text", () => {
      expect(parseChatMarkdown("I use **Pyth")).toEqual([text("I use **Pyth")]);
      expect(parseChatMarkdown("I use **")).toEqual([text("I use **")]);
      expect(parseChatMarkdown("I use **Python*")).toEqual([text("I use **Python*")]);
    });

    it("keeps an unclosed link as text", () => {
      expect(parseChatMarkdown("See [my si")).toEqual([text("See [my si")]);
      expect(parseChatMarkdown("See [my site](")).toEqual([text("See [my site](")]);
    });

    it("keeps a link without its closing paren as text plus a bare URL", () => {
      expect(parseChatMarkdown("See [site](https://a.com")).toEqual([
        text("See [site]("),
        link("https://a.com", "https://a.com"),
      ]);
    });

    it("renders every prefix of a message without throwing", () => {
      const full = "Hi **Tiago**! See [site](https://tiago-coutinho.com) or mail a@b.co.";
      for (let i = 0; i <= full.length; i++) {
        expect(() => parseChatMarkdown(full.slice(0, i))).not.toThrow();
      }
      expect(parseChatMarkdown(full)).toEqual([
        text("Hi "),
        { type: "bold", children: [text("Tiago")] },
        text("! See "),
        link("https://tiago-coutinho.com", "site"),
        text(" or mail "),
        link("mailto:a@b.co", "a@b.co"),
        text("."),
      ]);
    });
  });
});

describe("safeHref", () => {
  it("allows http, https and mailto only", () => {
    expect(safeHref("http://a.com")).toBe("http://a.com");
    expect(safeHref("HTTPS://a.com")).toBe("HTTPS://a.com");
    expect(safeHref("mailto:a@b.com")).toBe("mailto:a@b.com");
    expect(safeHref("javascript:alert(1)")).toBeNull();
    expect(safeHref("JaVaScRiPt:alert(1)")).toBeNull();
    expect(safeHref("data:text/html,x")).toBeNull();
    expect(safeHref("//evil.com")).toBeNull();
    expect(safeHref("ftp://a.com")).toBeNull();
  });
});
