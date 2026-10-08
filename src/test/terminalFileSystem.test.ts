import { describe, it, expect, vi, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { fileSystem, projectLinks } from "@/data/terminalFileSystem";
import { projects } from "@/data/projects";
import { useTerminal } from "@/hooks/useTerminal";

const getDirectory = (name: string) =>
  fileSystem.children?.find((c) => c.type === "directory" && c.name === name);

describe("terminal projects/ directory", () => {
  const projectsDir = getDirectory("projects");

  it("lists every project from the Projects page, in the same order", () => {
    const fileNames = projectsDir?.children?.map((c) => c.name);
    expect(fileNames).toEqual(projects.map((p) => `${p.slug}.json`));
    expect(fileNames).toEqual([
      "Firebreak.json",
      "GitHubDiscipline.json",
      "IMLens.json",
      "SpeedChampion.json",
    ]);
  });

  it("keeps the project JSON shape", () => {
    for (const project of projects) {
      const file = projectsDir?.children?.find((c) => c.name === `${project.slug}.json`);
      const json = JSON.parse(file?.content ?? "{}");
      expect(Object.keys(json)).toEqual([
        "name",
        "description",
        "longDescription",
        "url",
        "status",
        "features",
        "technologies",
        "github",
      ]);
      expect(json.name).toBe(project.title);
      expect(json.features).toEqual(project.features);
      expect(json.technologies).toEqual(project.technologies);
    }
  });

  it("has an open target for every project", () => {
    for (const project of projects) {
      const links = projectLinks[project.slug.toLowerCase()];
      expect(links).toBeDefined();
      expect(links.liveUrl ?? links.githubUrl).toBeTruthy();
    }
  });
});

describe("open command", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const runOpen = (arg: string) => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    const { result } = renderHook(() => useTerminal(() => {}, true));
    act(() => result.current.executeCommand(`open ${arg}`));
    return { openSpy, lines: result.current.lines };
  };

  it("opens the live website when there is one", () => {
    const { openSpy } = runOpen("GitHubDiscipline.json");
    expect(openSpy).toHaveBeenCalledWith("https://github-discipline.tiago-coutinho.com", "_blank");
  });

  it("falls back to the GitHub repository when there is no live website", () => {
    const { openSpy, lines } = runOpen("imlens");
    expect(openSpy).toHaveBeenCalledWith("https://github.com/COU7INHO/imlens", "_blank");
    expect(lines.at(-1)?.content).toContain("no live website");
  });

  it("reports unknown projects", () => {
    const { openSpy, lines } = runOpen("nope");
    expect(openSpy).not.toHaveBeenCalled();
    expect(lines.at(-1)?.type).toBe("error");
  });
});
