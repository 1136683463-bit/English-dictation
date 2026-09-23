import { AppData } from "../types";

const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;

/**
 * 导出前抹掉**本机凭据**（2026-09-22 修，P0 安全）。
 *
 * 此前 `exportJson` 直接 `JSON.stringify(data)`，于是备份文件里带着
 * `settings.aiProvider.apiKey`、`settings.dataSync.token` 与中转站地址的**明文**。
 * 而设置页的说明写的是「API Key 只保存在本机」——文案与实现不一致，
 * 用户分享备份（发给自己另一台设备、贴进群里求排查）就等于泄露密钥。
 *
 * 取代方案：导出时把这两处替换成一个提示串。
 * 导入侧原本就「以本机设置为准」（示例：`apiKey: asString(aiProvider.apiKey, defaultSettings...)`），
 * 所以抹掉不会让导入报错，只是恢复后需要重新填一次密钥——这是安全的默认。
 *
 * 注意：Anki CSV / Markdown 两种导出**不含** settings，本来就没有密钥，不需要处理。
 */
export const REDACTED_SECRET = "";

const withoutSecrets = (data: AppData): AppData => ({
  ...data,
  settings: {
    ...data.settings,
    aiProvider: { ...data.settings.aiProvider, apiKey: REDACTED_SECRET },
    dataSync: { ...data.settings.dataSync, token: REDACTED_SECRET }
  }
});

export const exportJson = (data: AppData) => JSON.stringify(withoutSecrets(data), null, 2);

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
