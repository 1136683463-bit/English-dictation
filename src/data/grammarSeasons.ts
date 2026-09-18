// 语法季分组：路径页与侦探页共用（原 LESSON_GROUPS 定义于 GrammarPathPage，
// 2026-09-17 排版优化时抽出，供案件列表按季分组复用）。
//
// ⚠️ 硬护栏（维护须知）：min/max 区间过滤是「必需机制」而非展示装饰——
// 课程号不落在任何区间内会被路径页静默过滤（整课不显示、无报错）。
// 新增课程批次时必须同步追加 season-N 分组，并有 grammarSeasons.test.ts 守门。
// 先例：批五 season-5 (42–46) · 批六 season-6 (47–49) · 批七 season-7 (50–54) ·
//       批八 season-8 (55–60) · 批九 season-9 (61–66) · 批十 season-10 (67–71) ·
//       批十一 season-11 (72–75)。
// 批次的「分组 + 里程碑（mN）」是同一张随批上线清单（见各批 PRD 的 G8 硬需求项）。
export interface GrammarSeason {
  id: string;
  label: string;
  hint: string;
  min: number;
  max: number;
}

/** 数据基线由 grammarSeasons.test.ts 断言，改区间先跑测试。 */
export const LESSON_GROUPS: GrammarSeason[] = [
  { id: "season-1", label: "第一季 · 初级篇", hint: "从第一句英语，到把昨天和明天说清楚", min: 1, max: 12 },
  { id: "season-2", label: "第二季 · 进阶篇", hint: "从「报句子」到「讲事情」：进行时、情态、比较、连句", min: 13, max: 24 },
  // F5 第三季 · 巩固篇（2026-09-13）：补 A2 高频缺口——三单 -s、there be、疑问词系统
  { id: "season-3", label: "第三季 · 巩固篇", hint: "把最顽固的小毛病改掉：三单、存在句、疑问词、频率、打算、数量……全部拿下", min: 25, max: 34 },
  // 第四批 · 句子变长（2026-09-14）：宾从「话中话」+ 定从「挂尾巴」
  { id: "season-4", label: "第四季 · 句子变长", hint: "从一句一件事，到一句话说两件事：话中话、给名词挂尾巴", min: 35, max: 41 },
  // 第五批 · 动词的两件新搭档（2026-09-16）：-ing 名字版 + 目的 to 小垫板
  { id: "season-5", label: "第五季 · 动词的两件新搭档", hint: "喜欢做、享受做、去做、想做：like/enjoy + reading；go … to buy", min: 42, max: 46 },
  // 第六批 · 语用入门（2026-09-17）：S5 首兑——should 建议 + if 条件句
  { id: "season-6", label: "第六季 · 建议与条件", hint: "给人建议、说条件：should 应该 / if 如果……就……", min: 47, max: 49 },
  // 第七批 · 幕后句（2026-09-17）：be + 做过版——谁做的不重要，把事推到台前
  { id: "season-7", label: "第七季 · 幕后句", hint: "谁做的不重要——把事推到台前：杯子被摔了、窗户被打扫了", min: 50, max: 54 },
  // 第八批 · 日常细节（2026-09-18）：日期链（序数→月份→日期）+ 副词链（-ly→well/fast）+ there was/were
  { id: "season-8", label: "第八季 · 日常细节", hint: "说日期、夸做得好、回忆昨天——日常里的小事说利索", min: 55, max: 60 },
  // 第九批 · 客气与程度（2026-09-18）：could 请求 + would like + give 双宾 + finish 门卫 + as…as + too…to
  { id: "season-9", label: "第九季 · 客气与程度", hint: "请人帮忙说客气、东西递到手、一样和太过——话说得体面也说得精确", min: 61, max: 66 },
  // 第十批 · 本领与分寸（2026-09-18）：good at + buy for + would you mind/like + enough
  { id: "season-10", label: "第十季 · 本领与分寸", hint: "擅长的、买给你的、问得婉转的、够用的——把本事说得出口，把心意送得到位", min: 67, max: 71 },
  // 第十一批 · 频率与提议（2026-09-18）：how 家族两问（How often / How long）+ 搭把手（let me / help）+ 提议（Let's）
  { id: "season-11", label: "第十一季 · 频率与提议", hint: "问多久一次、问要花多久、开口搭把手、一起走吧——问得清楚，约得起来", min: 72, max: 75 },
  // 第十二批 · 更上一层（2026-09-18）：much 加力 + keep 不停 + 跨季大团圆
  { id: "season-12", label: "第十二季 · 更上一层", hint: "给「更」加力、一直在做、把一天串成一条线——说得更有劲，也说得更连贯", min: 76, max: 78 },
  // 第十三批 · 找东西（2026-09-19）：方位三课 + put + 不定代词两课 + whose + 失物招领收口（首个大章节 8 课）
  { id: "season-13", label: "第十三季 · 找东西", hint: "东西在哪、放到哪儿、说不清是什么、这是谁的——把身边的东西一件件说清楚", min: 79, max: 86 },
  // 第十四批 · 聊两句（2026-09-19）：合体 It's + -y 天气词 + 感叹 + 时间从句三课 + used to + 校门口收口（大章节 8 课）
  { id: "season-14", label: "第十四季 · 聊两句", hint: "说短一点、说天气、说感叹、说先后、说从前——校门口聊两句，把话越说越长", min: 87, max: 94 },
  // 第十五批 · 讲故事（2026-09-19）：过去进行升级 + 背景句 + when/while + 进行 vs 过去 + used to 讲故事 + 双收口（大章节 8 课·单拱）
  { id: "season-15", label: "第十五季 · 讲故事", hint: "那时正在做、被电话打断、一边一边——把昨天的事一件件讲清楚", min: 95, max: 102 }
];

/** 按课号查所属季（找不到返回 undefined——出现即数据缺口，宁可显式暴露）。 */
export const findSeasonByLessonNumber = (lessonNumber: number): GrammarSeason | undefined =>
  LESSON_GROUPS.find((group) => lessonNumber >= group.min && lessonNumber <= group.max);
