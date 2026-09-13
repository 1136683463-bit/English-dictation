import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearSpeechAudioCacheForTests,
  DEFAULT_SPEECH_PREVIEW_TEXT,
  isSpeechSupported,
  pickSpeechPreviewText,
  preloadAudioUrl,
  preloadSpeechAudio,
  selectPreferredSpeechVoice,
  setPronunciationAudioFetcherForTest,
  speakText
} from "./speechService";

const installAudioMock = (playResults: Array<Promise<void> | Error | undefined> = [undefined]) => {
  const playMocks: ReturnType<typeof vi.fn>[] = [];
  const audioAttributes: Array<Record<string, string>> = [];
  const AudioMock = vi.fn().mockImplementation(() => {
    const result = playResults.shift();
    let paused = false;
    const listeners = new Map<string, () => void>();
    const attributes: Record<string, string> = {};
    audioAttributes.push(attributes);
    const play = vi.fn(() => {
      paused = false;
      if (result instanceof Error) {
        return Promise.reject(result);
      }
      if (result === undefined) listeners.get("playing")?.();
      return result ?? Promise.resolve();
    });
    const pause = vi.fn(() => {
      paused = true;
    });
    playMocks.push(play);
    return {
      addEventListener: vi.fn((eventName: string, listener: () => void) => listeners.set(eventName, listener)),
      currentTime: 0,
      duration: 0,
      load: vi.fn(),
      readyState: 0,
      get paused() {
        return paused;
      },
      pause,
      play,
      preload: "",
      removeAttribute: vi.fn(),
      removeEventListener: vi.fn((eventName: string) => listeners.delete(eventName)),
      setAttribute: vi.fn((name: string, value: string) => {
        attributes[name] = value;
      })
    };
  });

  vi.stubGlobal("Audio", AudioMock);
  return { AudioMock, playMocks, audioAttributes };
};

const installSpeechSynthesisMock = () => {
  const cancel = vi.fn();
  const getVoices = vi.fn<() => SpeechSynthesisVoice[]>(() => []);
  const speak = vi.fn();

  // @ts-expect-error narrow mock for speech synthesis tests
  window.speechSynthesis = { cancel, getVoices, speak };
  vi.stubGlobal(
    "SpeechSynthesisUtterance",
    vi.fn().mockImplementation((text: string) => ({ text }))
  );

  return { cancel, getVoices, speak };
};

describe("speechService", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    clearSpeechAudioCacheForTests();
    setPronunciationAudioFetcherForTest(undefined);
    vi.unstubAllGlobals();
    vi.useRealTimers();
    // @ts-expect-error test cleanup
    delete window.speechSynthesis;
    // @ts-expect-error test cleanup
    delete window.SpeechSynthesisUtterance;
  });

  it("returns false when no speech or audio is available", async () => {
    setPronunciationAudioFetcherForTest(null);

    expect(isSpeechSupported()).toBe(false);
    await expect(speakText("hello")).resolves.toBe(false);
  });

  it("prefers a matching natural voice over the first available novelty voice", () => {
    const novelty = { name: "Bad News", lang: "en_US", voiceURI: "bad-news", localService: true } as SpeechSynthesisVoice;
    const natural = { name: "Samantha (Enhanced)", lang: "en_US", voiceURI: "samantha-enhanced", localService: true } as SpeechSynthesisVoice;

    expect(selectPreferredSpeechVoice([novelty, natural], "en-US")).toBe(natural);

    const defaultMacVoice = { name: "Samantha", lang: "en_US", voiceURI: "samantha", localService: true } as SpeechSynthesisVoice;
    const firstListedVoice = { name: "Eddy", lang: "en_US", voiceURI: "eddy", localService: true } as SpeechSynthesisVoice;
    expect(selectPreferredSpeechVoice([firstListedVoice, defaultMacVoice], "en-US")).toBe(defaultMacVoice);
  });

  it("honors an explicitly selected system voice", () => {
    const first = { name: "Alex", lang: "en_US", voiceURI: "alex", localService: true } as SpeechSynthesisVoice;
    const selected = { name: "Daniel", lang: "en_GB", voiceURI: "daniel", localService: true } as SpeechSynthesisVoice;

    expect(selectPreferredSpeechVoice([first, selected], "en-US", "daniel")).toBe(selected);
  });

  it("uses the preferred natural voice for the system fallback", async () => {
    const { AudioMock } = installAudioMock([new Error("network")]);
    const speech = installSpeechSynthesisMock();
    const eddy = { name: "Eddy", lang: "en_US", voiceURI: "eddy", localService: true } as SpeechSynthesisVoice;
    const samantha = { name: "Samantha", lang: "en_US", voiceURI: "samantha", localService: true } as SpeechSynthesisVoice;
    speech.getVoices.mockReturnValue([eddy, samantha]);
    const fetchPronunciationAudio = vi.fn().mockResolvedValue("https://cdn.example.com/hello.mp3");
    setPronunciationAudioFetcherForTest(fetchPronunciationAudio);

    await expect(speakText("hello", { fallbackToDictionary: false })).resolves.toBe(true);

    expect(AudioMock).toHaveBeenCalledTimes(1);
    expect(speech.speak).toHaveBeenCalledTimes(1);
    expect(speech.speak.mock.calls[0][0].voice).toBe(samantha);
  });

  it("prefers uploaded audio before system speech", async () => {
    const { AudioMock, playMocks } = installAudioMock();
    const speech = installSpeechSynthesisMock();
    const fetchPronunciationAudio = vi.fn().mockResolvedValue("https://cdn.example.com/hello.mp3");
    setPronunciationAudioFetcherForTest(fetchPronunciationAudio);

    await expect(speakText("hello", { audioUrl: "data:audio/mp3;base64,abc" })).resolves.toBe(true);

    expect(AudioMock).toHaveBeenCalledWith();
    expect(playMocks[0]).toHaveBeenCalled();
    expect(fetchPronunciationAudio).not.toHaveBeenCalled();
    expect(speech.speak).not.toHaveBeenCalled();
  });

  it("reuses a preloaded uploaded audio element when speaking", async () => {
    const { AudioMock, playMocks } = installAudioMock();
    const speech = installSpeechSynthesisMock();

    expect(preloadAudioUrl("data:audio/mp3;base64,abc")).toBe(true);
    await expect(speakText("hello", { audioUrl: "data:audio/mp3;base64,abc" })).resolves.toBe(true);

    expect(AudioMock).toHaveBeenCalledTimes(1);
    expect(playMocks[0]).toHaveBeenCalledTimes(1);
    expect(speech.speak).not.toHaveBeenCalled();
  });

  it("uses fetched pronunciation audio before system speech when no uploaded audio exists", async () => {
    const { AudioMock, playMocks } = installAudioMock();
    const speech = installSpeechSynthesisMock();
    const fetchPronunciationAudio = vi.fn().mockResolvedValue("https://cdn.example.com/hello.mp3");
    setPronunciationAudioFetcherForTest(fetchPronunciationAudio);

    await expect(speakText("  hello  ", { lang: "en-GB" })).resolves.toBe(true);

    expect(fetchPronunciationAudio).toHaveBeenCalledWith("hello", "en-GB");
    expect(AudioMock).toHaveBeenCalledWith();
    expect(playMocks[0]).toHaveBeenCalled();
    expect(speech.speak).not.toHaveBeenCalled();
  });

  it("plays a sentence with one continuous online audio request without using system speech", async () => {
    const { AudioMock, playMocks } = installAudioMock();
    const speech = installSpeechSynthesisMock();

    const playback = speakText("The bell rings softly.", {
      lang: "en-US",
      fallbackToSystem: false,
      fallbackToDictionary: false
    });

    // play() must run before yielding so the browser still recognizes the click gesture.
    expect(AudioMock).toHaveBeenCalledTimes(1);
    expect(AudioMock).toHaveBeenCalledWith();
    expect(playMocks[0]).toHaveBeenCalledTimes(1);
    await expect(playback).resolves.toBe(true);
    expect(speech.speak).not.toHaveBeenCalled();
  });

  it("starts playback from the media playing event when the play promise stays pending", async () => {
    const listeners = new Map<string, () => void>();
    const play = vi.fn(() => new Promise<void>(() => undefined));
    const pause = vi.fn();
    const AudioMock = vi.fn().mockImplementation(() => ({
      addEventListener: vi.fn((eventName: string, listener: () => void) => listeners.set(eventName, listener)),
      currentTime: 0,
      load: vi.fn(),
      paused: false,
      pause,
      play,
      preload: "",
      removeAttribute: vi.fn(),
      removeEventListener: vi.fn((eventName: string) => listeners.delete(eventName))
    }));
    const onStart = vi.fn();
    vi.stubGlobal("Audio", AudioMock);

    const playback = speakText("A complete sentence.", {
      fallbackToSystem: false,
      fallbackToDictionary: false,
      lifecycle: { onStart }
    });

    expect(play).toHaveBeenCalledTimes(1);
    listeners.get("playing")?.();
    await expect(playback).resolves.toBe(true);
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("exits loading when online audio never starts", async () => {
    vi.useFakeTimers();
    const pendingPlayback = new Promise<void>(() => undefined);
    installAudioMock([pendingPlayback]);
    const onError = vi.fn();

    const playback = speakText("A complete sentence.", {
      fallbackToSystem: false,
      fallbackToDictionary: false,
      lifecycle: { onError }
    });

    await vi.advanceTimersByTimeAsync(6000);
    await expect(playback).resolves.toBe(false);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("preloads fetched pronunciation audio and reuses it on click", async () => {
    const { AudioMock, playMocks } = installAudioMock();
    const speech = installSpeechSynthesisMock();
    const fetchPronunciationAudio = vi.fn().mockResolvedValue("https://cdn.example.com/hello.mp3");
    setPronunciationAudioFetcherForTest(fetchPronunciationAudio);

    await expect(preloadSpeechAudio(" Hello ", { lang: "en-US" })).resolves.toBe(true);
    await expect(speakText("hello", { lang: "en-US" })).resolves.toBe(true);

    expect(fetchPronunciationAudio).toHaveBeenCalledTimes(1);
    expect(fetchPronunciationAudio).toHaveBeenCalledWith("hello", "en-US");
    expect(AudioMock).toHaveBeenCalledTimes(1);
    expect(AudioMock).toHaveBeenCalledWith();
    expect(playMocks[0]).toHaveBeenCalledTimes(1);
    expect(speech.speak).not.toHaveBeenCalled();
  });

  // Baidu gettts / Youdao dictvoice answer "200 OK" with an empty body when the
  // request carries a Referer, so the player silently fell back to the slow
  // system voice. Every audio request must therefore be referrer-free.
  it("requests online audio with no Referer", async () => {
    const { audioAttributes } = installAudioMock();
    const speech = installSpeechSynthesisMock();
    const fetchPronunciationAudio = vi.fn().mockResolvedValue("https://cdn.example.com/hello.mp3");
    setPronunciationAudioFetcherForTest(fetchPronunciationAudio);

    await expect(preloadSpeechAudio("hello", { lang: "en-US" })).resolves.toBe(true);
    await expect(speakText("hello", { lang: "en-US" })).resolves.toBe(true);

    expect(audioAttributes.length).toBeGreaterThan(0);
    expect(audioAttributes.every((attributes) => attributes.referrerpolicy === "no-referrer")).toBe(true);
    expect(speech.speak).not.toHaveBeenCalled();
  });

  it("tries fetched pronunciation audio after uploaded audio playback fails", async () => {
    const { AudioMock, playMocks } = installAudioMock([new Error("bad upload"), undefined]);
    const speech = installSpeechSynthesisMock();
    const fetchPronunciationAudio = vi.fn().mockResolvedValue("https://cdn.example.com/hello.mp3");
    setPronunciationAudioFetcherForTest(fetchPronunciationAudio);

    await expect(speakText("hello", { audioUrl: "blob:uploaded" })).resolves.toBe(true);

    expect(AudioMock).toHaveBeenNthCalledWith(1);
    expect(AudioMock).toHaveBeenNthCalledWith(2);
    expect(playMocks[0]).toHaveBeenCalled();
    expect(playMocks[1]).toHaveBeenCalled();
    expect(speech.speak).not.toHaveBeenCalled();
  });

  it("tries fetched pronunciation audio before legacy dictionary api audio", async () => {
    const { AudioMock, playMocks } = installAudioMock();
    const speech = installSpeechSynthesisMock();
    const fetchPronunciationAudio = vi.fn().mockResolvedValue("https://dict.youdao.com/dictvoice?type=0&audio=hello");
    setPronunciationAudioFetcherForTest(fetchPronunciationAudio);

    await expect(
      speakText("hello", {
        audioUrl: "https://api.dictionaryapi.dev/media/pronunciations/en/hello-us.mp3"
      })
    ).resolves.toBe(true);

    expect(AudioMock).toHaveBeenCalledTimes(1);
    expect(AudioMock).toHaveBeenCalledWith();
    expect(playMocks[0]).toHaveBeenCalled();
    expect(speech.speak).not.toHaveBeenCalled();
  });

  it("falls back to legacy dictionary api audio when fetched pronunciation audio fails", async () => {
    const { AudioMock, playMocks } = installAudioMock([new Error("network"), undefined]);
    const speech = installSpeechSynthesisMock();
    const fetchPronunciationAudio = vi.fn().mockResolvedValue("https://dict.youdao.com/dictvoice?type=0&audio=hello");
    const legacyAudioUrl = "https://api.dictionaryapi.dev/media/pronunciations/en/hello-us.mp3";
    setPronunciationAudioFetcherForTest(fetchPronunciationAudio);

    await expect(speakText("hello", { audioUrl: legacyAudioUrl })).resolves.toBe(true);

    expect(AudioMock).toHaveBeenNthCalledWith(1);
    expect(AudioMock).toHaveBeenNthCalledWith(2);
    expect(playMocks[0]).toHaveBeenCalled();
    expect(playMocks[1]).toHaveBeenCalled();
    expect(speech.speak).not.toHaveBeenCalled();
  });

  it("falls back to TTS when fetched pronunciation audio playback fails", async () => {
    const { AudioMock } = installAudioMock([new Error("network")]);
    const speech = installSpeechSynthesisMock();
    const fetchPronunciationAudio = vi.fn().mockResolvedValue("https://cdn.example.com/hello.mp3");
    setPronunciationAudioFetcherForTest(fetchPronunciationAudio);

    await expect(speakText("hello")).resolves.toBe(true);

    expect(AudioMock).toHaveBeenCalledWith();
    expect(speech.speak).toHaveBeenCalledTimes(1);
  });

  it("falls back to TTS when pronunciation lookup fails", async () => {
    const { AudioMock } = installAudioMock();
    const speech = installSpeechSynthesisMock();
    const fetchPronunciationAudio = vi.fn().mockRejectedValue(new Error("lookup failed"));
    setPronunciationAudioFetcherForTest(fetchPronunciationAudio);

    await expect(speakText("hello")).resolves.toBe(true);

    expect(AudioMock).not.toHaveBeenCalled();
    expect(speech.speak).toHaveBeenCalledTimes(1);
  });

  it("returns true when speech synthesis is unsupported but fetched audio plays", async () => {
    const { AudioMock, playMocks } = installAudioMock();
    const fetchPronunciationAudio = vi.fn().mockResolvedValue("https://cdn.example.com/hello.mp3");
    setPronunciationAudioFetcherForTest(fetchPronunciationAudio);

    await expect(speakText("hello")).resolves.toBe(true);

    expect(isSpeechSupported()).toBe(false);
    expect(AudioMock).toHaveBeenCalledWith();
    expect(playMocks[0]).toHaveBeenCalled();
  });

  it("does not fall back to system speech when online audio is required", async () => {
    const { AudioMock } = installAudioMock([new Error("network")]);
    const speech = installSpeechSynthesisMock();
    const fetchPronunciationAudio = vi.fn().mockResolvedValue("https://cdn.example.com/hello.mp3");
    setPronunciationAudioFetcherForTest(fetchPronunciationAudio);

    await expect(speakText("hello", { fallbackToSystem: false, fallbackToDictionary: false })).resolves.toBe(false);

    expect(AudioMock).toHaveBeenCalledWith();
    expect(speech.speak).not.toHaveBeenCalled();
  });

  it("pauses and resumes the active online audio element", async () => {
    const { playMocks } = installAudioMock();
    const speech = installSpeechSynthesisMock();
    const fetchPronunciationAudio = vi.fn().mockResolvedValue("https://cdn.example.com/hello.mp3");
    setPronunciationAudioFetcherForTest(fetchPronunciationAudio);

    await expect(speakText("hello", { fallbackToSystem: false })).resolves.toBe(true);
    expect((await import("./speechService")).pauseSpeaking()).toBe(true);
    expect((await import("./speechService")).resumeSpeaking()).toBe(true);
    expect(playMocks[0]).toHaveBeenCalledTimes(2);
    expect(speech.speak).not.toHaveBeenCalled();
  });
});

describe("pickSpeechPreviewText (R11)", () => {
  it("falls back to the default sentence when the library is empty", () => {
    const preview = pickSpeechPreviewText([]);
    expect(preview.fromLibrary).toBe(false);
    expect(preview.text).toBe(DEFAULT_SPEECH_PREVIEW_TEXT);
  });

  it("picks a real library sentence when available", () => {
    const preview = pickSpeechPreviewText(["The quick brown fox jumps over the lazy dog."]);
    expect(preview.fromLibrary).toBe(true);
    expect(preview.text).toBe("The quick brown fox jumps over the lazy dog.");
  });

  it("filters out non-English, too-short and too-long segments", () => {
    const tooLong = `a ${"b".repeat(200)}`;
    const preview = pickSpeechPreviewText(["你好，世界", "ok", tooLong]);
    expect(preview.fromLibrary).toBe(false);
  });
});

describe("speakText systemOnly", () => {
  it("skips online audio sources and speaks via the system engine directly", async () => {
    const { AudioMock } = installAudioMock();
    const speech = installSpeechSynthesisMock();

    const played = await speakText("Preview this library sentence.", { systemOnly: true });

    expect(played).toBe(true);
    expect(speech.speak).toHaveBeenCalledTimes(1);
    expect(AudioMock).not.toHaveBeenCalled();
  });

  it("returns false when the system engine is unavailable", async () => {
    const { AudioMock } = installAudioMock();
    // @ts-expect-error ensure no engine
    delete window.speechSynthesis;

    const played = await speakText("Preview this library sentence.", { systemOnly: true });

    expect(played).toBe(false);
    expect(AudioMock).not.toHaveBeenCalled();
  });
});
