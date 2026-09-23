import {
  AlertTriangle,
  BookOpenCheck,
  BookMarked,
  FileText,
  Flame,
  GraduationCap,
  Home,
  Library,
  ListChecks,
  MoreHorizontal,
  Compass,
  PlusCircle,
  Settings
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation, useParams } from "react-router-dom";
import BrandMark from "./components/BrandMark";
import { AppProvider, useAppData } from "./AppContext";
import { computeStreak } from "./services/statsService";
import EntryPage from "./pages/EntryPage";
import TodayPage from "./pages/TodayPage";
import TrainingPage from "./pages/TrainingPage";
import AddPage from "./pages/AddPage";
import LibraryPage from "./pages/LibraryPage";
import ReviewPage from "./pages/ReviewPage";
import SpellingPage from "./pages/SpellingPage";
import WordsPage from "./pages/WordsPage";
import SentencesPage from "./pages/SentencesPage";
import ImportPage from "./pages/ImportPage";
import MistakeBookPage from "./pages/MistakeBookPage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";
import UnitsPage from "./pages/UnitsPage";
import AdventurePage from "./pages/AdventurePage";
import AdventurePlayPage from "./pages/AdventurePlayPage";
import AdventureWorldsPage from "./pages/AdventureWorldsPage";
import GatePlayPage from "./pages/GatePlayPage";
import GrammarPathPage from "./pages/GrammarPathPage";
import GrammarReviewPage from "./pages/GrammarReviewPage";
import GrammarReplayPage from "./pages/GrammarReplayPage";
import GrammarProfilePage from "./pages/GrammarProfilePage";
import GrammarLessonPage from "./pages/GrammarLessonPage";
import GrammarRevisitPage from "./pages/GrammarRevisitPage";
import GrammarReauditPage from "./pages/GrammarReauditPage";
import GrammarBoostPage from "./pages/GrammarBoostPage";
import NotFoundPage from "./components/NotFoundPage";
import GrammarHuntPage from "./pages/GrammarHuntPage";
import GrammarDiaryPage from "./pages/GrammarDiaryPage";
import OnboardingGuide from "./components/OnboardingGuide";
import MilestoneCelebration from "./components/MilestoneCelebration";

const navItems = [
  { to: "/today", label: "首页", icon: Home, group: "训练台" },
  { to: "/training", label: "训练", icon: ListChecks, group: "训练台" },
  { to: "/adventure", label: "冒险", icon: Compass, group: "训练台" },
  { to: "/grammar", label: "语法", icon: GraduationCap, group: "训练台" },
  { to: "/mistakes", label: "错词本", icon: BookMarked, group: "训练台" },
  { to: "/units", label: "词书", icon: BookOpenCheck, group: "内容库" },
  { to: "/add", label: "添加", icon: PlusCircle, group: "内容库" },
  { to: "/library", label: "词库", icon: Library, group: "内容库" },
  { to: "/stats", label: "统计", icon: FileText, group: "回顾" },
  { to: "/settings", label: "设置", icon: Settings, group: "回顾" }
];

const navGroups = ["训练台", "内容库", "回顾"];

const mobilePrimaryNavPaths = new Set(["/today", "/training", "/adventure", "/library"]);
const mobileMoreItems = navItems.filter((item) => !mobilePrimaryNavPaths.has(item.to));

/**
 * 参数化路由的 key 包装：同路由换参数（第 4 课 → 第 5 课）时 React Router 会复用组件实例，
 * 上一课的 stage/段内进度等 useState 全部带过去——表现为「点下一课直接落在课堂结尾」。
 * 用 key 让 lessonId 变化时强制重挂载，回到课程开头。
 */
const GrammarLessonPageRoute = () => {
  const { lessonId } = useParams();
  return <GrammarLessonPage key={lessonId} />;
};
const GrammarRevisitPageRoute = () => {
  const { lessonId } = useParams();
  return <GrammarRevisitPage key={lessonId} />;
};
const GrammarReauditPageRoute = () => {
  const { lessonId } = useParams();
  return <GrammarReauditPage key={lessonId} />;
};
const GrammarBoostPageRoute = () => {
  const { lessonId } = useParams();
  return <GrammarBoostPage key={lessonId} />;
};

const AppLayout = () => {
  const location = useLocation();
  const { data, saveError, crossWindowNotice, dismissCrossWindowNotice, storagePressure } = useAppData();
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  useEffect(() => {
    setIsMobileMoreOpen(false);
  }, [location.pathname]);

  const isMobileMoreActive = mobileMoreItems.some((item) => location.pathname.startsWith(item.to));
  const streak = computeStreak(data.reviews);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand">
            <BrandMark size={40} />
            <div className="brand-copy">
              <strong>今日词</strong>
              <span>让词汇更简单</span>
            </div>
          </div>
        </div>
        <nav>
          {navGroups.map((group) => (
            <div className="nav-group" key={group}>
              <span className="nav-group-label">{group}</span>
              {navItems
                .filter((item) => item.group === group)
                .map((item) => {
                  const Icon = item.icon;
                  const mobileClass = mobilePrimaryNavPaths.has(item.to)
                    ? "mobile-primary-nav"
                    : "mobile-secondary-nav";
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      aria-label={item.label}
                      className={({ isActive }) => `${isActive ? "active" : ""} ${mobileClass}`.trim()}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
            </div>
          ))}
          <button
            type="button"
            className={`mobile-more-toggle${isMobileMoreActive || isMobileMoreOpen ? " active" : ""}`}
            aria-label={isMobileMoreOpen ? "关闭更多导航" : "打开更多导航"}
            aria-expanded={isMobileMoreOpen}
            aria-controls="mobile-more-nav"
            onClick={() => setIsMobileMoreOpen((open) => !open)}
          >
            <MoreHorizontal size={18} />
            <span>更多</span>
          </button>
        </nav>
        {isMobileMoreOpen && (
          <>
            <button
              type="button"
              className="mobile-more-backdrop"
              aria-label="关闭更多导航"
              onClick={() => setIsMobileMoreOpen(false)}
            />
            <div className="mobile-more-panel" id="mobile-more-nav" role="dialog" aria-label="更多导航">
              {mobileMoreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </>
        )}
        <div className="sidebar-streak" aria-label={`连续打卡 ${streak} 天`}>
          <span className="sidebar-streak-label">
            <Flame size={14} aria-hidden="true" />
            连续打卡
          </span>
          <strong>
            {streak} <small>天</small>
          </strong>
          <span className="sidebar-streak-note">继续加油！</span>
          <span className="sidebar-streak-bar">
            <span style={{ width: `${Math.min(100, Math.max(8, streak * 10))}%` }} />
          </span>
        </div>
      </aside>
      <main className="main">
        {/*
          落盘失败告警（2026-09-22 新增）：配额满时 commitData 会捕获异常并设这一状态。
          此前失败是静默的——界面显示「已生效」而磁盘上是旧数据，用户在下次重启才发现回退。
          这条横幅与页面无关，常驻在内容区顶部，确保用户在任何页面都能看到。
        */}
        {saveError && (
          <div className="save-error-banner" role="alert">
            <AlertTriangle size={16} aria-hidden="true" />
            <span>{saveError}</span>
          </div>
        )}
        {/*
          多窗口提示（R10）：只在这种情况出现——另一个窗口改过数据，
          而本次是「整份替换」类操作（导入/重置/恢复），无法自动合并。
          函数式更新（答题、勾选、收藏等日常操作）会自动与对方合并，
          用户完全无感，所以不提示。
        */}
        {crossWindowNotice && (
          <div className="save-error-banner" role="status">
            <AlertTriangle size={16} aria-hidden="true" />
            <span>{crossWindowNotice}</span>
            <button className="ghost-link" type="button" onClick={dismissCrossWindowNotice}>
              知道了
            </button>
          </div>
        )}
        {/*
          接近存储上限的提示（R11）：此前这条判断只在设置页算，而设置页用户很少去。
          实测从软上限（4MB）到真正写不下，在 macOS 桌面端只有约 43 天缓冲——
          指望用户在这段时间里主动进设置页，是会踩空的。改由每次保存后顺带更新，
          常驻内容区顶部。文案指向「归档」，因为它是唯一保留进度的选择。
        */}
        {storagePressure && (
          <div className="save-error-banner" role="status">
            <AlertTriangle size={16} aria-hidden="true" />
            <span>
              {storagePressure}
              {" "}
              <Link className="ghost-link" to="/settings">
                去设置
              </Link>
            </span>
          </div>
        )}
        <Routes>
          <Route path="/today" element={<TodayPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/adventure" element={<AdventurePage />} />
          <Route path="/adventure/worlds" element={<AdventureWorldsPage />} />
          <Route path="/adventure/gate/:gateId" element={<GatePlayPage />} />
          <Route path="/adventure/:adventureId" element={<AdventurePlayPage />} />
          <Route path="/grammar" element={<GrammarPathPage />} />
          <Route path="/grammar/review" element={<GrammarReviewPage />} />
          {/* C4：从 Top3 弱点拼出的复盘课（素材 100% 溯源，即时提取练习） */}
          <Route path="/grammar/replay" element={<GrammarReplayPage />} />
          {/* ④ 语法能力画像：全貌 + 趋势 + 已战胜（与弱点卡分工：弱点卡只讲 Top3 待修） */}
          <Route path="/grammar/profile" element={<GrammarProfilePage />} />
          {/* :lessonId 参数路由必须带 key——同路由换参数时 React Router 会复用组件实例，
              上一课的 stage/practiceDone 等状态会带进下一课（表现为「点下一课直接停在结尾」）。 */}
          <Route path="/grammar/lesson/:lessonId" element={<GrammarLessonPageRoute />} />
          <Route path="/grammar/lesson/:lessonId/revisit" element={<GrammarRevisitPageRoute />} />
          <Route path="/grammar/lesson/:lessonId/reaudit" element={<GrammarReauditPageRoute />} />
          <Route path="/grammar/boost/:lessonId" element={<GrammarBoostPageRoute />} />
          <Route path="/grammar/hunt" element={<GrammarHuntPage />} />
          <Route path="/grammar/diary" element={<GrammarDiaryPage />} />
          <Route path="/mistakes" element={<MistakeBookPage />} />
          <Route path="/add" element={<AddPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/spelling" element={<SpellingPage />} />
          <Route path="/units" element={<UnitsPage />} />
          <Route path="/words" element={<WordsPage />} />
          <Route path="/sentences" element={<SentencesPage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* R-UX1：catch-all 兜底——无匹配路由此前渲染空白 main，任何路径笔误都像页面坏了 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <OnboardingGuide />
      <MilestoneCelebration />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </AppProvider>
  );
}
