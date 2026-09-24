import { Fragment, ReactNode } from "react";

/**
 * 题干强调渲染（2026-09-24）：
 * 题干文案里「…」包裹的是**要点**（要点的语法现象、被替换的词、目标句），
 * 与指令文字混排时同字重，扫视时抓不到重点。这里把引号内容统一加粗。
 *
 * 约定（数据侧已成立）：这几个页面的题干用「」标记要点——
 * 错题重练「找出「…」这处毛病」、正课变形题「句子变身：「…」把「…」换成「…」」。
 * 非题干文案（如深挖卡正文）不要用本组件：那里「」是普通引用。
 */
export default function EmphasisText({ text }: { text: string }): ReactNode {
  // 按「…」切分：捕获组保证引号段落留在结果里，无引号时原样返回单段
  const parts = text.split(/(「[^」]*」)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("「") && part.endsWith("」") ? (
          <strong key={index} className="emphasis-quote">
            {part}
          </strong>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        )
      )}
    </>
  );
}
