/**
 * 「我的英文日记」问题池。
 * 选题原则（GRAMMAR_PEDAGOGY_REVIEW.md）：真实、私人、可答；全部落在第一人称高频句型
 * （I am / I have / I like / I want / I went / I will），与 12 课课程互相呼应。
 * 每天从池子里确定性抽 2-3 条，相邻几天不重样。
 */
export interface DiaryQuestion {
  id: string;
  zh: string;
  /** 句型脚手架（可选，零基础可以照着搭）。 */
  hint?: string;
}

export const diaryQuestions: DiaryQuestion[] = [
  // ── 今天 ─────────────────────────────────────────────
  { id: "d-today-feel", zh: "你现在的心情怎么样？", hint: "I am ______ today." },
  { id: "d-today-one-thing", zh: "今天最想记住的一件小事是什么？", hint: "Today I ______ ." },
  { id: "d-today-drink", zh: "今天喝了什么？", hint: "I drink ______ ." },
  { id: "d-today-weather", zh: "窗外的天气怎么样？", hint: "It is ______ ." },
  { id: "d-today-like", zh: "今天有什么让你开心的事？", hint: "I like ______ ." },
  { id: "d-today-first", zh: "今天你做的第一件事是什么？", hint: "I ______ in the morning." },
  { id: "d-today-eat", zh: "今天中午吃了什么？", hint: "I eat ______ ." },
  { id: "d-today-wear", zh: "今天穿的是什么颜色？", hint: "My ______ is ______ ." },
  { id: "d-today-tired", zh: "现在累不累？", hint: "I am ______ ." },
  { id: "d-today-see", zh: "今天在路上看到了什么？", hint: "I see ______ ." },

  // ── 昨天 ─────────────────────────────────────────────
  { id: "d-yesterday-place", zh: "昨天你去了哪儿？", hint: "Yesterday I went to ______ ." },
  { id: "d-yesterday-eat", zh: "昨天晚上吃了什么？", hint: "I ate ______ ." },
  { id: "d-yesterday-see", zh: "昨天你看见了什么？", hint: "I saw ______ ." },
  { id: "d-yesterday-person", zh: "昨天你和谁在一起？", hint: "I was with ______ ." },
  { id: "d-yesterday-sleep", zh: "昨天晚上几点睡的？", hint: "I went to bed at ______ ." },
  { id: "d-yesterday-buy", zh: "昨天买了什么吗？", hint: "I bought ______ ." },
  { id: "d-yesterday-watch", zh: "昨天看了什么视频或比赛？", hint: "I watched ______ ." },
  { id: "d-yesterday-tired", zh: "昨天累不累？", hint: "I was ______ yesterday." },

  // ── 明天与打算 ────────────────────────────────────────
  { id: "d-tomorrow-plan", zh: "明天有什么安排？", hint: "I will ______ tomorrow." },
  { id: "d-tomorrow-eat", zh: "明天想吃什么？", hint: "I will eat ______ ." },
  { id: "d-tomorrow-want", zh: "这周你想要什么？", hint: "I want ______ ." },
  { id: "d-tomorrow-place", zh: "下次假期想去哪儿？", hint: "I want to go to ______ ." },
  { id: "d-tomorrow-learn", zh: "接下来最想学会什么？", hint: "I want to learn ______ ." },
  { id: "d-tomorrow-call", zh: "最近想联系谁？", hint: "I will call ______ ." },

  // ── 喜欢与拥有 ────────────────────────────────────────
  { id: "d-like-food", zh: "你最喜欢吃什么？", hint: "I like ______ ." },
  { id: "d-like-color", zh: "你最喜欢什么颜色？", hint: "I like ______ ." },
  { id: "d-like-song", zh: "最近常听的一首歌？", hint: "I like the song ______ ." },
  { id: "d-like-person", zh: "你最感谢的人是谁？", hint: "I like ______ because ______ ." },
  { id: "d-have-thing", zh: "你最喜欢的一件东西是什么？", hint: "I have a ______ ." },
  { id: "d-have-pet", zh: "你想养一只什么小动物？", hint: "I want a ______ ." },
  { id: "d-have-book", zh: "书架上有一本你想推荐的书吗？", hint: "I have a book about ______ ." },

  // ── 小调查 ───────────────────────────────────────────
  { id: "d-mix-season", zh: "四季里你最喜欢哪个？", hint: "I like ______ ." },
  { id: "d-mix-drink", zh: "茶和咖啡，你选哪个？", hint: "I like ______ ." },
  { id: "d-mix-morning", zh: "你是早起的人吗？", hint: "I am ______ in the morning." },
  { id: "d-mix-weekend", zh: "周末你最想做什么？", hint: "I will ______ ." },
  { id: "d-mix-place", zh: "家里你最喜欢的角落是哪儿？", hint: "My favorite place is ______ ." }
];
