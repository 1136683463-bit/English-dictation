import { describe, expect, it } from "vitest";
import { findDictionaryEntry, searchDictionaryAsync } from "./dictionaryService";
import { makeTestData } from "./testUtils";

const makeEntry = (word: string, translation = `${word} translation`) => ({
  word,
  phonetic: `/${word}/`,
  partOfSpeech: "n.",
  definition: `${word} definition`,
  translation,
  collocations: ""
});

describe("dictionaryService", () => {
  it("falls back from common inflected forms to dictionary lemmas", () => {
    const data = makeTestData({
      dictionaryEntries: [
        makeEntry("sentence", "句子"),
        makeEntry("check", "检查"),
        makeEntry("study", "学习"),
        makeEntry("run", "跑"),
        makeEntry("create", "创造")
      ]
    });

    expect(findDictionaryEntry(data, "sentences")?.word).toBe("sentence");
    expect(findDictionaryEntry(data, "checked")?.word).toBe("check");
    expect(findDictionaryEntry(data, "studied")?.word).toBe("study");
    expect(findDictionaryEntry(data, "running")?.word).toBe("run");
    expect(findDictionaryEntry(data, "creating")?.word).toBe("create");
  });
});

describe("英美拼写变体（2026-09-23 批六十二新增）", () => {
  /**
   * 背景：内置词典 12000 词，但**同一词的两种拼写只收了一侧**——
   * 实测 23 组常见词在另一侧拼法下完全查不到（如词典只有 `favourite`，
   * 用户打 `favorite` 查不到）。这是用户能直接碰到的缺陷。
   *
   * 判据纪律：本表是**人工核对的真实词对**，不是拼写规则生成的。
   * 我先试过规则式（-our→-or / -re→-er / -ise→-ize），实测产出 291 组伪变体
   * （`share`→`shaer`、`nature`→`natuer`、`here`→`heer`）——
   * 那些后缀在英语里大量出现在**非英美差异**的词上，拿它们查表会张冠李戴。
   */
  it("词典只收一侧拼写时，另一侧也能查到同一条目", () => {
    // 词典故意只收英式
    const ukOnly = makeTestData({
      dictionaryEntries: [makeEntry("favourite", "最喜爱的"), makeEntry("theatre", "剧院"), makeEntry("jewellery", "珠宝")]
    });
    expect(findDictionaryEntry(ukOnly, "favorite")?.word).toBe("favourite");
    expect(findDictionaryEntry(ukOnly, "theater")?.word).toBe("theatre");
    expect(findDictionaryEntry(ukOnly, "jewelry")?.word).toBe("jewellery");

    // 词典故意只收美式
    const usOnly = makeTestData({
      dictionaryEntries: [makeEntry("realize", "意识到"), makeEntry("organize", "组织"), makeEntry("traveled", "旅行过")]
    });
    expect(findDictionaryEntry(usOnly, "realise")?.word).toBe("realize");
    expect(findDictionaryEntry(usOnly, "organise")?.word).toBe("organize");
    expect(findDictionaryEntry(usOnly, "travelled")?.word).toBe("traveled");
  });

  it("拼写变体与复数/时态叠加时仍能还原（先剥屈折、再换拼写）", () => {
    const data = makeTestData({
      dictionaryEntries: [makeEntry("favourite", "最喜爱的"), makeEntry("colour", "颜色")]
    });
    // favourites → favourite（剥复数）→ 已是英式，命中
    expect(findDictionaryEntry(data, "favourites")?.word).toBe("favourite");
    // colours 同理
    expect(findDictionaryEntry(data, "colours")?.word).toBe("colour");
  });

  it("不是英美变体的词不受影响（防拼写规则误伤）", () => {
    const data = makeTestData({
      dictionaryEntries: [makeEntry("share", "分享"), makeEntry("nature", "自然"), makeEntry("here", "这里")]
    });
    // 这三个词的后缀与英美差异**无关**，绝不能被改成 shaer / natuer / heer
    expect(findDictionaryEntry(data, "share")?.word).toBe("share");
    expect(findDictionaryEntry(data, "nature")?.word).toBe("nature");
    expect(findDictionaryEntry(data, "here")?.word).toBe("here");
    // 且查不到的仍然是查不到（不因新逻辑凭空产出条目）
    expect(findDictionaryEntry(data, "shaer")).toBeUndefined();
    expect(findDictionaryEntry(data, "natuer")).toBeUndefined();
  });

  it("闸自检：对照组必须真的能区分（否则本闸是空转）", () => {
    const ukOnly = makeTestData({ dictionaryEntries: [makeEntry("favourite", "最喜爱的")] });
    // 变体应命中
    expect(findDictionaryEntry(ukOnly, "favorite")).toBeTruthy();
    // 一个既非变体、也不存在的词，必须仍然查不到
    expect(findDictionaryEntry(ukOnly, "favoorite")).toBeUndefined();
  });
});

describe("搜索框认拼写变体（2026-09-23 批六十二补）", () => {
  /**
   * 与查词同一维度的第二个缺陷：搜索框原用**纯子串**匹配，
   * 于是在搜索框打 \`favorite\` 找不到 \`favourite\`（两个拼写不含彼此）。
   */
  it("搜美式拼写能找到英式条目，反之亦然", async () => {
    const data = makeTestData({
      dictionaryEntries: [makeEntry("favourite", "最喜爱的"), makeEntry("realize", "意识到")]
    });
    const byUS = await searchDictionaryAsync(data, "favorite");
    expect(byUS.some((e) => e.word === "favourite"), "搜 favorite 应找到 favourite").toBe(true);
    const byUK = await searchDictionaryAsync(data, "realise");
    expect(byUK.some((e) => e.word === "realize"), "搜 realise 应找到 realize").toBe(true);
  });

  it("原有子串行为不退化（搜前缀仍能找到）", async () => {
    const data = makeTestData({ dictionaryEntries: [makeEntry("favourite", "最喜爱的")] });
    const byPrefix = await searchDictionaryAsync(data, "favour");
    expect(byPrefix.some((e) => e.word === "favourite"), "搜 favour 前缀应找到 favourite").toBe(true);
  });
});
