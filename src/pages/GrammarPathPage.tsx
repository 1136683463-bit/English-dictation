import { Check, Flame, GraduationCap, PlayCircle, RotateCcw, Sparkles, TrendingDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import AdventureScene from "../components/AdventureScene";
import PageHeader from "../components/PageHeader";
import type { AdventureSceneId } from "../components/AdventureScene";
import type { GrammarLesson } from "../types";
import { backfillLessonCoreSentences, getLessonStageLock, repairDiaryCardTags, repairLessonCoreSentenceTranslations, listGrammarLessons, summarizeLessonProgress, type LessonStageIndex } from "../services/lessonService";
import { loadLessonResume } from "../services/grammarLessonResumeService";
import { buildGrammarReviewSession, GRAMMAR_REVIEW_SESSION_LIMIT } from "../services/grammarReviewService";
import { buildWeakSpotNarrative, computeWeakSpotsReport, dismissIntervention, findActiveIntervention, scheduleCardsForToday, type ActiveIntervention, type HealedSpot, type WeakSpot, type WeakSpotNarrative } from "../services/grammarWeakSpotsService";
import { buildReplayLesson } from "../services/grammarReplayService";
import { appendGrammarEvent, buildGrammarTelemetryExport, getGrammarTelemetryStats, listGrammarEventsByKind } from "../services/grammarTelemetry";
import { buildLastWeekReport, type WeeklyReport } from "../services/grammarOutputService";
import {
  BOOST_TIER_META,
  BOOST_TIERS,
  boostProgressLabel,
  getLessonBoostTiersDone
} from "../services/grammarBoostService";
import { downloadTextFile, nowIso } from "../services/storage";
// R20：课程分组——按季划分（2026-09-14 第四批上线：season-3 收口至 34，新增 season-4 从句篇）。
// 2026-09-17 排版优化：分组表迁至 src/data/grammarSeasons.ts（路径页 + 侦探页共用），
// 并有 grammarSeasons.test.ts 守门「课号必须落区间」（静默过滤是登记过的头号展示层风险）。
import { LESSON_GROUPS } from "../data/grammarSeasons";
import { buildWeeklySummaryFacts, requestWeeklySummary } from "../services/grammarWeeklySummaryService";

/** R06：已战胜的弱点——确证治愈（不是 7 天没犯被遗忘，而是有卡跃迁 mastered 且此后未再犯）。 */
function HealedSpotsRow({ spots }: { spots: HealedSpot[] }) {
  if (spots.length === 0) return null;
  return (
    <div className="healed-spots-row" aria-label="已战胜的弱点">
      <Check size={15} aria-hidden="true" />
      <p>
        已战胜：{spots.map((spot) => spot.label).join("、")}
        <span className="healed-spots-hint">——这些错你有卡片真正练会了，不是最近没遇到。</span>
      </p>
    </div>
  );
}

/** C4：把「最近练过」的时间显示成人话（今天 / 昨天 / N 天前）。 */
const formatReplayDate = (iso: string): string => {
  const at = new Date(iso).getTime();
  if (!Number.isFinite(at)) return "最近";
  const days = Math.floor((Date.now() - at) / (24 * 60 * 60 * 1000));
  if (days <= 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 7) return `${days} 天前`;
  return `${Math.floor(days / 7)} 周前`;
};

/** R08：本周反复犯的语法错 Top 3——频率×新近加权，一键排进今日复习。 */
function WeakSpotsCard({ spots, narrative, replayAvailable }: { spots: WeakSpot[]; narrative: WeakSpotNarrative | null; replayAvailable: boolean }) {
  const { updateData } = useAppData();
  const [queuedTags, setQueuedTags] = useState<Record<string, boolean>>({});

  const queueToday = (spot: WeakSpot) => {
    updateData((latest) => scheduleCardsForToday(latest, spot.relatedCardIds));
    setQueuedTags((current) => ({ ...current, [spot.tag]: true }));
  };

  return (
    <section className="weak-spots-card" aria-label="本周语法弱点">
      <header className="weak-spots-head">
        <span className="weak-spots-icon" aria-hidden="true">
          <TrendingDown size={17} />
        </span>
        <div className="weak-spots-heading">
          <h2>本周语法弱点 Top {spots.length}</h2>
          <p>反复出现的薄弱点，每次复习都算数，弱项会越来越小。</p>
        </div>
      </header>
      <ol className="weak-spots-list">
        {spots.map((spot, rank) => {
          const queued = Boolean(queuedTags[spot.tag]);
          return (
            <li key={spot.tag} className="weak-spots-item">
              <span className={`weak-spots-rank${rank === 0 ? " top" : ""}`} aria-hidden="true">
                {rank + 1}
              </span>
              <div className="weak-spots-info">
                <div className="weak-spots-title">
                  <strong>{spot.label}</strong>
                  <span className="weak-spots-stat">近 7 天 {spot.recentCount} 次</span>
                  <span className="weak-spots-stat">累计 {spot.totalCount} 次</span>
                </div>
                <p className="weak-spots-plain">{spot.plain}</p>
                {spot.example && <p className="weak-spots-example">{spot.example}</p>}
                {/* C4 闭环：练过之后让用户看到「练过了」，而不是练完没回声 */}
                {spot.lastReplayedAt && (
                  <p className="weak-spots-replayed">
                    <Check size={12} aria-hidden="true" />
                    最近练过：{formatReplayDate(spot.lastReplayedAt)}
                    {/* ② 成效可见：练完之后有没有再摔——这是「练了有没有用」的直接答案 */}
                    {typeof spot.mistakesSinceReplay === "number" && (
                      <span className="weak-spots-effect">
                        {spot.mistakesSinceReplay === 0
                          ? "· 之后没再摔过 👍"
                          : `· 之后又摔了 ${spot.mistakesSinceReplay} 次`}
                      </span>
                    )}
                  </p>
                )}
              </div>
              {spot.relatedCardIds.length > 0 ? (
                <button
                  type="button"
                  className={`weak-spots-cta${queued ? " queued" : ""}`}
                  onClick={() => queueToday(spot)}
                  disabled={queued}
                >
                  {queued ? (
                    <>
                      <Check size={14} /> 已排进今日复习
                    </>
                  ) : (
                    "排进今日复习"
                  )}
                </button>
              ) : (
                /* P1 走查修复：无关联卡时原先是「去复习」→ 但复习队列为空（0/0 张），
                   用户点进去无事可做。改为直达能立刻练这个弱点的错题重练课。 */
                <Link to="/grammar/replay" className="weak-spots-cta">
                  练这个弱点
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      {/* C1（M3）：把已算好的加权排序讲成一句人话——此前只有数字，没有人告诉你"你总在这摔"。
          纯本地模板，零 AI 零延迟；有课可指向时给直达入口（放在榜后作收口，不打乱列表的既有阅读顺序）。 */}
      {narrative && (
        <div className="weak-spots-narrative">
          <p>{narrative.text}</p>
          {narrative.lessonId && (
            <Link to={`/grammar/lesson/${narrative.lessonId}`} className="weak-spots-narrative-cta">
              去第 {narrative.lessonNumber} 课
            </Link>
          )}
          {/* C4：把弱点拼成一节可走完的复盘课（3–5 题，每题可溯源） */}
          {replayAvailable && (
            <Link to="/grammar/replay" className="weak-spots-narrative-cta secondary">
              拼一节错题重练
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

/**
 * C2（M3）：主动介入卡——连续 2 次同错因时，课程地图顶部推一张直达重练的卡。
 * 竞析核查：行业没有一家做到"AI 主动发现问题并介入"。判定完全本地确定性，零 AI 调用。
 */
function ActiveInterventionCard({ intervention }: { intervention: ActiveIntervention }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <section className="active-intervention" aria-label="主动介入推荐">
      <span className="active-intervention-icon" aria-hidden="true">
        <Sparkles size={16} />
      </span>
      <div className="active-intervention-body">
        <p>{intervention.text}</p>
      </div>
      <div className="active-intervention-actions">
        {intervention.lessonId && (
          <Link to={`/grammar/lesson/${intervention.lessonId}`} className="primary-button">
            去重练第 {intervention.lessonNumber} 课
          </Link>
        )}
        {/* C4：也可以直接拼一节针对性的复盘课 */}
        <Link to="/grammar/replay" className="secondary-button">拼错题重练</Link>
        <button
          type="button"
          className="ghost-link"
          onClick={() => {
            dismissIntervention(intervention.tag);
            setDismissed(true);
          }}
        >
          先不用
        </button>
      </div>
    </section>
  );
}

/** R23：can-do 能力里程碑（纯剧情确证）——达成即出现，确认后收起，无进度条无焦虑。 */
const CAN_DO_KEY = "grammar-can-do-v1";

interface CanDoMilestone {
  id: string;
  afterLesson: number;
  title: string;
  zh: string;
  samples: string[];
}

/** R07：can-do 锚点与 24 课对齐——12（第一季收口）/ 18（进阶过半）/ 24（全剧终）。 */
export const CAN_DO_MILESTONES: CanDoMilestone[] = [
  {
    id: "can-do-m1",
    afterLesson: 12,
    title: "我能把昨天和明天都说清楚",
    zh: "从现在到过去再到打算——第一季收官，你的句子已经能办日常的正事了。",
    samples: ["I went to the park yesterday.", "I will call my mom tonight.", "I like reading because it is fun."]
  },
  {
    id: "can-do-m2",
    afterLesson: 18,
    title: "我能说出我想要什么、我必须做什么",
    zh: "点餐、请假、开口求助——进阶过半，情态和比较让你的句子更灵活。",
    samples: ["Can I have a milk tea?", "I want to travel.", "This one is better than that one."]
  },
  {
    id: "can-do-m3",
    afterLesson: 24,
    title: "我能讲清楚已经发生和刚刚发生的事",
    zh: "完成时把「经历」和「影响」说清了——这就是进阶篇的收口。",
    samples: ["I have finished my homework.", "I have been to Beijing.", "I have lost my key."]
  },
  {
    id: "can-do-m4",
    afterLesson: 27,
    title: "我能说清楚他和她每天做什么",
    zh: "「他/她/它」后面的 -s、有没有、问什么——最顽固的小毛病全拿下，你的日常表达已经又稳又准。",
    samples: ["He drinks milk every day.", "There is a book on the desk.", "Where is my key?"]
  },
  {
    id: "can-do-m5",
    afterLesson: 34,
    title: "我能把时间和数量都说利索",
    zh: "频率、打算、数量、最、命令、远近、过去进行——巩固篇全通关，日常对话里你几乎不会再卡壳。",
    samples: ["I am going to watch a movie this weekend.", "How many books do you have?", "I was drawing at three."]
  },
  {
    id: "can-do-m6",
    afterLesson: 41,
    title: "我能一句话说两件事",
    zh: "话中话（我知道他在哪）+ 挂尾巴（戴眼镜的男生）——第四季收官，你的句子能装下别人的话和事物的样子了。",
    samples: ["I know where he is.", "The boy who wears glasses is my brother.", "This is the book which I read."]
  },
  {
    id: "can-do-m7",
    afterLesson: 46,
    title: "我能说清喜欢做的事和想做的事",
    zh: "名字版（like/enjoy + reading）+ 小垫板（want to travel）——动词后面跟什么，你已经有手感了。",
    samples: ["I like reading.", "I enjoy reading.", "I want to travel."]
  },
  {
    id: "can-do-m8",
    afterLesson: 49,
    title: "我能给人建议、说条件",
    zh: "三兄弟（能/必须/应该）+ 条件句（如果下雨就…）——给建议、说打算，日常对话里的语用工具齐了。",
    samples: ["You should sleep early.", "If it rains, I will stay at home.", "You should take an umbrella if it rains."]
  },
  {
    id: "can-do-m9",
    afterLesson: 54,
    title: "我能让事当主角",
    zh: "幕后句（谁做的不重要）+ by（想说谁就垫）+ has been（已经做过了）——谁重要谁上台，你的句子能挑焦点了。",
    samples: ["My cup was broken.", "The cake was eaten by my brother.", "The window has been cleaned."]
  },
  {
    id: "can-do-m10",
    afterLesson: 60,
    title: "我能说清日期和日常细节",
    zh: "日期链（第几个、哪个月、几月几号）+ 做事的样子（跑得快、唱得好）+ 回忆昨天（那天有…）——日常里的小事，你能说利索了。",
    samples: ["My birthday is in May.", "She runs quickly.", "There was a bird in the park."]
  },
  {
    id: "can-do-m11",
    afterLesson: 66,
    title: "我能客气地请人帮忙、说清一样和太过",
    zh: "客气请求（Could you…?）+ 给东西（先给谁、后给什么）+ 一样与太过（as…as / too…to）——话说得体面，也说得精确。",
    samples: ["Could you help me?", "He is as tall as me.", "It is too heavy to carry."]
  },
  {
    id: "can-do-m12",
    afterLesson: 71,
    title: "我能说清擅长的、买给谁的、够不够",
    zh: "擅长（good at）+ 买给你（for 家族）+ 婉转请（Would you mind）+ 招待（Would you like）+ 够（enough）——本领说得出口，心意送得到位。",
    samples: ["I am good at drawing.", "I bought a gift for my mom.", "The bag is light enough to carry."]
  },
  {
    id: "can-do-m13",
    afterLesson: 75,
    title: "我能问频率、问时长、搭把手、约起来",
    zh: "多久一次（How often）+ 要花多久（How long）+ 让我来帮（Let me）+ 咱们去吧（Let's）——问得清楚，约得起来。",
    samples: ["How often do you run?", "It takes ten minutes.", "Let's go to the park."]
  },
  {
    id: "can-do-m14",
    afterLesson: 78,
    title: "我能给「更」加力、说清一直在做的事",
    zh: "好多了（much + 更）+ 一直在做（keep + 名字版）+ 把一天串成一条线（跨季大团圆）——说得更有劲，也说得更连贯。",
    samples: ["I feel much better today.", "I keep doing my homework.", "I run every day, and I keep reading."]
  },
  {
    id: "can-do-m15",
    afterLesson: 86,
    title: "我能把身边的东西说清楚",
    zh: "东西在哪（next to／前后／中间）+ 怎么放（put）+ 说不清是什么（something／nothing）+ 这是谁的（whose）——指哪儿说哪儿，一件件都说明白。",
    samples: ["My desk is next to the window.", "I put my bag next to the door.", "Whose bag is this? It is next to the door."]
  },
  {
    id: "can-do-m16",
    afterLesson: 94,
    title: "我能和人聊两句，也能说说从前的事",
    zh: "说天气（It's cold／windy）+ 感叹（What a…!）+ 说先后（after／before／when）+ 说从前（used to）——校门口聊两句，话越说越长。",
    samples: ["It's cold today.", "After I do my homework, I watch TV.", "I used to play here."]
  },
  {
    id: "can-do-m17",
    afterLesson: 102,
    title: "我能把昨天的事讲成一段故事",
    zh: "那时正做着（was reading）+ 被什么打断（when／the phone rang）+ 两件同时在（while）+ 从前的习惯（used to）——昨天那个电话，你能从头讲到尾。",
    samples: ["I was reading at eight.", "When you called, I was reading.", "I was reading when the phone rang."]
  },
  {
    id: "can-do-m18",
    afterLesson: 110,
    title: "我能说清谁让谁做什么",
    zh: "推着做（makes）+ 放开做（lets）+ 分内的事（had）+ 费口舌请动（got to）+ 等到…为止（until）——家里和学校谁让谁做什么，四句话排一行。",
    samples: ["My mom makes me do my homework.", "She lets him play after dinner.", "I got him to go with me."]
  },
  {
    id: "can-do-m19",
    afterLesson: 118,
    title: "我能说清身边的人和东西",
    zh: "谁的（人后面加撇号 s）+ 我的（句尾用长版）+ 我的感受（感到版）+ 还有几个（a few）+ 有（have got／has got）——身边的事，一句话说清一件。",
    samples: ["Grandma's birthday is in May.", "This book is mine.", "I am bored."]
  },
  {
    id: "can-do-m20",
    afterLesson: 124,
    title: "我能说清「习惯了」",
    zh: "从前常（used to）+ 习惯了（be used to）+ 慢慢习惯（get used to）+ 不习惯怎么说——同一个 to，前面有 be 是一张脸，没 be 是另一张。",
    samples: ["I used to walk to school.", "I am used to the cold.", "I am getting used to it."]
  },
  {
    id: "can-do-m21",
    afterLesson: 127,
    title: "我能说出看到的东西是什么样",
    zh: "看着怎么样（It looks nice）+ 换人换形（You look tired／She looks tired）+ 同一个 look 两张脸（喊人看 vs 说样子）——看到什么就说什么。",
    samples: ["It looks nice.", "You look tired.", "The sky looks dark."]
  },
  {
    id: "can-do-m22",
    afterLesson: 133,
    title: "我能说出听到、闻到、尝到、摸到的是什么样",
    zh: "看（looks）+ 听（sounds）+ 闻（smells）+ 尝（tastes）+ 摸（feels）——五张脸一个架子，后面直接跟那个「怎么样」的词。",
    samples: ["It sounds great.", "It smells good.", "The water feels cold."]
  },
  {
    id: "can-do-m23",
    afterLesson: 138,
    title: "我能说出我盼着什么",
    zh: "盼着（look forward to）+ 换人换形（She looks forward to）+ 盼着做某事（forward to doing）+ 盼着吗（Are you looking forward to…）——同一个 to，后面跟的那件事。",
    samples: ["I am looking forward to the weekend.", "She looks forward to the summer.", "I am looking forward to seeing you."]
  },
  {
    id: "can-do-m24",
    afterLesson: 141,
    title: "我能说「虽然…」",
    zh: "虽然（Although 站最前面领一整句）+ 可是（but 站中间接两半）+ 只留一个——中文成对说，英语只留一个。",
    samples: ["Although it is raining, I will go out.", "It is raining, but I will go out.", "Although it was cold, we went out."]
  },
  {
    id: "can-do-m25",
    afterLesson: 144,
    title: "我能说「一到…就…」",
    zh: "一到就做（As soon as 站最前面领一整句）+ 前面说现在、后面说将来（第 48 课教过的同一条规矩）+ 两个刻度（when 是那段时间里，as soon as 是一到就）。",
    samples: ["As soon as I finish, I will eat.", "When I finish, I will eat.", "As soon as I get home, I will call you."]
  },
  {
    id: "can-do-m26",
    afterLesson: 147,
    title: "我能说「我也不」",
    zh: "我也一样（too 站句尾）+ 我也不（有「不」换 either）+ 都站句尾——同一个「也」，中文一个字，英语两张脸。",
    samples: ["I like tea too.", "I don't like coffee either.", "Drawing is fun too."]
  },
  {
    id: "can-do-m27",
    afterLesson: 150,
    title: "我能说「两个都」和「两个都不」",
    zh: "两个都（both 站最前面）+ 两个都不（有「不」换 neither）+ 后面那个东西带上 s、搭档用 are——同一个「两个」，两张脸。",
    samples: ["Both books are good.", "Neither book is good.", "Are both books good?"]
  },
  {
    id: "can-do-m28",
    afterLesson: 152,
    title: "我能说「全都」和「每一个」",
    zh: "全都（all 站最前面，后面可以站 the）+ 一个一个来（every 后面只说一个）+ 好多个带上 s 用 are／单个用 is——中文一个「都」字，看你从哪头数。",
    samples: ["All the books are good.", "Every student is here.", "All my books are new."]
  },
  {
    id: "can-do-m29",
    afterLesson: 154,
    title: "我能说「还没」「已经」「还在」",
    zh: "还没（yet 站句尾）+ 已经（already 站中间）+ 还在（still 站中间，紧挨着 is／have）——中文一个「还」，英语按「没发生」还是「一直在」分两个词。",
    samples: ["She hasn't come yet.", "I have already eaten.", "She is still waiting."]
  },
  {
    id: "can-do-m30",
    afterLesson: 156,
    title: "我能说「多久以前」和「持续多久」",
    zh: "多久以前（数字＋时间词＋ago 站句尾，动词穿昨天版）+ 持续多久（for 接在那块时间前面）+ 数着说的词带上 s——往回数、数时长，两条路。",
    samples: ["She left three days ago.", "I waited for an hour.", "She left two hours ago."]
  },
  {
    id: "can-do-m31",
    afterLesson: 158,
    title: "我能说「一个都不」",
    zh: "一个都不（说东西：None of the cups are mine——none 后面拴 of）+ 一个人都没有（说人：Nobody is at home——人装在词里，搭档用 is）+ 都自带「不」，后面不再请 not。",
    samples: ["None of the cups are mine.", "Nobody is at home.", "None of them are here."]
  },
  {
    id: "can-do-m32",
    afterLesson: 160,
    title: "我能说「像什么」和「好像」",
    zh: "看起来像（look 后面请 like 出场：It looks like a boat）+ 好像（seem 后面请 to 垫一下：He seems to know you）+ to 后面那个动作穿原样。",
    samples: ["It looks like a boat.", "He seems to know you.", "She seems to like the boat."]
  },
  {
    id: "can-do-m33",
    afterLesson: 162,
    title: "我能说「需要」和「大多数」",
    zh: "需要（need 后面请 to 垫一下：I need to buy some milk）+ 大多数（most 后面拴 of：Most of the students like it）+ to 后面穿原样、一群人配原样动词。",
    samples: ["I need to buy some milk.", "Most of the students like it.", "I need to go home now."]
  },
  {
    id: "can-do-m34",
    afterLesson: 185,
    title: "我能说这一章的五对说法",
    zh: "自己来（myself／himself）+ 互相（each other）+ 太多（too many／too much）+ 很多（a lot of）+ 建议（Why don't you）+ 缩写（I'd like）+ 既…又…／既不…也不… + 除非／为了 + 能够／我也是 + 宁愿／更喜欢 + 更早的事／征求同意 + 整个／最好…——成对学，一对一对说得出。",
    samples: ["I finished the whole book.", "We had better go now.", "I got up early in order to catch the bus."]
  },
  {
    id: "can-do-m35",
    afterLesson: 187,
    title: "我能说「是为了」和「只要」",
    zh: "是为了让谁做什么（so that 后面带「谁 + 能做什么」：I came early so that you can rest）+ 只要你（as long as 两个 as 各卡一头：I will go as long as you come）——换人用 so that，给底线用 as long as。",
    samples: ["I came early so that you can rest.", "I will go as long as you come.", "You can go as long as you finish."]
  },
  {
    id: "can-do-m36",
    afterLesson: 188,
    title: "我能说「昨天不得不」",
    zh: "昨天不得不（must 只管现在，过去的事用 had to：I had to walk home yesterday）+ had to 后面穿原样——同一句「不得不」，时间不同说法不同。",
    samples: ["I had to walk home yesterday.", "She had to cook dinner last night.", "I must finish my homework today."]
  },
  {
    id: "can-do-m37",
    afterLesson: 189,
    title: "我能说「他们的」",
    zh: "他们的（their 贴在东西前面，不带 s：These are their books）+ 自己站的那个带 s（theirs：These books are theirs）——第 8 课那批小标签，今天补上缺的一个。",
    samples: ["These are their books.", "These books are theirs.", "Their classroom is on the second floor."]
  },
  {
    id: "can-do-m38",
    afterLesson: 190,
    title: "我能说「我正在学做某事」",
    zh: "正在学做（前面穿 -ing、后面垫 to：I am learning to swim）+ 两层拼起来（be 加 -ing 是第 13 课的，垫板 to 是第 15 课那家的）——会了和学着，差着呢。",
    samples: ["I am learning to swim.", "She is learning to draw.", "I am swimming."]
  },
  {
    id: "can-do-m39",
    afterLesson: 192,
    title: "我能说「走进、穿过、横过」",
    zh: "走进里面用 into（She walked into the kitchen，比 in 多一层「从外面动到里面」）+ 中间钻过去用 through、一头到另一头用 across（We walked through the forest and across the bridge）——两个词中文都能翻成「穿过」，画面却不同。",
    samples: ["She walked into the kitchen.", "We walked through the forest.", "We walked across the bridge."]
  },
  {
    id: "can-do-m40",
    afterLesson: 193,
    title: "我能说「太…了，所以…」",
    zh: "太…了所以（so 和 that 一头一尾：The wind was so strong that the window broke）+ 分清 so 的三张脸——「所以」（第 20 课，站自己一句开头）／「是为了」（第 186 课，so that 连着写）／「太…了所以」（今天，中间隔着「有多…」那一小截）。",
    samples: ["The wind was so strong that the window broke.", "He was so tired that he fell asleep.", "I was hungry, so I ate noodles."]
  },
  {
    id: "can-do-m41",
    afterLesson: 194,
    title: "我能说「这么…的一个」",
    zh: "这么…的一个（a 紧跟 such，再跟「东西」：It was such a big fish）+ 分清「这么」的两条路——跟「有多…」那个词用 so（so strong，第 193 课）／跟「东西」用 such a（such a big fish，今天）。",
    samples: ["It was such a big fish.", "She is such a kind teacher.", "The wind was so strong that the window broke."]
  },
  {
    id: "can-do-m42",
    afterLesson: 195,
    title: "我能说「它的」",
    zh: "它的（its 不带小撇，跟 my／her 站同一个位置，贴在东西前面：The cat is in its box）+ 分清同一个音的两张脸——带撇的 It's 是「它是」（第 87 课）／不带撇的 its 是「它的」（今天）。判断只看一件事：能不能换成 it is。",
    samples: ["The cat is in its box.", "Its box is small.", "It's cold today."]
  },
  {
    id: "can-do-m43",
    afterLesson: 196,
    title: "我能说「在一堆东西中间」",
    zh: "混在一群里用 among（不点名，只说在这群里的中间：The cat is among the boxes）+ 分清和 between 的分工——两个、两头点名用 between（第 81 课：between Tom and Amy）／说不清哪几个、是一群，用 among。判断只看一件事：这几个东西你能一个个叫出来吗？",
    samples: ["The cat is among the boxes.", "She is among her friends.", "I sit between Tom and Amy."]
  },
  {
    id: "can-do-m44",
    afterLesson: 197,
    title: "我能说「有些词的昨天版要单独记」",
    zh: "老朋友自己的昨天版（think 的昨天版是 thought、know 的是 knew——不加 -ed，要一个个记）+ 说「不」和问句里它们反而变回原样（I didn't think about it）。这一批还有 went／ate／saw／bought（第 10 课）。",
    samples: ["I thought about it and knew the answer.", "She thought about it.", "I went to the park yesterday."]
  },
  {
    id: "can-do-m45",
    afterLesson: 198,
    title: "我能说「游过泳、唱过歌」",
    zh: "换零件的昨天版（swim 变 swam、sing 变 sang——里面的 i 换成 a，不加 -ed：We swam in the water and sang together）+ 说「不」和问句里它们穿回原样（didn't swim）。",
    samples: ["We swam in the water and sang together.", "We swam in the water.", "She sang a song."]
  },
  {
    id: "can-do-m46",
    afterLesson: 199,
    title: "我能说「坐旁边、赶上了」",
    zh: "两种换法（sit 变 sat 是换里面的元音；catch 变 caught 是整个换成 -aught、那个 gh 不发音：I sat next to her and caught the bus）+ 这批老朋友说「不」和问句里都穿回原样。",
    samples: ["I sat next to her and caught the bus.", "I caught the bus.", "I didn't catch the bus."]
  },
  {
    id: "can-do-m47",
    afterLesson: 200,
    title: "我能说「觉得冷、一直读着」",
    zh: "一对换法一样的昨天版（feel 变 felt、keep 变 kept——中间两个 e 只剩一个、尾巴加个 t：I felt cold, but I kept reading）+ 说「不」和问句里它们穿回原样（didn't feel）。这一批还有第 198 课的 swam／sang、第 199 课的 sat／caught。",
    samples: ["I felt cold in the snow, but I kept reading.", "I felt cold.", "I kept reading."]
  }
];

const readConfirmedCanDos = (): string[] => {
  try {
    const raw = window.localStorage.getItem(CAN_DO_KEY);
    const parsed = raw ? (JSON.parse(raw) as { confirmed?: string[] }) : null;
    return Array.isArray(parsed?.confirmed) ? parsed.confirmed : [];
  } catch {
    return [];
  }
};

function CanDoCard({ milestone, onConfirm }: { milestone: CanDoMilestone; onConfirm: (id: string) => void }) {
  return (
    <section className="can-do-card" aria-label="能力里程碑">
      <header className="can-do-head">
        <span className="can-do-icon" aria-hidden="true">
          <Sparkles size={17} />
        </span>
        <div className="can-do-heading">
          <h2>{milestone.title}</h2>
          <p>{milestone.zh}</p>
        </div>
      </header>
      <div className="can-do-samples">
        {milestone.samples.map((sample) => (
          <span key={sample} className="can-do-sample">
            {sample}
          </span>
        ))}
      </div>
      <button type="button" className="can-do-confirm" onClick={() => onConfirm(milestone.id)}>
        <Sparkles size={14} /> 小美替你盖章：我做到了
      </button>
    </section>
  );
}

/** R14 周报卡：每周首次进入时展示上周一句话结论（不催不焦虑，看完即收起）。 */
const WEEKLY_REPORT_KEY = "grammar-weekly-report-v1";

function WeeklyReportCard({ report, onDismiss }: { report: WeeklyReport; onDismiss: () => void }) {
  const { data } = useAppData();
  /**
   * AI 小结（可选增强）：模板句已经给出数字结论，AI 再补一句"下一步建议"。
   * 每周只调一次（按周缓存），且失败/未配置时静默保留模板句——绝不阻塞或弹错。
   */
  const [aiText, setAiText] = useState<string | null>(null);
  const requestedRef = useRef(false);
  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;
    const facts = buildWeeklySummaryFacts(data);
    if (!facts) return;
    void requestWeeklySummary(data.settings.aiProvider, facts).then((outcome) => {
      if (outcome.ok && outcome.text) setAiText(outcome.text);
    });
    // 只在挂载时请求一次（周报卡每周只出现一次）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="can-do-card weekly-report-card" aria-label="上周小结">
      <header className="can-do-head">
        <span className="can-do-icon" aria-hidden="true">
          <Sparkles size={17} />
        </span>
        <div className="can-do-heading">
          <h2>上周小结</h2>
          <p>{report.sentence}</p>
          {aiText && <p className="weekly-report-ai">{aiText}</p>}
        </div>
      </header>
      <button type="button" className="can-do-confirm" onClick={onDismiss}>
        知道了，继续
      </button>
    </section>
  );
}

/** R16：学习数据导出卡——把语法遥测（含归档）导出为 JSON，供基线与复盘使用。 */
function TelemetryExportCard() {
  const [stats, setStats] = useState(() => getGrammarTelemetryStats());
  const [exported, setExported] = useState(false);

  const exportData = () => {
    const stamp = nowIso().slice(0, 10);
    downloadTextFile(`grammar-telemetry-${stamp}.json`, buildGrammarTelemetryExport(), "application/json");
    setStats(getGrammarTelemetryStats());
    setExported(true);
  };

  return (
    <section className="can-do-card" aria-label="学习数据导出">
      <header className="can-do-head">
        <span className="can-do-icon" aria-hidden="true">
          <RotateCcw size={17} />
        </span>
        <div className="can-do-heading">
          <h2>学习数据</h2>
          <p>
            本地记录 {stats.activeEvents} / {stats.maxEvents} 条
            {stats.archivedEvents > 0 ? `（另有归档 ${stats.archivedEvents} 条）` : ""}
            ——导出后可以复盘学到哪、错在哪。
          </p>
        </div>
      </header>
      <button type="button" className="weak-spots-cta" onClick={exportData} style={{ marginTop: 12 }}>
        {exported ? "已导出，可再次导出" : "导出学习数据（JSON）"}
      </button>
    </section>
  );
}

export default function GrammarPathPage() {
  const { data, updateData } = useAppData();
  const lessons = useMemo(() => listGrammarLessons(), []);

  // R05：漏斗第一环埋点——每次进入语法页记一条（lessonsDone 区分首访/继续态）。
  // StrictMode 下 effect 会双跑，用 ref 保证一次挂载只记一条。
  const pathViewTracked = useRef(false);
  useEffect(() => {
    if (pathViewTracked.current) return;
    pathViewTracked.current = true;
    appendGrammarEvent({
      kind: "grammar_path_viewed",
      lessonsDone: (data.grammarLessonsDone ?? []).length,
      ts: nowIso()
    });
    // lessonsDone 取进入时的快照即可，不随完成动作重复上报
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // R04 存量回填：核心句没入队的已完成课，进语法页时静默补齐（幂等，空跑零成本）。
  // 顺带补写存量核心句卡缺失的中文意思——back 为空会让 /review 的题面等于答案本身。
  const backfillRan = useRef(false);
  useEffect(() => {
    if (backfillRan.current) return;
    backfillRan.current = true;
    updateData(
      (latest) =>
        repairDiaryCardTags(
          repairLessonCoreSentenceTranslations(backfillLessonCoreSentences(latest).data).data
        ).data
    );
  }, [updateData]);

  const summary = useMemo(() => summarizeLessonProgress(data), [data]);
  const nextId = summary.nextLesson?.id ?? null;
  const dueReviewCount = useMemo(() => buildGrammarReviewSession(data, GRAMMAR_REVIEW_SESSION_LIMIT).length, [data]);
  const weakSpotsReport = useMemo(() => computeWeakSpotsReport(data), [data]);
  // C2：主动介入（连续 2 次同错因 → 顶部推荐卡，48 小时冷却）
  const activeIntervention = useMemo(() => findActiveIntervention(data), [data]);
  // C1：弱点叙事（纯本地模板，零 AI）——P2：介入卡在场时换视角，避免同屏重复同一句话
  const weakSpotNarrative = useMemo(
    () => buildWeakSpotNarrative(data, Date.now(), { interventionPresent: Boolean(activeIntervention) }),
    [data, activeIntervention]
  );
  // C4：弱点素材是否够拼一节复盘课（不够则不显示入口，不给残缺的课）
  const replayAvailable = useMemo(
    () => !buildReplayLesson(weakSpotsReport.active.map((spot) => spot.tag)).isEmpty,
    [weakSpotsReport]
  );
  const weakSpots = weakSpotsReport.active;
  const healedSpots = weakSpotsReport.healed;

  // 2026-09-17 排版优化：季分组折叠——长页的方位治理。
  // R-UX-IA（2026-09-19）：两级导航——首页总览季卡，点卡片展开该季课表。
  // 2026-09-20 季合并后为 27 季（原 38 季，末段 17 个小季合并为 6 个大季）。
  // 单选语义：openSeasonId = null（全部收起）/ 季 id；默认展开「下一课」所在季
  //（全部学完时展开最后一季）。此前 override 表 + 默认值回退的组合会让默认季
  // 绕过互斥（点别的卡后旧季仍开），改为显式单值状态机。
  const [openSeasonId, setOpenSeasonId] = useState<string | null>(() => {
    const nextLesson = summary.nextLesson;
    if (nextLesson) {
      const group = LESSON_GROUPS.find(
        (item) => nextLesson.number >= item.min && nextLesson.number <= item.max
      );
      if (group) return group.id;
    }
    return LESSON_GROUPS[LESSON_GROUPS.length - 1]?.id ?? null;
  });
  // 换课（下一课推进）且用户未手动动过折叠时，展开态跟随当前季
  const openSeasonTouchedRef = useRef(false);
  useEffect(() => {
    const nextLesson = summary.nextLesson;
    if (openSeasonTouchedRef.current || !nextLesson) return;
    const group = LESSON_GROUPS.find(
      (item) => nextLesson.number >= item.min && nextLesson.number <= item.max
    );
    if (group) setOpenSeasonId(group.id);
  }, [summary.nextLesson]);
  const isGroupOpen = (groupId: string) => openSeasonId === groupId;
  const toggleGroup = (groupId: string) => {
    openSeasonTouchedRef.current = true;
    // 单选：点别的卡切换过去；点已开的卡收起（回到总览）
    setOpenSeasonId((current) => (current === groupId ? null : groupId));
  };

  // R23：里程碑达成 = 截至该课号的所有课都完成；已确认的存在独立 localStorage 键，不进 AppData。
  const [confirmedCanDos, setConfirmedCanDos] = useState<string[]>(readConfirmedCanDos);
  const achievedCanDos = useMemo(() => {
    const doneIds = new Set(data.grammarLessonsDone);
    return CAN_DO_MILESTONES.filter((milestone) =>
      lessons.filter((lesson) => lesson.number <= milestone.afterLesson).every((lesson) => doneIds.has(lesson.id))
    );
  }, [data.grammarLessonsDone, lessons]);
  const pendingCanDo = achievedCanDos.find((milestone) => !confirmedCanDos.includes(milestone.id)) ?? null;

  // R-UX7：路径页恢复锚点——找「有续学快照且未完课」的课（快照 24h 过期由 service 保证）
  const resumeHint = useMemo(() => {
    const doneIds = new Set(data.grammarLessonsDone);
    // 只扫快照语义上的「最近在学」：从下一课往前找几课 + 已解锁未完课，量小直接线性
    for (const lesson of lessons) {
      if (doneIds.has(lesson.id)) continue;
      const snapshot = loadLessonResume(lesson.id);
      if (snapshot && (snapshot.practiceIndex > 0 || snapshot.outputStep >= 0)) {
        return { lessonId: lesson.id, lessonNumber: lesson.number, step: snapshot.practiceIndex };
      }
    }
    return null;
  }, [data.grammarLessonsDone, lessons]);

  const confirmCanDo = (milestoneId: string) => {
    const next = [...confirmedCanDos, milestoneId];
    setConfirmedCanDos(next);
    try {
      window.localStorage.setItem(CAN_DO_KEY, JSON.stringify({ version: 1, confirmed: next }));
    } catch {
      // 存储满 / 隐私模式：确证状态写不进就下次再确认，不影响页面。
    }
    appendGrammarEvent({ kind: "can_do_confirmed", milestoneId, ts: nowIso() });
  };

  // R14 周报：每周首次进入且上周有可说的内容时展示一次；已展示过的周不再出现。
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(() => {
    const report = buildLastWeekReport(data);
    if (!report) return null;
    try {
      const shown = window.localStorage.getItem(WEEKLY_REPORT_KEY);
      if (shown === report.weekStart) return null;
    } catch {
      // 忽略
    }
    return report;
  });
  const dismissWeeklyReport = () => {
    if (weeklyReport) {
      try {
        window.localStorage.setItem(WEEKLY_REPORT_KEY, weeklyReport.weekStart);
      } catch {
        // 忽略
      }
    }
    setWeeklyReport(null);
  };

  // F1 三关卡：关 1 完成时间读取器（取遥测最近一次 completed 事件，用于关 2 次日窗判定）。
  const readCompletedAt = (lessonId: string): string | null => {
    const events = listGrammarEventsByKind("grammar_lesson_completed").filter((e) => e.lessonId === lessonId);
    return events.length > 0 ? events[events.length - 1].completedAt : null;
  };

  /** F1 三节点链：正课 → 次日回访 → 旧案重审（内嵌卡片下方，24 卡不膨胀为 72 平铺卡）。 */
  const renderStageChain = (lesson: GrammarLesson) => {
    const stage1Done = data.grammarLessonsDone.includes(lesson.id);
    // 仅关 1 完成的课才显示后续两关（未学课只显示正课节点，保持路径简洁）
    if (!stage1Done) return null;
    const stages: Array<{ stage: LessonStageIndex; label: string; to: string }> = [
      { stage: 1, label: "正课", to: `/grammar/lesson/${lesson.id}` },
      { stage: 2, label: "回访", to: `/grammar/lesson/${lesson.id}/revisit` },
      { stage: 3, label: "重审", to: `/grammar/lesson/${lesson.id}/reaudit` }
    ];
    return (
      <div className="lesson-stage-chain" aria-label={`第 ${lesson.number} 课三关卡`}>
        {stages.map(({ stage, label, to }, i) => {
          const lock = getLessonStageLock(data, lesson.id, stage, readCompletedAt);
          const stateClass = lock.state === "done" ? "done" : lock.state === "unlocked" ? "open" : "locked";
          const node = (
            <span className={`lesson-stage-node ${stateClass}`} key={stage}>
              {lock.state === "done" ? "●" : lock.state === "unlocked" ? "○" : "🔒"} {label}
            </span>
          );
          return (
            <span className="lesson-stage-chain-item" key={stage}>
              {i > 0 && <span className="lesson-stage-chain-sep" aria-hidden="true">─</span>}
              {lock.state === "locked" ? node : <Link to={to} className="lesson-stage-link">{node}</Link>}
            </span>
          );
        })}
      </div>
    );
  };

  /**
   * R-B6「趁热练」档位条：追加在三节点链**下一行**，渲染在卡片 `<Link>` 之外
   * （天然无冒泡问题，不需要 stopPropagation；每个档位是可聚焦的 `<Link>`，键盘可单独激活）。
   * 不新增第 4 个平级节点——避免与「正课/回访/重审」混淆、24 卡视觉膨胀。
   */
  const renderBoostBar = (lesson: GrammarLesson) => {
    if (!data.grammarLessonsDone.includes(lesson.id)) return null;
    const doneTiers = getLessonBoostTiersDone(data, lesson.id);
    const progress = boostProgressLabel(data, lesson.id);
    return (
      <div className="lesson-boost-bar" aria-label={`第 ${lesson.number} 课趁热练档位`}>
        <span className="lesson-boost-bar-label">
          <Flame size={13} aria-hidden="true" /> 趁热练
        </span>
        {BOOST_TIERS.map((tier) => {
          const tierMeta = BOOST_TIER_META[tier];
          const isDone = doneTiers.has(tier);
          return (
            <Link
              key={tier}
              to={`/grammar/boost/${lesson.id}?tier=${tier}&from=card`}
              className={`lesson-boost-tier${isDone ? " done" : ""}`}
              aria-label={`第 ${lesson.number} 课 趁热练 ${tierMeta.name}（${tierMeta.summaryZh}）`}
              onClick={() => {
                appendGrammarEvent({
                  kind: "grammar_boost_offered",
                  lessonId: lesson.id,
                  entryPoint: "card",
                  recommendedTier: tier,
                  ts: nowIso()
                });
              }}
            >
              {isDone ? "●" : "○"} {tierMeta.name}
            </Link>
          );
        })}
        {progress && <span className="lesson-boost-progress">{progress}</span>}
      </div>
    );
  };

  const renderLessonCard = (lesson: GrammarLesson) => {
    const isDone = data.grammarLessonsDone.includes(lesson.id);
    const isNext = lesson.id === nextId;
    return (
      <div key={lesson.id} className={`lesson-path-card-wrap${isDone ? " done" : ""}${isNext ? " next" : ""}`}>
        <Link
          to={`/grammar/lesson/${lesson.id}`}
          className={`lesson-path-card${isDone ? " done" : ""}${isNext ? " next" : ""}`}
        >
          <div className="lesson-path-art" aria-hidden="true">
            {lesson.cover ? (
              <img src={lesson.cover} alt="" loading="lazy" />
            ) : (
              <AdventureScene scene={lesson.scene as AdventureSceneId} />
            )}
          </div>
          <div className="lesson-path-body">
            <div className="lesson-path-head">
              <span className="lesson-path-episode">{lesson.episode}</span>
              <span className="lesson-path-grammar" title={lesson.grammarLabel}>{lesson.grammarLabel}</span>
              {isDone && <span className="lesson-path-done">已完成</span>}
              {isNext && !isDone && <span className="lesson-path-next">下一课</span>}
            </div>
            <strong>第 {lesson.number} 课 · {lesson.title}</strong>
            <p>{lesson.sceneSetupZh}</p>
            <span className="lesson-path-cta">
              {isDone ? "再学一遍" : isNext ? (
                <>
                  <PlayCircle size={14} /> 开始这一课
                </>
              ) : "去学习"}
            </span>
          </div>
        </Link>
        {renderStageChain(lesson)}
        {renderBoostBar(lesson)}
      </div>
    );
  };

  return (
    <div className="page lesson-page">
      <PageHeader
        eyebrow="语法"
        title="小美的一天"
        description={`跟着小美，从第一句英语到讲清楚一天的事。先看句子怎么搭出来，再动手试，每课 6–10 分钟。`}
        action={
          <div className="lesson-progress-pill" aria-label="课程进度">
            <GraduationCap size={16} />
            <span>
              {summary.done} / {summary.total} 课
            </span>
          </div>
        }
      />

      {activeIntervention && <ActiveInterventionCard intervention={activeIntervention} />}

      {/* R03 首访引导分态：零进度时主线「第 1 课」是唯一主 CTA，日记/找错降级；
          有进度后主 CTA 是「继续第 N 课」。文案随进度出现，不对零基础说「已经学过的」。 */}
      {summary.done === 0 ? (
        <div className="lesson-path-entry">
          <p>一切从这 6 分钟开始：先看小美怎么说，再跟着试一试。</p>
          <div className="lesson-path-entry-actions">
            {summary.nextLesson && (
              <Link to={`/grammar/lesson/${summary.nextLesson.id}`} className="primary-button">
                <PlayCircle size={16} /> 从第 1 课开始 · 小美的一天
              </Link>
            )}
          </div>
          {/* P2-1：两个次级入口拆成独立小卡，避免「写日记和侦探找错」被误读为一件事 */}
          <div className="lesson-path-entry-secondary">
            <span className="lesson-path-entry-secondary-lead">学完第 1 课后，这两个会更轻松：</span>
            <Link to="/grammar/diary" className="lesson-path-mini-card">写日记</Link>
            <Link to="/grammar/hunt" className="lesson-path-mini-card">侦探找错</Link>
          </div>
        </div>
      ) : (
        <div className="lesson-path-entry">
          {/* P2-3：1-3 课进度时引导语口语化（「已经学过的语法点」对刚学一两课的人偏文绉绉） */}
          <p>{summary.done <= 3 ? "学过的地方，可以去侦探那里找找漏洞来复习。" : "已经学过的语法点，可以去侦探那里找一找漏洞来复习。"}</p>
          <div className="lesson-path-entry-actions">
            {summary.nextLesson ? (
              <>
                <Link to={`/grammar/lesson/${summary.nextLesson.id}`} className="primary-button">
                  <PlayCircle size={16} /> 继续第 {summary.nextLesson.number} 课 · {summary.nextLesson.title}
                </Link>
                {/* R-UX7：恢复锚点——上次中途离开的课置顶可续（联动 R-UX3 快照，24h 内有效） */}
                {resumeHint && resumeHint.lessonId !== summary.nextLesson.id && (
                  <Link to={`/grammar/lesson/${resumeHint.lessonId}`} className="secondary-button">
                    上次学到第 {resumeHint.lessonNumber} 课 · 第 {resumeHint.step + 1} 步，去接着练
                  </Link>
                )}
              </>
            ) : (
              <Link to="/grammar/review" className="primary-button">
                <RotateCcw size={15} /> 全部课程已完成 · 去复习巩固
              </Link>
            )}
            <Link to="/grammar/diary" className="secondary-button">
              写今日日记
            </Link>
            <Link to="/grammar/hunt" className="secondary-button">
              去侦探找错
            </Link>
            {dueReviewCount > 0 && summary.nextLesson && (
              <Link to="/grammar/review" className="secondary-button">
                <RotateCcw size={14} /> 语法复习 · {dueReviewCount} 张到期
              </Link>
            )}
          </div>
        </div>
      )}

      {weakSpots.length > 0 && (
        <WeakSpotsCard spots={weakSpots} narrative={weakSpotNarrative} replayAvailable={replayAvailable} />
      )}

      {/* R06：确证治愈列表——独立于活跃弱点榜，活跃榜为空也展示「已战胜」 */}
      {healedSpots.length > 0 && <HealedSpotsRow spots={healedSpots} />}

      {/* R14：每周首次进入的上周小结（一句话，看完即收起） */}
      {weeklyReport && <WeeklyReportCard report={weeklyReport} onDismiss={dismissWeeklyReport} />}

      {pendingCanDo && <CanDoCard milestone={pendingCanDo} onConfirm={confirmCanDo} />}

      {/* R-UX-IA：季卡片两级导航——首页只见季卡总览（进度+状态一目了然），
          点卡片才展开该季课表（同时只开一季，方位置焦）。
          此前是 20 个折叠行全部平铺，滚动长、季与季的进度要逐行扫。 */}
      <div className="season-map">
        {LESSON_GROUPS.map((group) => {
          const groupLessons = lessons.filter((lesson) => lesson.number >= group.min && lesson.number <= group.max);
          if (groupLessons.length === 0) return null;
          const groupDone = groupLessons.filter((lesson) => data.grammarLessonsDone.includes(lesson.id)).length;
          const open = isGroupOpen(group.id);
          const groupComplete = groupDone === groupLessons.length;
          const isCurrent = summary.nextLesson != null && summary.nextLesson.number >= group.min && summary.nextLesson.number <= group.max;
          const bodyId = `grammar-season-${group.id}`;
          const percent = Math.round((groupDone / groupLessons.length) * 100);
          // 进度环：conic-gradient，空进度与满进度都由 --p 驱动（无 JS 绘图）
          const ringStyle = { ["--p" as string]: String(percent) };
          return (
            <section
              key={group.id}
              className={`season-card${open ? " is-open" : ""}${groupComplete ? " is-complete" : ""}${isCurrent ? " is-current" : ""}`}
              aria-label={group.label}
            >
              <button
                type="button"
                className="season-card-head"
                aria-expanded={open}
                aria-controls={bodyId}
                onClick={() => toggleGroup(group.id)}
              >
                <span className="season-ring" style={ringStyle} aria-hidden="true">
                  <span className="season-ring-num">{groupComplete ? "✓" : `${groupDone}`}</span>
                </span>
                {/* R-UX-IA 修复：两行布局——首行标题+徽章，次行简介独占整宽。
                    此前三块挤一行，窄卡时标题折行、简介只剩省略号。 */}
                <span className="season-card-text">
                  <span className="season-card-title-row">
                    <span className="season-card-title">{group.label}</span>
                    <span className="season-card-meta">
                      {groupComplete ? "已完成" : isCurrent ? "进行中" : `${groupDone} / ${groupLessons.length} 课`}
                    </span>
                  </span>
                  <span className="season-card-hint">{group.hint}</span>
                </span>
              </button>
              {open && (
                <div className="lesson-path-grid" id={bodyId}>
                  {groupLessons.map(renderLessonCard)}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* R03：导出卡偏技术化，首访（零进度）不展示，避免稀释主线 */}
      {summary.done > 0 && <TelemetryExportCard />}
    </div>
  );
}
