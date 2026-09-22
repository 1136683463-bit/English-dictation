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
  // F5 第三季 · 巩固篇（2026-09-13）：补 A2 高频缺口——动词带 s、there be、疑问词系统
  { id: "season-3", label: "第三季 · 巩固篇", hint: "把最顽固的小毛病改掉：动词带不带 s、东西在不在、问什么、多久一次、打算做什么、有几个……全部拿下", min: 25, max: 34 },
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
  { id: "season-15", label: "第十五季 · 讲故事", hint: "那时正在做、被电话打断、一边一边——把昨天的事一件件讲清楚", min: 95, max: 102 },
  // 第十六批 · 谁让谁做什么（2026-09-19）：make/let/have/get 四动词 + until 折入 + 四动词收口（大章节 8 课·单拱）
  { id: "season-16", label: "第十六季 · 谁让谁做什么", hint: "妈妈让我写、他不让我去、老师让我来、我说服他一起——「让」字四个说法，一次说清楚", min: 103, max: 110 },
  // 第十七批 · 我一直想说的那些（2026-09-19）：物主 's + mine 分工 + -ed/-ing + a few + have got/has got + 收口（大章节 8 课·单拱）
  { id: "season-17", label: "第十七季 · 我一直想说的那些", hint: "谁的（撇号 s）、我的（mine）、我的感受（感到版）、还有几个（a few）、有（have got）——身边的事，一句话说清一件", min: 111, max: 118 },
  // 第十八批 · 同一个 to，两张脸（2026-09-19）：be used to + 东西/-ing + get used to + 两张脸切开 + 否疑 + 收口（B1 开局章 6 课·单拱）
  { id: "season-18", label: "第十八季 · 同一个 to，两张脸", hint: "习惯了（be used to）、慢慢习惯（get used to）、从前常（used to）——同一个 to，前面有 be 是一张脸，没 be 是另一张", min: 119, max: 124 },
  // 第十九批 · 我看到的和感觉到的（2026-09-19）：look + 形容词 立岗（东西版）+ 换人换形 + 同一个 look 两张脸收口（3 课小章·单拱）
  { id: "season-19", label: "第十九季 · 我看到的和感觉到的", hint: "它看起来不错、你看起来很累、同一个 look 两张脸——看到什么就说什么，一句一句来", min: 125, max: 127 },
  // 第二十批 · 五种感官（2026-09-19）：sound/smell/taste/feel 四词立岗 + 否疑合体 + 五句排一行收口（造词课 6 课大章·单拱）
  { id: "season-20", label: "第二十季 · 五种感官", hint: "听起来不错、闻着好、尝着好、摸着凉——同一个架子，换四双耳朵", min: 128, max: 133 },
  // 第二十一批 · 盼着那一天（2026-09-20）：look forward to 整块立岗 + 换人换形 + 名字版 + 否疑 + 与批十八两站收口（B 档收官 5 课大章·单拱）
  { id: "season-21", label: "第二十一季 · 盼着那一天", hint: "我盼着周末、她盼着夏天、盼着见到你——同一个 to，后面跟的那件事", min: 134, max: 138 },
  // ── 末段季合并（2026-09-20）：用户反馈「我希望一个章节的课程多一些，而不是每次一个章节就两三节课」。
  // 原 season-22..38 共 17 个小季（2-3 课）合并为 6 个大季（6-10 课），主题邻近的放在一起。
  { id: "season-22", label: "第二十二季 · 让步与立刻", hint: "虽然下雨我还是要出去、我一写完就来吃——一个留退路，一个说到就到", min: 139, max: 144 },
  { id: "season-23", label: "第二十三季 · 也、两个", hint: "我也要一个、两本都好——「也」看有没有「不」，「两个」看最前面那个词", min: 145, max: 150 },
  { id: "season-24", label: "第二十四季 · 全都在、还没已经", hint: "这几本全都好、她还没来、她三天前走的——数量、时间、先后一次说清", min: 151, max: 156 },
  { id: "season-25", label: "第二十五季 · 一个都不、看起来像、需要", hint: "家里一个人都没有、它看起来像一条船、我需要买点牛奶——身边的事一件件说", min: 157, max: 162 },
  { id: "season-26", label: "第二十六季 · 自己、日常四句", hint: "我自己能做、我们互相帮忙、人太多了、你怎么不歇会儿——日常里最顺口的几句", min: 163, max: 169 },
  { id: "season-27", label: "第二十七季 · 一对一对的说法", hint: "既…又…／既不…也不…、除非／为了、能够／我也是、宁愿／更喜欢、更早的事／征求同意，再加整个和最好——成对学，记得牢", min: 170, max: 181 },
  { id: "season-28", label: "第二十八季 · 收口、目的、条件、不得不、他们的与走向哪儿", hint: "把整季的句型排一行，再加七格：做这事是为了让谁做什么（so that）、只要你来我就去（as long as）、昨天不得不走回家（had to）、他们的东西（their／theirs）、我正在学游泳（be 后面穿 -ing，再垫 to）、她走进了厨房（进到里面用 into）、我们穿过了树林、横过了小桥（中间钻过去用 through，一头到另一头用 across）、风太大把窗吹破了（太…了用 so…that 一头一尾）、好大的一条鱼（这么…的一个用 such a，a 紧跟 such）、猫在它的盒子里（「它的」写 its，不带小撇）、猫在一堆箱子中间（一群里用 among，两个才用 between）、想了一晚上想通了（think 的昨天版是 thought、know 的是 knew）、又游泳又唱歌（swim 变 swam、sing 变 sang）、坐旁边赶上了（sit 变 sat、catch 变 caught）、雪里读完了那本书（feel 变 felt、keep 变 kept——两个 e 只剩一个再加 t）、昨晚睡得好（sleep 变 slept）、画了条船贴在墙上（draw 变 drew，aw 换成 ew）", min: 182, max: 202 }
];

/** 按课号查所属季（找不到返回 undefined——出现即数据缺口，宁可显式暴露）。 */
export const findSeasonByLessonNumber = (lessonNumber: number): GrammarSeason | undefined =>
  LESSON_GROUPS.find((group) => lessonNumber >= group.min && lessonNumber <= group.max);

/** 兜底分组 id：内容批次先于赛季分组上线时，课程落进这里而不是被静默过滤。 */
export const FALLBACK_SEASON_ID = "season-fallback";

/**
 * 显示用季列表：在官方分组之外，若有课号未落进任何 season-N 区间，
 * 自动补一个「新章节」兜底分组。
 *
 * 背景（2026-09-22 防御性修复）：区间过滤是**必需机制**（季卡片按区间取课），
 * 但它的失败模式是**静默的**——课号不落区间就整课不显示、无报错。
 * 内容进程曾在一天内把课程从 158 加到 200，只要有一次「加了课、忘了加季分组」，
 * 那课就会在路径页凭空消失且无人察觉。
 * 兜底分组把这类缺口从「静默丢失」变成「显式可见」。
 */
export const buildDisplaySeasons = (
  lessonNumbers: readonly number[]
): GrammarSeason[] => {
  const covered = (num: number) =>
    LESSON_GROUPS.some((group) => num >= group.min && num <= group.max);
  const orphans = lessonNumbers.filter((num) => !covered(num));
  if (orphans.length === 0) return LESSON_GROUPS;
  const min = Math.min(...orphans);
  const max = Math.max(...orphans);
  return [
    ...LESSON_GROUPS,
    {
      id: FALLBACK_SEASON_ID,
      label: "新章节 · 待归季",
      hint: `${orphans.length} 课已上线但还没归入季分组——不影响学习，只是分类待补。`,
      min,
      max
    }
  ];
};
