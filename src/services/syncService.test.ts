import { describe, expect, it, vi } from "vitest";
import { AppData, DataSyncSettings } from "../types";
import { latestLocalUpdatedAt, pullDataSnapshot, pushDataSnapshot, resolveSyncDirection } from "./syncService";
import { loadData } from "./storage";

const sync: DataSyncSettings = {
  enabled: true,
  baseUrl: "https://sync.example.com",
  token: "secret-token"
};

const buildData = (overrides: Partial<AppData> = {}): AppData => ({
  ...loadData(),
  ...overrides
});

describe("sync service", () => {
  it("pushes a snapshot to the normalized /sync endpoint with the token header", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ savedAt: "2026-09-10T12:00:00.000Z" })
    });
    vi.stubGlobal("fetch", fetchMock);

    const data = buildData();
    const savedAt = await pushDataSnapshot(sync, data);

    expect(savedAt).toBe("2026-09-10T12:00:00.000Z");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("https://sync.example.com/sync");
    const init = fetchMock.mock.calls[0][1];
    expect(init.headers.Authorization).toBe("Bearer secret-token");
    expect(JSON.parse(init.body).payload.settings.aiProvider.model).toBe(data.settings.aiProvider.model);
    vi.unstubAllGlobals();
  });

  it("rejects an invalid sync base url before any request is made", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(pushDataSnapshot({ ...sync, baseUrl: "ftp://bad.example.com" }, buildData()))
      .rejects.toThrow("云同步地址无效");
    expect(fetchMock).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("returns null when the cloud has no snapshot yet and restores a valid one", async () => {
    const data = buildData({
      cards: [{ ...buildData().cards[0], front: "synced-word" } as AppData["cards"][number]].filter(Boolean)
    });
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 404, text: async () => "" })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ savedAt: "2026-09-10T13:00:00.000Z", payload: data })
      });
    vi.stubGlobal("fetch", fetchMock);

    await expect(pullDataSnapshot(sync)).resolves.toBeNull();

    const remote = await pullDataSnapshot(sync);
    expect(remote?.savedAt).toBe("2026-09-10T13:00:00.000Z");
    expect(remote?.data.cards.some((card) => card.front === "synced-word")).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    vi.unstubAllGlobals();
  });

  it("surfaces the server error message when the token is rejected", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ error: { message: "令牌不正确。" } })
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(pushDataSnapshot(sync, buildData())).rejects.toThrow("令牌不正确");
    vi.unstubAllGlobals();
  });

  it("lets the newer side win when reconciling local and cloud data", () => {
    const emptyLocal = buildData({ cards: [], adventures: [], materials: [], sentenceDetails: [] });
    expect(resolveSyncDirection(emptyLocal, "2020-01-01T00:00:00.000Z")).toBe("pull");
    expect(resolveSyncDirection(emptyLocal, "")).toBe("push");

    const local = buildData();
    expect(resolveSyncDirection(local, "")).toBe("push");
    // No local entity timestamps -> the cloud snapshot wins.
    expect(resolveSyncDirection({ ...local, cards: [], adventures: [], materials: [] }, "2020-01-01T00:00:00.000Z")).toBe("pull");
  });

  it("finds the newest entity timestamp across collections", () => {
    const base = buildData();
    const oldCard = { ...base.cards[0], updatedAt: "2026-01-01T00:00:00.000Z" };
    // 种子数据使用当前时间，因此断言取未来时间戳，避免测试随运行日期失效。
    const newest = new Date(Date.now() + 86400000).toISOString();
    const newCard = { ...base.cards[0], id: "card_new", updatedAt: newest };
    const adventure = { ...base.adventures[0], updatedAt: "2026-06-01T00:00:00.000Z" };

    expect(latestLocalUpdatedAt({ ...base, cards: [oldCard, newCard], adventures: [adventure] }))
      .toBe(newest);
  });
});
