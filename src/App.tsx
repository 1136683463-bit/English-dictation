import {
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
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
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
import GrammarLessonPage from "./pages/GrammarLessonPage";
import GrammarRevisitPage from "./pages/GrammarRevisitPage";
import GrammarReauditPage from "./pages/GrammarReauditPage";
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

const AppLayout = () => {
  const location = useLocation();
  const { data } = useAppData();
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
        <Routes>
          <Route path="/today" element={<TodayPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/adventure" element={<AdventurePage />} />
          <Route path="/adventure/worlds" element={<AdventureWorldsPage />} />
          <Route path="/adventure/gate/:gateId" element={<GatePlayPage />} />
          <Route path="/adventure/:adventureId" element={<AdventurePlayPage />} />
          <Route path="/grammar" element={<GrammarPathPage />} />
          <Route path="/grammar/review" element={<GrammarReviewPage />} />
          <Route path="/grammar/lesson/:lessonId" element={<GrammarLessonPage />} />
          <Route path="/grammar/lesson/:lessonId/revisit" element={<GrammarRevisitPage />} />
          <Route path="/grammar/lesson/:lessonId/reaudit" element={<GrammarReauditPage />} />
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
