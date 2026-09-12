import AdventureScene, { ADVENTURE_SCENE_IDS, matchAdventureScene, type AdventureSceneId } from "./AdventureScene";
import type { Adventure } from "../types";
import { ADVENTURE_THEME_BY_ID, type AdventureTheme } from "../services/adventureThemeLibrary";
import { ADVENTURE_THEME_ARTWORKS } from "./adventureThemeArtworks";

/**
 * 主题专属插画：每个主题在 adventureThemeArtworks 里有一幅独立设计的 96×96 场景。
 * 未知 id（如主题库改版后的旧数据）渲染柔和的星形兜底图。
 */
export default function AdventureThemeArt({ theme }: { theme: AdventureTheme }) {
  const render = ADVENTURE_THEME_ARTWORKS[theme.id];
  return (
    <svg
      viewBox="0 0 96 96"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      {render ? (
        render()
      ) : (
        <>
          <defs>
            <linearGradient id="adv-theme-art-fallback" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3c4166" />
              <stop offset="1" stopColor="#8f83ad" />
            </linearGradient>
          </defs>
          <rect width="96" height="96" fill="url(#adv-theme-art-fallback)" />
          <path d="M48 30 l3.4 7.4 7.8 .9 -5.8 5.4 1.6 7.8 -7 -4 -7 4 1.6 -7.8 -5.8 -5.4 7.8 -.9 Z" fill="#ffd76e" opacity=".9" />
        </>
      )}
    </svg>
  );
}

/** 冒险渲染统一入口：有主题 ID 用专属插画，否则退回 14 款通用场景。 */
export function AdventureArtwork({ adventure }: { adventure: Adventure }) {
  const theme = adventure.themeId ? ADVENTURE_THEME_BY_ID.get(adventure.themeId) : undefined;
  if (theme) return <AdventureThemeArt theme={theme} />;
  const validScene = adventure.scene && (ADVENTURE_SCENE_IDS as string[]).includes(adventure.scene)
    ? adventure.scene as AdventureSceneId
    : undefined;
  return (
    <AdventureScene
      scene={validScene ?? matchAdventureScene(`${adventure.customPrompt ?? ""} ${adventure.title ?? ""}`)}
    />
  );
}
