import { describe, expect, it, vi } from "vitest";
import { generateWordExplanationWithModel } from "./modelService";
import { aiService } from "./aiService";
import type { AiProviderSettings } from "../types";

const provider: AiProviderSettings = {
  enabled: true,
  baseUrl: "https://relay.example.com/v1",
  apiKey: "sk-test",
  model: "test-model",
  temperature: 0.3,
  timeoutMs: 5000,
  fallbackToLocal: true
};

const okResponse = (content: string) =>
  ({
    ok: true,
    text: async () =>
      JSON.stringify({
        choices: [{ message: { content } }]
      })
  }) as unknown as Response;

const stubFetch = (response: Response) => {
  vi.stubGlobal("fetch", vi.fn(async () => response));
};

describe("generateWordExplanationWithModel（AI 补全预研）", () => {
  it("配置不完整时直接报错，不发请求", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    await expect(
      generateWordExplanationWithModel({ ...provider, apiKey: "" }, { word: "persist" })
    ).rejects.toThrow("AI 中转站配置不完整");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("解析模型返回的 JSON（translation/mnemonic/example）", async () => {
    stubFetch(
      okResponse(
        JSON.stringify({
          translation: "v. 坚持；持续",
          mnemonic: "per-（一直）+ sist（站）→ 一直站着不放弃。",
          example: "She persisted with daily dictation. (她坚持每天听写。)"
        })
      )
    );

    const result = await generateWordExplanationWithModel(provider, { word: "persist" });
    expect(result.translation).toBe("v. 坚持；持续");
    expect(result.mnemonic).toContain("一直站着");
    expect(result.example).toContain("persisted");
  });

  it("兼容 ```json 代码围栏包裹的返回", async () => {
    stubFetch(
      okResponse("```json\n{\"translation\": \"n. 例子\", \"mnemonic\": \"\", \"example\": \"\"}\n```")
    );

    const result = await generateWordExplanationWithModel(provider, { word: "example" });
    expect(result.translation).toBe("n. 例子");
  });

  it("缺少 translation 视为失败", async () => {
    stubFetch(okResponse(JSON.stringify({ mnemonic: "只有助记" })));

    await expect(
      generateWordExplanationWithModel(provider, { word: "persist" })
    ).rejects.toThrow("模型返回缺少 translation");
  });

  it("HTTP 错误透传网关的 error.message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 401,
        text: async () => JSON.stringify({ error: { message: "invalid api key" } })
      }) as unknown as Response)
    );

    await expect(
      generateWordExplanationWithModel(provider, { word: "persist" })
    ).rejects.toThrow("invalid api key");
  });
});

describe("aiService.explainWord", () => {
  it("AI 未配置时返回 null（由 UI 引导去设置）", async () => {
    const result = await aiService.explainWord(
      { word: "persist" },
      { aiProvider: { ...provider, enabled: false } } as never
    );
    expect(result).toBeNull();
  });

  it("AI 已配置时走模型通道返回释义", async () => {
    stubFetch(
      okResponse(JSON.stringify({ translation: "v. 坚持", mnemonic: "助记", example: "" }))
    );

    const result = await aiService.explainWord(
      { word: "persist" },
      { aiProvider: provider } as never
    );
    expect(result?.translation).toBe("v. 坚持");
  });
});
