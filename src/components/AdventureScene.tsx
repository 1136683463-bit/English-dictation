/**
 * 冒险板块场景插画：每款是一幅自带天空渐变与景深层次的小场景，
 * 铺满圆角图块（而不是色块里的单个符号）。
 * 默认模板使用固定场景；AI 随机推荐会返回 icon 字段，从本目录中挑选。
 */
export type AdventureSceneId =
  | "campus"
  | "city"
  | "train"
  | "lighthouse"
  | "desert"
  | "space"
  | "ocean"
  | "island"
  | "mansion"
  | "forest"
  | "snow"
  | "magic"
  | "mystery"
  | "sparkle";

export const ADVENTURE_SCENE_IDS: AdventureSceneId[] = [
  "campus", "city", "train", "lighthouse", "desert", "space", "ocean",
  "island", "mansion", "forest", "snow", "magic", "mystery", "sparkle"
];

/** 场景 ID 的中文提示，供 AI 推荐 prompt 使用。 */
export const ADVENTURE_SCENE_LABELS: Record<AdventureSceneId, string> = {
  campus: "校园课堂",
  city: "城市街区",
  train: "列车旅行",
  lighthouse: "灯塔海雾",
  desert: "沙漠古城",
  space: "星际太空",
  ocean: "海底世界",
  island: "海岛椰风",
  mansion: "老宅午夜",
  forest: "迷雾森林",
  snow: "冰雪雪国",
  magic: "魔法奇幻",
  mystery: "悬疑侦探",
  sparkle: "其他奇想"
};

/** AI 未返回 icon（或返回值无效）时，用中英文关键词兜底匹配场景。 */
const SCENE_KEYWORD_RULES: Array<[RegExp, AdventureSceneId]> = [
  [/沙漠|古城|遗迹|废墟|金字塔|黄沙|丝路|desert|sand|ruin|pyramid/i, "desert"],
  [/星际|太空|宇宙|星球|银河|科幻|外星|未来|space|star|galaxy|planet|cosmic|courier/i, "space"],
  [/海岛|孤岛|小岛|岛屿|荒岛|椰|island|palm/i, "island"],
  [/海底|深海|珊瑚|人鱼|鱼|海湾|海港|海|ocean|sea|coral|wave|fish/i, "ocean"],
  [/老宅|古宅|钟声|午夜|深夜|宅|mansion|midnight|haunt|bell|clock tower/i, "mansion"],
  [/灯塔|雾林|浓雾|灯|lighthouse|fog|mist/i, "lighthouse"],
  [/校园|学校|教室|社团|课堂|谜题|笔记|school|campus|classroom|club/i, "campus"],
  [/信|邮|街区|城市|都市|街道|letter|mail|post|city|street|urban/i, "city"],
  [/列车|火车|巴士|铁路|公路|车站|train|bus|rail|station|journey/i, "train"],
  [/森林|树林|丛林|迷雾森林|forest|wood|jungle/i, "forest"],
  [/雪|冰|寒冬|极光|极地|snow|ice|winter|frost|aurora/i, "snow"],
  [/魔法|女巫|咒语|奇幻|精灵|龙|幻境|magic|wizard|witch|spell|dragon|fairy/i, "magic"],
  [/悬疑|侦探|谜|案|秘密|失踪|线索|mystery|detective|secret|clue|riddle/i, "mystery"]
];

export const matchAdventureScene = (
  text: string,
  fallback: AdventureSceneId = "sparkle"
): AdventureSceneId => {
  for (const [pattern, scene] of SCENE_KEYWORD_RULES) {
    if (pattern.test(text)) return scene;
  }
  return fallback;
};

interface AdventureSceneProps {
  scene: AdventureSceneId;
}

const SceneSvg = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 48 48" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    {children}
  </svg>
);

/* 各场景插画。渐变 id 以场景名为前缀，同名场景重复实例共享定义也无碍。 */

const DesertScene = () => (
  <SceneSvg>
    <defs>
      <linearGradient id="ascn-desert-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffe4b6" />
        <stop offset="1" stopColor="#ffd08d" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" fill="url(#ascn-desert-sky)" />
    <circle cx="36.5" cy="11" r="4.6" fill="#ff9f4d" />
    <circle cx="36.5" cy="11" r="6.8" fill="#ff9f4d" opacity="0.28" />
    <path d="M8 12.5c1.6-1.2 3.2-1.2 4.8 0M14.5 9.4c1.3-1 2.6-1 3.9 0" stroke="#c98a4e" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.7" />
    <path d="M0 30c8-5.5 16-5.5 24-2s16 3.5 24-1.5V48H0z" fill="#e9ad68" />
    <path d="M11.5 32.5 14 18.5h6.5l2.5 14z" fill="#b5763e" />
    <rect x="12.6" y="16.2" width="9.3" height="2.6" rx="1.2" fill="#a3632e" />
    <path d="M15.5 32.5v-5.4a3.2 3.2 0 0 1 6.4 0v5.4z" fill="#7c451d" />
    <path d="M30.5 32.5v-7.2a2.5 2.5 0 0 1 5 0v7.2z" fill="#c08247" />
    <path d="M0 36c10-4.5 21-4 29-1.2 7.5 2.6 13.5 2.8 19 .4V48H0z" fill="#f4c27e" />
  </SceneSvg>
);

const SpaceScene = () => (
  <SceneSvg>
    <defs>
      <linearGradient id="ascn-space-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2e2b60" />
        <stop offset="1" stopColor="#5b4bb0" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" fill="url(#ascn-space-sky)" />
    <circle cx="8" cy="9" r="1.1" fill="#fff" opacity="0.9" />
    <circle cx="19" cy="6" r="0.8" fill="#fff" opacity="0.6" />
    <circle cx="42" cy="26" r="0.9" fill="#fff" opacity="0.7" />
    <circle cx="12" cy="20" r="0.7" fill="#fff" opacity="0.5" />
    <path d="M30 4.6l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" fill="#ffe9a8" />
    <circle cx="29" cy="19" r="8" fill="#f2b95c" />
    <circle cx="26.4" cy="16.6" r="2.6" fill="#f8d190" opacity="0.85" />
    <ellipse cx="29" cy="19" rx="13.5" ry="3.9" fill="none" stroke="#e6d3a4" strokeWidth="1.6" transform="rotate(-16 29 19)" opacity="0.9" />
    <circle cx="10" cy="36" r="4" fill="#8f7fe0" />
    <circle cx="11.2" cy="34.8" r="1.2" fill="#b3a6ef" opacity="0.9" />
    <g transform="rotate(-12 15 30)">
      <rect x="9.5" y="26.5" width="11" height="7.6" rx="1.5" fill="#fdfbff" />
      <path d="M10 27.3l5 3.7 5-3.7" fill="none" stroke="#c4b8e8" strokeWidth="1.2" />
    </g>
    <path d="M24 40c1.2-2 3-2 4.2 0M31 43c1-1.6 2.4-1.6 3.4 0" stroke="#b3a6ef" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.7" />
  </SceneSvg>
);

const OceanScene = () => (
  <SceneSvg>
    <defs>
      <linearGradient id="ascn-ocean-sea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c6ecf4" />
        <stop offset="1" stopColor="#7fcbdc" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" fill="url(#ascn-ocean-sea)" />
    <circle cx="35" cy="9" r="1.4" fill="#fff" opacity="0.6" />
    <circle cx="38" cy="14" r="1" fill="#fff" opacity="0.5" />
    <circle cx="33" cy="17" r="0.8" fill="#fff" opacity="0.45" />
    <circle cx="14" cy="12" r="2.6" fill="#ffd166" />
    <path d="M15.8 12.6l3 1.9v-3.8z" fill="#ffd166" />
    <circle cx="14.6" cy="11.3" r="0.6" fill="#4a3b2a" />
    <g>
      <ellipse cx="30" cy="23" rx="5.4" ry="3.4" fill="#ff9455" />
      <path d="M34.8 23l4.4-2.8v5.6z" fill="#ff9455" />
      <path d="M27.5 20.6c1.6 1.5 1.6 3.3 0 4.8" stroke="#e5703a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="27.6" cy="22" r="0.7" fill="#fff" />
      <circle cx="27.6" cy="22" r="0.35" fill="#33261c" />
    </g>
    <path d="M9 41c-1.6-3 .6-5.2-1-8.4 2.4 1 3 3.6 2.6 6M12.5 41c.6-2.6-.4-4 .4-6.6 1.8 1.2 1.6 4 .8 6.4" stroke="#3f9e6f" strokeWidth="1.7" fill="none" strokeLinecap="round" />
    <g stroke="#f28ba8" strokeWidth="1.5" strokeLinecap="round" fill="none">
      <path d="M38 41v-5.4" />
      <path d="M38 37.6c-1.5-.2-2.3-1.1-2.4-2.6" />
      <path d="M38 36.4c1.5-.2 2.3-1.1 2.4-2.6" />
    </g>
    <path d="M0 37.5c10-3 30-3 48 0V48H0z" fill="#f2dfae" />
  </SceneSvg>
);

const IslandScene = () => (
  <SceneSvg>
    <defs>
      <linearGradient id="ascn-island-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d4f0f8" />
        <stop offset="1" stopColor="#fdfaf0" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" fill="url(#ascn-island-sky)" />
    <circle cx="38" cy="10" r="4.2" fill="#ffd166" />
    <rect x="0" y="30" width="48" height="18" fill="#6fc3d9" />
    <path d="M2 34c2.5-1.4 5-1.4 7.5 0M14 33c2.5-1.4 5-1.4 7.5 0M30 35c2.5-1.4 5-1.4 7.5 0" stroke="#ffffff" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.65" />
    <path d="M11 38c2.5-4 23.5-4 26 0z" fill="#f2d8a0" />
    <path d="M24.5 37.5c.2-5-.4-8.5-1.8-11.5" stroke="#a5713f" strokeWidth="1.9" fill="none" strokeLinecap="round" />
    <g fill="#4fa570">
      <path d="M22.7 26c-3.6-2.6-6.8-2.4-9.2.2 3-.4 6 .2 9.2 1z" />
      <path d="M22.7 26c-1.4-4.2-4-6.3-7.6-6-.1 0 3 2.4 7.6 6z" opacity="0.9" />
      <path d="M22.7 26c3.6-2.6 6.8-2.4 9.2.2-3-.4-6 .2-9.2 1z" />
      <path d="M22.7 26c1.4-4.2 4-6.3 7.6-6 0 0-3 2.4-7.6 6z" opacity="0.9" />
      <path d="M22.7 26c-.4-3.6 1-6 4-7.4-2.4 2.2-3.6 4.6-4 7.4z" />
    </g>
    <circle cx="13" cy="30.6" r="0.8" fill="#fff" opacity="0.8" />
  </SceneSvg>
);

const MansionScene = () => (
  <SceneSvg>
    <defs>
      <linearGradient id="ascn-mansion-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#544a7c" />
        <stop offset="1" stopColor="#8d7cae" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" fill="url(#ascn-mansion-sky)" />
    <circle cx="37" cy="10.5" r="4.4" fill="#ffefc2" />
    <circle cx="38.8" cy="9.4" r="3.7" fill="#6a5f95" />
    <circle cx="10" cy="14" r="0.8" fill="#fff" opacity="0.7" />
    <circle cx="16" cy="8" r="0.6" fill="#fff" opacity="0.5" />
    <rect x="27" y="13.5" width="2.6" height="6" rx="0.6" fill="#2b2342" />
    <rect x="12" y="22" width="20" height="15" fill="#2b2342" />
    <path d="M9.8 22.4 22 13l12.2 9.4z" fill="#221b38" />
    <circle cx="22" cy="19" r="2.7" fill="#f7ead0" />
    <path d="M22 17.6v1.5l1.1.8" stroke="#4a3f66" strokeWidth="0.9" fill="none" strokeLinecap="round" />
    <rect x="18.6" y="27" width="6.8" height="6" rx="1" fill="#ffc65c" />
    <path d="M22 27v6M18.6 30h6.8" stroke="#2b2342" strokeWidth="0.9" />
    <g stroke="#241d38" strokeWidth="1.3" strokeLinecap="round" fill="none">
      <path d="M39 37V26" />
      <path d="M39 30.5c-1.6-1.4-3.2-1.7-4.8-1M39 28.4c1.4-1.2 2.8-1.5 4.2-.9" />
    </g>
    <rect x="0" y="36" width="48" height="12" fill="#382e57" />
    <ellipse cx="20" cy="36.5" rx="16" ry="2.2" fill="#ffffff" opacity="0.14" />
  </SceneSvg>
);

const CampusScene = () => (
  <SceneSvg>
    <defs>
      <linearGradient id="ascn-campus-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d8ecff" />
        <stop offset="1" stopColor="#f8fbff" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" fill="url(#ascn-campus-sky)" />
    <circle cx="40" cy="9.5" r="4" fill="#ffd98a" />
    <path d="M6 14c1.6-1.2 3.2-1.2 4.8 0" stroke="#9db8d8" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.8" />
    <rect x="0" y="36.5" width="48" height="11.5" fill="#c8e6ae" />
    <circle cx="8" cy="28.5" r="5.4" fill="#8fd0a0" />
    <circle cx="5.6" cy="31" r="3.4" fill="#7cbd8e" />
    <rect x="7.2" y="31.5" width="1.8" height="6" rx="0.9" fill="#a5713f" />
    <path d="M15.5 22 26 14.5 36.5 22z" fill="#c96a4c" />
    <rect x="14" y="22" width="24" height="15" rx="1.2" fill="#e08a6d" />
    <circle cx="26" cy="19.6" r="2.5" fill="#fff" />
    <path d="M26 18.2v1.5l1 .8" stroke="#c96a4c" strokeWidth="0.9" fill="none" strokeLinecap="round" />
    <rect x="17.2" y="26" width="4.2" height="4.8" rx="0.8" fill="#fff6e8" />
    <rect x="23.9" y="26" width="4.2" height="4.8" rx="0.8" fill="#fff6e8" />
    <rect x="30.6" y="26" width="4.2" height="4.8" rx="0.8" fill="#fff6e8" />
    <path d="M24 37v-5.2a2.1 2.1 0 0 1 4.2 0V37z" fill="#7c4530" />
    <rect x="35" y="13" width="0.9" height="6" fill="#8a6a44" />
    <path d="M35.9 13.4 40 14.8l-4.1 1.6z" fill="#f26a3c" />
  </SceneSvg>
);

const CityScene = () => (
  <SceneSvg>
    <defs>
      <linearGradient id="ascn-city-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e9edf8" />
        <stop offset="1" stopColor="#fafcff" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" fill="url(#ascn-city-sky)" />
    <rect x="2.5" y="16" width="9" height="32" rx="1" fill="#b3bcd9" />
    <rect x="33" y="12" width="10" height="36" rx="1" fill="#b3bcd9" />
    <rect x="9" y="22" width="10" height="26" rx="1" fill="#8d99bd" />
    <rect x="27" y="20" width="9" height="28" rx="1" fill="#8d99bd" />
    <g fill="#f6f8ff" opacity="0.9">
      <rect x="11.5" y="25" width="2.2" height="2.6" rx="0.4" />
      <rect x="15" y="29" width="2.2" height="2.6" rx="0.4" />
      <rect x="29.5" y="24" width="2.2" height="2.6" rx="0.4" />
      <rect x="29.5" y="30" width="2.2" height="2.6" rx="0.4" />
      <rect x="36" y="16" width="2.2" height="2.6" rx="0.4" />
      <rect x="39.5" y="21" width="2.2" height="2.6" rx="0.4" />
    </g>
    <path d="M4 40c2-1.4 4-1.4 6 0" stroke="#fff" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
    <g transform="rotate(-8 23 23)">
      <rect x="11.5" y="17" width="23" height="15" rx="2.6" fill="#ffffff" />
      <rect x="11.5" y="17" width="23" height="15" rx="2.6" fill="none" stroke="#dfe4f2" strokeWidth="1" />
      <path d="M12.6 18.6 23 26.4l10.4-7.8" fill="none" stroke="#c9d1e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <path d="M4.5 26.5c2.4-.9 4.4-.9 6.4 0M3.5 31.5c2-.7 3.6-.7 5.4 0" stroke="#b3bcd9" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    <path d="M35 38c2.4-.9 4.4-.9 6.4 0" stroke="#b3bcd9" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  </SceneSvg>
);

const TrainScene = () => (
  <SceneSvg>
    <defs>
      <linearGradient id="ascn-train-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffe8d2" />
        <stop offset="1" stopColor="#fff8f0" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" fill="url(#ascn-train-sky)" />
    <circle cx="39" cy="10" r="4.2" fill="#ffb37e" />
    <path d="M6 12c1.6-1.2 3.2-1.2 4.8 0" stroke="#e0b28a" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.8" />
    <rect x="0" y="24" width="48" height="11" fill="#7fc8d9" />
    <path d="M3 28.5c2.4-1.3 4.8-1.3 7.2 0M20 30c2.4-1.3 4.8-1.3 7.2 0M36 28c2.4-1.3 4.8-1.3 7.2 0" stroke="#fff" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
    <rect x="0" y="35" width="48" height="13" fill="#e8b06e" />
    <rect x="7" y="24.5" width="27" height="10" rx="3" fill="#f26a3c" />
    <rect x="31" y="22" width="8" height="12.5" rx="2.6" fill="#e0562f" />
    <rect x="10.5" y="27" width="4.6" height="3.6" rx="0.9" fill="#fff6e8" />
    <rect x="17" y="27" width="4.6" height="3.6" rx="0.9" fill="#fff6e8" />
    <rect x="23.5" y="27" width="4.6" height="3.6" rx="0.9" fill="#fff6e8" />
    <rect x="33" y="24.5" width="4" height="3.4" rx="0.9" fill="#fff6e8" />
    <circle cx="13" cy="35" r="2" fill="#3c3c46" />
    <circle cx="21" cy="35" r="2" fill="#3c3c46" />
    <circle cx="29" cy="35" r="2" fill="#3c3c46" />
    <circle cx="36.5" cy="35" r="2" fill="#3c3c46" />
    <path d="M6.5 37.6h36" stroke="#8a6a44" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="8" cy="20.5" r="1.6" fill="#fff" opacity="0.85" />
    <circle cx="11.5" cy="18.5" r="2.1" fill="#fff" opacity="0.7" />
  </SceneSvg>
);

const LighthouseScene = () => (
  <SceneSvg>
    <defs>
      <linearGradient id="ascn-lh-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e0efe7" />
        <stop offset="1" stopColor="#f6faf6" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" fill="url(#ascn-lh-sky)" />
    <path d="M26.5 13.5 46 7.5v8.5z" fill="#ffe9a8" opacity="0.6" />
    <path d="M4 38c7-4 14-4.6 21-2.4 8 2.4 15 2.4 23-.6V48H0z" fill="#9fb8a8" />
    <path d="M5 44.5c2.6-1.5 5.2-1.5 7.8 0" stroke="#fff" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.55" />
    <path d="M19 36.5 20.6 16h6.8L29 36.5z" fill="#f8f6ef" />
    <path d="M19.9 25.5h8.2l.3 4.4h-8.8z" fill="#e0603f" />
    <path d="M20.6 18.6h6.8l.3 4h-7.4z" fill="#e0603f" opacity="0.92" />
    <rect x="21.4" y="10.6" width="5.2" height="5.4" fill="#ffd166" />
    <path d="M20.4 10.6 24 6.6l3.6 4z" fill="#d86a4a" />
    <g fill="#5f8f74">
      <path d="M9 36.5 12 28l3 8.5z" />
      <path d="M9.6 31.5 12 25l2.4 6.5z" opacity="0.85" />
    </g>
    <ellipse cx="14" cy="40.5" rx="12" ry="2.6" fill="#fff" opacity="0.5" />
    <ellipse cx="36" cy="44" rx="12" ry="2.4" fill="#fff" opacity="0.4" />
  </SceneSvg>
);

const ForestScene = () => (
  <SceneSvg>
    <defs>
      <linearGradient id="ascn-forest-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e6f5e4" />
        <stop offset="1" stopColor="#c2e6c6" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" fill="url(#ascn-forest-sky)" />
    <g fill="#a5d4ae">
      <path d="M6 32 11 18l5 14z" />
      <path d="M20 30 25 15l5 15z" />
      <path d="M34 32 39 18l5 14z" />
    </g>
    <ellipse cx="24" cy="31.5" rx="20" ry="2.8" fill="#fff" opacity="0.55" />
    <g fill="#6fb07e">
      <path d="M2 42 8 26l6 16z" />
      <path d="M15 44 21.5 26 28 44z" />
      <path d="M30 42 36 27l6 15z" />
    </g>
    <rect x="0" y="41" width="48" height="7" fill="#79b586" />
    <circle cx="12" cy="24" r="1.1" fill="#ffe28a" />
    <circle cx="30" cy="21" r="0.9" fill="#ffe28a" />
    <circle cx="40" cy="28" r="1" fill="#ffe28a" />
    <circle cx="20" cy="34" r="0.8" fill="#ffe28a" opacity="0.8" />
  </SceneSvg>
);

const SnowScene = () => (
  <SceneSvg>
    <defs>
      <linearGradient id="ascn-snow-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#dfe9fb" />
        <stop offset="1" stopColor="#f8fbff" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" fill="url(#ascn-snow-sky)" />
    <path d="M0 36 11 17l9.5 15.5z" fill="#b9cdea" />
    <path d="M13 36 27 12l15 24z" fill="#9db8e2" />
    <path d="M23 17.5 27 12l4 5.5-4 2.6z" fill="#fff" />
    <path d="M8.5 21.5 11 17l2.5 4.5-2.5 1.8z" fill="#fff" />
    <rect x="0" y="36" width="48" height="12" fill="#f4f8ff" />
    <g stroke="#b9cdea" strokeWidth="1.1" strokeLinecap="round">
      <path d="M9 10v4M7 12h4" />
      <path d="M33 6v3.4M31.3 7.7h3.4" />
      <path d="M42 20v3M40.5 21.5h3" />
    </g>
    <rect x="29" y="27" width="12" height="9" rx="1" fill="#b0793f" />
    <path d="M27.5 27.5 35 21.5l7.5 6z" fill="#8a5a2b" />
    <path d="M27.2 27.8c2.6 1.4 5.2 2 7.8 2s5.2-.6 7.8-2l.2 1.4c-2.7 1.4-5.3 2-8 2s-5.3-.6-8-2z" fill="#fff" />
    <rect x="33" y="30.5" width="4" height="4" rx="0.6" fill="#ffc65c" />
    <circle cx="14" cy="31" r="1.4" fill="#fff" />
    <circle cx="10" cy="34" r="1" fill="#fff" />
  </SceneSvg>
);

const MagicScene = () => (
  <SceneSvg>
    <defs>
      <linearGradient id="ascn-magic-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f0e6ff" />
        <stop offset="1" stopColor="#dcc6ff" />
      </linearGradient>
      <linearGradient id="ascn-magic-star" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#b78cf7" />
        <stop offset="1" stopColor="#8f5fe8" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" fill="url(#ascn-magic-sky)" />
    <circle cx="24" cy="24" r="14" fill="none" stroke="#c9adff" strokeWidth="1.1" strokeDasharray="2.4 3.6" opacity="0.8" />
    <path d="M24 12.5l2.7 8.8 8.8 2.7-8.8 2.7-2.7 8.8-2.7-8.8-8.8-2.7 8.8-2.7z" fill="url(#ascn-magic-star)" />
    <path d="M24 18.5l1.4 4.1 4.1 1.4-4.1 1.4-1.4 4.1-1.4-4.1-4.1-1.4 4.1-1.4z" fill="#e9dcff" />
    <path d="M37 8.6a4.6 4.6 0 1 0 2.6 6.2 3.6 3.6 0 1 1-2.6-6.2z" fill="#fff3c9" />
    <path d="M9 33l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z" fill="#ffd166" />
    <circle cx="38" cy="30" r="1.1" fill="#ffd166" />
    <circle cx="10" cy="12" r="0.9" fill="#fff" opacity="0.9" />
  </SceneSvg>
);

const MysteryScene = () => (
  <SceneSvg>
    <defs>
      <linearGradient id="ascn-mys-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#57506e" />
        <stop offset="1" stopColor="#837a99" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" fill="url(#ascn-mys-sky)" />
    <text x="7" y="14" fontSize="7" fill="#cfc7e2" opacity="0.75">?</text>
    <text x="38" y="20" fontSize="5.4" fill="#cfc7e2" opacity="0.6">?</text>
    <text x="35" y="38" fontSize="4.6" fill="#cfc7e2" opacity="0.5">?</text>
    <circle cx="21" cy="21" r="9.5" fill="#f5f0e6" opacity="0.92" />
    <circle cx="21" cy="21" r="9.5" fill="none" stroke="#ffd166" strokeWidth="2.4" />
    <path d="M18.4 19a2.7 2.7 0 1 1 4 2.5c-.9.5-1.3 1-1.3 2" stroke="#8a7fae" strokeWidth="1.7" fill="none" strokeLinecap="round" />
    <circle cx="21.1" cy="26.4" r="1" fill="#8a7fae" />
    <path d="M28.2 28.2 36 36" stroke="#ffd166" strokeWidth="3" strokeLinecap="round" />
    <path d="M36 36l3.4 3.4" stroke="#e0a83c" strokeWidth="3.2" strokeLinecap="round" />
    <rect x="0" y="40" width="48" height="8" fill="#423c56" />
  </SceneSvg>
);

const SparkleScene = () => (
  <SceneSvg>
    <defs>
      <linearGradient id="ascn-sp-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffe9dc" />
        <stop offset="1" stopColor="#fff6ef" />
      </linearGradient>
      <linearGradient id="ascn-sp-star" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ff8a4d" />
        <stop offset="1" stopColor="#f26a3c" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" fill="url(#ascn-sp-sky)" />
    <path d="M24 9.5l3.4 11.1 11.1 3.4-11.1 3.4L24 38.5l-3.4-11.1-11.1-3.4 11.1-3.4z" fill="url(#ascn-sp-star)" />
    <path d="M24 17l1.8 5.2 5.2 1.8-5.2 1.8-1.8 5.2-1.8-5.2-5.2-1.8 5.2-1.8z" fill="#ffc09a" />
    <path d="M37.5 30.5l1.2 3.3 3.3 1.2-3.3 1.2-1.2 3.3-1.2-3.3-3.3-1.2 3.3-1.2z" fill="#ffd166" />
    <path d="M10 8.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" fill="#ffb37e" />
    <circle cx="38" cy="12" r="1.2" fill="#ffb37e" opacity="0.85" />
  </SceneSvg>
);

const SCENES: Record<AdventureSceneId, () => React.ReactElement> = {
  desert: DesertScene,
  space: SpaceScene,
  ocean: OceanScene,
  island: IslandScene,
  mansion: MansionScene,
  campus: CampusScene,
  city: CityScene,
  train: TrainScene,
  lighthouse: LighthouseScene,
  forest: ForestScene,
  snow: SnowScene,
  magic: MagicScene,
  mystery: MysteryScene,
  sparkle: SparkleScene
};

export default function AdventureScene({ scene }: AdventureSceneProps) {
  const Scene = SCENES[scene] ?? SparkleScene;
  return <Scene />;
}
