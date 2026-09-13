import type { AiProviderSettings, AppData, DiaryCorrectionResult, DiaryEntry, DiaryIssue, GrammarErrorTag } from "../types";
import { diaryQuestions, type DiaryQuestion as PoolQuestion } from "../data/diaryQuestions";
import { addSentence } from "./cardService";
import { isAiProviderConfigured, normalizeChatCompletionsUrl, readResponsePayload, requestFetch } from "./aiHttpClient";
import { GRAMMAR_ERROR_TAGS } from "./huntService";
import { nowIso, uid } from "./storage";

const localDateKey = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** 简单字符串哈希（djb2），用于从日期得到确定性的随机种子。 */
const hashText = (text: string): number => {
  let hash = 5381;
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) + hash + text.charCodeAt(index)) >>> 0;
  }
  return hash;
};

/** mulberry32：种子化 PRNG，洗牌质量远好于直接比较哈希值。 */
const mulberry32 = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** 每天确定性抽 count 条：同一天必相同；excludeIds 用于「再来一组」避开已出的题。 */
export const pickDailyDiaryQuestions = (
  dateKey: string,
  count = 3,
  excludeIds: ReadonlyArray<string> = []
): PoolQuestion[] => {
  const random = mulberry32(hashText(`diary:${dateKey}`));
  const shuffled = [...diaryQuestions];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  const excluded = new Set(excludeIds);
  const fresh = shuffled.filter((question) => !excluded.has(question.id));
  // R10 变体不同屏：已选中的题若其 variantOf 已被选，则跳过（同一句型不重复出现）。
  const pickWithVariantRule = (pool: PoolQuestion[], limit: number): PoolQuestion[] => {
    const result: PoolQuestion[] = [];
    const usedBaseIds = new Set<string>();
    for (const question of pool) {
      if (result.length >= limit) break;
      const baseId = question.variantOf ?? question.id;
      if (usedBaseIds.has(baseId)) continue;
      usedBaseIds.add(baseId);
      result.push(question);
    }
    return result;
  };
  const target = Math.max(1, Math.min(count, fresh.length));
  const picked = pickWithVariantRule(fresh, target);
  // 排除后不够时，从已出过的题里补齐（题库有限，重复无害；仍遵守变体不同屏）。
  if (picked.length < count) {
    const pickedIds = new Set(picked.map((item) => item.id));
    const usedBaseIds = new Set(picked.map((item) => item.variantOf ?? item.id));
    for (const question of shuffled) {
      if (picked.length >= count) break;
      const baseId = question.variantOf ?? question.id;
      if (!pickedIds.has(question.id) && !usedBaseIds.has(baseId)) {
        picked.push(question);
        pickedIds.add(question.id);
        usedBaseIds.add(baseId);
      }
    }
  }
  return picked;
};

export const getTodayDiaryQuestions = (count = 3): PoolQuestion[] =>
  pickDailyDiaryQuestions(localDateKey(), count);

/** R10 跨天回避：近 7 天已出过的题 ID（从日记条目反查），抽取时优先排除，题目新鲜度撑得起「最强留存钩子」。 */
const RECENT_AVOID_DAYS = 7;

export const listRecentDiaryQuestionIds = (data: AppData, fromDate = new Date()): string[] => {
  const cutoff = fromDate.getTime() - RECENT_AVOID_DAYS * 24 * 60 * 60 * 1000;
  const ids = new Set<string>();
  for (const entry of data.diaryEntries ?? []) {
    const createdAt = new Date(entry.createdAt).getTime();
    if (Number.isFinite(createdAt) && createdAt >= cutoff && entry.questionId) {
      ids.add(entry.questionId);
    }
  }
  return [...ids];
};

/** R10：今日抽题（带跨天回避）——优先避开近 7 天已出过的题；题不够时退化为普通抽题。 */
export const getTodayDiaryQuestionsWithAvoid = (data: AppData, count = 3): PoolQuestion[] => {
  const avoidIds = listRecentDiaryQuestionIds(data);
  return pickDailyDiaryQuestions(localDateKey(), count, avoidIds);
};

export const listDiaryEntries = (data: AppData): DiaryEntry[] =>
  [...(data.diaryEntries ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

export const listDiaryEntriesByDate = (data: AppData, dateKey: string): DiaryEntry[] =>
  listDiaryEntries(data).filter((entry) => entry.dateKey === dateKey);

export type { PoolQuestion };

export interface DiaryProgressSummary {
  totalEntries: number;
  days: number;
  todayCount: number;
  correctedCount: number;
  todayDateKey: string;
}

export const summarizeDiaryProgress = (data: AppData): DiaryProgressSummary => {
  const entries = data.diaryEntries ?? [];
  const days = new Set(entries.map((entry) => entry.dateKey));
  const todayDateKey = localDateKey();
  return {
    totalEntries: entries.length,
    days: days.size,
    todayCount: entries.filter((entry) => entry.dateKey === todayDateKey).length,
    correctedCount: entries.filter((entry) => entry.status === "done").length,
    todayDateKey
  };
};

/** 保存一条日记：同一天同一问题覆盖更新，其余追加。 */
export const saveDiaryEntry = (
  data: AppData,
  input: { dateKey: string; question: PoolQuestion; answerEn: string }
): { data: AppData; entry: DiaryEntry } => {
  const answer = input.answerEn.trim();
  if (!answer) throw new Error("先写一句英文吧，哪怕只有三个词。");

  const existing = (data.diaryEntries ?? []).find(
    (entry) => entry.dateKey === input.dateKey && entry.questionId === input.question.id
  );

  if (existing) {
    const updated: DiaryEntry = {
      ...existing,
      answerEn: answer,
      correctedEn: "",
      issues: [],
      status: "pending",
      note: undefined,
      createdAt: nowIso()
    };
    return {
      data: {
        ...data,
        diaryEntries: (data.diaryEntries ?? []).map((entry) => (entry.id === existing.id ? updated : entry))
      },
      entry: updated
    };
  }

  const entry: DiaryEntry = {
    id: uid("diary"),
    dateKey: input.dateKey,
    questionId: input.question.id,
    questionZh: input.question.zh,
    answerEn: answer,
    correctedEn: "",
    issues: [],
    status: "pending",
    createdAt: nowIso()
  };
  return { data: { ...data, diaryEntries: [entry, ...(data.diaryEntries ?? [])] }, entry };
};

/** 把批改结果写回一条日记。 */
export const applyDiaryCorrection = (data: AppData, entryId: string, correctedEn: string, issues: DiaryIssue[]): AppData => ({
  ...data,
  diaryEntries: (data.diaryEntries ?? []).map((entry) =>
    entry.id === entryId
      ? { ...entry, correctedEn: correctedEn.trim(), issues, status: "done" as const, note: undefined }
      : entry
  )
});

/** 批改失败时保留原句并记下原因，允许稍后重试。 */
export const markDiaryCorrectionFailed = (data: AppData, entryId: string, note: string): AppData => ({
  ...data,
  diaryEntries: (data.diaryEntries ?? []).map((entry) =>
    entry.id === entryId ? { ...entry, note } : entry
  )
});

/**
 * 日记批改提示词：只改明显的语法问题，不追求高级改写；解释用简短中文；
 * 每处问题顺带归因到 10 类罪名之一（R09 日记归因闭环的数据来源）；
 * 全部正确时原句返回。红线：不许出现「错误」等挫败性表述。
 */
/** R11 三档批改强度的差异化指令（追加在共性规则之后）。 */
const STYLE_INSTRUCTIONS: Record<"gentle" | "standard" | "strict", string> = {
  gentle: [
    "Correction style: GENTLE. Start with one specific praise for what the learner got right.",
    "Point out AT MOST 1 issue (the most important one). If there are more, stay silent about them.",
    "If the sentence is correct, just praise it warmly."
  ].join(" "),
  standard: [
    "Correction style: STANDARD. Point out all clear grammar issues (usually 1-3).",
    "Be warm but honest — every real issue deserves a kind note."
  ].join(" "),
  strict: [
    "Correction style: STRICT. Point out EVERY grammar issue, even small ones.",
    "After the issues, add one follow-up question in Chinese that pushes the learner to say more (field: followUp)."
  ].join(" ")
};

/** 导出供测试：三档批改强度的 prompt 构建（R11 差异验证）。 */
export const buildCorrectionMessages = (
  questionZh: string,
  answerEn: string,
  style: "gentle" | "standard" | "strict" = "standard"
) => [
  {
    role: "system" as const,
    content: [
      "You are a gentle English tutor for Chinese beginners (CEFR A1-A2).",
      "The learner answers a daily diary question in simple English.",
      "Fix only clear grammar issues: tense, subject-verb agreement, missing be-verb, articles, plurals, prepositions, word order.",
      "Keep the learner's own words and meaning. Never upgrade vocabulary or rewrite into advanced English.",
      "If the sentence is already correct, return it unchanged with an empty issues array.",
      "Each explanation must be one short sentence in Simplified Chinese, warm and encouraging.",
      STYLE_INSTRUCTIONS[style],
      "For each issue, also classify it into exactly one tag from this list:",
      "tense (verb tense), sv_agreement (third-person -s), missing_be (missing am/is/are), article (a/an/the),",
      "plural (countable/singular-plural), preposition (wrong preposition), fragment (missing subject or verb),",
      "run_on (because...so / run-on sentence), word_order (adjective or phrase order), verb_form (verb form).",
      "Pick the closest tag; when unsure, use tense.",
      // R11 recast：在 corrected（只修语法）之外，给一个更地道的重述——低成本高感知价值。
      "Also provide a \"recast\": a natural, native-sounding version of the SAME meaning, still within A2 vocabulary.",
      "Return JSON only: {\"corrected\": string, \"recast\": string, \"issues\": [{\"original\": string, \"correction\": string, \"explanation\": string, \"tag\": string}], \"followUp\": string}.",
      "The first character of your reply is { and the last is }. Never write notes before or after."
    ].join(" ")
  },
  {
    role: "user" as const,
    content: JSON.stringify({ question: questionZh, answer: answerEn })
  }
];

const extractJsonObject = (text: string): Record<string, unknown> => {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("模型没有返回可解析的 JSON。");
  return JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
};

/** 调用 AI 批改一条日记（R11：style 三档 + recast）。未配置 AI 或请求失败都会抛错，由页面决定降级。 */
export const requestDiaryCorrection = async (
  provider: AiProviderSettings,
  questionZh: string,
  answerEn: string,
  style: "gentle" | "standard" | "strict" = "standard"
): Promise<DiaryCorrectionResult> => {
  if (!isAiProviderConfigured(provider)) throw new Error("还没有配置 AI，先保存句子，稍后可以在设置里开启批改。");

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), Math.max(15000, provider.timeoutMs));
  try {
    const endpoint = normalizeChatCompletionsUrl(provider.baseUrl);
    const buildRequest = (withResponseFormat: boolean) =>
      requestFetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${provider.apiKey}` },
        body: JSON.stringify({
          model: provider.model,
          temperature: Math.min(provider.temperature, 0.4),
          max_tokens: 900,
          ...(withResponseFormat ? { response_format: { type: "json_object" } } : {}),
          messages: buildCorrectionMessages(questionZh, answerEn, style)
        }),
        signal: controller.signal
      });

    let response = await buildRequest(true);
    let payload = await readResponsePayload<{ choices?: Array<{ message?: { content?: string } }>; error?: { message?: string } }>(response);
    const errorMessage = payload.error?.message || `批改请求失败：${response.status}`;
    if (!response.ok && response.status === 400 && /response.?format|json.?object|unsupported|不支持/i.test(errorMessage)) {
      response = await buildRequest(false);
      payload = await readResponsePayload(response);
    }
    if (!response.ok) throw new Error(errorMessage);

    const content = payload.choices?.[0]?.message?.content ?? "";
    const parsed = extractJsonObject(content);
    const correctedEn = typeof parsed.corrected === "string" ? parsed.corrected.trim() : "";
    const issues = Array.isArray(parsed.issues)
      ? (parsed.issues as Record<string, unknown>[])
          .map((item) => ({
            original: typeof item.original === "string" ? item.original : "",
            correction: typeof item.correction === "string" ? item.correction : "",
            explanation: typeof item.explanation === "string" ? item.explanation : "",
            ...(GRAMMAR_ERROR_TAGS.includes(item.tag as GrammarErrorTag)
              ? { tag: item.tag as GrammarErrorTag }
              : {})
          }))
          .filter((item) => item.original || item.correction)
      : [];
    if (!correctedEn) throw new Error("模型没有返回批改后的句子。");
    const recast = typeof parsed.recast === "string" && parsed.recast.trim() ? parsed.recast.trim() : undefined;
    return { correctedEn, issues, recast };
  } finally {
    window.clearTimeout(timeout);
  }
};

/**
 * 日记的句子也可一键进入复习队列（SM-2）。
 */
export const addDiarySentenceToReview = (data: AppData, entry: DiaryEntry): AppData => {
  const sentence = (entry.correctedEn || entry.answerEn).trim();
  if (!sentence) return data;
  const duplicated = data.cards.some(
    (card) => card.type === "sentence" && card.front.trim() === sentence && card.sourceId === `diary:${entry.id}`
  );
  if (duplicated) return data;
  return addSentence(data, {
    sentence,
    translation: "",
    keywords: "",
    grammarNote: entry.issues.map((issue) => `${issue.original} → ${issue.correction}`).join("；"),
    sourceId: `diary:${entry.id}`,
    note: `我的英文日记 · ${entry.dateKey}`,
    tags: "日记"
  });
};
