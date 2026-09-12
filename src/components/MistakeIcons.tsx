import type { SVGProps } from "react";

/**
 * 错词本模块功能图标集（Mb = Mistake Book）
 *
 * 风格规范（全组统一，新增图标必须遵守）：
 * - 网格：24 × 24，内容安全区 3 ~ 21（四周留白 ≥ 2.5，保证视觉重量均衡）
 * - 线条：strokeWidth 1.8，圆头端点 + 圆角拐点（与全站侧栏图标线宽一致）
 * - 颜色：currentColor 单色；语义色（橙/绿/琥珀/紫）由容器芯片提供，图标本身不带色
 * - 圆角：矩形 rx ≥ 2.2，呼应设计稿卡片圆角语言
 * - 命名：Mb + 语义 PascalCase（如 MbSpelling = 拼写重练入口）
 * - 尺寸档位：13（行内眉标）/ 15-17（按钮与工具栏）/ 19（行动行）/ 24（空态）
 * - 结构符号（箭头/雪佛龙）不进本组，继续使用 lucide，保持全局导航语言统一
 */

export interface MbIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function MbIcon({ size = 20, children, ...rest }: MbIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** 搜索（页头圆形按钮 / 工具栏搜索框） */
export const MbSearch = (props: MbIconProps) => (
  <MbIcon {...props}>
    <circle cx="10.8" cy="10.8" r="6.3" />
    <path d="M15.5 15.5 20.2 20.2" />
  </MbIcon>
);

/** 设置（页头圆形按钮 / 故事生成设置） */
export const MbTune = (props: MbIconProps) => (
  <MbIcon {...props}>
    <path d="M4 6.4h3.3" />
    <circle cx="9.7" cy="6.4" r="2.1" />
    <path d="M11.8 6.4H20" />
    <path d="M4 12h9.2" />
    <circle cx="15.5" cy="12" r="2.1" />
    <path d="M17.6 12H20" />
    <path d="M4 17.6h1.4" />
    <circle cx="7.8" cy="17.6" r="2.1" />
    <path d="M9.9 17.6H20" />
  </MbIcon>
);

/** 筛选（工具栏筛选入口） */
export const MbFilter = (props: MbIconProps) => (
  <MbIcon {...props}>
    <path d="M4.5 5.5h15a.7.7 0 0 1 .54 1.15l-5.86 7.01a1 1 0 0 0-.25.65v4.2a.85.85 0 0 1-1.28.73l-2.6-1.55a.9.9 0 0 1-.44-.78v-2.6a1 1 0 0 0-.25-.65L3.96 6.65A.7.7 0 0 1 4.5 5.5Z" />
  </MbIcon>
);

/** 拼写重练（下一步行动 / 重练入口） */
export const MbSpelling = (props: MbIconProps) => (
  <MbIcon {...props}>
    <path d="M7.4 16.4 11.03 7h1.94l3.63 9.4" />
    <path d="M9.1 12.5h5.8" />
    <path d="M6.4 19.8h11.2" />
  </MbIcon>
);

/** 重练这个词（书写笔） */
export const MbPencil = (props: MbIconProps) => (
  <MbIcon {...props}>
    <path d="M16.6 4.2a2.3 2.3 0 0 1 3.25 3.25L7.6 19.7l-4.3 1 1-4.3L16.6 4.2Z" />
    <path d="M14.9 5.9l3.25 3.25" />
  </MbIcon>
);

/** 生成例句（引用气泡） */
export const MbExamples = (props: MbIconProps) => (
  <MbIcon {...props}>
    <path d="M11.9 4.3c4.55 0 8.2 2.83 8.2 6.35 0 3.51-3.65 6.34-8.2 6.34-.86 0-1.7-.1-2.48-.3-1.05.83-2.4 1.4-3.9 1.55.62-.83 1-1.75 1.08-2.72-1.8-1.16-2.9-2.9-2.9-4.87 0-3.52 3.65-6.35 8.2-6.35Z" />
    <path d="M8.8 10.6h6.4" />
    <path d="M8.8 13.5h4" />
  </MbIcon>
);

/** 错词小故事（摊开的书 + 灵感星） */
export const MbStory = (props: MbIconProps) => (
  <MbIcon {...props}>
    <path d="M12 7.4C10.5 6.2 8.5 5.55 6.3 5.55c-.78 0-1.55.08-2.3.24V17.9c.75-.16 1.52-.24 2.3-.24 2.2 0 4.2.62 5.7 1.79 1.5-1.17 3.5-1.79 5.7-1.79.78 0 1.55.08 2.3.24V5.79c-.75-.16-1.52-.24-2.3-.24-2.2 0-4.2.63-5.7 1.85Z" />
    <path d="M12 7.4v12.05" />
    <path
      d="M19.3 2.3l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5Z"
      fill="currentColor"
      stroke="none"
    />
  </MbIcon>
);

/** AI 生成（四角星） */
export const MbSpark = (props: MbIconProps) => (
  <MbIcon {...props}>
    <path d="M11 4.5c.6 4.2 2.85 6.45 7.05 7.05-4.2.6-6.45 2.85-7.05 7.05-.6-4.2-2.85-6.45-7.05-7.05 4.2-.6 6.45-2.85 7.05-7.05Z" />
    <path d="M18.9 3.2c.18 1.25.9 1.97 2.15 2.15-1.25.18-1.97.9-2.15 2.15-.18-1.25-.9-1.97-2.15-2.15 1.25-.18 1.97-.9 2.15-2.15Z" />
  </MbIcon>
);

/** 生成中（旋转箭头） */
export const MbRefresh = (props: MbIconProps) => (
  <MbIcon {...props}>
    <path d="M19.8 12a7.8 7.8 0 1 1-7.8-7.8c2.2 0 4.25.86 5.8 2.4l1.55 1.5" />
    <path d="M19.9 3.5v4.9h-4.9" />
  </MbIcon>
);

/** 复制 */
export const MbCopy = (props: MbIconProps) => (
  <MbIcon {...props}>
    <rect x="8.8" y="8.8" width="11" height="11" rx="2.3" />
    <path d="M5.9 15.2h-.4a1.9 1.9 0 0 1-1.9-1.9V5.9a2.3 2.3 0 0 1 2.3-2.3h7.4a1.9 1.9 0 0 1 1.9 1.9v.4" />
  </MbIcon>
);

/** 已复制 / 通用确认 */
export const MbCheck = (props: MbIconProps) => (
  <MbIcon {...props}>
    <path d="M4.8 12.6l4.3 4.3L19.2 6.6" />
  </MbIcon>
);

/** 记录天数（打卡日历） */
export const MbCalendarCheck = (props: MbIconProps) => (
  <MbIcon {...props}>
    <rect x="3.9" y="5.4" width="16.2" height="14.6" rx="2.4" />
    <path d="M3.9 10.2h16.2" />
    <path d="M8.3 3.2v3.6" />
    <path d="M15.7 3.2v3.6" />
    <path d="M9.4 15l1.9 1.9 3.4-3.6" />
  </MbIcon>
);

/** 当天已掌握（圆环勾） */
export const MbMastered = (props: MbIconProps) => (
  <MbIcon {...props}>
    <circle cx="12" cy="12" r="8.3" />
    <path d="M8.4 12.4l2.5 2.5 4.7-5" />
  </MbIcon>
);

/** 仍易错（圆角警示三角） */
export const MbAlert = (props: MbIconProps) => (
  <MbIcon {...props}>
    <path d="M10.6 4.7c.6-1.05 2.14-1.05 2.74 0l6.9 11.9c.6 1.03-.14 2.3-1.34 2.3H5.1c-1.2 0-1.94-1.27-1.34-2.3l6.84-11.9Z" />
    <path d="M12 9.8v3.5" />
    <path d="M12 16.4v.01" />
  </MbIcon>
);
