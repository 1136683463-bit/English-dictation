# 错词本模块 · 功能图标集 v1.0

> 设计：高象素 · 2026-09-12 · 配套预览：`design/mistake-book-icons-preview.html`

## 风格锚点

| 项目 | 值 |
| --- | --- |
| 网格 | viewBox `0 0 24 24`，主形状落在 20×20 活动区（2px 安全边距） |
| 描边 | `stroke-width="1.75"`（全套唯一值，与现有 lucide 1.8 观感对齐） |
| 端点 / 拐角 | `stroke-linecap="round"` / `stroke-linejoin="round"` |
| 容器圆角 | 矩形类形状统一 `rx="3"`；圆环半径 ≤ 8.25 |
| 色彩 | 单色 `currentColor`，颜色由外层 `color` 注入；点缀（圆点/四角星）允许 `fill="currentColor" stroke="none"` |
| 禁止 | 渐变、投影、文字、混用描边粗细、拉伸变形 |

## 图标清单

| Token | 语义 | 典型场景 | 默认色 |
| --- | --- | --- | --- |
| `mistake-book` | 错词本入口 | 侧边栏入口 / 模块页头 | brand |
| `streak-calendar` | 记录天数 | 统计卡 · 连续记录 | brand |
| `mastered-check` | 已掌握 | 统计卡 / 掌握状态 | success |
| `error-prone` | 仍易错 | 统计卡 / 错误警示 | danger |
| `story-spark` | 已生成 | 统计卡 / AI 故事内容 | violet |
| `repeat-practice` | 重练提醒 | 先练未重练 / 重练标记 | brand |
| `play-practice` | 开始练习 | 开始按钮 / 训练入口 | brand |
| `story-wand` | 生成故事 | AI 生成故事按钮 | 白（按钮内反白） |
| `pronounce` | 发音 | 单词行朗读操作 | brand |
| `filter` | 筛选 | 筛选 chip | ink |
| `search` | 搜索 | 搜索框前缀 | ink |
| `sort-priority` | 排序·修复优先 | 排序下拉 | ink |
| `sliders` | 设置 | 故事设置等配置入口 | ink |
| `plus` | 添加 | 添加单词 / 新建 | ink |

## 颜色 Token（CSS 变量）

```css
--icon-ink: #464C56;        /* 中性工具，hover #333A44 */
--icon-brand: #F97316;      /* 品牌/操作，hover #EA580C */
--icon-success: #22C55E;    /* 已掌握，hover #16A34A */
--icon-danger: #EF4444;     /* 仍易错，hover #DC2626 */
--icon-violet: #8B5CF6;     /* AI/已生成，hover #7C3AED */
--icon-disabled: #C3C9D2;
/* 容器底色 = 对应色 10%–12% 透明度，圆角 8–10 */
```

## 尺寸档位

| 档位 | 用途 |
| --- | --- |
| 16 | 行内、表单、搜索框前缀 |
| 20 | 侧边导航、chip、统计卡 |
| 24 | 按钮、列表行（默认档） |
| 32 / 40 | 分区空态 / 页面空态（配 10% 色底容器） |

## 接入方式

- React：封装 `<Icon name="mistake-book" size={20} />`，组件内 `color` 控制语义色。
- 直接引用 SVG 文件：图形使用 `currentColor`，外层设置 `color` 即可换色/换态。
- 命名：kebab-case 语义命名；组件 token 为 `icon-{name}`。

## 批量扩展（AI 提示词模板）

完整模板见预览页第 07 节，要点：24 网格 + 1.75 描边 + 圆头圆角 + 2px 安全区 + 单色 currentColor，输出后按「安全区 / 描边 / 圆角 / 视觉密度」四项人工校验。
