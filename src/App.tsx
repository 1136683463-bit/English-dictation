import {
  BookOpenCheck,
  BookMarked,
  Download,
  FileText,
  Home,
  Library,
  ListChecks,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  Settings,
  Sparkles
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { AppProvider } from "./AppContext";
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

const navItems = [
  { to: "/today", label: "今日", icon: Home },
  { to: "/training", label: "训练", icon: ListChecks },
  { to: "/mistakes", label: "错词本", icon: BookMarked },
  { to: "/units", label: "词书", icon: BookOpenCheck },
  { to: "/add", label: "添加", icon: PlusCircle },
  { to: "/library", label: "词库", icon: Library },
  { to: "/stats", label: "统计", icon: FileText },
  { to: "/settings", label: "设置", icon: Settings }
];

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

const AppLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  });

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const ToggleIcon = isSidebarCollapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <div className={`app-shell${isSidebarCollapsed ? " sidebar-collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand">
            <div className="brand-icon">
              <Sparkles size={20} />
            </div>
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
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                aria-label={item.label}
                data-tooltip={isSidebarCollapsed ? item.label : undefined}
                title={isSidebarCollapsed ? item.label : undefined}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
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
