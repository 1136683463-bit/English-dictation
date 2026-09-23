import { Settings } from "../types";
import { getOnlinePronunciationAudioUrl } from "./pronunciationService";

export interface SpeakOptions {
  audioUrl?: string;
  lang?: Settings["speechLang"];
  rate?: number;
  voiceURI?: string;
  /** Keep the legacy browser TTS fallback enabled for existing callers. */
  fallbackToSystem?: boolean;
  /** Skip the word-only dictionary fallback when speaking a full sentence. */
  fallbackToDictionary?: boolean;
  /**
   * 只走系统语音引擎，跳过所有在线音源。设置页「试听」验证的是
   * 口音/语速/声音选择本身，经在线 TTS 会让预览延迟取决于网络而非语音设置。
   */
  systemOnly?: boolean;
  lifecycle?: SpeechLifecycleHandlers;
}

export interface SpeechLifecycleHandlers {
  onLoading?: () => void;
  onStart?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onError?: () => void;
  onSystemFallback?: () => void;
}

export type SpeechPlaybackState = "idle" | "loading" | "playing" | "paused" | "error";

type PronunciationAudioFetcher = (text: string, lang?: Settings["speechLang"]) => Promise<string | null>;
type PronunciationServiceModule = {
  fetchTextPronunciationAudio?: PronunciationAudioFetcher;
  fetchWordPronunciationAudio?: PronunciationAudioFetcher;
  fetchFallbackWordPronunciationAudio?: PronunciationAudioFetcher;
};

const MAX_AUDIO_ELEMENT_CACHE_SIZE = 60;
const MAX_PRONUNCIATION_URL_CACHE_SIZE = 300;
// A healthy online clip starts in a few hundred milliseconds. Anything slower
// than this is a dead source, so bail out early instead of leaving the user in
// silence while the fallback chain waits.
const AUDIO_START_TIMEOUT_MS = 2500;

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
let currentSpeechLifecycle: SpeechLifecycleHandlers | undefined;
let currentAudioListenerCleanup: (() => void) | null = null;
let currentWebAudioContext: AudioContext | null = null;
let currentWebAudioSource: AudioBufferSourceNode | null = null;
let currentWebAudioLifecycle: SpeechLifecycleHandlers | undefined;

export const isSpeechSupported = () =>
  typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";

export const DEFAULT_SPEECH_PREVIEW_TEXT = "This is your English pronunciation preview.";

/**
 * R11：试听文本对齐真实听写场景——从当前词库句段随机挑一句
 *（含英文、8-140 字符）；词库为空时回退默认句。纯函数，可单测。
 */
export const pickSpeechPreviewText = (segmentTexts: string[]): { text: string; fromLibrary: boolean } => {
  const pool = segmentTexts
    .map((text) => text.trim())
    .filter((text) => /[A-Za-z]/.test(text) && text.length >= 8 && text.length <= 140);
  if (pool.length === 0) return { text: DEFAULT_SPEECH_PREVIEW_TEXT, fromLibrary: false };
  return { text: pool[Math.floor(Math.random() * pool.length)], fromLibrary: true };
};

export const getSpeechVoices = () => {
  if (!isSpeechSupported()) return [];
  return window.speechSynthesis.getVoices();
};

const NATURAL_VOICE_HINTS = [
  "natural",
  "neural",
  "enhanced",
  "premium",
  "online",
  "siri",
  "ava",
  "samantha",
  "alex",
  "daniel",
  "eddy",
  "flo",
  "sandy",
  "karen"
];

const HIGH_QUALITY_SYSTEM_VOICE_HINTS = ["samantha", "alex", "ava", "daniel"];

const NOVELTY_VOICE_HINTS = [
  "bad news",
  "bells",
  "boing",
  "bubbles",
  "cellos",
  "jester",
  "organ",
  "superstar",
  "trinoids",
  "wobble",
  "whisper",
  "zarvox"
];

const normalizeVoiceLanguage = (language: string) => language.trim().replace(/_/g, "-").toLowerCase();

const scoreSpeechVoice = (voice: SpeechSynthesisVoice, language?: Settings["speechLang"]) => {
  const requestedLanguage = normalizeVoiceLanguage(language ?? "en-US");
  const voiceLanguage = normalizeVoiceLanguage(voice.lang);
  const voiceName = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  const requestedBase = requestedLanguage.split("-")[0];
  const voiceBase = voiceLanguage.split("-")[0];
  let score = 0;

  if (voiceLanguage === requestedLanguage) score += 120;
  else if (voiceBase === requestedBase) score += 55;
  else if (voiceBase === "en") score += 10;
  else score -= 80;

  NATURAL_VOICE_HINTS.forEach((hint) => {
    if (voiceName.includes(hint)) score += hint === "natural" || hint === "neural" ? 70 : 24;
  });
  HIGH_QUALITY_SYSTEM_VOICE_HINTS.forEach((hint) => {
    if (voiceName.includes(hint)) score += 52;
  });
  NOVELTY_VOICE_HINTS.forEach((hint) => {
    if (voiceName.includes(hint)) score -= 120;
  });

  // Local voices are available without a network round trip. Keep them slightly
  // ahead of remote voices when the quality indicators are otherwise equal.
  if (voice.localService) score += 4;
  return score;
};

export const selectPreferredSpeechVoice = (
  voices: SpeechSynthesisVoice[],
  language?: Settings["speechLang"],
  voiceURI?: string
) => {
  if (voiceURI) {
    const selected = voices.find((voice) => voice.voiceURI === voiceURI);
    if (selected) return selected;
  }

  return voices
    .map((voice, index) => ({ voice, index, score: scoreSpeechVoice(voice, language) }))
    .sort((left, right) => right.score - left.score || left.index - right.index)[0]?.voice;
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
  currentAudioListenerCleanup?.();
  currentAudioListenerCleanup = null;
  if (currentAudio) {
    try {
      currentAudio.pause();
      if (currentAudio.readyState > 0 && Number.isFinite(currentAudio.duration)) {
        currentAudio.currentTime = 0;
      }
    } finally {
      currentAudio = null;
    }
  }
  if (currentWebAudioSource) {
    const source = currentWebAudioSource;
    currentWebAudioSource = null;
    currentWebAudioLifecycle = undefined;
    source.onended = null;
    try {
      source.stop();
    } catch {
      // The source may already have ended.
    }
    source.disconnect();
  }
  currentSpeechLifecycle = undefined;

  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
};

const getWebAudioContext = () => {
  if (typeof window === "undefined") return null;
  const AudioContextConstructor =
    window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextConstructor) return null;
  if (!currentWebAudioContext) {
    /**
     * R09：构造函数会抛，必须兜住。
     *
     * WebKit 上 `new AudioContext()` 可以抛 `InvalidStateError`
     *（"hardware contexts" 相关），与硬件/权限有关。这条路径由
     * `speakText` 同步调用，而所有调用方都写 `void speakText(...)`，
     * 于是异常变成 **unhandled rejection**：在 jsdom/vitest 里它出现在
     * `process.on("unhandledRejection")`，在浏览器里是控制台报错 +
     * 静默无语音——用户只看到「点了没声音」，没有任何可行动的信息。
     *
     * 门铃是可选能力：拿不到就返回 null，走系统语音兜底。
     */
    try {
      currentWebAudioContext = new AudioContextConstructor();
    } catch {
      return null;
    }
  }
  return currentWebAudioContext;
};

const unlockWebAudio = () => {
  const context = getWebAudioContext();
  if (!context || context.state === "running") return context;
  void context.resume().catch(() => undefined);
  return context;
};

const playDecodedAudioUrl = async (audioUrl: string, lifecycle?: SpeechLifecycleHandlers) => {
  const context = unlockWebAudio();
  if (!context || typeof fetch !== "function") return false;

  try {
    // The upstream TTS hosts reject requests that carry a page Referer (they
    // answer "200 OK" with an empty body), so never send one.
    const response = await fetch(audioUrl, { credentials: "omit", referrerPolicy: "no-referrer" });
    if (!response.ok) return false;
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await context.decodeAudioData(arrayBuffer.slice(0));
    await context.resume();

    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    currentWebAudioSource = source;
    currentWebAudioLifecycle = lifecycle;
    source.onended = () => {
      if (currentWebAudioSource === source) {
        currentWebAudioSource = null;
        currentWebAudioLifecycle = undefined;
        lifecycle?.onEnd?.();
      }
      source.disconnect();
    };
    source.start(0);
    lifecycle?.onStart?.();
    return true;
  } catch {
    return false;
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

  const audio = new Audio();
  // Online TTS endpoints (Baidu gettts in particular) answer with an empty
  // 200 when the request carries a Referer, which stalls the media element and
  // forces the slow system-voice fallback. Suppress the Referer header.
  audio.setAttribute?.("referrerpolicy", "no-referrer");
  audio.src = audioUrlKey;
  audio.setAttribute?.("playsinline", "true");
  audio.setAttribute?.("webkit-playsinline", "true");
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

const chooseVoice = (options: SpeakOptions) => selectPreferredSpeechVoice(getSpeechVoices(), options.lang, options.voiceURI);

const playAudioUrl = async (audioUrl?: string | null, lifecycle?: SpeechLifecycleHandlers) => {
  const cachedAudio = getCachedAudioElement(audioUrl);
  if (!cachedAudio) return false;

  const { audioUrl: audioUrlKey, audio } = cachedAudio;
  currentAudio = audio;
  currentSpeechLifecycle = lifecycle;
  audio.preload = "auto";

  let hasStarted = false;
  let isStartSettled = false;
  let startTimeoutId: number | undefined;
  let resolveStart: (started: boolean) => void = () => undefined;
  const startPromise = new Promise<boolean>((resolve) => {
    resolveStart = resolve;
  });

  const clearCurrentAudio = () => {
    if (currentAudio === audio) {
      currentAudio = null;
      currentSpeechLifecycle = undefined;
    }
  };
  const settleStart = (started: boolean) => {
    if (isStartSettled) return;
    isStartSettled = true;
    if (startTimeoutId !== undefined) {
      window.clearTimeout(startTimeoutId);
      startTimeoutId = undefined;
    }
    if (started) {
      hasStarted = true;
      lifecycle?.onStart?.();
    }
    resolveStart(started);
  };
  const handlePlaying = () => settleStart(true);
  const handleProgress = () => {
    if (!audio.paused && audio.currentTime > 0) settleStart(true);
  };
  const removePlaybackListeners = () => {
    audio.removeEventListener?.("playing", handlePlaying);
    audio.removeEventListener?.("timeupdate", handleProgress);
    audio.removeEventListener?.("error", handleError);
    audio.removeEventListener?.("ended", handleEnded);
  };
  const cancelPlaybackAttempt = () => {
    settleStart(false);
    removePlaybackListeners();
    if (currentAudioListenerCleanup === cancelPlaybackAttempt) {
      currentAudioListenerCleanup = null;
    }
  };
  const handleEnded = () => {
    cancelPlaybackAttempt();
    if (hasStarted) lifecycle?.onEnd?.();
    clearCurrentAudio();
  };
  const handleError = () => {
    const failedAfterStart = hasStarted;
    cancelPlaybackAttempt();
    if (failedAfterStart) lifecycle?.onError?.();
    clearCurrentAudio();
    forgetAudioElement(audioUrlKey, audio);
  };
  audio.addEventListener?.("playing", handlePlaying);
  audio.addEventListener?.("timeupdate", handleProgress);
  audio.addEventListener?.("error", handleError, { once: true });
  audio.addEventListener?.("ended", handleEnded, { once: true });
  currentAudioListenerCleanup = cancelPlaybackAttempt;
  startTimeoutId = window.setTimeout(() => {
    cancelPlaybackAttempt();
    try {
      audio.pause();
      if (audio.readyState > 0 && Number.isFinite(audio.duration)) {
        audio.currentTime = 0;
      }
    } finally {
      clearCurrentAudio();
      forgetAudioElement(audioUrlKey, audio);
    }
  }, AUDIO_START_TIMEOUT_MS);

  try {
    if (audio.readyState > 0 && Number.isFinite(audio.duration)) {
      audio.currentTime = 0;
    }
    const playPromise = audio.play();
    void playPromise.catch(() => settleStart(false));
    const started = await startPromise;
    if (started) return true;

    cancelPlaybackAttempt();
    clearCurrentAudio();
    forgetAudioElement(audioUrlKey, audio);
    return false;
  } catch {
    cancelPlaybackAttempt();
    clearCurrentAudio();
    forgetAudioElement(audioUrlKey, audio);
    return false;
  }
};

const fetchPronunciationAudioUrl = async (text: string, lang?: Settings["speechLang"]) => {
  const normalizedText = text.trim().replace(/\s+/g, " ").toLowerCase();
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
  return service?.fetchTextPronunciationAudio ?? service?.fetchWordPronunciationAudio ?? null;
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

  if (options.audioUrl && !shouldDeferProvidedAudio && preloadAudioUrl(options.audioUrl)) {
    return true;
  }

  const immediateAudioUrl = pronunciationAudioFetcherForTest === undefined
    ? getOnlinePronunciationAudioUrl(trimmed, options.lang)
    : null;
  if (immediateAudioUrl && preloadAudioUrl(immediateAudioUrl)) {
    return true;
  }

  const pronunciationAudioUrl = immediateAudioUrl
    ? null
    : await fetchPronunciationAudioUrl(trimmed, options.lang);
  if (preloadAudioUrl(pronunciationAudioUrl)) {
    return true;
  }

  if (shouldDeferProvidedAudio && preloadAudioUrl(options.audioUrl)) {
    return true;
  }

  if (options.fallbackToDictionary === false) return false;
  const fallbackPronunciationAudioUrl = await fetchFallbackPronunciationAudioUrl(trimmed, options.lang);
  return preloadAudioUrl(fallbackPronunciationAudioUrl);
};

const speakWithSystemVoice = (text: string, options: SpeakOptions, lifecycle?: SpeechLifecycleHandlers): boolean => {
  if (!isSpeechSupported()) {
    lifecycle?.onError?.();
    return false;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  lifecycle?.onSystemFallback?.();
  utterance.lang = options.lang ?? "en-US";
  utterance.rate = options.rate ?? 0.9;
  const voice = chooseVoice(options);
  if (voice) {
    utterance.voice = voice;
  }

  utterance.onstart = lifecycle?.onStart ?? null;
  utterance.onend = lifecycle?.onEnd ?? null;
  utterance.onerror = lifecycle?.onError ?? null;
  window.speechSynthesis.speak(utterance);
  return true;
};

export const speakText = async (text: string, options: SpeakOptions = {}) => {
  const trimmed = text.trim();
  if (!trimmed && !options.audioUrl) return false;

  const lifecycle = options.lifecycle;
  lifecycle?.onLoading?.();
  stopSpeaking();
  unlockWebAudio();

  // systemOnly：跳过全部在线音源，直接用系统语音引擎（设置页试听场景）。
  if (options.systemOnly) {
    return speakWithSystemVoice(trimmed, options, lifecycle);
  }

  const shouldDeferProvidedAudio = isLegacyDictionaryApiAudioUrl(options.audioUrl);

  if (options.audioUrl && !shouldDeferProvidedAudio && (await playAudioUrl(options.audioUrl, lifecycle))) {
    return true;
  }

  // Build the public URL synchronously so audio.play() still runs inside the
  // original click gesture. Browsers may reject playback after an async lookup.
  const immediateAudioUrl = pronunciationAudioFetcherForTest === undefined
    ? getOnlinePronunciationAudioUrl(trimmed, options.lang)
    : null;
  if (immediateAudioUrl && (await playAudioUrl(immediateAudioUrl, lifecycle))) {
    return true;
  }
  if (immediateAudioUrl && (await playDecodedAudioUrl(immediateAudioUrl, lifecycle))) {
    return true;
  }

  const pronunciationAudioUrl = immediateAudioUrl
    ? null
    : await fetchPronunciationAudioUrl(trimmed, options.lang);
  if (await playAudioUrl(pronunciationAudioUrl, lifecycle)) {
    return true;
  }
  if (pronunciationAudioUrl && (await playDecodedAudioUrl(pronunciationAudioUrl, lifecycle))) {
    return true;
  }

  if (shouldDeferProvidedAudio && (await playAudioUrl(options.audioUrl, lifecycle))) {
    return true;
  }

  if (options.fallbackToDictionary !== false) {
    const fallbackPronunciationAudioUrl = await fetchFallbackPronunciationAudioUrl(trimmed, options.lang);
    if (fallbackPronunciationAudioUrl !== pronunciationAudioUrl && (await playAudioUrl(fallbackPronunciationAudioUrl, lifecycle))) {
      return true;
    }
  }

  if (options.fallbackToSystem === false) {
    lifecycle?.onError?.();
    return false;
  }

  return speakWithSystemVoice(trimmed, options, lifecycle);
};

export const speakTextWithLifecycle = (
  text: string,
  options: SpeakOptions = {},
  handlers: SpeechLifecycleHandlers = {}
) => {
  return speakText(text, { ...options, lifecycle: handlers });
};

export const pauseSpeaking = () => {
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    currentSpeechLifecycle?.onPause?.();
    return true;
  }
  if (currentWebAudioSource && currentWebAudioContext?.state === "running") {
    void currentWebAudioContext.suspend();
    currentWebAudioLifecycle?.onPause?.();
    return true;
  }
  if (!isSpeechSupported() || !window.speechSynthesis.speaking || window.speechSynthesis.paused) return false;
  window.speechSynthesis.pause();
  currentSpeechLifecycle?.onPause?.();
  return true;
};

export const resumeSpeaking = () => {
  if (currentAudio && currentAudio.paused) {
    void currentAudio.play();
    currentSpeechLifecycle?.onResume?.();
    return true;
  }
  if (currentWebAudioSource && currentWebAudioContext?.state === "suspended") {
    void currentWebAudioContext.resume();
    currentWebAudioLifecycle?.onResume?.();
    return true;
  }
  if (!isSpeechSupported() || !window.speechSynthesis.paused) return false;
  window.speechSynthesis.resume();
  currentSpeechLifecycle?.onResume?.();
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
  void currentWebAudioContext?.close?.();
  currentWebAudioContext = null;
};
