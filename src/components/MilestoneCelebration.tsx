import { useEffect, useRef, useState } from "react";
import { PartyPopper, X } from "lucide-react";
import { useAppData } from "../AppContext";
import {
  findNewlyReachedMilestones,
  markMilestonesReached,
  type MilestoneState
} from "../services/milestoneService";

const AUTO_DISMISS_MS = 6000;

/**
 * P2-2 里程碑激励：监听数据变化，发现「已达成但未庆祝」的里程碑时弹出 toast。
 * 同一里程碑一生只弹一次（settings.reachedMilestoneIds 记录）；多个同时达成时排队依次展示。
 */
export default function MilestoneCelebration() {
  const { data, updateData } = useAppData();
  const [queue, setQueue] = useState<MilestoneState[]>([]);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fresh = findNewlyReachedMilestones(data);
    if (fresh.length === 0) return;
    // 先落记录再展示：即使立即关闭页面也不会重复弹。
    updateData((current) => markMilestonesReached(current, fresh.map((state) => state.definition.id)));
    setQueue((prev) => [...prev, ...fresh.filter((state) => !prev.some((queued) => queued.definition.id === state.definition.id))]);
  }, [data, updateData]);

  const current = queue[0];

  useEffect(() => {
    if (!current) return;
    dismissTimer.current = setTimeout(() => {
      setQueue((prev) => prev.slice(1));
    }, AUTO_DISMISS_MS);
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [current?.definition.id]);

  if (!current) return null;

  return (
    <div className="milestone-toast" role="status" aria-live="polite">
      <span className="milestone-toast-icon" aria-hidden="true">
        <PartyPopper size={22} />
      </span>
      <div className="milestone-toast-copy">
        <strong>里程碑达成 · {current.definition.title}</strong>
        <span>{current.definition.description}</span>
      </div>
      <button
        type="button"
        className="milestone-toast-close"
        aria-label="关闭庆祝提示"
        onClick={() => setQueue((prev) => prev.slice(1))}
      >
        <X size={15} />
      </button>
    </div>
  );
}
