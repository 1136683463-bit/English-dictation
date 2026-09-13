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
  /** R10 变体标记：本题的「换个问法」来源（指向基础题 id）。同一基础题与其变体不同屏出现。 */
  variantOf?: string;
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
  { id: "d-mix-place", zh: "家里你最喜欢的角落是哪儿？", hint: "My favorite place is ______ ." },

  // ── 观察（R10 补类：「看」的句子，练 there be / see / 现在进行）────────
  { id: "d-observe-window", zh: "此刻窗外有什么？", hint: "I see ______ outside." },
  { id: "d-observe-room", zh: "你桌上现在有什么？", hint: "There is ______ on my desk." },
  { id: "d-observe-sky", zh: "今天的天空是什么样子的？", hint: "The sky is ______ today." },
  { id: "d-observe-people", zh: "你身边的人现在在做什么？", hint: "He / She is ______ now." },
  { id: "d-observe-sound", zh: "现在你能听到什么声音？", hint: "I hear ______ ." },
  { id: "d-observe-street", zh: "楼下（或路上）有什么车？", hint: "There are ______ on the street." },

  // ── 如果（R10 补类：轻度假设，练 I would / I want to 的雏形）──────────
  { id: "d-if-free", zh: "如果明天不上班/不上课，你会做什么？", hint: "If I am free tomorrow, I will ______ ." },
  { id: "d-if-money", zh: "如果现在有 100 元随便花，你会买什么？", hint: "I want to buy ______ ." },
  { id: "d-if-place", zh: "如果能立刻去一个地方，你想去哪儿？", hint: "I want to go to ______ ." },
  { id: "d-if-weather", zh: "如果明天还是下雨天，你打算怎么过？", hint: "If it rains, I will ______ at home." },
  { id: "d-if-power", zh: "如果能拥有一种超能力，你想要什么？", hint: "I want to ______ ." },
  { id: "d-if-dinner", zh: "如果今晚有人请你吃饭，你想吃什么？", hint: "I want to eat ______ ." },

  // ── 变体（R10 下半：36 个基础题各 1 个「换个问法」变体，variantOf 指向原题，不同屏出现）──
  // 今天
  { id: "d-today-feel-v2", variantOf: "d-today-feel", zh: "用一个词形容你现在的心情？", hint: "I am ______ ." },
  { id: "d-today-one-thing-v2", variantOf: "d-today-one-thing", zh: "今天有什么小事让你笑了一下？", hint: "Today ______ made me smile." },
  { id: "d-today-drink-v2", variantOf: "d-today-drink", zh: "今天喝了几杯水/几杯茶？", hint: "I drink ______ cups of ______ ." },
  { id: "d-today-weather-v2", variantOf: "d-today-weather", zh: "今天比昨天冷还是热？", hint: "It is ______ than yesterday." },
  { id: "d-today-like-v2", variantOf: "d-today-like", zh: "今天有什么想感谢的小事？", hint: "I like ______ today." },
  { id: "d-today-first-v2", variantOf: "d-today-first", zh: "今天早上出门前做了什么？", hint: "I ______ before I go out." },
  { id: "d-today-eat-v2", variantOf: "d-today-eat", zh: "今天吃得最好的一顿是什么？", hint: "I eat ______ . It is good." },
  { id: "d-today-wear-v2", variantOf: "d-today-wear", zh: "今天穿的这件衣服舒服吗？", hint: "My ______ is ______ ." },
  { id: "d-today-tired-v2", variantOf: "d-today-tired", zh: "现在你的精力还有几成？", hint: "I am ______ now." },
  { id: "d-today-see-v2", variantOf: "d-today-see", zh: "今天有什么让你多看了一眼？", hint: "I see ______ ." },
  // 昨天
  { id: "d-yesterday-place-v2", variantOf: "d-yesterday-place", zh: "昨天出门了吗？去了哪里？", hint: "Yesterday I ______ ." },
  { id: "d-yesterday-eat-v2", variantOf: "d-yesterday-eat", zh: "昨天哪顿饭吃得最香？", hint: "I ate ______ ." },
  { id: "d-yesterday-see-v2", variantOf: "d-yesterday-see", zh: "昨天遇到什么有意思的人或事？", hint: "Yesterday I saw ______ ." },
  { id: "d-yesterday-person-v2", variantOf: "d-yesterday-person", zh: "昨天和谁说了最多的话？", hint: "I talked with ______ ." },
  { id: "d-yesterday-sleep-v2", variantOf: "d-yesterday-sleep", zh: "昨天睡得好吗？", hint: "I slept ______ last night." },
  { id: "d-yesterday-buy-v2", variantOf: "d-yesterday-buy", zh: "昨天花的最值的一笔钱是什么？", hint: "I bought ______ ." },
  { id: "d-yesterday-watch-v2", variantOf: "d-yesterday-watch", zh: "昨天看了什么想推荐的？", hint: "I watched ______ . It is good." },
  { id: "d-yesterday-tired-v2", variantOf: "d-yesterday-tired", zh: "昨天最累的一刻是什么时候？", hint: "I was tired ______ ." },
  // 明天与打算
  { id: "d-tomorrow-plan-v2", variantOf: "d-tomorrow-plan", zh: "明天最期待的一件事是什么？", hint: "I will ______ tomorrow." },
  { id: "d-tomorrow-eat-v2", variantOf: "d-tomorrow-eat", zh: "明天早餐想吃什么？", hint: "I will eat ______ ." },
  { id: "d-tomorrow-want-v2", variantOf: "d-tomorrow-want", zh: "这周想给自己买点什么？", hint: "I want to buy ______ ." },
  { id: "d-tomorrow-place-v2", variantOf: "d-tomorrow-place", zh: "周末想去城里哪里走走？", hint: "I want to go to ______ ." },
  { id: "d-tomorrow-learn-v2", variantOf: "d-tomorrow-learn", zh: "下周想试着做什么新鲜事？", hint: "I want to try ______ ." },
  { id: "d-tomorrow-call-v2", variantOf: "d-tomorrow-call", zh: "想给谁发条消息？", hint: "I will message ______ ." },
  // 喜欢与拥有
  { id: "d-like-food-v2", variantOf: "d-like-food", zh: "最近想吃的一道菜是什么？", hint: "I like ______ ." },
  { id: "d-like-color-v2", variantOf: "d-like-color", zh: "今天你身上有什么颜色？", hint: "I wear ______ today." },
  { id: "d-like-song-v2", variantOf: "d-like-song", zh: "哪首歌你单曲循环过？", hint: "I like the song ______ ." },
  { id: "d-like-person-v2", variantOf: "d-like-person", zh: "谁最近帮过你一个忙？", hint: "I like ______ . He / She ______ ." },
  { id: "d-have-thing-v2", variantOf: "d-have-thing", zh: "你每天都在用的一个东西是什么？", hint: "I have a ______ ." },
  { id: "d-have-pet-v2", variantOf: "d-have-pet", zh: "你更喜欢猫还是狗？为什么？", hint: "I like ______ because ______ ." },
  { id: "d-have-book-v2", variantOf: "d-have-book", zh: "最近翻到的一页有意思的内容？", hint: "I read ______ ." },
  // 小调查
  { id: "d-mix-season-v2", variantOf: "d-mix-season", zh: "这个季节你最喜欢的一点是什么？", hint: "I like ______ ." },
  { id: "d-mix-drink-v2", variantOf: "d-mix-drink", zh: "早上你一般喝什么？", hint: "I drink ______ in the morning." },
  { id: "d-mix-morning-v2", variantOf: "d-mix-morning", zh: "你一般几点起床？", hint: "I get up at ______ ." },
  { id: "d-mix-weekend-v2", variantOf: "d-mix-weekend", zh: "上个周末你做了什么？", hint: "I ______ last weekend." },
  { id: "d-mix-place-v2", variantOf: "d-mix-place", zh: "你在家最常待的地方是哪儿？", hint: "I like ______ at home." }
];
