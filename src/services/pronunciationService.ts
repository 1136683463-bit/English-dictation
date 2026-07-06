export type PronunciationLang = "en-US" | "en-GB";

const DICTIONARY_API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";
const YOUDAO_AUDIO_URL = "https://dict.youdao.com/dictvoice";
const DEFAULT_LANG: PronunciationLang = "en-US";
const LOOKUP_TIMEOUT_MS = 3500;
const LOOKUP_WORD_PATTERN = /^[a-z]+(?:[-'][a-z]+)*$/;
const US_HINT_PATTERN =
  /(?:^|[^a-z])(en[-_ ]?us|u\.s\.?|usa|us|american|united[-_ ]?states)(?:[^a-z]|$)/i;
const GB_HINT_PATTERN =
  /(?:^|[^a-z])(en[-_ ]?(?:gb|uk)|u\.k\.?|gb|uk|british|united[-_ ]?kingdom|received[-_ ]?pronunciation|rp)(?:[^a-z]|$)/i;

const dictionaryAudioCache = new Map<string, Promise<string | null>>();

const normalizeWord = (word: string) => word.trim().toLowerCase();

const encodeLookupWord = (word: string) => encodeURIComponent(word).replace(/'/g, "%27");

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const stringValue = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const normalizeAudioUrl = (audio: unknown): string | null => {
  const trimmed = stringValue(audio);
  if (!trimmed) return null;

  const withProtocol = trimmed.startsWith("//") ? `https:${trimmed}` : trimmed;

  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.href;
  } catch {
    return null;
  }
};

const hasPreferredAccentHint = (phonetic: Record<string, unknown>, audioUrl: string, lang: PronunciationLang) => {
  const hints = [
    audioUrl,
    stringValue(phonetic.audio),
    stringValue(phonetic.text),
    stringValue(phonetic.sourceUrl)
  ].join(" ");
  const pattern = lang === "en-GB" ? GB_HINT_PATTERN : US_HINT_PATTERN;
  return pattern.test(hints);
};

const selectAudioUrl = (responseBody: unknown, lang: PronunciationLang): string | null => {
  if (!Array.isArray(responseBody)) return null;

  const candidates: Array<{ url: string; preferred: boolean }> = [];

  for (const entry of responseBody) {
    if (!isRecord(entry) || !Array.isArray(entry.phonetics)) continue;

    for (const phonetic of entry.phonetics) {
      if (!isRecord(phonetic)) continue;

      const url = normalizeAudioUrl(phonetic.audio);
      if (!url) continue;

      candidates.push({
        url,
        preferred: hasPreferredAccentHint(phonetic, url, lang)
      });
    }
  }

  return candidates.find((candidate) => candidate.preferred)?.url ?? candidates[0]?.url ?? null;
};

const buildYoudaoPronunciationAudioUrl = (word: string, lang: PronunciationLang) => {
  const url = new URL(YOUDAO_AUDIO_URL);
  url.searchParams.set("type", lang === "en-GB" ? "1" : "0");
  url.searchParams.set("audio", word);
  return url.href;
};

const fetchDictionaryApiPronunciationAudio = async (word: string, lang: PronunciationLang): Promise<string | null> => {
  if (typeof fetch !== "function") return null;

  const controller = typeof AbortController !== "undefined" ? new AbortController() : undefined;
  const timeoutId =
    controller && typeof window !== "undefined"
      ? window.setTimeout(() => controller.abort(), LOOKUP_TIMEOUT_MS)
      : undefined;

  try {
    const response = await fetch(`${DICTIONARY_API_URL}/${encodeLookupWord(word)}`, {
      signal: controller?.signal
    });
    if (!response.ok) return null;

    const responseBody: unknown = await response.json();
    return selectAudioUrl(responseBody, lang);
  } catch {
    return null;
  } finally {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
  }
};

export const fetchWordPronunciationAudio = (
  word: string,
  lang: PronunciationLang = DEFAULT_LANG
): Promise<string | null> => {
  const normalizedWord = normalizeWord(word);
  if (!normalizedWord || !LOOKUP_WORD_PATTERN.test(normalizedWord)) {
    return Promise.resolve(null);
  }

  return Promise.resolve(buildYoudaoPronunciationAudioUrl(normalizedWord, lang));
};

export const fetchFallbackWordPronunciationAudio = (
  word: string,
  lang: PronunciationLang = DEFAULT_LANG
): Promise<string | null> => {
  const normalizedWord = normalizeWord(word);
  if (!normalizedWord || !LOOKUP_WORD_PATTERN.test(normalizedWord)) {
    return Promise.resolve(null);
  }

  const cacheKey = `${normalizedWord}:${lang}`;
  const cached = dictionaryAudioCache.get(cacheKey);
  if (cached) return cached;

  const lookup = fetchDictionaryApiPronunciationAudio(normalizedWord, lang);
  dictionaryAudioCache.set(cacheKey, lookup);
  return lookup;
};

export const clearPronunciationAudioCacheForTests = () => {
  dictionaryAudioCache.clear();
};
