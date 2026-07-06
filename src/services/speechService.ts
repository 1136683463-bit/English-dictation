import { Settings } from "../types";

export interface SpeakOptions {
  audioUrl?: string;
  lang?: Settings["speechLang"];
  rate?: number;
  voiceURI?: string;
}

type PronunciationAudioFetcher = (word: string, lang?: Settings["speechLang"]) => Promise<string | null>;
type PronunciationServiceModule = {
  fetchWordPronunciationAudio?: PronunciationAudioFetcher;
  fetchFallbackWordPronunciationAudio?: PronunciationAudioFetcher;
};

const MAX_AUDIO_ELEMENT_CACHE_SIZE = 60;
const MAX_PRONUNCIATION_URL_CACHE_SIZE = 300;

const pronunciationServiceLoaders = (
  import.meta as ImportMeta & {
    glob: <Module>(pattern: string) => Record<string, () => Promise<Module>>;
  }
).glob<PronunciationServiceModule>("./pronunciationService.ts");
let pronunciationAudioFetcherForTest: PronunciationAudioFetcher | null | undefined;
let pronunciationServicePromise: Promise<PronunciationServiceModule | null> | null = null;
const pronunciationAudioUrlCache = new Map<string, Promise<string | null>>();
const fallbackPronunciationAudioUrlCache = new Map<string, Promise<string | null>>();
const audioElementCache = new Map<string, HTMLAudioElement>();
let currentAudio: HTMLAudioElement | null = null;

export const isSpeechSupported = () =>
  typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";

export const getSpeechVoices = () => {
  if (!isSpeechSupported()) return [];
  return window.speechSynthesis.getVoices();
};

export const setPronunciationAudioFetcherForTest = (
  fetcher: PronunciationAudioFetcher | null | undefined
) => {
  pronunciationAudioFetcherForTest = fetcher;
  pronunciationServicePromise = null;
  pronunciationAudioUrlCache.clear();
  fallbackPronunciationAudioUrlCache.clear();
};

export const stopSpeaking = () => {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } finally {
      currentAudio = null;
    }
  }

  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
};

const normalizeAudioUrlKey = (audioUrl?: string | null) => audioUrl?.trim() ?? "";

const pruneAudioElementCache = () => {
  if (audioElementCache.size <= MAX_AUDIO_ELEMENT_CACHE_SIZE) return;

  for (const [audioUrl, audio] of audioElementCache) {
    if (audioElementCache.size <= MAX_AUDIO_ELEMENT_CACHE_SIZE) return;
    if (audio === currentAudio) continue;

    try {
      audio.pause();
      audio.removeAttribute("src");
      audio.load?.();
    } catch {
      // Best-effort cleanup only; a failed media reset should not block playback.
    }
    audioElementCache.delete(audioUrl);
  }
};

const rememberAudioElement = (audioUrl: string, audio: HTMLAudioElement) => {
  audioElementCache.delete(audioUrl);
  audioElementCache.set(audioUrl, audio);
  pruneAudioElementCache();
};

const forgetAudioElement = (audioUrl: string, audio: HTMLAudioElement) => {
  if (audioElementCache.get(audioUrl) === audio) {
    audioElementCache.delete(audioUrl);
  }
};

const getCachedAudioElement = (audioUrl?: string | null) => {
  const audioUrlKey = normalizeAudioUrlKey(audioUrl);
  if (!audioUrlKey || typeof Audio === "undefined") return null;

  const cachedAudio = audioElementCache.get(audioUrlKey);
  if (cachedAudio) {
    rememberAudioElement(audioUrlKey, cachedAudio);
    return { audioUrl: audioUrlKey, audio: cachedAudio, isNew: false };
  }

  const audio = new Audio(audioUrlKey);
  audio.preload = "auto";
  rememberAudioElement(audioUrlKey, audio);
  return { audioUrl: audioUrlKey, audio, isNew: true };
};

export const preloadAudioUrl = (audioUrl?: string | null) => {
  const cachedAudio = getCachedAudioElement(audioUrl);
  if (!cachedAudio) return false;

  try {
    cachedAudio.audio.preload = "auto";
    if (cachedAudio.isNew) {
      cachedAudio.audio.load?.();
    }
    return true;
  } catch {
    forgetAudioElement(cachedAudio.audioUrl, cachedAudio.audio);
    return false;
  }
};

const chooseVoice = (options: SpeakOptions) => {
  const voices = getSpeechVoices();
  if (options.voiceURI) {
    const selected = voices.find((voice) => voice.voiceURI === options.voiceURI);
    if (selected) return selected;
  }
  if (options.lang) {
    return voices.find((voice) => voice.lang === options.lang) ?? voices.find((voice) => voice.lang.startsWith("en"));
  }
  return voices.find((voice) => voice.lang.startsWith("en"));
};

const playAudioUrl = async (audioUrl?: string | null) => {
  const cachedAudio = getCachedAudioElement(audioUrl);
  if (!cachedAudio) return false;

  const { audioUrl: audioUrlKey, audio } = cachedAudio;
  currentAudio = audio;
  audio.preload = "auto";

  const clearCurrentAudio = () => {
    if (currentAudio === audio) {
      currentAudio = null;
    }
  };
  audio.addEventListener?.("ended", clearCurrentAudio, { once: true });
  audio.addEventListener?.(
    "error",
    () => {
      clearCurrentAudio();
      forgetAudioElement(audioUrlKey, audio);
    },
    { once: true }
  );

  try {
    audio.currentTime = 0;
    await audio.play();
    return true;
  } catch {
    clearCurrentAudio();
    forgetAudioElement(audioUrlKey, audio);
    return false;
  }
};

const fetchPronunciationAudioUrl = async (text: string, lang?: Settings["speechLang"]) => {
  const normalizedText = text.trim().toLowerCase();
  if (!normalizedText) return null;

  const cacheKey = `${normalizedText}:${lang ?? "default"}`;
  const cachedUrl = pronunciationAudioUrlCache.get(cacheKey);
  if (cachedUrl) return cachedUrl;

  const lookup = (async () => {
    const fetchPronunciationAudio = await loadPronunciationAudioFetcher();
    return fetchPronunciationAudio ? await fetchPronunciationAudio(normalizedText, lang) : null;
  })().catch(() => null);

  pronunciationAudioUrlCache.set(cacheKey, lookup);
  while (pronunciationAudioUrlCache.size > MAX_PRONUNCIATION_URL_CACHE_SIZE) {
    const oldestKey = pronunciationAudioUrlCache.keys().next().value;
    if (!oldestKey) break;
    pronunciationAudioUrlCache.delete(oldestKey);
  }

  return lookup;
};

const fetchFallbackPronunciationAudioUrl = async (text: string, lang?: Settings["speechLang"]) => {
  if (pronunciationAudioFetcherForTest !== undefined) return null;

  const normalizedText = text.trim().toLowerCase();
  if (!normalizedText) return null;

  const cacheKey = `${normalizedText}:${lang ?? "default"}`;
  const cachedUrl = fallbackPronunciationAudioUrlCache.get(cacheKey);
  if (cachedUrl) return cachedUrl;

  const lookup = (async () => {
    const fetchPronunciationAudio = await loadFallbackPronunciationAudioFetcher();
    return fetchPronunciationAudio ? await fetchPronunciationAudio(normalizedText, lang) : null;
  })().catch(() => null);

  fallbackPronunciationAudioUrlCache.set(cacheKey, lookup);
  while (fallbackPronunciationAudioUrlCache.size > MAX_PRONUNCIATION_URL_CACHE_SIZE) {
    const oldestKey = fallbackPronunciationAudioUrlCache.keys().next().value;
    if (!oldestKey) break;
    fallbackPronunciationAudioUrlCache.delete(oldestKey);
  }

  return lookup;
};

const loadPronunciationService = async () => {
  if (!pronunciationServicePromise) {
    pronunciationServicePromise = (async () => {
      const loader = pronunciationServiceLoaders["./pronunciationService.ts"];
      if (!loader) return null;

      try {
        return await loader();
      } catch {
        return null;
      }
    })();
  }

  return pronunciationServicePromise;
};

const loadPronunciationAudioFetcher = async () => {
  if (pronunciationAudioFetcherForTest !== undefined) {
    return pronunciationAudioFetcherForTest;
  }

  const service = await loadPronunciationService();
  return service?.fetchWordPronunciationAudio ?? null;
};

const loadFallbackPronunciationAudioFetcher = async () => {
  const service = await loadPronunciationService();
  return service?.fetchFallbackWordPronunciationAudio ?? null;
};

const isLegacyDictionaryApiAudioUrl = (audioUrl?: string | null) => {
  const audioUrlKey = normalizeAudioUrlKey(audioUrl);
  if (!audioUrlKey) return false;

  try {
    return new URL(audioUrlKey).hostname === "api.dictionaryapi.dev";
  } catch {
    return false;
  }
};

export const preloadSpeechAudio = async (text: string, options: SpeakOptions = {}) => {
  const trimmed = text.trim();
  if (!trimmed && !options.audioUrl) return false;

  const shouldDeferProvidedAudio = isLegacyDictionaryApiAudioUrl(options.audioUrl);

  if (!shouldDeferProvidedAudio && preloadAudioUrl(options.audioUrl)) {
    return true;
  }

  const pronunciationAudioUrl = await fetchPronunciationAudioUrl(trimmed, options.lang);
  if (preloadAudioUrl(pronunciationAudioUrl)) {
    return true;
  }

  if (shouldDeferProvidedAudio && preloadAudioUrl(options.audioUrl)) {
    return true;
  }

  const fallbackPronunciationAudioUrl = await fetchFallbackPronunciationAudioUrl(trimmed, options.lang);
  return preloadAudioUrl(fallbackPronunciationAudioUrl);
};

export const speakText = async (text: string, options: SpeakOptions = {}) => {
  const trimmed = text.trim();
  if (!trimmed && !options.audioUrl) return false;

  stopSpeaking();

  const shouldDeferProvidedAudio = isLegacyDictionaryApiAudioUrl(options.audioUrl);

  if (!shouldDeferProvidedAudio && (await playAudioUrl(options.audioUrl))) {
    return true;
  }

  const pronunciationAudioUrl = await fetchPronunciationAudioUrl(trimmed, options.lang);
  if (await playAudioUrl(pronunciationAudioUrl)) {
    return true;
  }

  if (shouldDeferProvidedAudio && (await playAudioUrl(options.audioUrl))) {
    return true;
  }

  const fallbackPronunciationAudioUrl = await fetchFallbackPronunciationAudioUrl(trimmed, options.lang);
  if (fallbackPronunciationAudioUrl !== pronunciationAudioUrl && (await playAudioUrl(fallbackPronunciationAudioUrl))) {
    return true;
  }

  if (!isSpeechSupported()) return false;

  const utterance = new SpeechSynthesisUtterance(trimmed);
  utterance.lang = options.lang ?? "en-US";
  utterance.rate = options.rate ?? 0.9;
  const voice = chooseVoice(options);
  if (voice) {
    utterance.voice = voice;
  }

  window.speechSynthesis.speak(utterance);
  return true;
};

export const clearSpeechAudioCacheForTests = () => {
  stopSpeaking();
  for (const audio of audioElementCache.values()) {
    try {
      audio.pause();
      audio.removeAttribute("src");
      audio.load?.();
    } catch {
      // Test cleanup should keep going even if a mock media element is minimal.
    }
  }
  audioElementCache.clear();
  pronunciationAudioUrlCache.clear();
  fallbackPronunciationAudioUrlCache.clear();
};
