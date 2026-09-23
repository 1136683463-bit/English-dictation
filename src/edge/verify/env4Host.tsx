/**
 * ENV4 用的最小宿主（2026-09-22）。
 *
 * `saveError` 由 `AppProvider` 持有、`App.tsx` 渲染成页面顶部的警示条
 * （App.tsx:195-199）。要观察「配额写满时用户看不看得到提示」，
 * 就需要一个同时包含 AppProvider 与那条警示条的最小宿主，
 * 而不是把整个 App（含全部路由与导航）拉进来。
 */
import { useAppData } from "../../AppContext";

export function AppLayoutHost() {
  const { data, setData, saveError } = useAppData();
  return (
    <div>
      {saveError && <div role="alert">{saveError}</div>}
      <span>卡片 {data.cards.length}</span>
      <button
        type="button"
        onClick={() =>
          setData({
            ...data,
            cards: [
              ...data.cards,
              {
                id: `extra-${data.cards.length}`,
                type: "word",
                front: "x",
                back: "y",
                note: "",
                tags: [],
                status: "review",
                priority: false,
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z"
              }
            ]
          })
        }
      >
        加一张卡
      </button>
    </div>
  );
}
