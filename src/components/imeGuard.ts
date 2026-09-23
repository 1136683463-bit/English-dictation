/**
 * 输入法（IME）守卫（2026-09-22 第 9 轮）。
 *
 * ## 为什么需要它
 *
 * 中文输入法打字时，**回车键先归输入法用**：按回车是从候选词里选词上屏，
 * 而不是「确认输入完成」。如果代码在 `keydown` 上直接判 `Enter` 就提交，
 * 用户想上屏一个词，结果是**半截拼音被当成答案提交**。
 *
 * 真机复现（Playwright + CDP `Input.imeSetComposition`，非伪造事件）：
 * 拼写页组词 `pict` 未上屏时按回车 → 记录为一次评分 1 的复习、
 * 卡片进错词书并重排进队列。用户视角：「我明明还没打完。」
 *
 * ## 两个判定条件，缺一不可
 *
 * ① `isComposing`：标准属性。**组词期间**为 true。
 * ② `keyCode === 229`：旧引擎/部分输入法在组词期间不上报 `isComposing`，
 *    但会给 `229`（Windows IME 的传统信号）。
 *
 * 只在「确认要提交」的地方调用本函数；它**不** `preventDefault`，
 * 提交与否交给调用方决定。
 */

/** 判断这次按键是否属于「输入法正在组词」——是则应忽略，不能当提交。 */
export const isImeComposing = (event: {
  nativeEvent?: { isComposing?: boolean };
  isComposing?: boolean;
  keyCode?: number;
}): boolean => {
  if (event.nativeEvent?.isComposing === true) return true;
  if ((event as { isComposing?: boolean }).isComposing === true) return true;
  // 229 = 组词中（部分输入法只给这个信号，不给 isComposing）。
  if (event.keyCode === 229) return true;
  return false;
};

/**
 * 该把这次 `Enter` 当成「提交」吗？
 *
 * 三类要排除：
 * - 组词态（见 `isImeComposing`）——回车是「上屏候选词」。
 * - `Shift+Enter`——多行输入框里它是「换行」，不是提交。
 * - `Alt`/`Ctrl`/`Meta+Enter`——浏览器/系统快捷键，不抢。
 */
export const isSubmitKey = (event: {
  key: string;
  shiftKey?: boolean;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  nativeEvent?: { isComposing?: boolean };
  isComposing?: boolean;
  keyCode?: number;
}): boolean => {
  if (event.key !== "Enter") return false;
  if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return false;
  return !isImeComposing(event);
};

/**
 * 放在 `<form>` 内文本输入框的 `onKeyDown` 上：**组词态回车不许触发隐式提交**。
 *
 * 为什么不能只在 `onSubmit` 里拦：原生 `submit` 事件**不携带** `isComposing`，
 * 等它触发时组词信息已经丢了，无法反悔。所以必须在 keydown 这一层
 * `preventDefault`，让浏览器的隐式提交根本不发生。
 *
 * 只在「确实在组词」时拦截，其余情况一律放行——不影响正常回车提交与换行。
 *
 * 真机复现过的后果（Playwright + CDP `Input.imeSetComposition`）：
 * 词书分组名存成 `hexin100`（用户想打「核心100」）、
 * 句子标签存成 `ceshi`（想打「测试」）——上屏后再回车才是对的。
 */
export const blockImeSubmit = (event: {
  key: string;
  preventDefault: () => void;
  nativeEvent?: { isComposing?: boolean };
  isComposing?: boolean;
  keyCode?: number;
}): void => {
  if (event.key !== "Enter") return;
  if (!isImeComposing(event)) return;
  event.preventDefault();
};

/**
 * 展到 `<form>` 上的属性：一处覆盖整个表单里的所有输入框。
 *
 * 为什么挂在 form 上而不是逐个 input：`keydown` 会**冒泡**，
 * 所以 form 上的 handler 能收到内部任意输入框的按键，
 * 一处接好、日后新加的输入框也自动受保护（逐个加容易再漏）。
 *
 * 用法：`<form onSubmit={save} {...imeSafeFormProps}>`
 */
export const imeSafeFormProps = { onKeyDown: blockImeSubmit } as const;

/**
 * 焦点是否在「用户正在输入的地方」。
 *
 * 快捷键监听如果只看按键、不看焦点，就会抢用户的字：
 * 复习页的 1-4 评分键在答案框里打 `I have 2 cats` 时会被当成「评 2 分」，
 * 把没写完的草稿直接评走（同段监听里的 Space 早已用 `target === document.body`
 * 处理了这件事，数字键漏了）。
 *
 * 与 `LibraryPage.tsx:167` 的 `isTyping` 同口径，抽出来避免每处各写一遍。
 */
export const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!target || typeof target !== "object") return false;
  const element = target as { tagName?: string; isContentEditable?: boolean };
  const tag = element.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return element.isContentEditable === true;
};
