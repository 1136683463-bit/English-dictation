import type { AppData } from "../types";
import { findDictionaryEntryAsync } from "./dictionaryService";

/**
 * R1 离线兜底：无 AI 配置时，用本地词典对整句做逐词直译拼接。
 *
 * 定位是"最后防线"——让 A1 用户在没有 AI、没有预置译文时也能猜出大意，
 * 不追求译文质量。所有产出必须显式标注（见 ADVENTURE_FALLBACK_MARK），
 * 且不落库，避免污染正式译文数据。
 */

/** 兜底译文的统一标注前缀（UI 据此识别并弱化展示）。 */
export const ADVENTURE_FALLBACK_MARK = "［词］";

const TOKEN_SPLIT_RE = /[^A-Za-z']+/;

const isSkippableToken = (token: string) => {
  const normalized = token.replace(/^'+|'+$/g, "");
  return normalized.length <= 1 && !/^[ai]$/i.test(normalized);
};

/**
 * 对一句英文做词典级逐词直译。
 * - 每个词取词典第一义项中文释义；查不到的词保留英文原词；
 * - 词间以空格连接，不调整语序（保证与原文逐词对应，便于对照猜读）。
 * @returns 带 ［词］ 标注的直译；整句无可译词时返回 null。
 */
export const translateSentenceWithDictionary = async (
  data: AppData,
  sentence: string
): Promise<string | null> => {
  const tokens = sentence.split(TOKEN_SPLIT_RE).filter((token) => /[A-Za-z]/.test(token));
  if (!tokens.length) return null;

  const parts = await Promise.all(
    tokens.map(async (token) => {
      if (isSkippableToken(token)) return token;
      const entry = await findDictionaryEntryAsync(data, token);
      const translation = entry?.translation?.trim();
      return translation || token;
    })
  );

  const hitCount = parts.filter((part, index) => part !== tokens[index]).length;
  if (hitCount === 0) return null;
  return `${ADVENTURE_FALLBACK_MARK}${parts.join(" ")}`;
};

/**
 * 对整段英文逐句生成兜底译文；任一句查不出词时该句保留占位说明，保证数组长度与句子数对齐。
 */
export const translateSentencesWithDictionary = async (
  data: AppData,
  sentences: string[]
): Promise<string[]> =>
  Promise.all(
    sentences.map(async (sentence) =>
      (await translateSentenceWithDictionary(data, sentence)) ?? `${ADVENTURE_FALLBACK_MARK}（本句词语暂未收录，试试点词查看释义）`
    )
  );
