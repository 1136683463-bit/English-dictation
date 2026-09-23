import { useEffect, useRef } from "react";

/**
 * 判题/换题后把焦点交回内容区（2026-09-21 新增，修 P0 无障碍缺陷）。
 *
 * ## 问题
 * 全站 12 条「答一题 → 进下一题」动线里，动作完成后 `document.activeElement` 全部落到
 * `<body>`：被点击的按钮随判题反馈一起被 React 卸载，浏览器按规范把焦点退回 body，
 * 而代码里没有任何补偿。键盘 / 读屏用户每答一题都要**从页面开头重新 Tab 一遍**——
 * 以正课 guided 段（6 题）为例，每次都要重新穿过返回按钮、段标、题面提示才能到词块库。
 *
 * ## 判据：只在「焦点确实丢了」时补
 * 触发条件是 `document.activeElement` 已经变成 `<body>`（或已不在文档内）——
 * 这是「被聚焦元素遭卸载」的唯一表现。焦点若仍在页面里某个合理位置，本 hook 什么都不做，
 * 避免把用户正在操作的元素抢走。
 *
 * ## 滚动行为按输入方式区分
 * 键盘用户希望新题被滚进视野（与按 Tab 一致）；鼠标用户不希望页面自己滚动。
 * 用「最近一次 keydown 是否晚于最近一次 pointerdown」区分，仅影响 `preventScroll`。
 *
 * @param active 当前是否处于「刚判完题 / 刚换题」的状态（如 `feedback !== "idle"`）
 * @param dep 依赖键：变化即尝试一次落焦（如 `${stepIndex}:${feedback}`）
 * @returns 要挂到内容容器上的 ref
 */
export const useReturnFocus = <T extends HTMLElement>(
  active: boolean,
  dep: string
): React.MutableRefObject<T | null> => {
  const containerRef = useRef<T | null>(null);
  const lastKeyRef = useRef(0);
  const lastPointerRef = useRef(0);
  const lastHandledRef = useRef<string>("");

  useEffect(() => {
    const markKey = () => {
      lastKeyRef.current = Date.now();
    };
    const markPointer = () => {
      lastPointerRef.current = Date.now();
    };
    window.addEventListener("keydown", markKey, true);
    window.addEventListener("pointerdown", markPointer, true);
    return () => {
      window.removeEventListener("keydown", markKey, true);
      window.removeEventListener("pointerdown", markPointer, true);
    };
  }, []);

  useEffect(() => {
    if (!active || !dep || dep === lastHandledRef.current) return;
    lastHandledRef.current = dep;

    const activeElement = document.activeElement as HTMLElement | null;
    const focusWasLost = !activeElement || activeElement === document.body || !document.contains(activeElement);
    if (!focusWasLost) return; // 焦点还在页面里 → 不抢

    const container = containerRef.current;
    if (!container) return;
    const target = container.querySelector<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    // 鼠标用户不滚动（避免页面自己跳动）；键盘与程序化触发允许滚动进视野
    const pointerWasLast = lastPointerRef.current > lastKeyRef.current;
    const options: FocusOptions = { preventScroll: pointerWasLast };
    if (target) target.focus(options);
    else container.focus(options);
  }, [active, dep]);

  return containerRef;
};
