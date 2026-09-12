import type { ReactNode } from "react";

/**
 * 50 幅主题专属插画：每幅都是为该主题剧情独立设计的 96×96 扁平小场景。
 * 注册表 key = 主题 id；AdventureThemeArt 组件按 id 取用。
 * 约定：统一扁平风、圆角色块、两三层景深；渐变 id 以主题 id 命名避免冲突。
 */
export const ADVENTURE_THEME_ARTWORKS: Record<string, () => ReactNode> = {
  // ── campus 校园课堂 ──────────────────────────────────────
  "campus-01": () => (
    <>
      <defs><linearGradient id="g-campus-01" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2e3a67" /><stop offset="1" stopColor="#5f6aa8" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-campus-01)" />
      <circle cx="80" cy="14" r="6" fill="#fff6d8" /><circle cx="83" cy="12" r="5" fill="#4a5490" />
      <circle cx="16" cy="12" r="1.1" fill="#fff" opacity=".9" /><circle cx="30" cy="20" r=".9" fill="#fff" opacity=".7" /><circle cx="52" cy="9" r="1" fill="#fff" opacity=".8" />
      <rect y="72" width="96" height="24" fill="#7a5238" />
      <circle cx="74" cy="34" r="14" fill="#ffd98f" opacity=".25" /><circle cx="74" cy="34" r="9" fill="#ffd98f" opacity=".3" />
      <path d="M74 30 l-2.6 5.4 h6 l-8 6.4" stroke="#a8743f" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M22 70 Q40 62 47 70 Q54 62 72 70 V54 Q54 46 47 54 Q40 46 22 54 Z" fill="#fdf7ea" />
      <path d="M47 54 V70" stroke="#d9cba8" strokeWidth="1.6" />
      <path d="M28 58 q8 -3.4 15 0 M28 63 q8 -3.4 15 0" stroke="#b9a97e" strokeWidth="1.3" fill="none" />
      <path d="M51 49 q4 -7 1 -12 q7 3 6 11" fill="none" stroke="#ffd76e" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M58 46 q3 -5 8 -4" fill="none" stroke="#ffe9ad" strokeWidth="1.5" strokeLinecap="round" opacity=".85" />
      <path d="M56 22 l1.1 2.4 2.4 1.1 -2.4 1.1 -1.1 2.4 -1.1 -2.4 -2.4 -1.1 2.4 -1.1 Z" fill="#ffe9ad" />
    </>
  ),
  "campus-02": () => (
    <>
      <defs><linearGradient id="g-campus-02" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f8c98a" /><stop offset="1" stopColor="#fdeecb" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-campus-02)" />
      <rect y="76" width="96" height="20" fill="#b8cf8f" />
      <rect x="34" y="22" width="28" height="54" fill="#c96f4a" />
      <path d="M30 22 L48 8 L66 22 Z" fill="#a8563a" />
      <circle cx="48" cy="34" r="7" fill="#fdf7ea" /><path d="M48 34 V30 M48 34 l3 2" stroke="#a8563a" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M38 48 a10 11 0 0 1 20 0 v8 h-20 Z" fill="#3a2318" />
      <path d="M43 51 q2.4 -5 4.8 0 v4.4 h-4.8 Z" fill="#f2b134" />
      <path d="M48.4 51 q2.4 -5 4.8 0 v4.4 h-4.8 Z" fill="#e2574c" />
      <path d="M46.2 58 q1.8 -4.6 3.8 0 v4.6 h-3.8 Z" fill="#c96f4a" />
      <circle cx="48" cy="34" r="7" fill="#fdf7ea" /><path d="M48 34 V30 M48 34 l3 2" stroke="#a8563a" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M70 30 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4 Z" fill="#c96f4a" />
      <path d="M74 44 q2.6 -3 5.4 -1.4 M78 52 q2.8 -2.4 5.4 -.6" stroke="#a8563a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </>
  ),
  "campus-03": () => (
    <>
      <defs><linearGradient id="g-campus-03" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bfe3fa" /><stop offset="1" stopColor="#eaf5e2" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-campus-03)" />
      <rect y="64" width="96" height="32" fill="#9ccf7f" />
      <path d="M0 84 Q48 72 96 84" stroke="#fff" strokeWidth="1.6" fill="none" opacity=".7" />
      <rect x="8" y="38" width="3" height="28" fill="#fff" /><rect x="26" y="38" width="3" height="28" fill="#fff" /><rect x="8" y="38" width="21" height="3" fill="#fff" />
      <path d="M62 66 V36 h20 v30" fill="none" stroke="#8a6a4a" strokeWidth="3" />
      <path d="M66 66 V42 h10 v24" fill="#ffedbe" stroke="#8a6a4a" strokeWidth="2" />
      <circle cx="71" cy="52" r="2.2" fill="#ffd76e" />
      <path d="M71 30 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4 Z" fill="#f2b134" />
      <circle cx="86" cy="14" r="7" fill="#ffd76e" opacity=".9" />
    </>
  ),
  "campus-04": () => (
    <>
      <rect width="96" height="96" fill="#fbf4e0" />
      <rect x="6" y="6" width="84" height="84" rx="6" fill="#fff" stroke="#e8dcbe" strokeWidth="1.4" />
      <path d="M22 22 h52 v52 h-30 v-10 h20 v-32 h-32 v22 h12" fill="none" stroke="#4a5a78" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M32 34 h22 M42 54 h22 M22 62 h12" stroke="#4a5a78" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="22" cy="22" r="3.4" fill="#e2574c" />
      <path d="M74 74 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0" fill="#4caf7d" />
      <g transform="rotate(38 76 76)"><rect x="74" y="60" width="4.4" height="14" rx="2" fill="#f2b134" /><path d="M74 74 h4.4 l-2.2 6 Z" fill="#e2574c" /></g>
      <circle cx="86" cy="14" r="3" fill="#4caf7d" opacity=".85" />
    </>
  ),

  // ── city 城市街区 ────────────────────────────────────────
  "city-01": () => (
    <>
      <defs><linearGradient id="g-city-01" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c3e4fb" /><stop offset="1" stopColor="#fdf3d8" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-city-01)" />
      <rect y="84" width="96" height="12" fill="#9aa7b8" opacity=".5" />
      <g transform="rotate(-5 30 52)"><rect x="20" y="44" width="20" height="32" fill="#6f93c1" /><rect x="24" y="49" width="4" height="4" fill="#fdf3d8" /><rect x="31" y="49" width="4" height="4" fill="#fdf3d8" /><rect x="24" y="57" width="4" height="4" fill="#fdf3d8" /><rect x="31" y="57" width="4" height="4" fill="#fdf3d8" /></g>
      <g transform="rotate(6 62 46)"><rect x="52" y="34" width="22" height="34" fill="#e2574c" opacity=".85" /><rect x="56" y="39" width="4" height="4" fill="#fdf3d8" /><rect x="64" y="39" width="4" height="4" fill="#fdf3d8" /><rect x="56" y="48" width="4" height="4" fill="#fdf3d8" /><rect x="64" y="48" width="4" height="4" fill="#fdf3d8" /></g>
      <circle cx="30" cy="30" r="5.4" fill="#f2b134" /><path d="M30 35.4 V44" stroke="#9a6b2f" strokeWidth="1.4" />
      <circle cx="57" cy="20" r="5.4" fill="#f2b134" opacity=".95" /><circle cx="64" cy="24" r="4.2" fill="#f2b134" opacity=".8" /><path d="M57 25.4 V34 M64 28.2 V34" stroke="#9a6b2f" strokeWidth="1.4" />
      <ellipse cx="76" cy="18" rx="10" ry="4.4" fill="#fff" opacity=".9" /><ellipse cx="18" cy="24" rx="8" ry="3.6" fill="#fff" opacity=".8" />
    </>
  ),
  "city-02": () => (
    <>
      <defs><linearGradient id="g-city-02" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f7b98b" /><stop offset="1" stopColor="#fce4c4" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-city-02)" />
      <rect y="76" width="96" height="20" fill="#8f7a8b" />
      <rect x="18" y="30" width="60" height="46" rx="3" fill="#a86a4e" />
      <path d="M14 30 L48 16 L82 30 Z" fill="#8a5340" />
      <rect x="38" y="52" width="20" height="24" fill="#5c3a2e" />
      <rect x="26" y="38" width="14" height="10" rx="1.6" fill="#f2b134" />
      <rect x="56" y="38" width="14" height="10" rx="1.6" fill="#f2b134" />
      <g transform="translate(48 66)"><rect x="-11" y="-7" width="22" height="14" rx="2" fill="#fdf7ea" /><path d="M-11 -7 L0 1 L11 -7" fill="none" stroke="#c9a86a" strokeWidth="1.4" /><path d="M-16 -2 q4 -4 8 0 q4 4 8 0 q4 -4 8 0 M-13 3 q3 -3 6 0 q3 3 6 0" stroke="#e2574c" strokeWidth="1.4" fill="none" strokeLinecap="round" /></g>
    </>
  ),
  "city-03": () => (
    <>
      <defs><linearGradient id="g-city-03" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#202a4e" /><stop offset="1" stopColor="#4d5a96" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-city-03)" />
      <rect y="80" width="96" height="16" fill="#252e57" />
      <rect x="14" y="10" width="3" height="40" fill="#39447a" /><circle cx="15.5" cy="10" r="5" fill="#ffd76e" opacity=".9" />
      <g fill="#1b2344"><circle cx="46" cy="34" r="6" /><rect x="41" y="40" width="10" height="22" rx="4" /><path d="M51 46 l6 3" stroke="#1b2344" strokeWidth="3" strokeLinecap="round" /><rect x="42" y="62" width="3.6" height="18" /><rect x="47.4" y="62" width="3.6" height="18" /></g>
      <g fill="#39447a" opacity=".95"><circle cx="72" cy="34" r="6" /><rect x="67" y="40" width="10" height="22" rx="4" /><path d="M77 46 l6 3" stroke="#39447a" strokeWidth="3" strokeLinecap="round" /><rect x="68" y="62" width="3.6" height="18" /><rect x="73.4" y="62" width="3.6" height="18" /></g>
      <path d="M82 40 v8 M82 40 h6" stroke="#ffd76e" strokeWidth="1.6" strokeDasharray="2.6 2.2" fill="none" strokeLinecap="round" />
      <circle cx="86" cy="26" r="1.6" fill="#ffd76e" opacity=".8" />
    </>
  ),
  "city-04": () => (
    <>
      <rect width="96" height="96" fill="#8a6a55" />
      <g fill="#7a5c48"><rect x="0" y="0" width="96" height="96" fill="none" /><path d="M0 12 h20 M30 4 h22 M64 10 h18 M6 30 h14 M78 28 h12" stroke="#7a5c48" strokeWidth="4" strokeLinecap="round" /></g>
      <rect x="26" y="16" width="44" height="64" rx="4" fill="#5c463a" />
      <rect x="32" y="24" width="32" height="48" fill="#ffe9b8" />
      <path d="M32 24 h32 v48 h-32 Z" fill="none" stroke="#caa25e" strokeWidth="2" />
      <path d="M40 24 v48 M56 24 v48" stroke="#caa25e" strokeWidth="1.6" opacity=".8" />
      <circle cx="78" cy="26" r="9" fill="#fdf7ea" />
      <path d="M78 26 l3.4 -3 M78 26 l-2.6 3.4" stroke="#8a6a55" strokeWidth="1.6" strokeLinecap="round" />
      <text x="78" y="40" fontSize="7" fill="#ffe9b8" textAnchor="middle" fontWeight="700">13</text>
      <path d="M12 64 q4 -8 8 0 M18 78 q4 -8 8 0" stroke="#caa25e" strokeWidth="1.4" fill="none" opacity=".7" />
    </>
  ),

  // ── train 列车旅行 ───────────────────────────────────────
  "train-01": () => (
    <>
      <defs><linearGradient id="g-train-01" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a3560" /><stop offset="1" stopColor="#5d6ca8" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-train-01)" />
      <path d="M78 16 a7 7 0 1 0 4 9 a6 6 0 1 1 -4 -9" fill="#fff6d8" />
      <circle cx="18" cy="16" r="1" fill="#fff" opacity=".8" /><circle cx="40" cy="10" r=".9" fill="#fff" opacity=".7" /><circle cx="62" cy="18" r="1" fill="#fff" opacity=".8" />
      <path d="M-4 78 Q20 70 40 76 Q66 82 100 74 V96 h-104 Z" fill="#e8f1fa" />
      <rect x="18" y="52" width="52" height="20" rx="7" fill="#33517a" />
      <path d="M70 52 q10 2 10 10 q0 8 -10 10 Z" fill="#33517a" />
      <rect x="26" y="57" width="8" height="7" rx="1.4" fill="#ffd76e" /><rect x="38" y="57" width="8" height="7" rx="1.4" fill="#ffd76e" /><rect x="50" y="57" width="8" height="7" rx="1.4" fill="#ffd76e" />
      <circle cx="30" cy="76" r="3.6" fill="#22335a" /><circle cx="56" cy="76" r="3.6" fill="#22335a" />
      <path d="M70 62 l6 -2" stroke="#ffd76e" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="10" cy="30" r="1.3" fill="#fff" /><circle cx="84" cy="34" r="1.1" fill="#fff" opacity=".8" />
    </>
  ),
  "train-02": () => (
    <>
      <rect width="96" height="96" fill="#4f7a8c" />
      <rect y="76" width="96" height="20" fill="#3f6273" />
      <path d="M24 54 L32 24 h32 l8 30 Z" fill="#c98a52" />
      <path d="M32 24 h32" stroke="#8a5f34" strokeWidth="2.4" />
      <path d="M36 32 h24 M36 42 h24" stroke="#8a5f34" strokeWidth="1.6" opacity=".7" />
      <rect x="18" y="52" width="60" height="26" rx="4" fill="#a8743f" />
      <path d="M30 52 h36 v9 a18 9 0 0 1 -36 0 Z" fill="#2e2013" />
      <path d="M40 54 V30 M56 54 V30" stroke="#e8dfc8" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M40 48 h16 M40 40 h16" stroke="#e8dfc8" strokeWidth="1.8" />
      <circle cx="48" cy="26" r="4.4" fill="#e2574c" /><rect x="43" y="26" width="10" height="4" rx="2" fill="#e2574c" />
      <circle cx="48" cy="25" r="1.2" fill="#ffe9ad" />
      <path d="M12 20 l1.1 2.4 2.4 1.1 -2.4 1.1 -1.1 2.4 -1.1 -2.4 -2.4 -1.1 2.4 -1.1 Z" fill="#ffe9ad" />
    </>
  ),
  "train-03": () => (
    <>
      <defs><linearGradient id="g-train-03" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bcdff6" /><stop offset="1" stopColor="#f6efd2" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-train-03)" />
      <ellipse cx="68" cy="30" rx="26" ry="14" fill="#fff" />
      <ellipse cx="52" cy="24" rx="14" ry="9" fill="#fff" opacity=".95" />
      <path d="M-2 88 Q20 70 44 78 Q64 84 82 62" fill="none" stroke="#8a6a4a" strokeWidth="3.4" />
      <path d="M-2 92 Q20 74 44 82 Q62 87 78 68" fill="none" stroke="#8a6a4a" strokeWidth="3.4" />
      <path d="M6 88 l5 -3 M22 82 l5 -3 M38 79 l5 -3 M54 80 l5 -3 M68 74 l5 -3" stroke="#6a4f34" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="82" cy="60" r="7" fill="#e2574c" /><rect x="76" y="60" width="12" height="8" rx="3" fill="#e2574c" />
      <circle cx="86" cy="59" r="1.6" fill="#ffe9ad" />
      <path d="M14 30 q3 -3 6 0 M22 24 q3 -3 6 0" stroke="#5f83a3" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </>
  ),
  "train-04": () => (
    <>
      <defs><linearGradient id="g-train-04" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#232c50" /><stop offset="1" stopColor="#454f85" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-train-04)" />
      <rect y="74" width="96" height="22" fill="#1c2440" />
      <rect x="74" y="12" width="14" height="18" rx="2" fill="#39447a" />
      <text x="81" y="25" fontSize="10" fill="#ffd76e" textAnchor="middle" fontWeight="700">14</text>
      <rect x="-6" y="48" width="60" height="22" rx="6" fill="#33517a" />
      <rect x="4" y="53" width="9" height="8" rx="1.4" fill="#ffd76e" /><rect x="18" y="53" width="9" height="8" rx="1.4" fill="#ffd76e" /><rect x="32" y="53" width="9" height="8" rx="1.4" fill="#ffd76e" />
      <g opacity=".95"><rect x="60" y="48" width="34" height="22" rx="6" fill="none" stroke="#ffe9ad" strokeWidth="1.8" strokeDasharray="4 3" /><rect x="68" y="53" width="9" height="8" rx="1.4" fill="#ffe9ad" opacity=".5" /></g>
      <circle cx="18" cy="74" r="3.4" fill="#141a38" /><circle cx="44" cy="74" r="3.4" fill="#141a38" /><circle cx="74" cy="74" r="3.4" fill="#141a38" />
      <circle cx="90" cy="34" r="1.4" fill="#fff" opacity=".8" />
    </>
  ),

  // ── lighthouse 灯塔海雾 ──────────────────────────────────
  "lighthouse-01": () => (
    <>
      <defs><linearGradient id="g-lighthouse-01" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f5b98d" /><stop offset="1" stopColor="#f9e0c2" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-lighthouse-01)" />
      <rect y="62" width="96" height="34" fill="#5f9ec0" />
      <path d="M0 62 q6 -4 12 0 q6 4 12 0 q6 -4 12 0 q6 4 12 0 q6 -4 12 0 q6 4 12 0 q6 -4 12 0 v4 h-96 Z" fill="#7fb5cb" opacity=".8" />
      <path d="M14 62 Q30 34 52 38 Q78 42 84 58 Q86 62 82 62 Z" fill="#3c5a80" />
      <path d="M84 56 q12 -2 10 6 q-6 4 -12 0 Z" fill="#3c5a80" />
      <circle cx="14" cy="56" r="2.6" fill="#3c5a80" />
      <rect x="52" y="18" width="8" height="20" fill="#fdf7ea" /><path d="M50 18 l6 -8 6 8 Z" fill="#e2574c" />
      <rect x="52.8" y="14" width="6.4" height="5" fill="#ffd76e" />
      <path d="M36 46 h8 v12 h-8 Z M40 42 l4 4 h-8 Z" fill="#f2b134" /><rect x="39" y="58" width="2.4" height="4" fill="#8a5a3a" />
      <path d="M26 20 q4 4 0 8 M32 16 q5 6 0 13" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".8" />
    </>
  ),
  "lighthouse-02": () => (
    <>
      <defs><linearGradient id="g-lighthouse-02" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a688c" /><stop offset="1" stopColor="#8b96b4" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-lighthouse-02)" />
      <path d="M8 20 l2 6 M26 14 l2 6 M48 22 l2 6 M70 12 l2 6 M86 24 l2 6 M18 34 l2 6 M60 34 l2 6" stroke="#c8d2e8" strokeWidth="1.4" strokeLinecap="round" opacity=".7" />
      <path d="M-4 76 Q16 62 34 72 Q52 80 72 70 Q88 64 100 74 V96 h-104 Z" fill="#33406b" />
      <rect x="40" y="34" width="16" height="34" fill="#2b3558" />
      <path d="M38 34 L48 24 L58 34 Z" fill="#222b4a" />
      <path d="M42 42 a8 8 0 0 1 12 0 v5 h-12 Z" fill="#39466f" />
      <circle cx="48" cy="45" r="4.4" fill="#ffd76e" />
      <path d="M36 44 q-5 1 -7 5 M60 44 q5 1 7 5" stroke="#ffd76e" strokeWidth="1.6" fill="none" opacity=".8" />
      <path d="M30 56 q-4 4 0 8 M66 58 q4 4 0 8 M38 62 q-3 4 0 7 M58 64 q3 4 0 7" stroke="#c8d2e8" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".65" />
    </>
  ),
  "lighthouse-03": () => (
    <>
      <defs><linearGradient id="g-lighthouse-03" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fb8d8" /><stop offset="1" stopColor="#dfe9e6" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-lighthouse-03)" />
      <path d="M52 0 H96 V64 L84 60 L74 64 L62 60 L52 64 Z" fill="#58719c" />
      <path d="M62 6 l10 7 -7 7 10 7 -7 7 10 7" fill="none" stroke="#e8dfc8" strokeWidth="4.6" strokeLinecap="round" />
      <circle cx="62" cy="6" r="2.4" fill="#ffd76e" />
      <rect y="60" width="96" height="36" fill="#5f8aa8" />
      <path d="M0 62 q6 -3 12 0 q6 3 12 0 q6 -3 12 0 q6 3 12 0 q6 -3 12 0 q6 3 12 0 q6 -3 12 0 q6 3 12 0 v3 H0 Z" fill="#7fa8bd" />
      <path d="M60 72 q8 -5 16 0 l-2.4 14 h-11.2 Z" fill="#3f6a86" />
      <path d="M64 79 a4.4 4.4 0 0 1 8.8 0 v2.2 h-8.8 Z" fill="#ffe9ad" />
      <circle cx="62" cy="90" r="1.4" fill="#e8f4f8" /><circle cx="72" cy="93" r="1.1" fill="#e8f4f8" />
    </>
  ),
  "lighthouse-04": () => (
    <>
      <defs><linearGradient id="g-lighthouse-04" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3f4a78" /><stop offset="1" stopColor="#7a7fae" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-lighthouse-04)" />
      <rect y="72" width="96" height="24" fill="#2c3558" />
      <rect x="10" y="14" width="10" height="58" fill="#e8e0d0" /><path d="M8 14 L15 4 L22 14 Z" fill="#e2574c" />
      <rect x="11.6" y="9" width="6.8" height="5" fill="#ffd76e" />
      <path d="M20 12 L44 22 M20 12 L44 34" stroke="#ffe9ad" strokeWidth="2" opacity=".65" />
      <path d="M34 72 v-10 h22 v10 Z" fill="#8a5a3a" /><path d="M32 62 L45 54 L58 62 Z" fill="#a8743f" />
      <path d="M62 72 v-8 h20 v8 Z" fill="#8a5a3a" /><path d="M60 64 L72 56 L84 64 Z" fill="#a8743f" />
      <path d="M38 50 l3 -4 3 4 Z M50 48 l3 -4 3 4 Z" fill="#e8dfc8" />
      <circle cx="45" cy="68" r="2" fill="#ffd76e" /><circle cx="68" cy="68" r="2" fill="#ffd76e" />
      <circle cx="88" cy="16" r="1.4" fill="#fff" opacity=".8" />
    </>
  ),

  // ── desert 沙漠古城 ──────────────────────────────────────
  "desert-01": () => (
    <>
      <defs><linearGradient id="g-desert-01" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd9a0" /><stop offset="1" stopColor="#f9ead0" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-desert-01)" />
      <circle cx="20" cy="16" r="8" fill="#e2574c" opacity=".85" />
      <path d="M-4 78 Q22 58 48 74 Q74 66 100 76 V96 h-104 Z" fill="#e8b06e" />
      <path d="M30 72 Q34 48 52 46 Q66 48 68 70 Z" fill="#d99a5e" />
      <ellipse cx="50" cy="38" rx="14" ry="9" fill="#fff" opacity=".92" />
      <ellipse cx="40" cy="34" rx="8" ry="6" fill="#fff" opacity=".85" />
      <path d="M58 28 l3 -6 M64 32 l6 -4 M60 20 l2 -6" stroke="#e2574c" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="74" cy="18" r="3" fill="#f2b134" /><path d="M74 15 v-2 M74 21 v2 M71 18 h-2 M77 18 h2" stroke="#a8743f" strokeWidth="1.2" />
      <path d="M22 30 q4 -3 8 0" stroke="#a8743f" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </>
  ),
  "desert-02": () => (
    <>
      <defs><linearGradient id="g-desert-02" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f7b27e" /><stop offset="1" stopColor="#fde8c8" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-desert-02)" />
      <circle cx="76" cy="16" r="8" fill="#f2b134" opacity=".9" />
      <g opacity=".5" fill="none" stroke="#fff" strokeWidth="1.6"><path d="M8 44 v-12 l6 -6 6 6 v12 M28 44 v-16 l5 -7 5 7 v16 M52 44 v-10 h10 v10 M70 44 v-14 l5 -5 5 5 v14" /></g>
      <path d="M-4 52 Q30 46 60 52 Q84 56 100 50 V96 h-104 Z" fill="#e8b06e" />
      <rect x="34" y="56" width="28" height="22" fill="#c98a52" />
      <path d="M32 56 L48 46 L64 56 Z" fill="#a86f42" />
      <rect x="42" y="62" width="12" height="10" fill="#3f2f22" />
      <rect x="44" y="64" width="8" height="6" fill="#ffe9ad" />
      <circle cx="76" cy="60" r="1.6" fill="#fdf7ea" opacity=".9" />
    </>
  ),
  "desert-03": () => (
    <>
      <defs><linearGradient id="g-desert-03" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3c3a6e" /><stop offset="1" stopColor="#8f6b8e" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-desert-03)" />
      <path d="M-4 30 Q24 12 48 26 Q74 40 100 22" stroke="#c8b8e8" strokeWidth="7" fill="none" opacity=".4" strokeLinecap="round" />
      <circle cx="20" cy="16" r="1.2" fill="#fff" /><circle cx="44" cy="10" r="1.4" fill="#fff" /><circle cx="66" cy="14" r="1" fill="#fff" /><circle cx="84" cy="24" r="1.3" fill="#fff" /><circle cx="58" cy="20" r="1" fill="#fff" />
      <path d="M-4 80 Q30 62 56 76 Q80 68 100 78 V96 h-104 Z" fill="#7a5c72" />
      <g fill="#2e2a52"><circle cx="52" cy="52" r="4" /><rect x="49" y="56" width="6" height="12" rx="2.6" /><path d="M44 64 l6 4" stroke="#2e2a52" strokeWidth="3" strokeLinecap="round" /><path d="M55 62 l8 -8" stroke="#2e2a52" strokeWidth="3" strokeLinecap="round" /><path d="M60 50 a10 10 0 0 1 8 -3 M64 45 a14 14 0 0 1 10 -2" stroke="#2e2a52" strokeWidth="1.6" fill="none" strokeLinecap="round" /></g>
      <g fill="#ffe9ad"><circle cx="76" cy="44" r="2.2" /><circle cx="84" cy="50" r="1.8" /><circle cx="72" cy="54" r="1.6" /></g>
      <path d="M76 44 l6 -8 M84 50 l7 -6" stroke="#ffe9ad" strokeWidth="1" opacity=".7" />
    </>
  ),
  "desert-04": () => (
    <>
      <defs><linearGradient id="g-desert-04" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f9cf9b" /><stop offset="1" stopColor="#fdf0d5" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-desert-04)" />
      <circle cx="80" cy="14" r="6.4" fill="#e2574c" opacity=".85" />
      <path d="M-4 40 Q30 24 60 38 Q84 46 100 38 V96 h-104 Z" fill="#e8b06e" />
      <path d="M-4 46 Q30 32 62 44 Q84 50 100 44 V96 h-104 Z" fill="#d99a5e" />
      <path d="M18 60 Q18 44 48 44 Q78 44 78 60 V96 H18 Z" fill="#8a5f3e" />
      <path d="M26 60 Q26 50 48 50 Q70 50 70 60 V96 H26 Z" fill="#5f4226" />
      <rect x="30" y="62" width="3.6" height="16" fill="#e8b06e" /><rect x="36" y="60" width="3.6" height="20" fill="#e8b06e" /><rect x="42" y="64" width="3.6" height="18" fill="#e8b06e" />
      <rect x="52" y="62" width="3.6" height="16" fill="#e8b06e" /><rect x="58" y="60" width="3.6" height="20" fill="#e8b06e" /><rect x="64" y="64" width="3.6" height="18" fill="#e8b06e" />
      <path d="M48 58 l1.2 2.6 2.6 1.2 -2.6 1.2 -1.2 2.6 -1.2 -2.6 -2.6 -1.2 2.6 -1.2 Z" fill="#ffe9ad" />
      <rect x="44" y="52" width="8" height="5" rx="1" fill="#e2574c" opacity=".9" />
    </>
  ),

  // ── space 星际太空 ───────────────────────────────────────
  "space-01": () => (
    <>
      <defs><linearGradient id="g-space-01" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1d2547" /><stop offset="1" stopColor="#4c3f7d" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-space-01)" />
      <circle cx="10" cy="14" r="1.2" fill="#fff" opacity=".9" /><circle cx="30" cy="8" r="1" fill="#fff" opacity=".7" /><circle cx="86" cy="40" r="1.1" fill="#fff" opacity=".8" />
      <circle cx="48" cy="44" r="26" fill="#e8dfc8" />
      <circle cx="38" cy="36" r="5" fill="#c9bd9e" /><circle cx="58" cy="52" r="6.4" fill="#c9bd9e" /><circle cx="42" cy="58" r="3.6" fill="#c9bd9e" /><circle cx="60" cy="30" r="3" fill="#c9bd9e" />
      <path d="M44 44 h14 v6 h-14 Z" fill="#e2574c" /><path d="M44 47 h14" stroke="#fdf7ea" strokeWidth="1.8" />
      <g transform="rotate(40 76 72)"><rect x="74" y="60" width="4" height="16" rx="2" fill="#8fd0ff" /><path d="M72 76 h8 l-2 5 h-4 Z" fill="#8fd0ff" /></g>
      <rect x="14" y="70" width="14" height="10" rx="2" fill="#8a6a4a" /><rect x="19" y="66" width="4" height="4" fill="#8a6a4a" />
    </>
  ),
  "space-02": () => (
    <>
      <defs><linearGradient id="g-space-02" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#25204a" /><stop offset="1" stopColor="#7a4b86" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-space-02)" />
      <circle cx="14" cy="20" r="1.2" fill="#fff" opacity=".9" /><circle cx="82" cy="16" r="1" fill="#fff" opacity=".7" /><circle cx="70" cy="74" r="1.1" fill="#fff" opacity=".8" />
      <path d="M84 78 Q60 62 40 44 Q26 30 16 16" stroke="#ffd76e" strokeWidth="7" fill="none" strokeLinecap="round" opacity=".45" />
      <path d="M84 78 Q60 62 40 44" stroke="#ffe9ad" strokeWidth="3.4" fill="none" strokeLinecap="round" opacity=".85" />
      <circle cx="38" cy="42" r="9" fill="#e2574c" />
      <rect x="33" y="39" width="10" height="7" rx="1" fill="#a8743f" stroke="#5c3a2e" strokeWidth="1" /><path d="M33 42.5 h10 M38 39 v7" stroke="#5c3a2e" strokeWidth="1" />
      <path d="M30 34 l2 -3 M46 33 l-1 -4" stroke="#ffe9ad" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  "space-03": () => (
    <>
      <defs><linearGradient id="g-space-03" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#101c3c" /><stop offset="1" stopColor="#2f5a86" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-space-03)" />
      <circle cx="16" cy="70" r="1.2" fill="#fff" opacity=".9" /><circle cx="84" cy="20" r="1" fill="#fff" opacity=".7" /><circle cx="70" cy="12" r="1.2" fill="#fff" opacity=".8" />
      <g transform="rotate(-18 48 48)">
        <rect x="34" y="38" width="24" height="18" rx="3" fill="#e2574c" />
        <path d="M34 47 h24" stroke="#a8423a" strokeWidth="1.6" />
        <rect x="40" y="30" width="3" height="8" fill="#a8423a" /><rect x="49" y="30" width="3" height="8" fill="#a8423a" />
        <rect x="38" y="43" width="6" height="4.6" rx="1" fill="#ffe9ad" /><rect x="48" y="43" width="6" height="4.6" rx="1" fill="#ffe9ad" />
      </g>
      <g transform="rotate(12 70 62)"><rect x="64" y="58" width="14" height="10" rx="1.6" fill="#fdf7ea" /><path d="M64 60 l7 5 7 -5" fill="none" stroke="#c9a86a" strokeWidth="1.2" /></g>
      <g transform="rotate(-30 30 66)"><rect x="24" y="62" width="12" height="9" rx="1.4" fill="#ffe9ad" opacity=".9" /><path d="M24 64 l6 4 6 -4" fill="none" stroke="#c9a86a" strokeWidth="1" /></g>
      <path d="M20 30 q-3 3 0 6 M26 26 q-3 3 0 6" stroke="#7de3c3" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".8" />
    </>
  ),
  "space-04": () => (
    <>
      <defs><linearGradient id="g-space-04" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2c2450" /><stop offset="1" stopColor="#a05a74" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-space-04)" />
      <circle cx="12" cy="14" r="1.2" fill="#fff" opacity=".9" /><circle cx="34" cy="20" r="1" fill="#fff" opacity=".7" /><circle cx="80" cy="12" r="1.1" fill="#fff" opacity=".8" />
      <rect x="10" y="30" width="76" height="34" rx="3" fill="#1c1838" opacity=".0" />
      <rect x="10" y="26" width="76" height="38" rx="4" fill="#141030" />
      <rect x="16" y="32" width="64" height="26" rx="2" fill="#312a5c" />
      <circle cx="30" cy="45" r="2" fill="#fff" opacity=".9" /><circle cx="48" cy="38" r="1.4" fill="#fff" opacity=".7" /><circle cx="66" cy="48" r="1.8" fill="#fff" opacity=".85" />
      <circle cx="38" cy="55" r="1.2" fill="#fff" opacity=".6" />
      <rect y="64" width="96" height="32" fill="#8a4a5c" />
      <ellipse cx="34" cy="66" rx="12" ry="2.6" fill="#b36a7c" />
      <circle cx="34" cy="60" r="6" fill="#7de3c3" /><circle cx="32" cy="58" r="1.4" fill="#4aa88a" /><circle cx="36.4" cy="61" r="1" fill="#4aa88a" />
      <path d="M56 58 v-8 M56 50 q0 -4 4 -4" stroke="#ffe9ad" strokeWidth="1.6" fill="none" strokeLinecap="round" /><rect x="59" y="42" width="4" height="5" rx="1" fill="#ffe9ad" />
      <path d="M74 44 l1.1 2.4 2.4 1.1 -2.4 1.1 -1.1 2.4 -1.1 -2.4 -2.4 -1.1 2.4 -1.1 Z" fill="#ffe9ad" />
    </>
  ),

  // ── ocean 海底世界 ───────────────────────────────────────
  "ocean-01": () => (
    <>
      <defs><linearGradient id="g-ocean-01" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b7ea8" /><stop offset="1" stopColor="#1a4568" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-ocean-01)" />
      <g transform="rotate(-14 44 64)">
        <path d="M16 88 L24 44 h40 l8 44 Z" fill="#6b573f" />
        <path d="M24 54 h40 M22 64 h44 M20 74 h48" stroke="#4a3a2c" strokeWidth="2.2" />
        <path d="M28 44 L26 30 l14 6" fill="none" stroke="#4a3a2c" strokeWidth="3.4" strokeLinecap="round" />
      </g>
      <path d="M70 36 V14" stroke="#4a3a2c" strokeWidth="3" strokeLinecap="round" />
      <path d="M70 16 l15 4.4 -15 6.4 Z" fill="#8a7a5e" opacity=".92" />
      <circle cx="72" cy="54" r="3.2" fill="#ffd76e" />
      <path d="M72 54 l7 -3.4 M72 54 l6 4.4" stroke="#ffe9ad" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="82" cy="47" r="1.8" fill="#ffd76e" opacity=".9" />
      <path d="M12 88 q3 -8 -1 -14 M88 88 q4 -6 0 -12" stroke="#4caf7d" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.6" fill="#bfe3f0" opacity=".8" /><circle cx="22" cy="9" r="1.2" fill="#bfe3f0" opacity=".7" /><circle cx="86" cy="26" r="1.3" fill="#bfe3f0" opacity=".7" />
    </>
  ),
  "ocean-02": () => (
    <>
      <defs><linearGradient id="g-ocean-02" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7cc6e0" /><stop offset="1" stopColor="#2f6d8c" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-ocean-02)" />
      <rect y="70" width="96" height="26" fill="#2a5a76" />
      <rect x="14" y="34" width="68" height="5" rx="2.4" fill="#3f7a96" />
      <rect x="14" y="58" width="68" height="5" rx="2.4" fill="#3f7a96" />
      <g><path d="M22 34 v-8 a7 7 0 0 1 14 0 v8 Z" fill="#e2574c" /><path d="M29 26 v8" stroke="#a8423a" strokeWidth="1.4" /></g>
      <g transform="rotate(-16 46 26)"><rect x="43" y="18" width="6" height="14" rx="2.4" fill="#8a5a3a" /><rect x="43" y="28" width="6" height="4" fill="#5f3a24" /></g>
      <circle cx="66" cy="26" r="6.4" fill="#f2b134" /><circle cx="66" cy="26" r="4" fill="#fdf7ea" /><path d="M66 23 v3.4 M66 29 v.2" stroke="#a8743f" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="58" y="48" width="12" height="9" rx="1.6" fill="#a8743f" /><circle cx="72" cy="52" r="2.2" fill="#f2b134" />
      <path d="M20 52 h10 v8 h-10 Z" fill="#4caf7d" opacity=".9" /><path d="M22 52 v-5 a3 3 0 0 1 6 0 v5" fill="none" stroke="#4caf7d" strokeWidth="2" />
      <circle cx="84" cy="18" r="1.6" fill="#bfe3f0" opacity=".8" /><circle cx="10" cy="16" r="1.3" fill="#bfe3f0" opacity=".7" />
      <path d="M88 42 l1 2.2 2.2 1 -2.2 1 -1 2.2 -1 -2.2 -2.2 -1 2.2 -1 Z" fill="#ffe9ad" />
    </>
  ),
  "ocean-03": () => (
    <>
      <defs><linearGradient id="g-ocean-03" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fd8ef" /><stop offset="1" stopColor="#3f7fa0" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-ocean-03)" />
      <path d="M-4 78 Q20 70 44 76 Q70 82 100 74 V96 h-104 Z" fill="#e8c48a" />
      <path d="M10 78 q3 -8 -1 -14 M18 78 q4 -6 0 -12 M74 78 q3 -8 -1 -13 M82 78 q4 -6 0 -11" stroke="#e29a5e" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <g><ellipse cx="44" cy="58" rx="13" ry="9.5" fill="#f2b134" /><path d="M57 58 l11 -6 v12 Z" fill="#f2b134" /><path d="M37 54 q4 5 9 5" stroke="#c98a2e" strokeWidth="1.3" fill="none" /><circle cx="41" cy="54" r="1.4" fill="#3f2f22" /></g>
      <g fill="none" stroke="#fff" strokeWidth="1.4" opacity=".95"><circle cx="58" cy="40" r="3.4" /><circle cx="66" cy="30" r="4.4" /><circle cx="76" cy="18" r="5.6" /></g>
      <g fill="#fdf7ea"><rect x="74.6" y="16" width="2.8" height="4" rx=".6" /><rect x="64.9" y="28.4" width="2.2" height="3.2" rx=".5" /><rect x="56.9" y="38.8" width="2.2" height="3.2" rx=".5" /></g>
      <circle cx="12" cy="18" r="1.6" fill="#fff" opacity=".8" />
    </>
  ),
  "ocean-04": () => (
    <>
      <defs><linearGradient id="g-ocean-04" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1c4470" /><stop offset="1" stopColor="#0a1c30" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-ocean-04)" />
      <path d="M-4 0 Q10 34 4 96 h24 Q20 40 34 0 Z" fill="#122c47" />
      <path d="M100 0 Q86 30 92 96 h-24 Q76 44 62 0 Z" fill="#122c47" />
      <path d="M30 10 l6 6 M66 16 l-6 6 M28 74 l6 6 M68 78 l-6 6" stroke="#1f3f5c" strokeWidth="3" strokeLinecap="round" />
      <path d="M40 14 h16 v20 a8 8 0 0 1 -16 0 Z" fill="#39466f" />
      <rect x="42" y="20" width="5" height="6" rx="1" fill="#ffe9ad" /><rect x="50" y="20" width="5" height="6" rx="1" fill="#ffe9ad" />
      <path d="M48 42 v22" stroke="#8b96b4" strokeWidth="2" />
      <path d="M44 64 h8 l-2 10 h-4 Z" fill="#8b96b4" opacity=".6" />
      <path d="M42 86 q6 4 12 0" stroke="#7de3c3" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".9" />
      <circle cx="48" cy="92" r="1.4" fill="#7de3c3" opacity=".9" />
    </>
  ),

  // ── island 海岛椰风 ──────────────────────────────────────
  "island-01": () => (
    <>
      <defs><linearGradient id="g-island-01" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a8ddf5" /><stop offset="1" stopColor="#fdeecd" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-island-01)" />
      <rect y="60" width="96" height="36" fill="#5fa8c8" />
      <path d="M-4 62 Q40 54 100 62 V72 h-104 Z" fill="#f2d9a0" />
      <path d="M20 72 q8 -14 28 -13 q20 1 26 13 Z" fill="#e8c48a" />
      <path d="M60 60 q.8 -10 -1.4 -16 l3.4 -.4 q2.4 8 1.2 16.4 Z" fill="#8a5a3a" />
      <path d="M61 44 q-6.4 -6 -12 -2.6 q5 .8 8 5 Z M61 44 q6.4 -6 12 -2.6 q-5 .8 -8 5 Z M61 44 q-.8 -7 4 -10 q.6 5 -1.6 9.4 Z" fill="#4caf7d" />
      <path d="M36 70 l4.6 -4.6 M40.6 70 l-4.6 -4.6" stroke="#a85a3a" strokeWidth="2" strokeLinecap="round" />
      <rect x="48" y="60" width="16" height="10" rx="1.6" fill="#8a5a3a" /><rect x="49.4" y="52" width="13.2" height="9" rx="1.4" fill="#a8743f" />
      <path d="M53 61 l3 2.6 3.4 -3" stroke="#ffd76e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="52" cy="56" r="1.4" fill="#ffd76e" /><circle cx="60" cy="56" r="1.4" fill="#ffd76e" />
      <circle cx="14" cy="16" r="7" fill="#ffd76e" opacity=".9" />
      <path d="M10 24 q3 -3 6 0" stroke="#5f83a3" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </>
  ),
  "island-02": () => (
    <>
      <defs><linearGradient id="g-island-02" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c2ecf7" /><stop offset="1" stopColor="#fdf3d4" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-island-02)" />
      <rect y="70" width="96" height="26" fill="#5fa8c8" />
      <path d="M-4 72 Q30 60 56 70 Q80 76 100 68 V96 h-104 Z" fill="#e8c48a" />
      <path d="M24 70 L44 26 h10 L74 70 Z" fill="#6a4a3a" />
      <path d="M40 34 L49 20 L58 34 Z" fill="#4f3428" />
      <path d="M46 30 q4 3 6 0 q3 3 6 0 l-2 -3.4 h-8 Z" fill="#e2574c" opacity="0" />
      <path d="M46 28 q3 2.6 5.4 0 q3 2.6 5.6 0 l-1.4 -2.6 h-8.2 Z" fill="#6b3a1f" />
      <path d="M44 70 q6 -14 4 -28 q4 -2 6 0 q-2 14 4 28 Z" fill="#8a5a2e" opacity=".9" />
      <ellipse cx="48" cy="78" rx="16" ry="5" fill="#6b3a1f" />
      <path d="M36 78 q12 4 24 0" stroke="#8a5a2e" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="48" cy="16" r="1.4" fill="#e2574c" /><path d="M48 18 v3" stroke="#6b3a1f" strokeWidth="1.6" />
    </>
  ),
  "island-03": () => (
    <>
      <defs><linearGradient id="g-island-03" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#232c50" /><stop offset="1" stopColor="#4f6f7a" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-island-03)" />
      <path d="M-4 34 Q24 10 48 26 Q74 42 100 20" stroke="#c8b8e8" strokeWidth="8" fill="none" opacity=".45" strokeLinecap="round" />
      <path d="M-4 40 Q26 20 50 32 Q76 46 100 28" stroke="#ffe9ad" strokeWidth="2" fill="none" opacity=".35" />
      <circle cx="20" cy="14" r="1.2" fill="#fff" /><circle cx="66" cy="10" r="1.4" fill="#fff" /><circle cx="86" cy="26" r="1" fill="#fff" />
      <path d="M-4 76 Q30 68 60 76 Q84 82 100 74 V96 h-104 Z" fill="#2c4258" />
      <path d="M28 78 L44 60 L60 78 Z" fill="#e2574c" />
      <path d="M42 78 v-9 a4 4 0 0 1 8 0 v9" fill="#ffe9ad" />
      <g><circle cx="70" cy="70" r="1.6" fill="#f2b134" /><rect x="67.4" y="72" width="5.2" height="7" rx="1.6" fill="#8a5a3a" /><path d="M70 64 q3 -2 4 -5 M70 64 q-3 -2 -4 -5" stroke="#f2b134" strokeWidth="1.4" strokeLinecap="round" /></g>
      <path d="M74 56 l1.1 2.4 2.4 1.1 -2.4 1.1 -1.1 2.4 -1.1 -2.4 -2.4 -1.1 2.4 -1.1 Z" fill="#ffe9ad" />
    </>
  ),

  // ── mansion 老宅午夜 ─────────────────────────────────────
  "mansion-01": () => (
    <>
      <defs><linearGradient id="g-mansion-01" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#232744" /><stop offset="1" stopColor="#4f5480" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-mansion-01)" />
      <circle cx="80" cy="14" r="7" fill="#fff6d8" opacity=".95" /><circle cx="83" cy="12" r="6" fill="#2b2f52" />
      <g fill="#191c38">
        <rect x="16" y="46" width="52" height="30" />
        <path d="M12 46 L42 26 L72 46 Z" />
        <rect x="30" y="34" width="14" height="42" />
        <path d="M28 34 L37 24 L46 34 Z" />
      </g>
      <circle cx="37" cy="42" r="5.6" fill="#ffd76e" />
      <path d="M37 42 v-3.6 M37 42 l2.6 1.8" stroke="#191c38" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M26 58 q-6 1 -8 5 M48 56 q6 1 8 5" stroke="#ffd76e" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".75" />
      <rect x="20" y="56" width="6" height="9" fill="#ffd76e" opacity=".85" /><rect x="58" y="56" width="6" height="9" fill="#ffd76e" opacity=".6" />
      <rect y="76" width="96" height="20" fill="#14172e" />
    </>
  ),
  "mansion-02": () => (
    <>
      <defs><linearGradient id="g-mansion-02" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a4f7d" /><stop offset="1" stopColor="#8f83ad" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-mansion-02)" />
      <path d="M-4 84 Q48 72 100 84 V96 h-104 Z" fill="#33365c" />
      <rect x="14" y="20" width="26" height="32" rx="2" fill="#c9a86a" />
      <rect x="17.5" y="23.5" width="19" height="25" fill="#3f4468" />
      <circle cx="27" cy="33" r="5" fill="#e8dfc8" /><path d="M22 44 q5 -4 10 0 v4.5 h-10 Z" fill="#e8dfc8" />
      <rect x="54" y="20" width="26" height="32" rx="2" fill="#c9a86a" />
      <rect x="57.5" y="23.5" width="19" height="25" fill="#5c4a80" />
      <g transform="rotate(-14 67 36)"><circle cx="67" cy="32" r="5" fill="#ffd7c2" /><path d="M62 44 q5 -4 10 0 v4.5 h-10 Z" fill="#8fd0ff" /></g>
      <path d="M60 26 q6 -6 12 0" stroke="#ffe9ad" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <rect x="45.4" y="26" width="3.2" height="12" fill="#8a6a4a" /><ellipse cx="47" cy="24" rx="2.6" ry="3.6" fill="#ffd76e" />
      <path d="M40 62 h14 v22 h-14 Z M54 66 h26 v18 h-26 Z" fill="#2b2f52" opacity=".0" />
      <path d="M36 62 q4 6 0 12 M62 62 q-4 6 0 12" stroke="#c9a86a" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".8" />
    </>
  ),
  "mansion-03": () => (
    <>
      <rect width="96" height="96" fill="#5f4a3a" />
      <path d="M0 10 h96 v8 H0 Z" fill="#4f3c2e" />
      <path d="M20 22 h56 v56 h-56 Z" fill="#6b5442" />
      <path d="M26 78 V48 a22 22 0 0 1 44 0 v30 h-10 V52 a12 13 0 0 0 -24 0 v26 Z" fill="#2b2018" />
      <path d="M37 76 q2 -8 8 -6 q3 -5 7 -2 q5 -2 7 4 q1 5 -5 7 q-8 2 -13 0 q-4 -1 -4 -3 Z" fill="#f2b134" />
      <path d="M44 70 q1 -5 -2 -8 M50 69 q3 -5 1 -8" stroke="#e2574c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <g transform="rotate(9 60 64)"><rect x="55" y="56" width="11" height="14" rx="1.2" fill="#fdf7ea" /><path d="M57 60 h7 M57 63 h7 M57 66 h4" stroke="#8a7a5e" strokeWidth="1.1" /><path d="M66 62 l3 5 -2.6 1" fill="none" stroke="#3a2c22" strokeWidth="1.6" strokeLinecap="round" /></g>
      <circle cx="30" cy="38" r="1.3" fill="#ffd76e" /><circle cx="70" cy="32" r="1.1" fill="#ffd76e" />
    </>
  ),
  "mansion-04": () => (
    <>
      <defs><linearGradient id="g-mansion-04" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6f6a9e" /><stop offset="1" stopColor="#a89ecb" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-mansion-04)" />
      <rect y="78" width="96" height="18" fill="#4f4a78" />
      <path d="M30 14 h36 v56 h-36 Z" fill="#c9a86a" />
      <path d="M34 18 h28 v48 h-28 Z" fill="#312a5c" />
      <g opacity=".85"><rect x="40" y="30" width="16" height="22" rx="2" fill="#8f83ad" /><rect x="43" y="34" width="10" height="8" fill="#e8dfc8" /><circle cx="48" cy="46" r="2.6" fill="#e8dfc8" opacity=".7" /></g>
      <circle cx="48" cy="24" r="4.4" fill="#e8dfc8" /><path d="M48 24 v-2.6 M48 24 l1.8 1.4" stroke="#312a5c" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M28 30 q-6 4 -6 12 M68 30 q6 4 6 12" stroke="#ffe9ad" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".8" />
      <path d="M72 60 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4 Z" fill="#ffe9ad" />
      <path d="M20 64 l1 2.2 2.2 1 -2.2 1 -1 2.2 -1 -2.2 -2.2 -1 2.2 -1 Z" fill="#ffe9ad" opacity=".85" />
    </>
  ),

  // ── forest 迷雾森林 ──────────────────────────────────────
  "forest-01": () => (
    <>
      <defs><linearGradient id="g-forest-01" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fcab8" /><stop offset="1" stopColor="#e8ecc4" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-forest-01)" />
      <g fill="#5f9a76" opacity=".8"><path d="M4 72 L14 40 L24 72 Z" /><path d="M26 72 L38 34 L50 72 Z" /><path d="M56 72 L66 42 L76 72 Z" /><path d="M74 72 L84 46 L94 72 Z" /></g>
      <rect x="12" y="60" width="16" height="4" fill="#fff" opacity=".5" /><rect x="30" y="52" width="22" height="4" fill="#fff" opacity=".45" /><rect x="58" y="58" width="20" height="4" fill="#fff" opacity=".5" />
      <rect y="72" width="96" height="24" fill="#4f8a63" />
      <path d="M8 84 Q30 76 48 84 Q70 90 92 82" stroke="#a8d7a2" strokeWidth="3" fill="none" opacity=".7" />
      <g fill="#ffe9ad"><circle cx="30" cy="66" r="1.6" /><circle cx="40" cy="60" r="1.4" /><circle cx="50" cy="64" r="1.7" /><circle cx="60" cy="58" r="1.4" /><circle cx="68" cy="63" r="1.5" /></g>
      <path d="M34 74 q8 -4 16 0 q8 4 16 0" stroke="#ffe9ad" strokeWidth="1.2" fill="none" opacity=".5" />
    </>
  ),
  "forest-02": () => (
    <>
      <defs><linearGradient id="g-forest-02" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#24384f" /><stop offset="1" stopColor="#4f6f7a" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-forest-02)" />
      <circle cx="76" cy="14" r="6" fill="#fff6d8" opacity=".9" /><circle cx="79" cy="12" r="5" fill="#2c4258" />
      <g fill="#1a2c3c" opacity=".9"><path d="M2 76 L12 44 L22 76 Z" /><path d="M74 76 L84 42 L94 76 Z" /></g>
      <rect y="76" width="96" height="20" fill="#16262f" />
      <g>
        <path d="M38 76 q-2 -14 4 -22 h12 q6 8 4 22 Z" fill="#5c4a3a" />
        <path d="M34 54 q-8 -2 -12 -10 M62 54 q8 -2 12 -10" stroke="#5c4a3a" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M22 44 q-4 -8 2 -12 M74 44 q4 -8 -2 -12 M40 54 q-2 -8 2 -10 M56 54 q2 -8 -2 -10" stroke="#5c4a3a" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <circle cx="53" cy="50" r="7" fill="#5c4a3a" /><circle cx="56.4" cy="46" r="2" fill="#5c4a3a" />
        <circle cx="51" cy="49" r="1" fill="#ffe9ad" /><circle cx="56" cy="49" r="1" fill="#ffe9ad" />
        <circle cx="20" cy="32" r="2.4" fill="#ffe9ad" /><circle cx="76" cy="32" r="2.4" fill="#ffe9ad" /><circle cx="42" cy="44" r="2" fill="#ffd76e" /><circle cx="58" cy="44" r="2" fill="#ffd76e" />
      </g>
    </>
  ),
  "forest-03": () => (
    <>
      <defs><linearGradient id="g-forest-03" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b5dcc2" /><stop offset="1" stopColor="#f2ecc9" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-forest-03)" />
      <circle cx="20" cy="14" r="8" fill="#8fc2a0" opacity=".7" /><circle cx="76" cy="10" r="10" fill="#79ae96" opacity=".8" />
      <path d="M34 96 V30 q0 -10 14 -10 q14 0 14 10 v66 Z" fill="#8a5a3a" />
      <rect x="40" y="40" width="16" height="14" rx="2" fill="#fdf7ea" />
      <path d="M43 46 h3.4 M49 46 h4 M43 50 h4 M49.5 50 h3.5" stroke="#a8743f" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M42 40 v14 M54 40 v14" stroke="#d9c8a8" strokeWidth="1.2" />
      <path d="M30 60 q18 8 36 0 M28 72 q20 9 40 0" stroke="#6a4530" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx="24" cy="76" r="1.4" fill="#e2574c" /><circle cx="72" cy="66" r="1.4" fill="#f2b134" /><circle cx="76" cy="80" r="1.4" fill="#4caf7d" />
      <path d="M62 22 q8 2 10 10" stroke="#4caf7d" strokeWidth="1.6" fill="none" opacity=".8" />
      <path d="M78 30 q4 -3 8 0 q-4 3 -8 0 Z" fill="#4caf7d" />
      <circle cx="88" cy="44" r="2" fill="#e2574c" opacity=".85" />
    </>
  ),

  // ── snow 冰雪雪国 ────────────────────────────────────────
  "snow-01": () => (
    <>
      <defs><linearGradient id="g-snow-01" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#16233f" /><stop offset="1" stopColor="#3c5a80" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-snow-01)" />
      <path d="M6 26 Q22 8 38 24 Q50 36 66 20 Q78 10 92 22" stroke="#7de3c3" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".75" />
      <path d="M2 40 Q20 26 36 38 Q52 50 70 34 Q82 24 96 34" stroke="#a5f0e0" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".5" />
      <circle cx="14" cy="12" r="1.1" fill="#fff" opacity=".8" /><circle cx="48" cy="8" r="1" fill="#fff" opacity=".7" /><circle cx="88" cy="44" r="1.1" fill="#fff" opacity=".7" />
      <path d="M-4 80 Q20 68 44 76 Q70 84 100 72 V96 h-104 Z" fill="#ddeafa" />
      <path d="M30 80 a14 14 0 0 1 28 0 Z" fill="#9fb4d4" />
      <path d="M34 80 a10 10 0 0 1 20 0 Z" fill="#c3d4ec" />
      <rect x="40" y="62" width="8" height="8" rx="1" fill="#8f6fc4" />
      <path d="M52 70 v-8 M50 62 h4" stroke="#c8d4ec" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="42" y="72" width="4" height="7" fill="#8f6fc4" opacity=".85" />
    </>
  ),
  "snow-02": () => (
    <>
      <rect width="96" height="96" fill="#7a8ca8" />
      <rect x="10" y="6" width="60" height="90" rx="8" fill="#e8f1fa" />
      <rect x="16" y="12" width="48" height="78" rx="5" fill="#0f2c46" />
      <rect x="20" y="30" width="40" height="4" rx="2" fill="#9fc3e6" />
      <rect x="20" y="54" width="40" height="4" rx="2" fill="#9fc3e6" />
      <path d="M18 12 v78" stroke="#bfe3f0" strokeWidth="2" opacity=".7" />
      <g><path d="M36 30 v-7 a5 5 0 0 1 10 0 v7 Z" fill="#f2b134" /><rect x="34" y="30" width="14" height="4" rx="2" fill="#e2574c" /></g>
      <g><ellipse cx="42" cy="50" rx="8" ry="9" fill="#fdf7ea" /><circle cx="42" cy="38" r="5.4" fill="#fdf7ea" /><path d="M39 37 l1.4 1.4 M45 37 l-1.4 1.4" stroke="#3c5a80" strokeWidth="1" strokeLinecap="round" /><path d="M42 40.6 l-1.4 1.6 h2.8 Z" fill="#f2b134" /><path d="M36 58 l-2.4 3.4 M48 58 l2.4 3.4" stroke="#f2b134" strokeWidth="1.6" strokeLinecap="round" /><circle cx="39.6" cy="37.4" r="1" fill="#2c4258" /><circle cx="44.4" cy="37.4" r="1" fill="#2c4258" /></g>
      <rect x="70" y="10" width="16" height="82" rx="4" fill="#c3d4ec" />
      <circle cx="78" cy="52" r="2.6" fill="#8f9ab8" />
      <circle cx="30" cy="8" r="1.4" fill="#fff" opacity=".8" />
    </>
  ),
  "snow-03": () => (
    <>
      <defs><linearGradient id="g-snow-03" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3c3a6e" /><stop offset="1" stopColor="#8f6b8e" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-snow-03)" />
      <path d="M-4 78 Q24 70 50 78 Q76 84 100 76 V96 h-104 Z" fill="#dce8f5" />
      <path d="M14 78 V56 a8 8 0 0 1 16 0 v22 Z" fill="#a5e0e8" opacity=".85" />
      <path d="M18 64 h8 M18 70 h8" stroke="#d8f2f5" strokeWidth="1.4" />
      <path d="M40 78 L46 52 L52 78 Z" fill="#a5e0e8" opacity=".8" />
      <path d="M58 78 v-14 q6 -6 12 0 v14 Z" fill="#a5e0e8" opacity=".75" />
      <path d="M20 58 l2 3 M46 56 l2 3 M64 62 l2 3" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M10 44 q38 -12 76 0" stroke="#ffd76e" strokeWidth="1.2" fill="none" opacity=".7" />
      <circle cx="22" cy="42" r="1.8" fill="#ffd76e" /><circle cx="48" cy="38" r="1.8" fill="#ffd76e" /><circle cx="74" cy="42" r="1.8" fill="#ffd76e" />
      <circle cx="12" cy="12" r="1.2" fill="#fff" opacity=".8" /><circle cx="84" cy="10" r="1.4" fill="#fff" opacity=".8" />
    </>
  ),

  // ── magic 魔法奇幻 ───────────────────────────────────────
  "magic-01": () => (
    <>
      <defs><linearGradient id="g-magic-01" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b2452" /><stop offset="1" stopColor="#5f4a8c" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-magic-01)" />
      <g fill="#241d46">
        <rect x="12" y="44" width="16" height="36" /><path d="M10 44 L20 28 L30 44 Z" />
        <rect x="66" y="40" width="18" height="40" /><path d="M64 40 L75 22 L86 40 Z" />
        <rect x="34" y="56" width="30" height="24" />
      </g>
      <rect x="16" y="52" width="4" height="7" fill="#ffd76e" opacity=".9" /><rect x="72" y="50" width="4" height="7" fill="#ffd76e" opacity=".7" /><rect x="44" y="64" width="8" height="16" fill="#171232" />
      <path d="M48 10 l2.6 5.6 6 .7 -4.4 4.2 1.2 6 -5.4 -3 -5.4 3 1.2 -6 -4.4 -4.2 6 -.7 Z" fill="#ffd76e" />
      <path d="M48 10 l2.6 5.6 6 .7 -4.4 4.2 1.2 6" fill="none" stroke="#fff2c8" strokeWidth="1" opacity=".8" />
      <path d="M30 22 l1 2.2 2.2 1 -2.2 1 -1 2.2 -1 -2.2 -2.2 -1 2.2 -1 Z" fill="#c8b8e8" /><path d="M68 18 l1 2.2 2.2 1 -2.2 1 -1 2.2 -1 -2.2 -2.2 -1 2.2 -1 Z" fill="#c8b8e8" opacity=".8" />
      <path d="M48 26 v10 M40 30 q8 6 16 0" stroke="#ffd76e" strokeWidth="1.2" fill="none" opacity=".6" />
    </>
  ),
  "magic-02": () => (
    <>
      <defs><linearGradient id="g-magic-02" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fb0ec" /><stop offset="1" stopColor="#ede8fa" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-magic-02)" />
      <path d="M16 62 q32 -14 64 0 q-14 10 -32 8 q-18 2 -32 -8 Z" fill="#8a76c2" />
      <path d="M20 60 q28 -10 56 0" stroke="#a895d6" strokeWidth="3" fill="none" />
      <path d="M34 58 q-2 -14 4 -20 M52 56 q0 -16 8 -22 M66 58 q4 -10 10 -14" stroke="#4caf7d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="34" rx="9" ry="5.6" fill="#fff" opacity=".95" />
      <ellipse cx="62" cy="28" rx="7" ry="4.6" fill="#fff" opacity=".9" />
      <ellipse cx="78" cy="42" rx="5.4" ry="3.6" fill="#fff" opacity=".85" />
      <path d="M38 40 v6 M62 33 v7 M78 46 v5" stroke="#4caf7d" strokeWidth="1.6" />
      <g transform="rotate(20 22 44)"><rect x="16" y="40" width="12" height="9" rx="2" fill="#e8b06e" /><path d="M16 43 h12 M22 36 v4" stroke="#a8743f" strokeWidth="1.4" /></g>
      <path d="M20 38 q0 -6 6 -6" stroke="#8fd0ff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="84" cy="14" r="1.6" fill="#ffd76e" /><circle cx="14" cy="20" r="1.3" fill="#ffd76e" opacity=".8" />
    </>
  ),
  "magic-03": () => (
    <>
      <defs><linearGradient id="g-magic-03" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8f7ad0" /><stop offset="1" stopColor="#d8c8f0" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-magic-03)" />
      <path d="M18 34 q30 -12 60 0 q-8 10 -30 9 q-22 1 -30 -9 Z" fill="#6a55a8" />
      <path d="M40 36 v10 q0 4 4 4 h8 q4 0 4 -4 v-10" fill="#8a5a3a" />
      <path d="M38 34 h20 l-3 -6 h-14 Z" fill="#e2574c" />
      <path d="M44 28 q4 -6 0 -10 M52 28 q4 -6 0 -10" stroke="#ffe9ad" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".9" />
      <g fill="#fff"><path d="M30 56 l1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6 Z" opacity=".95" /><circle cx="62" cy="60" r="2" /><circle cx="70" cy="74" r="1.6" opacity=".8" /><circle cx="26" cy="76" r="1.8" opacity=".9" /><circle cx="58" cy="84" r="1.4" opacity=".7" /></g>
      <path d="M22 66 l1 2.2 2.2 1 -2.2 1 -1 2.2 -1 -2.2 -2.2 -1 2.2 -1 Z" fill="#fff" opacity=".9" />
    </>
  ),

  // ── mystery 悬疑侦探 ─────────────────────────────────────
  "mystery-01": () => (
    <>
      <rect width="96" height="96" fill="#8b96b5" />
      <path d="M0 68 h96 v28 h-96 Z" fill="#565f7c" />
      <path d="M0 66 h96 v4 h-96 Z" fill="#454e6b" />
      <g fill="#c9a86a"><rect x="10" y="24" width="14" height="18" rx="1.6" /><rect x="30" y="24" width="14" height="18" rx="1.6" /><rect x="70" y="24" width="14" height="18" rx="1.6" /></g>
      <rect x="12.6" y="27" width="8.8" height="12" fill="#3f4468" /><rect x="32.6" y="27" width="8.8" height="12" fill="#3f4468" /><rect x="72.6" y="27" width="8.8" height="12" fill="#3f4468" />
      <circle cx="17" cy="31" r="2.2" fill="#e8dfc8" /><rect x="34.6" y="31" width="4.8" height="6" fill="#e8dfc8" /><path d="M74.6 36 l3 -4 3 4.6 2.4 -2.6" stroke="#e8dfc8" strokeWidth="1.3" fill="none" />
      <rect x="50" y="22" width="16" height="21" rx="1.6" fill="none" stroke="#ffd76e" strokeWidth="1.8" strokeDasharray="3.4 2.6" />
      <path d="M40 12 L58 12 L64 44 L34 44 Z" fill="#fff6d8" opacity=".18" />
      <circle cx="58" cy="58" r="1.6" fill="#ffd76e" />
      <text x="56" y="20" fontSize="6.4" fill="#e8dfc8" textAnchor="middle" fontWeight="700">? 12</text>
    </>
  ),
  "mystery-02": () => (
    <>
      <rect width="96" height="96" fill="#8a6a4a" />
      <rect x="12" y="12" width="72" height="72" rx="3" fill="#fdf3d8" />
      <g fill="#a8743f"><rect x="18" y="18" width="18" height="14" rx="1.6" /><rect x="39" y="18" width="18" height="14" rx="1.6" /><rect x="60" y="18" width="18" height="14" rx="1.6" /><rect x="18" y="36" width="18" height="14" rx="1.6" /><rect x="39" y="36" width="18" height="14" rx="1.6" /><rect x="60" y="36" width="18" height="14" rx="1.6" /><rect x="18" y="54" width="18" height="14" rx="1.6" /><rect x="60" y="54" width="18" height="14" rx="1.6" /></g>
      <rect x="39" y="54" width="18" height="14" rx="1.6" fill="none" stroke="#e2574c" strokeWidth="1.6" strokeDasharray="3 2.2" />
      <g fill="#fdf3d8"><rect x="21" y="22" width="12" height="2" rx="1" /><rect x="42" y="22" width="12" height="2" rx="1" /><rect x="63" y="22" width="12" height="2" rx="1" /><rect x="21" y="40" width="12" height="2" rx="1" /><rect x="42" y="40" width="12" height="2" rx="1" /><rect x="63" y="40" width="12" height="2" rx="1" /><rect x="21" y="58" width="12" height="2" rx="1" /><rect x="63" y="58" width="12" height="2" rx="1" /></g>
      <g transform="rotate(-16 78 72)" fill="#2b2f52"><circle cx="76" cy="66" r="4" /><rect x="73" y="70" width="6" height="10" rx="2.6" /><rect x="73.4" y="80" width="2.4" height="8" /><rect x="77.6" y="80" width="2.4" height="8" /><rect x="79" y="72.4" width="7" height="5" rx="1" transform="rotate(-24 82 75)" /></g>
      <path d="M64 76 l1 2.2 2.2 1 -2.2 1 -1 2.2 -1 -2.2 -2.2 -1 2.2 -1 Z" fill="#e2574c" opacity=".85" />
    </>
  ),
  "mystery-03": () => (
    <>
      <defs><linearGradient id="g-mystery-03" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6b7699" /><stop offset="1" stopColor="#b3ad9e" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-mystery-03)" />
      <rect y="72" width="96" height="24" fill="#353d56" />
      <rect x="30" y="8" width="36" height="64" fill="#3c4166" />
      <path d="M26 8 L48 0 L70 8 Z" fill="#2c3154" />
      <circle cx="48" cy="34" r="15" fill="#e8dfc8" />
      <circle cx="48" cy="34" r="12" fill="#f6efd2" />
      <path d="M48 34 L38 28 M48 34 L54 42" stroke="#2c3154" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M34 34 a14 14 0 0 1 6 -10 M62 34 a14 14 0 0 1 -6 10" stroke="#e2574c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M38 17 l1.6 -1.2 M58 17 l-1.6 -1.2" stroke="#e2574c" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 40 q4 -3 8 0 M16 50 q4 -3 8 0 M78 44 q-4 -3 -8 0" stroke="#2c3154" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".85" />
      <circle cx="20" cy="20" r="1.3" fill="#fff" opacity=".8" />
    </>
  ),

  // ── sparkle 其他奇想 ─────────────────────────────────────
  "sparkle-01": () => (
    <>
      <rect width="96" height="96" fill="#5c5470" />
      <rect x="10" y="16" width="76" height="6" fill="#463f5c" /><rect x="10" y="46" width="76" height="6" fill="#463f5c" />
      <g><circle cx="22" cy="12" r="5.4" fill="#e2574c" /><circle cx="38" cy="12" r="5.4" fill="#f2b134" /><circle cx="54" cy="12" r="5.4" fill="#4caf7d" /><circle cx="70" cy="12" r="5.4" fill="#8f6fc4" /></g>
      <g><circle cx="22" cy="42" r="5.4" fill="#f2b134" opacity=".85" /><circle cx="38" cy="42" r="5.4" fill="#e2574c" opacity=".85" /><circle cx="70" cy="42" r="5.4" fill="#4caf7d" opacity=".85" /></g>
      <path d="M50 38 a6 6 0 1 0 .2 0 Z M50 44 q0 4 -4 5" fill="none" stroke="#8fd0ff" strokeWidth="2.4" />
      <circle cx="54" cy="42" r="5.4" fill="#8fd0ff" opacity=".35" />
      <path d="M50 52 q-2 6 -6 8" stroke="#8fd0ff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M62 60 l1.2 2.6 2.6 1.2 -2.6 1.2 -1.2 2.6 -1.2 -2.6 -2.6 -1.2 2.6 -1.2 Z" fill="#8fd0ff" />
      <path d="M20 76 l3 -8 3 8 Z M30 76 l3 -8 3 8 Z" fill="#463f5c" />
      <rect y="76" width="96" height="20" fill="#3a3450" />
    </>
  ),
  "sparkle-02": () => (
    <>
      <defs><linearGradient id="g-sparkle-02" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bfe3fa" /><stop offset="1" stopColor="#eaf5e2" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-sparkle-02)" />
      <circle cx="80" cy="14" r="7" fill="#ffd76e" />
      <rect y="66" width="96" height="30" fill="#a3d18c" />
      <path d="M4 58 h88" stroke="#8a6a4a" strokeWidth="2" />
      <path d="M10 52 v12 M28 52 v12 M64 52 v12 M82 52 v12" stroke="#8a6a4a" strokeWidth="2" />
      <g fill="#fff"><ellipse cx="20" cy="50" rx="10" ry="6" /><ellipse cx="52" cy="46" rx="12" ry="7" /><ellipse cx="80" cy="52" rx="9" ry="5.4" opacity=".95" /></g>
      <g stroke="#8a6a4a" strokeWidth="1.4" strokeLinecap="round"><path d="M16 56 v4 M24 56 v4 M48 53 v4 M56 53 v4 M77 57 v4 M84 57 v4" /></g>
      <circle cx="18" cy="49" r="1.2" fill="#3f4468" /><circle cx="50" cy="45" r="1.2" fill="#3f4468" /><circle cx="79" cy="51" r="1.2" fill="#3f4468" />
      <rect x="47" y="36" width="11" height="6" rx="1.6" fill="#fdf7ea" stroke="#c9a86a" strokeWidth=".8" />
      <text x="52.5" y="41" fontSize="4.6" fill="#5c5470" textAnchor="middle">云朵A</text>
    </>
  ),
  "sparkle-03": () => (
    <>
      <defs><linearGradient id="g-sparkle-03" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#232840" /><stop offset="1" stopColor="#4c5474" /></linearGradient></defs>
      <rect width="96" height="96" fill="url(#g-sparkle-03)" />
      <circle cx="14" cy="14" r="1.2" fill="#fff" opacity=".9" /><circle cx="34" cy="10" r="1" fill="#fff" opacity=".7" /><circle cx="86" cy="12" r="1.1" fill="#fff" opacity=".8" />
      <path d="M-4 78 Q30 68 60 76 Q84 82 100 74 V96 h-104 Z" fill="#1b2033" />
      <g fill="#2b3152"><circle cx="66" cy="52" r="4" /><rect x="63" y="56" width="6" height="14" rx="2.6" /><path d="M61 62 l5 4" stroke="#2b3152" strokeWidth="3" strokeLinecap="round" /><rect x="72" y="50" width="3.4" height="20" rx="1.4" /></g>
      <circle cx="70" cy="48" r="1.2" fill="#1b2033" />
      <path d="M78 56 q8 2 10 10" stroke="#3a4166" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <g fill="#ffe9ad"><path d="M30 66 l1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6 Z" /><path d="M44 70 l1.3 2.8 2.8 1.3 -2.8 1.3 -1.3 2.8 -1.3 -2.8 -2.8 -1.3 2.8 -1.3 Z" opacity=".95" /><path d="M18 72 l1.2 2.6 2.6 1.2 -2.6 1.2 -1.2 2.6 -1.2 -2.6 -2.6 -1.2 2.6 -1.2 Z" opacity=".9" /></g>
      <path d="M30 70 v3 M44 74 v3 M18 76 v3" stroke="#ffe9ad" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="84" cy="30" r="5.4" fill="#fff6d8" opacity=".95" /><circle cx="86.4" cy="28" r="4.6" fill="#232840" />
    </>
  )
};
