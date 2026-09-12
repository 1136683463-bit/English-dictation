/**
 * 冒险板块专用图标：圆角色块内的双色调实心图形，
 * 与设计稿里的图标风格保持一致（而非通用线性图标）。
 */
export type AdventureGlyphName =
  | "search"
  | "letter"
  | "train"
  | "lighthouse"
  | "sparkle"
  | "waves"
  | "rocket"
  | "compass";

interface AdventureGlyphProps {
  name: AdventureGlyphName;
  size?: number;
}

export default function AdventureGlyph({ name, size = 20 }: AdventureGlyphProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
    focusable: "false" as const
  };

  switch (name) {
    case "search":
      return (
        <svg {...common}>
          <circle cx="10.5" cy="10.5" r="6" fill="currentColor" opacity="0.22" />
          <circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.9" />
          <circle cx="10.5" cy="10.5" r="2.1" fill="currentColor" />
          <path d="M15.4 15.4 20 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case "letter":
      return (
        <svg {...common}>
          <rect x="2.8" y="5.8" width="18.4" height="12.4" rx="3" fill="currentColor" opacity="0.24" />
          <rect x="2.8" y="5.8" width="18.4" height="12.4" rx="3" fill="none" stroke="currentColor" strokeWidth="1.9" />
          <path d="M4.6 8.4 12 13.4l7.4-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "train":
      return (
        <svg {...common}>
          <rect x="4.6" y="3.4" width="14.8" height="14" rx="4" fill="currentColor" opacity="0.24" />
          <rect x="4.6" y="3.4" width="14.8" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="1.9" />
          <path d="M4.6 10.4h14.8" stroke="currentColor" strokeWidth="1.9" />
          <circle cx="9" cy="13.6" r="1.4" fill="currentColor" />
          <circle cx="15" cy="13.6" r="1.4" fill="currentColor" />
          <path d="M8 20.6 6 21.8M16 20.6l2 1.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
      );
    case "lighthouse":
      return (
        <svg {...common}>
          <path d="M9.6 8.2h4.8l1.6 12H8z" fill="currentColor" opacity="0.26" />
          <path d="M9.6 8.2h4.8l1.6 12H8z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M10.4 3.2h3.2v3.4h-3.2z" fill="currentColor" />
          <path d="M8.6 11.4h6.8M9 15h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M6.4 5.4 3.4 4M17.6 5.4 20.6 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...common}>
          <path
            d="M12 2.2c.9 5 3.9 8 8.9 8.9-5 .9-8 3.9-8.9 8.9-.9-5-3.9-8-8.9-8.9 5-.9 8-3.9 8.9-8.9z"
            fill="currentColor"
          />
          <path
            d="M18.6 14.2c.5 2.1 1.7 3.3 3.8 3.8-2.1.5-3.3 1.7-3.8 3.8-.5-2.1-1.7-3.3-3.8-3.8 2.1-.5 3.3-1.7 3.8-3.8z"
            fill="currentColor"
            opacity="0.65"
          />
          <circle cx="6" cy="4.6" r="1.1" fill="currentColor" opacity="0.55" />
        </svg>
      );
    case "waves":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.2" />
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5.2 13.4c1.7-2.1 3.4-2.1 5.1 0 1.7 2.1 3.4 2.1 5.1 0 0.9-1.1 1.9-1.6 3-1.4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
          <path d="M5.2 9.6c1.7-2.1 3.4-2.1 5.1 0 1.7 2.1 3.4 2.1 5.1 0" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" opacity="0.5" />
        </svg>
      );
    case "rocket":
      return (
        <svg {...common}>
          <path d="M12 2.8c3.2 1.6 5 4.6 5 8.2 0 2-.6 3.8-1.7 5.4H8.7A9.1 9.1 0 0 1 7 8.6C8.2 6.1 9.9 4.2 12 2.8z" fill="currentColor" opacity="0.26" />
          <path d="M12 2.8c3.2 1.6 5 4.6 5 8.2 0 2-.6 3.8-1.7 5.4H8.7A9.1 9.1 0 0 1 7 8.6C8.2 6.1 9.9 4.2 12 2.8z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="12" cy="9.6" r="2" fill="currentColor" />
          <path d="M9.4 17.2 8 21l3.4-1.6L12 21l.6-1.6L16 21l-1.4-3.8" fill="currentColor" opacity="0.6" />
        </svg>
      );
    case "compass":
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.2" />
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M15.6 8.4 13.4 13.4 8.4 15.6l2.2-5z" fill="currentColor" />
        </svg>
      );
  }
}
