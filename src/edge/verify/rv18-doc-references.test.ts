// @vitest-environment node
/**
 * RV18 · 源码注释里引用的测试文件必须真实存在（2026-09-24 批六十八新增）
 *
 * ## 为什么要这道闸
 *
 * `reviewArchiveService.ts` 的注释里有两处**承重引用**——
 * 「WebKit 8 个月撞墙」与「真冗余只占 8%，摘了也救不了」，
 * 它们是 `REVIEW_DETAIL_RETENTION_DAYS = 180` 这个常量的**全部依据**。
 * 但这两处引用的 `pf2d-quota-wall-recalib.test.ts` 与
 * `pf2g-detail-redundancy.test.ts` **都已不存在**——测试后来被改名/重组为
 * `r13b-*` 与 `r12a-*`，注释路径没跟着改。
 *
 * **危害不是「链接点不动」**：后人（包括我自己）要调整保留窗口时，
 * 会照着注释去找那份证据，找不到就只能**照抄注释里的数字**——
 * 而那些数字一旦与代码脱节，就成了「用旧结论指导新决策」。
 *
 * ## 这道闸怎么判
 *
 * 扫 `src/**` 里所有形如 `src/edge/verify/xxx.test.ts` 的路径引用，
 * 逐个 `existsSync`。**只查「文件在不在」，不查内容对不对**——
 * 内容是否仍支持结论需要人读，机器只能拦住「指向空文件」这一层。
 *
 * ## 为什么值得单独一道闸
 *
 * 本会话已出现**三例同类问题**（`loud`/`careful` 幻影登记、`by the time`
 * 评估过却没做、「316 词缺失」假缺口），共同点都是
 * **文档与数据脱节、且无人核对**。注释里的文件路径是最容易脱节的一种，
 * 因为它不参与编译、不参与测试，改错了没有任何机制会报。
 */
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const REPO = process.cwd();

/** 递归收集 src 下的 .ts/.tsx（不含测试文件自身，避免自引用噪声）。 */
const collectSources = (dir: string, acc: string[] = []): string[] => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (/node_modules|\.git$|dist/.test(full)) continue;
      collectSources(full, acc);
    } else if (/\.(ts|tsx)$/.test(entry)) {
      acc.push(full);
    }
  }
  return acc;
};

describe("RV18 注释里的测试文件引用", () => {
  it("源码注释中引用的 src/edge/verify/*.test.ts 必须存在", () => {
    const dangling: string[] = [];
    /**
     * ⚠️ 扫描要**排除本文件自己**：它按设计含两个不存在的路径——
     * 一个是文档里的占位符 `xxx.test.ts`，一个是「闸自检」里那个
     * 刻意举的反例（被改名的旧路径）。若不排除，闸会被自己的说明绊红
     * （第一版就是这样，实测踩到）。
     */
    const SELF = "rv18-doc-references.test.ts";
    for (const file of collectSources(join(REPO, "src"))) {
      if (file.endsWith(SELF)) continue;
      const source = readFileSync(file, "utf8");
      // 只匹配「看起来是仓库内路径」的引用（含 src/edge/verify/ 前缀）
      for (const match of source.matchAll(/src\/edge\/verify\/[a-z0-9-]+\.test\.tsx?/g)) {
        const referenced = match[0];
        if (!existsSync(join(REPO, referenced))) {
          dangling.push(`${relative(REPO, file)} → ${referenced}`);
        }
      }
    }
    expect(
      dangling,
      `以下注释引用了**不存在**的测试文件（多半是测试改名后没回改路径）：\n` +
        `${dangling.join("\n")}\n` +
        `处理方式：要么把路径改成现名，要么删掉该引用并说明证据已并入何处——` +
        `**不要留着指向空文件的引用**，后人会照抄它旁边的数字。`
    ).toEqual([]);
  });

  it("闸自检：判据能真的区分（构造一个不存在的路径应被抓到）", () => {
    const real = "src/edge/verify/pf2a-scale-curves.test.ts";
    const fake = "src/edge/verify/pf2d-quota-wall-recalib.test.ts";
    expect(existsSync(join(REPO, real)), "正例：现存文件应存在").toBe(true);
    // 反例：这正是本批修掉的那个悬空引用，它确实不存在
    expect(existsSync(join(REPO, fake)), "反例：被改名的旧路径应不存在").toBe(false);
  });

  it("本批修掉的两处引用现指向真实文件（防回退）", () => {
    const source = readFileSync(join(REPO, "src/services/reviewArchiveService.ts"), "utf8");
    // 应引用现名
    expect(source, "归档窗口的月份依据应引 r13b").toContain("r13b-quota-wall-recalib");
    expect(source, "冗余占比的依据应引 r12a").toContain("r12a-detail-redundancy");
    /**
     * 旧文件名**允许出现在「校正说明」里**（本批就是靠那段说明记录
     * 「它曾指向空文件」这件事的）——所以不能简单断言「全文不含旧名」，
     * 我的第一版就是这么写的、然后被自己写的说明绊红了。
     *
     * 精确判据：**旧名出现的每一处上下文都必须是「已不存在 / 校正」这类说明**，
     * 而不是当作有效引用（有效引用的写法是反引号包路径 + 句末，如旧版那样）。
     */
    for (const oldName of ["pf2d-quota-wall-recalib", "pf2g-detail-redundancy"]) {
      const lines = source.split("\n").filter((line) => line.includes(oldName));
      expect(lines.length, `\`${oldName}\` 不应凭空出现`).toBeGreaterThan(0);
      for (const line of lines) {
        expect(
          /已不存在|校正|改名/.test(line),
          `\`${oldName}\` 出现在非「校正说明」的上下文里（可能是残留的有效引用）：\n${line}`
        ).toBe(true);
      }
    }
  });
});
