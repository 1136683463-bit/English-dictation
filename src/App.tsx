import {
  BookOpenCheck,
  BookMarked,
  Download,
  FileText,
  Home,
  Library,
  ListChecks,
  MoreHorizontal,
  Map,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  Settings
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import BrandMark from "./components/BrandMark";
import { AppProvider, useAppData } from "./AppContext";
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

const navItems = [
  { to: "/today", label: "今日", icon: Home, group: "训练台" },
  { to: "/training", label: "训练", icon: ListChecks, group: "训练台" },
  { to: "/adventure", label: "冒险", icon: Map, group: "训练台" },
  { to: "/mistakes", label: "错词本", icon: BookMarked, group: "训练台", badge: "mistakes" as const },
  { to: "/units", label: "词书", icon: BookOpenCheck, group: "内容库" },
  { to: "/add", label: "添加", icon: PlusCircle, group: "内容库" },
  { to: "/library", label: "词库", icon: Library, group: "内容库", badge: "library" as const },
  { to: "/stats", label: "统计", icon: FileText, group: "回顾" },
  { to: "/settings", label: "设置", icon: Settings, group: "回顾" }
];

const navGroups = ["训练台", "内容库", "回顾"];

const mobilePrimaryNavPaths = new Set(["/today", "/training", "/adventure", "/library"]);
const mobileMoreItems = navItems.filter((item) => !mobilePrimaryNavPaths.has(item.to));

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

const AppLayout = () => {
  const location = useLocation();
  const { data } = useAppData();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  });
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  const mistakeCount = new Set(
    data.reviews.filter((review) => review.rating <= 2).map((review) => review.cardId)
  ).size;
  const libraryCount = data.cards.length;
  const badgeValues: Record<string, number> = {
    mistakes: mistakeCount,
    library: libraryCount
  };

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    setIsMobileMoreOpen(false);
  }, [location.pathname]);

  const ToggleIcon = isSidebarCollapsed ? PanelLeftOpen : PanelLeftClose;
  const isMobileMoreActive = mobileMoreItems.some((item) => location.pathname.startsWith(item.to));

  return (
    <div className={`app-shell${isSidebarCollapsed ? " sidebar-collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand">
            <BrandMark size={40} />
            <div className="brand-copy">
              <strong>听写工坊</strong>
              <span>个人词句训练</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-toggle"
            aria-label={isSidebarCollapsed ? "展开侧边栏" : "收起侧边栏"}
            data-tooltip={isSidebarCollapsed ? "展开侧边栏" : undefined}
            title={isSidebarCollapsed ? "展开侧边栏" : "收起侧边栏"}
            onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
          >
            <ToggleIcon size={18} />
          </button>
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
                  const badgeValue = item.badge ? badgeValues[item.badge] : 0;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      aria-label={item.label}
                      data-tooltip={isSidebarCollapsed ? item.label : undefined}
                      title={isSidebarCollapsed ? item.label : undefined}
                      className={({ isActive }) => `${isActive ? "active" : ""} ${mobileClass}`.trim()}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                      {item.badge && badgeValue > 0 && <em className="nav-badge">{badgeValue}</em>}
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
        <NavLink
          to="/settings"
          className="sidebar-footer"
          aria-label="设置与导出"
          data-tooltip={isSidebarCollapsed ? "设置与导出" : undefined}
          title={isSidebarCollapsed ? "设置与导出" : undefined}
        >
          <Download size={16} />
          <span>设置与导出</span>
        </NavLink>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/today" element={<TodayPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/adventure" element={<AdventurePage />} />
          <Route path="/adventure/:adventureId" element={<AdventurePlayPage />} />
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
