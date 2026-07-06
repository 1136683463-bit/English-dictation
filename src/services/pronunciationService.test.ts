import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearPronunciationAudioCacheForTests,
  fetchFallbackWordPronunciationAudio,
  fetchWordPronunciationAudio
} from "./pronunciationService";

const jsonResponse = (body: unknown, ok = true) =>
  ({
    ok,
    json: vi.fn().mockResolvedValue(body)
  }) as unknown as Response;

describe("pronunciationService", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    clearPronunciationAudioCacheForTests();
  });

  it("uses Youdao audio as the primary pronunciation source", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const audioUrl = await fetchWordPronunciationAudio("Hello", "en-US");

    expect(fetchMock).not.toHaveBeenCalled();
    expect(audioUrl).toBe("https://dict.youdao.com/dictvoice?type=0&audio=hello");
  });

  it("maps the British accent setting to the Youdao British audio type", async () => {
    const audioUrl = await fetchWordPronunciationAudio("colour", "en-GB");

    expect(audioUrl).toBe("https://dict.youdao.com/dictvoice?type=1&audio=colour");
  });

  it("normalizes protocol-relative fallback audio urls", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse([
        {
          phonetics: [{ audio: "//api.dictionaryapi.dev/media/pronunciations/en/hello-us.mp3" }]
        }
      ])
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchFallbackWordPronunciationAudio("Hello")).resolves.toBe(
      "https://api.dictionaryapi.dev/media/pronunciations/en/hello-us.mp3"
    );
  });

  it("prefers matching accent hints for fallback audio when available", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse([
          {
            phonetics: [
              { audio: "https://example.com/context-us.mp3" },
              { audio: "https://example.com/context-uk.mp3", sourceUrl: "Oxford UK" }
            ]
          }
        ])
      )
    );

    await expect(fetchFallbackWordPronunciationAudio("context", "en-GB")).resolves.toBe(
      "https://example.com/context-uk.mp3"
    );
  });

  it("returns null for failed or unresolvable lookups", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ title: "No Definitions Found" }, false));
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchFallbackWordPronunciationAudio("notaword")).resolves.toBeNull();
    await expect(fetchWordPronunciationAudio("two words")).resolves.toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("caches lookup results including misses", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([{ phonetics: [] }]));
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchFallbackWordPronunciationAudio("missing")).resolves.toBeNull();
    await expect(fetchFallbackWordPronunciationAudio("missing")).resolves.toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
