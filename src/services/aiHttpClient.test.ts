import { afterEach, describe, expect, it, vi } from "vitest";
import { RELAY_BRIDGE_PREFIX, isLoopbackRelayUrl, requestFetch, toRelayBridgeUrl } from "./aiHttpClient";

const setPageOrigin = (origin: string) => {
  Object.defineProperty(window, "location", {
    value: { origin },
    configurable: true,
    writable: true
  });
};

describe("ai http client relay bridge", () => {
  afterEach(() => {
    Reflect.deleteProperty(window, "location");
  });

  it("recognizes loopback relay urls and ignores remote ones", () => {
    expect(isLoopbackRelayUrl("http://127.0.0.1:7865/v1")).toBe(true);
    expect(isLoopbackRelayUrl("http://localhost:7865/v1")).toBe(true);
    expect(isLoopbackRelayUrl("http://[::1]:7865/v1")).toBe(true);
    expect(isLoopbackRelayUrl("https://api.example.com/v1")).toBe(false);
    // TLS loopback stays on its own connection: the bridge forwards in plain HTTP.
    expect(isLoopbackRelayUrl("https://127.0.0.1:7865/v1")).toBe(false);
    expect(isLoopbackRelayUrl("not a url")).toBe(false);
  });

  it("routes a loopback relay through the same-origin dev bridge so the browser cannot block it", () => {
    setPageOrigin("http://127.0.0.1:1420");
    expect(toRelayBridgeUrl("http://127.0.0.1:7865/v1/chat/completions"))
      .toBe(`${RELAY_BRIDGE_PREFIX}127.0.0.1:7865/v1/chat/completions`);
  });

  it("preserves the query string when bridging", () => {
    setPageOrigin("http://localhost:1420");
    expect(toRelayBridgeUrl("http://127.0.0.1:7865/v1/chat/completions?debug=1"))
      .toBe(`${RELAY_BRIDGE_PREFIX}127.0.0.1:7865/v1/chat/completions?debug=1`);
  });

  it("leaves remote relays untouched so a real CORS message is never masked", () => {
    setPageOrigin("http://127.0.0.1:1420");
    expect(toRelayBridgeUrl("https://api.example.com/v1/chat/completions"))
      .toBe("https://api.example.com/v1/chat/completions");
  });

  it("does not bridge when the page itself is not served from loopback", () => {
    setPageOrigin("https://app.example.com");
    expect(toRelayBridgeUrl("http://127.0.0.1:7865/v1/chat/completions"))
      .toBe("http://127.0.0.1:7865/v1/chat/completions");
  });

  it("sends the rewritten url to fetch", async () => {
    setPageOrigin("http://127.0.0.1:1420");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchMock);

    await requestFetch("http://127.0.0.1:7865/v1/chat/completions", { method: "POST" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(`${RELAY_BRIDGE_PREFIX}127.0.0.1:7865/v1/chat/completions`);
    vi.unstubAllGlobals();
  });
});
