import type { AdventureSceneId } from "../components/AdventureScene";

/**
 * 内置冒险主题库：50 个脑洞主题，随机推荐直接本地抽样，不再调用 AI。
 * 每个主题在 adventureThemeArtworks.tsx 里有一幅独立手绘的专属插画。
 */
export interface AdventureTheme {
  id: string;
  title: string;
  /** 一句话钩子，控制在 22 字以内，卡片直接展示。 */
  description: string;
  scene: AdventureSceneId;
}

const THEMES: AdventureTheme[] = [
  // ── campus 校园课堂 ──────────────────────────────────────
  { id: "campus-01", scene: "campus", title: "会续写的课本", description: "深夜课本自己写出下一课。" },
  { id: "campus-02", scene: "campus", title: "钟楼里的合唱团", description: "钟声其实是排练的暗号。" },
  { id: "campus-03", scene: "campus", title: "操场尽头的门", description: "越位线后是另一所学校。" },
  { id: "campus-04", scene: "campus", title: "迷宫期末卷", description: "答对下一题才能找到出口。" },

  // ── city 城市街区 ────────────────────────────────────────
  { id: "city-01", scene: "city", title: "每天搬家的城市", description: "早餐时街道已重新洗牌。" },
  { id: "city-02", scene: "city", title: "声音邮局", description: "寄一封装着笑声的信。" },
  { id: "city-03", scene: "city", title: "影子修理铺", description: "你的影子缺了一角。" },
  { id: "city-04", scene: "city", title: "通往上周的电梯", description: "按住 13 楼别松手。" },

  // ── train 列车旅行 ───────────────────────────────────────
  { id: "train-01", scene: "train", title: "开往雪国的夜车", description: "车票是一句温柔的晚安。" },
  { id: "train-02", scene: "train", title: "行李箱里的站台", description: "打开就是另一条铁轨。" },
  { id: "train-03", scene: "train", title: "开进云里的铁道", description: "轨尾拴着一朵等车的云。" },
  { id: "train-04", scene: "train", title: "第 14 节车厢", description: "票面今早刚多印出来的。" },

  // ── lighthouse 灯塔海雾 ──────────────────────────────────
  { id: "lighthouse-01", scene: "lighthouse", title: "鲸背灯塔镇", description: "小镇建在老鲸的背上。" },
  { id: "lighthouse-02", scene: "lighthouse", title: "第 13 次钟声", description: "多出的那声是求救信号。" },
  { id: "lighthouse-03", scene: "lighthouse", title: "退潮的楼梯", description: "它通向海底一扇旧门。" },
  { id: "lighthouse-04", scene: "lighthouse", title: "回忆市集", description: "灯塔下只用回忆交换。" },

  // ── desert 沙漠古城 ──────────────────────────────────────
  { id: "desert-01", scene: "desert", title: "打喷嚏的沙丘", description: "喷出千年前的驼铃。" },
  { id: "desert-02", scene: "desert", title: "蜃楼售票处", description: "海市蜃楼真的能买票。" },
  { id: "desert-03", scene: "desert", title: "接星星的人", description: "银河在这里触到了底。" },
  { id: "desert-04", scene: "desert", title: "沙下的图书馆", description: "藏着一部风的传记。" },

  // ── space 星际太空 ───────────────────────────────────────
  { id: "space-01", scene: "space", title: "月亮修理铺", description: "环形山缺了一块要补。" },
  { id: "space-02", scene: "space", title: "彗星快递", description: "七十六年一班的特快。" },
  { id: "space-03", scene: "space", title: "失重邮局", description: "信件自己去找收件人。" },
  { id: "space-04", scene: "space", title: "宇宙尽头的餐馆", description: "菜单只有一道家乡菜。" },

  // ── ocean 海底世界 ───────────────────────────────────────
  { id: "ocean-01", scene: "ocean", title: "沉船密码", description: "潜入深海找回失落花园。" },
  { id: "ocean-02", scene: "ocean", title: "深海失物招领", description: "领回你掉进海里的梦。" },
  { id: "ocean-03", scene: "ocean", title: "泡泡邮局", description: "把话吹进泡泡寄出去。" },
  { id: "ocean-04", scene: "ocean", title: "海沟电梯", description: "往下是另一片星空。" },

  // ── island 海岛椰风 ──────────────────────────────────────
  { id: "island-01", scene: "island", title: "孤岛寻宝记", description: "解开礁石下的藏宝图。" },
  { id: "island-02", scene: "island", title: "火山巧克力厂", description: "岩浆是融化的巧克力。" },
  { id: "island-03", scene: "island", title: "银河露营地", description: "帐篷外银河触手可及。" },

  // ── mansion 老宅午夜 ─────────────────────────────────────
  { id: "mansion-01", scene: "mansion", title: "老宅钟声", description: "追查午夜钟声的秘密。" },
  { id: "mansion-02", scene: "mansion", title: "会换画的走廊", description: "肖像每晚换一个姿势。" },
  { id: "mansion-03", scene: "mansion", title: "壁炉密信", description: "灰烬里烤出一封旧信。" },
  { id: "mansion-04", scene: "mansion", title: "慢五分钟的镜", description: "镜子里还是旧时光。" },

  // ── forest 迷雾森林 ──────────────────────────────────────
  { id: "forest-01", scene: "forest", title: "迷雾森林向导", description: "萤火虫只照亮真话。" },
  { id: "forest-02", scene: "forest", title: "鹿角灯笼", description: "夜行鹿角上挂着灯。" },
  { id: "forest-03", scene: "forest", title: "树冠图书馆", description: "每片叶子是一本书。" },

  // ── snow 冰雪雪国 ────────────────────────────────────────
  { id: "snow-01", scene: "snow", title: "雪国极光站", description: "追查极光消失的原因。" },
  { id: "snow-02", scene: "snow", title: "冰箱科考站", description: "极地就在冷冻层后面。" },
  { id: "snow-03", scene: "snow", title: "冰雕夜市", description: "天亮前就要全部融化。" },

  // ── magic 魔法奇幻 ───────────────────────────────────────
  { id: "magic-01", scene: "magic", title: "魔法学院试炼", description: "用勇气点亮魔法星。" },
  { id: "magic-02", scene: "magic", title: "天空种植园", description: "云朵挂在藤上成熟。" },
  { id: "magic-03", scene: "magic", title: "浮空岛雨季", description: "今天雨是往上落的。" },

  // ── mystery 悬疑侦探 ─────────────────────────────────────
  { id: "mystery-01", scene: "mystery", title: "消失的第 12 幅画", description: "墙上多出一块空画框。" },
  { id: "mystery-02", scene: "mystery", title: "偷星期三的人", description: "日历整整缺了一天。" },
  { id: "mystery-03", scene: "mystery", title: "倒走的钟塔", description: "塔上的钟都在倒着走。" },

  // ── sparkle 其他奇想 ─────────────────────────────────────
  { id: "sparkle-01", scene: "sparkle", title: "颜色仓库", description: "世界快要用完蓝色。" },
  { id: "sparkle-02", scene: "sparkle", title: "云朵养殖场", description: "给每朵云取个名字。" },
  { id: "sparkle-03", scene: "sparkle", title: "牧星人", description: "赶着星群去换牧场。" }
];

export const ADVENTURE_THEME_LIBRARY = THEMES;

export const ADVENTURE_THEME_BY_ID: ReadonlyMap<string, AdventureTheme> = new Map(
  THEMES.map((theme) => [theme.id, theme])
);

// ── 本地抽样：替代 AI 随机推荐 ───────────────────────────────

/** Fisher-Yates 洗牌（返回新数组）。 */
const shuffle = <T,>(list: T[]): T[] => {
  const result = [...list];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
};

/**
 * 从主题库随机抽 count 个主题：先排除 excludeIds（最近展示过的），
 * 再按「场景桶」轮流取，尽量让同批 4 张卡的插画场景互不重复。
 */
export const sampleAdventureThemes = (count = 4, excludeIds: ReadonlyArray<string> = []): AdventureTheme[] => {
  const excluded = new Set(excludeIds);
  const byScene = new Map<AdventureSceneId, AdventureTheme[]>();
  for (const theme of ADVENTURE_THEME_LIBRARY) {
    if (excluded.has(theme.id)) continue;
    const bucket = byScene.get(theme.scene);
    if (bucket) bucket.push(theme);
    else byScene.set(theme.scene, [theme]);
  }
  const buckets = shuffle([...byScene.keys()]).map((scene) => shuffle(byScene.get(scene)!));
  const picked: AdventureTheme[] = [];
  let cursor = 0;
  while (picked.length < count && buckets.length) {
    const index = cursor % buckets.length;
    const theme = buckets[index].pop();
    if (theme) picked.push(theme);
    if (!buckets[index].length) buckets.splice(index, 1);
    cursor += 1;
  }
  return picked;
};
