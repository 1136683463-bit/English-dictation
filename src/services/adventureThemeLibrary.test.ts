import { describe, expect, it } from "vitest";
import { ADVENTURE_SCENE_IDS } from "../components/AdventureScene";
import { ADVENTURE_THEME_ARTWORKS } from "../components/adventureThemeArtworks";
import {
  ADVENTURE_THEME_BY_ID,
  ADVENTURE_THEME_LIBRARY,
  sampleAdventureThemes
} from "./adventureThemeLibrary";

describe("adventure theme library", () => {
  it("contains exactly 50 themes with unique ids and titles", () => {
    expect(ADVENTURE_THEME_LIBRARY).toHaveLength(50);
    const ids = new Set(ADVENTURE_THEME_LIBRARY.map((theme) => theme.id));
    const titles = new Set(ADVENTURE_THEME_LIBRARY.map((theme) => theme.title));
    expect(ids.size).toBe(50);
    expect(titles.size).toBe(50);
    ADVENTURE_THEME_LIBRARY.forEach((theme) => {
      expect(theme.title.length).toBeGreaterThanOrEqual(3);
      expect(theme.title.length).toBeLessThanOrEqual(12);
      expect(theme.description.length).toBeGreaterThan(0);
      expect(theme.description.length).toBeLessThanOrEqual(22);
    });
  });

  it("only uses valid scene ids and keeps the by-id map in sync", () => {
    ADVENTURE_THEME_LIBRARY.forEach((theme) => {
      expect(ADVENTURE_SCENE_IDS).toContain(theme.scene);
      expect(ADVENTURE_THEME_BY_ID.get(theme.id)).toBe(theme);
    });
  });

  it("has a bespoke artwork registered for every theme", () => {
    ADVENTURE_THEME_LIBRARY.forEach((theme) => {
      expect(typeof ADVENTURE_THEME_ARTWORKS[theme.id]).toBe("function");
    });
    expect(Object.keys(ADVENTURE_THEME_ARTWORKS)).toHaveLength(50);
  });

  it("samples the requested count without excluded ids and prefers distinct scenes", () => {
    for (let round = 0; round < 20; round += 1) {
      const picked = sampleAdventureThemes(4);
      expect(picked).toHaveLength(4);
      const ids = new Set(picked.map((theme) => theme.id));
      expect(ids.size).toBe(4);
      const scenes = new Set(picked.map((theme) => theme.scene));
      expect(scenes.size).toBe(4);
    }
    const excluded = ADVENTURE_THEME_LIBRARY.slice(0, 30).map((theme) => theme.id);
    const picked = sampleAdventureThemes(4, excluded);
    picked.forEach((theme) => expect(excluded).not.toContain(theme.id));
  });

  it("still returns themes when exclusions cover most of the library", () => {
    const everythingExceptFive = ADVENTURE_THEME_LIBRARY
      .slice(0, 45)
      .map((theme) => theme.id);
    const picked = sampleAdventureThemes(4, everythingExceptFive);
    expect(picked.length).toBeGreaterThan(0);
    picked.forEach((theme) => expect(everythingExceptFive).not.toContain(theme.id));
  });
});
