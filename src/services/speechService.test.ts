import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearSpeechAudioCacheForTests,
  isSpeechSupported,
  preloadAudioUrl,
  preloadSpeechAudio,
  setPronunciationAudioFetcherForTest,
  speakText
} from "./speechService";

const installAudioMock = (playResults: Array<Promise<void> | Error | undefined> = [undefined]) => {
  const playMocks: ReturnType<typeof vi.fn>[] = [];
  const AudioMock = vi.fn().mockImplementation(() => {
    const result = playResults.shift();
    const play = vi.fn(() => {
      if (result instanceof Error) {
        return Promise.reject(result);
      }
      return result ?? Promise.resolve();
    });
    playMocks.push(play);
    return {
      addEventListener: vi.fn(),
      currentTime: 0,
      load: vi.fn(),
      pause: vi.fn(),
      play,
      preload: "",
      removeAttribute: vi.fn()
    };
  });

  vi.stubGlobal("Audio", AudioMock);
  return { AudioMock, playMocks };
};

const installSpeechSynthesisMock = () => {
  const cancel = vi.fn();
  const getVoices = vi.fn(() => []);
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

  it("prefers uploaded audio before system speech", async () => {
    const { AudioMock, playMocks } = installAudioMock();
    const speech = installSpeechSynthesisMock();
    const fetchPronunciationAudio = vi.fn().mockResolvedValue("https://cdn.example.com/hello.mp3");
    setPronunciationAudioFetcherForTest(fetchPronunciationAudio);

    await expect(speakText("hello", { audioUrl: "data:audio/mp3;base64,abc" })).resolves.toBe(true);

    expect(AudioMock).toHaveBeenCalledWith("data:audio/mp3;base64,abc");
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
    expect(AudioMock).toHaveBeenCalledWith("https://cdn.example.com/hello.mp3");
    expect(playMocks[0]).toHaveBeenCalled();
    expect(speech.speak).not.toHaveBeenCalled();
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
    expect(AudioMock).toHaveBeenCalledWith("https://cdn.example.com/hello.mp3");
    expect(playMocks[0]).toHaveBeenCalledTimes(1);
    expect(speech.speak).not.toHaveBeenCalled();
  });

  it("tries fetched pronunciation audio after uploaded audio playback fails", async () => {
    const { AudioMock, playMocks } = installAudioMock([new Error("bad upload"), undefined]);
    const speech = installSpeechSynthesisMock();
    const fetchPronunciationAudio = vi.fn().mockResolvedValue("https://cdn.example.com/hello.mp3");
    setPronunciationAudioFetcherForTest(fetchPronunciationAudio);

    await expect(speakText("hello", { audioUrl: "blob:uploaded" })).resolves.toBe(true);

    expect(AudioMock).toHaveBeenNthCalledWith(1, "blob:uploaded");
    expect(AudioMock).toHaveBeenNthCalledWith(2, "https://cdn.example.com/hello.mp3");
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
    expect(AudioMock).toHaveBeenCalledWith("https://dict.youdao.com/dictvoice?type=0&audio=hello");
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

    expect(AudioMock).toHaveBeenNthCalledWith(1, "https://dict.youdao.com/dictvoice?type=0&audio=hello");
    expect(AudioMock).toHaveBeenNthCalledWith(2, legacyAudioUrl);
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

    expect(AudioMock).toHaveBeenCalledWith("https://cdn.example.com/hello.mp3");
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
    expect(AudioMock).toHaveBeenCalledWith("https://cdn.example.com/hello.mp3");
    expect(playMocks[0]).toHaveBeenCalled();
  });
});
