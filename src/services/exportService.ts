import { AppData } from "../types";

const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;

export const exportJson = (data: AppData) => JSON.stringify(data, null, 2);

export const exportAnkiCsv = (data: AppData) => {
  const rows = data.cards.map((card) => {
    const front = card.front;
    const back = [card.back, card.note].filter(Boolean).join("<br>");
    const tags = card.tags.join(" ");
    return [front, back, tags].map(escapeCsv).join(",");
  });
  return ["front,back,tags", ...rows].join("\n");
};

export const exportMarkdown = (data: AppData) => {
  const words = data.cards
    .filter((card) => card.type === "word")
    .map((card) => {
      const details = data.wordDetails.find((item) => item.cardId === card.id);
      return [
        `### ${card.front}`,
        `- 释义：${card.back || "-"}`,
        `- 音标：${details?.phonetic || "-"}`,
        `- 搭配：${details?.collocations || "-"}`,
        `- 来源句：${details?.sourceSentence || "-"}`,
        `- 标签：${card.tags.join(", ") || "-"}`
      ].join("\n");
    });

  const sentences = data.cards
    .filter((card) => card.type === "sentence")
    .map((card) => {
      const details = data.sentenceDetails.find((item) => item.cardId === card.id);
      return [
        `### ${card.front}`,
        `- 翻译：${card.back || "-"}`,
        `- 关键词：${details?.keywords.join(", ") || "-"}`,
        `- 备注：${card.note || "-"}`
      ].join("\n");
    });

  return [
    "# 个人英语词句笔记",
    "",
    "## 单词",
    "",
    ...words,
    "",
    "## 句子",
    "",
    ...sentences
  ].join("\n\n");
};
