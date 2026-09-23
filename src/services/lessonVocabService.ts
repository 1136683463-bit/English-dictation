import type { AppData, GrammarLesson, Unit } from "../types";
import { grammarLessons } from "../data/grammarLessons";
import { nowIso, uid } from "./storage";

/**
 * 随课词桥（2026-09-23 批六十七）。
 *
 * ## 解决什么问题
 *
 * 语法线与词汇线此前**不相通**：用户读完了 205 课的上千个句子，
 * 但词汇侧只有一个 **12000 词的查询库**（用户主动去查），**没有任何带顺序的词汇序列**。
 * 「这课新出现了哪些词」这个信息，此前只活在 `grammarLessons.test.ts` 的 D 层守门里——
 * 那份 `buildPools` 词表**只用于校验，从未被产品功能用过**。
 *
 * 本模块把那份口径抽成正式服务，让「课内教过的词」能被复用。
 *
 * ## 口径纪律（照搬 D 层守门，不得放宽）
 *
 * **本课词表不含 `practice` 自身的 tokens。** 若把题目自己的词块算进来，
 * 「课内出现过」会变成恒真命题，词表失去意义（见 `grammarLessons.test.ts` 的
 * 「关键口径纪律」注释）。
 *
 * ## 归一化
 *
 * 与 D 层守门同一套：小写 + 去掉非字母数字撇号 + 压空白。
 * ⚠️ 不做词形还原——`books` 与 `book` 是两个不同的词条。
 * 这是**刻意的**：词表用于「这课出现了哪些词形」，而词典查询侧
 * （`dictionaryService.getLookupCandidates`）另有还原逻辑，两者职责不同。
 *
 * ## ⚠️ 已知限制（诚实登记，未做）
 *
 * 词表里有**专有名词与中文人名**（`xiaomei` / `xiaoming` / `lin` / `tao` / `tom`…）。
 * 严格说，把 `xiaomei` 收进词书让用户背是不合适的——那是角色名，不是英语词。
 * 未做的原因：机器分不出「人名」与「普通词」（都要靠一张人名表），
 * 而仓库里没有人名清单；硬编一张会随课文新增而失效。
 * ⇒ 若要做，正确路径是**在课数据侧给人名打标**，而不是在服务里猜。
 * 当前由调用方（UI）决定是否展示；本服务只负责「这课新出现了哪些词形」。
 */

/** 与 `grammarLessons.test.ts` 的 D 层守门同一套归一化。 */
const normalize = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();

const wordsOf = (value: string): string[] => normalize(value).split(" ").filter(Boolean);

/**
 * 一课教过的全部词形。
 *
 * ## 与 D 层守门的一处**刻意差异**（批六十七实测后定）
 *
 * D 层守门的 `buildPools` 把 `contrast.wrong`（错句）也算进词表，
 * 因为它的命题是「**用户见没见过**这个词」——错句也是用户看过的材料。
 *
 * 但这个词表的用途是**生成词书**，而错句里大量是**刻意造的错误形式**：
 * `haves`（L3）、`goodest`（L31）、`fastly`（L59）、`breaked`（L23）……
 * 实测全库有 **25 个**这样的错形混进来（`allLessonNewWords` 首版产出）。
 * **把 `goodest` 收进词书教用户背，是明确的缺陷**——那不是英语词。
 *
 * ⇒ 本函数**只收正确材料**（目标句 / 例句 / 块 / 对话 / 对比卡的正句 /
 *   变体 / 场景变奏 / 跟段答案 / 忆段答案），**排除 `contrast.wrong`**。
 *   若将来要复用它做「用户见没见过」的判定，**不要直接用**，得另传口径。
 */
export const lessonVocabulary = (lesson: GrammarLesson): string[] => {
  const vocab = new Set<string>();
  const add = (text?: string) => {
    if (text) for (const word of wordsOf(text)) vocab.add(word);
  };
  add(lesson.targetSentence);
  for (const example of lesson.examples ?? []) add(example.en);
  for (const block of lesson.blocks ?? []) add(block.text);
  for (const line of lesson.dialogue ?? []) add(line.en);
  for (const contrast of lesson.contrast ?? []) {
    // ⚠️ 只收正句；错句里有刻意造的错误形式，不能进词书（见上方说明）
    add(contrast.correct);
  }
  for (const variant of lesson.variants ?? []) add(variant.en);
  for (const swing of lesson.sceneSwings ?? []) add(swing.en);
  for (const step of lesson.guided ?? []) {
    /**
     * ⚠️ `spot` 题的 `answer` **就是那个错词**（用户要点出来的），
     * `tokens` 也是**含错的句子**——两者都不能进词书。
     * 实测：混进来 8 个刻意造的错误形式（`putted` L82 / `thinked` L197 /
     * `catched` L199 / `keeped` L200 / `sleeped` L201 / `drawed` L202 /
     * `weared` L203 / `gived` L204）。
     *
     * 这与 `types.ts` 里 `HuntError` 那条纪律同源：
     * **「答案」字段的语义要看题型的语境，不能按名字猜。**
     */
    if (step.kind === "spot") continue;
    if (step.answer) add(step.answer);
    for (const token of step.tokens ?? []) add(token);
  }
  if (lesson.recall?.answer) add(lesson.recall.answer);
  vocab.delete("");
  return [...vocab];
};

/**
 * 一课**新出现**的词（相对此前所有课累计）。
 *
 * `number` 只增不减地扫一遍：先算第 1 课的词表，再算第 2 课减去第 1 课……
 * 与 D 层守门「含此前累计」的语义一致。
 */
export const newWordsInLesson = (lesson: GrammarLesson): string[] => {
  const prior = new Set<string>();
  for (const candidate of [...grammarLessons].sort((a, b) => a.number - b.number)) {
    const vocab = lessonVocabulary(candidate);
    if (candidate.number === lesson.number) {
      return vocab.filter((word) => !prior.has(word));
    }
    for (const word of vocab) prior.add(word);
  }
  return [];
};

/** 全库「每课新词」一次算好（供批量场景使用，避免逐课重复扫全库）。 */
export const allLessonNewWords = (): Map<string, string[]> => {
  const prior = new Set<string>();
  const result = new Map<string, string[]>();
  for (const lesson of [...grammarLessons].sort((a, b) => a.number - b.number)) {
    const fresh = lessonVocabulary(lesson).filter((word) => !prior.has(word));
    result.set(lesson.id, fresh);
    for (const word of lessonVocabulary(lesson)) prior.add(word);
  }
  return result;
};

/** 随课词书的标题与描述模板（单一事实来源，UI 与测试都读这里）。 */
export const lessonVocabUnitMeta = (lesson: GrammarLesson) => ({
  title: `第 ${lesson.number} 课 · ${lesson.title}`,
  description: `《${lesson.title}》里新出现的词——跟着课的进度走，不是随机词表。`
});

/**
 * 为某课生成「随课词书」（幂等：已存在则原样返回，不重复创建）。
 *
 * 幂等键是 `Unit.description` 里嵌的 `[随课:lessonId]`——
 * 不用 title 判重，因为 title 是给人看的、可能被用户改。
 */
export const ensureLessonVocabUnit = (
  data: AppData,
  lesson: GrammarLesson
): { data: AppData; unitId: string | null; created: boolean } => {
  const key = `[随课:${lesson.id}]`;
  const existing = data.units.find((unit) => unit.description.includes(key));
  if (existing) return { data, unitId: existing.id, created: false };

  const words = newWordsInLesson(lesson);
  // 新词为 0 的课不建空词书（例如纯复习课/收口课）
  if (words.length === 0) return { data, unitId: null, created: false };

  const meta = lessonVocabUnitMeta(lesson);
  const timestamp = nowIso();
  const maxOrder = data.units.reduce((max, unit) => Math.max(max, unit.order), 0);
  const unit: Unit = {
    id: uid("unit"),
    title: meta.title,
    description: `${meta.description} ${key}`,
    order: maxOrder + 1,
    color: "#2563eb",
    createdAt: timestamp,
    updatedAt: timestamp
  };
  return { data: { ...data, units: [...data.units, unit] }, unitId: unit.id, created: true };
};
