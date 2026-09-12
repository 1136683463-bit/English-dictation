import { createRoot } from "react-dom/client";
import AdventureThemeArt from "../components/AdventureThemeArt";
import { ADVENTURE_THEME_LIBRARY } from "../services/adventureThemeLibrary";

const cards = ADVENTURE_THEME_LIBRARY.map((theme) => (
  <div className="card" key={theme.id}>
    <span className="tile"><AdventureThemeArt theme={theme} /></span>
    <span className="copy">
      <strong>{theme.title}</strong>
      <small>{theme.id} · {theme.description}</small>
    </span>
  </div>
));

createRoot(document.getElementById("root")!).render(<div className="grid">{cards}</div>);
