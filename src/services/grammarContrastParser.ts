/**
 * 深挖卡「对比项」解析（从 GrammarLessonPage 抽出，2026-09-23）。
 *
 * 为什么单独成文件：React Fast Refresh 要求页面文件**只导出组件**——
 * 页面里多一个非组件 export（`parseContrastParagraph`）会让整文件 HMR 失效，
 * 开发时的修改不会热更新到已打开的页面（用户曾因此看到过期代码：
 * 「第一个问题有询问 AI，第二个问题又没有了」）。
 *
 * 深挖卡段落的「对比项」识别（展示层增强，不改数据）。
 *
 * 命中形如：`There be 说「某处存在某物」：There is a book on the desk（桌上有一本书）——重点是「那个地方有什么」。`
 * → { term: "There be", body: "说「某处存在某物」：There is a book on the desk（桌上有一本书）", focus: "「那个地方有什么」" }
 *
 * 未命中（如「问句把 Is / Are 搬到句首：…」）返回 null，调用方按普通段落渲染。
 */
export function parseContrastParagraph(paragraph: string): { term: string; body: string; focus: string | null } | null {
  // 只识别「语法术语 + 说…：…」的对比项（宁漏勿错）。
  // 全库实测：中文叙述里含「说」的句子太多（「中文说…」「老外说…」「所以句首说…」），
  // 按长度/虚词黑名单都拦不干净——因此只认确定性高的形态：
  //   术语 = 英文词（可含空格/连字符）或 英文词 + 语法术语中文（动词/名词/介词/代词/冠词/时态/语序/词）
  // 这类正是「There be 说…」「have 说…」「be 动词 说…」等真正的语法对比项。
  const head = paragraph.match(/^((?:[A-Za-z][A-Za-z\s/-]*)(?:动词|名词|介词|代词|冠词|时态|语序|词)?)\s*说/);
  if (!head) return null;
  const colonAt = paragraph.indexOf("：");
  if (colonAt <= 0) return null;
  const term = head[1].trim();
  if (!term || term.length > 10) return null;
  const rest = paragraph.slice(head[0].length, colonAt).trim();
  let body = paragraph.slice(colonAt + 1).trim();
  // 侧注：末尾「——重点是「X」」拆成独立小标签（结构上独立，视觉上次一级）
  let focus: string | null = null;
  const dashAt = body.lastIndexOf("——");
  if (dashAt > 0) {
    const tail = body.slice(dashAt + 2).trim();
    const focusMatch = tail.match(/^重点是(.+)$/);
    if (focusMatch) {
      focus = focusMatch[1].trim();
      body = body.slice(0, dashAt).trim();
    }
  }
  return { term, body: rest ? `${rest}：${body}` : body, focus };
}
