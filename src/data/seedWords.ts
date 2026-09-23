export interface SeedWord {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  translation: string;
  definition: string;
  collocations: string;
  sourceSentence: string;
}

export const CORE_100_WORDS_VERSION = "core-100-v1";

/**
 * 每个内置词书包的词数（20）。
 *
 * ## 为什么抽成常量（2026-09-24）
 *
 * 此前这个 20 在 `storage.ts` 里出现两次（分本下标 `Math.floor(index / 20)`
 * 与 `description` 的 `index * 20`），而**建几本**是另一处写死的 `length: 5`。
 * 三者各写各的，于是词表长到 115 时没人发现「5 本 × 20 = 100 < 115」——
 * 索引 100-114 的那 15 个词越界，被兜底逻辑塞进 **Unit 1**
 * （实测：空存储首启后 Unit 1 有 **35** 张，应为 20）。
 *
 * 抽成常量后，`storage.ts` 的建本数与分本下标都从这里推导，
 * **词表规模与「本数 × 每本词数」不会再各走各的**。
 */
export const CORE_WORDS_PER_UNIT = 20;

export const core100Words: SeedWord[] = [
  {
    word: "achieve",
    phonetic: "/əˈtʃiːv/",
    partOfSpeech: "v.",
    translation: "实现；达到；完成",
    definition: "to successfully complete something or get a good result",
    collocations: "achieve a goal; achieve success",
    sourceSentence: "Small daily reviews help you achieve long-term progress."
  },
  {
    word: "adapt",
    phonetic: "/əˈdæpt/",
    partOfSpeech: "v.",
    translation: "适应；改编；调整",
    definition: "to change your behavior or methods for a new situation",
    collocations: "adapt to change; adapt a method",
    sourceSentence: "Good learners adapt their strategy when a method stops working."
  },
  {
    word: "analyze",
    phonetic: "/ˈænəlaɪz/",
    partOfSpeech: "v.",
    translation: "分析；解析",
    definition: "to examine something carefully in order to understand it",
    collocations: "analyze data; analyze a sentence",
    sourceSentence: "You can analyze a sentence before trying to memorize it."
  },
  {
    word: "assume",
    phonetic: "/əˈsuːm/",
    partOfSpeech: "v.",
    translation: "假设；认为；承担",
    definition: "to think that something is true without proof",
    collocations: "assume that; assume responsibility",
    sourceSentence: "Do not assume you know a word until you can use it."
  },
  {
    word: "benefit",
    phonetic: "/ˈbenɪfɪt/",
    partOfSpeech: "n./v.",
    translation: "好处；受益；有益于",
    definition: "an advantage or helpful effect",
    collocations: "benefit from; a clear benefit",
    sourceSentence: "You benefit from seeing a word in several real contexts."
  },
  {
    word: "challenge",
    phonetic: "/ˈtʃælɪndʒ/",
    partOfSpeech: "n./v.",
    translation: "挑战；质疑；考验",
    definition: "something difficult that tests your ability",
    collocations: "face a challenge; challenge an idea",
    sourceSentence: "A difficult sentence can be a useful challenge."
  },
  {
    word: "clarify",
    phonetic: "/ˈklærɪfaɪ/",
    partOfSpeech: "v.",
    translation: "澄清；阐明；使清楚",
    definition: "to make something easier to understand",
    collocations: "clarify a point; clarify the meaning",
    sourceSentence: "A simple example can clarify the meaning of a new word."
  },
  {
    word: "combine",
    phonetic: "/kəmˈbaɪn/",
    partOfSpeech: "v.",
    translation: "结合；联合；组合",
    definition: "to join two or more things together",
    collocations: "combine practice with review; combine ideas",
    sourceSentence: "This app combines vocabulary, sentences, and dictation."
  },
  {
    word: "compare",
    phonetic: "/kəmˈper/",
    partOfSpeech: "v.",
    translation: "比较；对照",
    definition: "to examine similarities and differences",
    collocations: "compare A with B; compare results",
    sourceSentence: "Compare your answer with the original sentence."
  },
  {
    word: "complete",
    phonetic: "/kəmˈpliːt/",
    partOfSpeech: "v./adj.",
    translation: "完成；完整的",
    definition: "to finish doing something; having all necessary parts",
    collocations: "complete a task; a complete sentence",
    sourceSentence: "Complete today's review before adding new words."
  },
  {
    word: "concentrate",
    phonetic: "/ˈkɑːnsntreɪt/",
    partOfSpeech: "v.",
    translation: "集中注意力；专注",
    definition: "to give all your attention to something",
    collocations: "concentrate on; concentrate fully",
    sourceSentence: "It is easier to remember words when you concentrate."
  },
  {
    word: "concept",
    phonetic: "/ˈkɑːnsept/",
    partOfSpeech: "n.",
    translation: "概念；观念",
    definition: "an idea or principle",
    collocations: "a basic concept; understand a concept",
    sourceSentence: "A concept becomes clearer when you can explain it."
  },
  {
    word: "conclude",
    phonetic: "/kənˈkluːd/",
    partOfSpeech: "v.",
    translation: "总结；断定；结束",
    definition: "to decide something after considering information",
    collocations: "conclude that; conclude a discussion",
    sourceSentence: "After reviewing the evidence, we can conclude the method works."
  },
  {
    word: "conduct",
    phonetic: "/kənˈdʌkt/",
    partOfSpeech: "v./n.",
    translation: "进行；实施；行为",
    definition: "to organize and carry out an activity",
    collocations: "conduct research; conduct an interview",
    sourceSentence: "You can conduct a short review every morning."
  },
  {
    word: "confirm",
    phonetic: "/kənˈfɜːrm/",
    partOfSpeech: "v.",
    translation: "确认；证实",
    definition: "to show that something is true or correct",
    collocations: "confirm a result; confirm that",
    sourceSentence: "A spelling test can confirm whether you really know a word."
  },
  {
    word: "connect",
    phonetic: "/kəˈnekt/",
    partOfSpeech: "v.",
    translation: "连接；联系；关联",
    definition: "to join or link things together",
    collocations: "connect with; connect ideas",
    sourceSentence: "Connect a new word with a sentence you care about."
  },
  {
    word: "consider",
    phonetic: "/kənˈsɪdər/",
    partOfSpeech: "v.",
    translation: "考虑；认为",
    definition: "to think carefully about something",
    collocations: "consider doing; consider an option",
    sourceSentence: "Consider whether a word is worth adding before saving it."
  },
  {
    word: "consistent",
    phonetic: "/kənˈsɪstənt/",
    partOfSpeech: "adj.",
    translation: "一致的；持续的；稳定的",
    definition: "happening in the same way over time",
    collocations: "consistent practice; be consistent with",
    sourceSentence: "Consistent practice matters more than a long study session."
  },
  {
    word: "construct",
    phonetic: "/kənˈstrʌkt/",
    partOfSpeech: "v.",
    translation: "构建；建造；组织",
    definition: "to build or create something",
    collocations: "construct a sentence; construct a model",
    sourceSentence: "Try to construct your own sentence with the word."
  },
  {
    word: "contain",
    phonetic: "/kənˈteɪn/",
    partOfSpeech: "v.",
    translation: "包含；容纳；控制",
    definition: "to have something inside",
    collocations: "contain information; contain errors",
    sourceSentence: "A sentence can contain several useful expressions."
  },
  {
    word: "contribute",
    phonetic: "/kənˈtrɪbjuːt/",
    partOfSpeech: "v.",
    translation: "贡献；促成；投稿",
    definition: "to help cause something or give something",
    collocations: "contribute to; contribute ideas",
    sourceSentence: "Every small review contributes to better memory."
  },
  {
    word: "create",
    phonetic: "/kriˈeɪt/",
    partOfSpeech: "v.",
    translation: "创造；创建；造成",
    definition: "to make something new",
    collocations: "create a card; create value",
    sourceSentence: "Create a card only when the word is useful to you."
  },
  {
    word: "critical",
    phonetic: "/ˈkrɪtɪkl/",
    partOfSpeech: "adj.",
    translation: "关键的；批判性的；严重的",
    definition: "extremely important; involving careful judgment",
    collocations: "critical thinking; a critical factor",
    sourceSentence: "Review is a critical part of vocabulary learning."
  },
  {
    word: "define",
    phonetic: "/dɪˈfaɪn/",
    partOfSpeech: "v.",
    translation: "定义；明确；界定",
    definition: "to explain the meaning of something",
    collocations: "define a word; define the scope",
    sourceSentence: "A good example helps define the word more clearly."
  },
  {
    word: "demonstrate",
    phonetic: "/ˈdemənstreɪt/",
    partOfSpeech: "v.",
    translation: "展示；证明；示范",
    definition: "to show something clearly by giving proof or examples",
    collocations: "demonstrate ability; demonstrate how",
    sourceSentence: "Your own sentence can demonstrate that you understand the word."
  },
  {
    word: "describe",
    phonetic: "/dɪˈskraɪb/",
    partOfSpeech: "v.",
    translation: "描述；形容",
    definition: "to say what someone or something is like",
    collocations: "describe a process; describe in detail",
    sourceSentence: "Try to describe a familiar situation using the new word."
  },
  {
    word: "determine",
    phonetic: "/dɪˈtɜːrmɪn/",
    partOfSpeech: "v.",
    translation: "决定；确定；查明",
    definition: "to find out or decide something",
    collocations: "determine whether; determine the cause",
    sourceSentence: "Your review history can determine the next review date."
  },
  {
    word: "develop",
    phonetic: "/dɪˈveləp/",
    partOfSpeech: "v.",
    translation: "发展；开发；培养",
    definition: "to grow, improve, or create something over time",
    collocations: "develop a habit; develop a skill",
    sourceSentence: "You develop vocabulary by meeting words repeatedly."
  },
  {
    word: "distinguish",
    phonetic: "/dɪˈstɪŋɡwɪʃ/",
    partOfSpeech: "v.",
    translation: "区分；辨别；使有别于",
    definition: "to recognize the difference between things",
    collocations: "distinguish A from B; distinguish sounds",
    sourceSentence: "Dictation helps you distinguish similar sounds."
  },
  {
    word: "effective",
    phonetic: "/ɪˈfektɪv/",
    partOfSpeech: "adj.",
    translation: "有效的；起作用的",
    definition: "successful in producing the result you want",
    collocations: "an effective method; effective practice",
    sourceSentence: "Short reviews can be more effective than passive reading."
  },
  {
    word: "emphasize",
    phonetic: "/ˈemfəsaɪz/",
    partOfSpeech: "v.",
    translation: "强调；重视",
    definition: "to give special importance to something",
    collocations: "emphasize the importance; emphasize a point",
    sourceSentence: "This system emphasizes sentences, not isolated words."
  },
  {
    word: "enable",
    phonetic: "/ɪˈneɪbl/",
    partOfSpeech: "v.",
    translation: "使能够；使成为可能",
    definition: "to make it possible for someone to do something",
    collocations: "enable someone to do; enable learning",
    sourceSentence: "Examples enable you to remember words in context."
  },
  {
    word: "encounter",
    phonetic: "/ɪnˈkaʊntər/",
    partOfSpeech: "v./n.",
    translation: "遇到；遭遇；相遇",
    definition: "to meet or experience something",
    collocations: "encounter a problem; encounter a word",
    sourceSentence: "Save a word when you encounter it in a real sentence."
  },
  {
    word: "enhance",
    phonetic: "/ɪnˈhæns/",
    partOfSpeech: "v.",
    translation: "增强；提高；改善",
    definition: "to improve the quality or value of something",
    collocations: "enhance memory; enhance performance",
    sourceSentence: "Speaking the sentence aloud can enhance your memory."
  },
  {
    word: "ensure",
    phonetic: "/ɪnˈʃʊr/",
    partOfSpeech: "v.",
    translation: "确保；保证",
    definition: "to make certain that something happens",
    collocations: "ensure that; ensure quality",
    sourceSentence: "Daily review helps ensure that words are not forgotten."
  },
  {
    word: "establish",
    phonetic: "/ɪˈstæblɪʃ/",
    partOfSpeech: "v.",
    translation: "建立；确立；创立",
    definition: "to start or create something that will continue",
    collocations: "establish a habit; establish a rule",
    sourceSentence: "Establish a review habit before adding too many new words."
  },
  {
    word: "evaluate",
    phonetic: "/ɪˈvæljueɪt/",
    partOfSpeech: "v.",
    translation: "评估；评价",
    definition: "to judge the quality or value of something",
    collocations: "evaluate progress; evaluate a method",
    sourceSentence: "Use weekly statistics to evaluate your progress."
  },
  {
    word: "expand",
    phonetic: "/ɪkˈspænd/",
    partOfSpeech: "v.",
    translation: "扩大；扩展；展开",
    definition: "to become larger or make something larger",
    collocations: "expand vocabulary; expand a sentence",
    sourceSentence: "Reading can expand your vocabulary naturally."
  },
  {
    word: "explain",
    phonetic: "/ɪkˈspleɪn/",
    partOfSpeech: "v.",
    translation: "解释；说明",
    definition: "to make something clear or easy to understand",
    collocations: "explain a concept; explain why",
    sourceSentence: "If you can explain a word, you probably understand it."
  },
  {
    word: "focus",
    phonetic: "/ˈfoʊkəs/",
    partOfSpeech: "n./v.",
    translation: "焦点；专注；集中",
    definition: "to give attention to one thing",
    collocations: "focus on; maintain focus",
    sourceSentence: "Focus on the words that block your understanding."
  },
  {
    word: "generate",
    phonetic: "/ˈdʒenəreɪt/",
    partOfSpeech: "v.",
    translation: "生成；产生；引起",
    definition: "to produce or create something",
    collocations: "generate examples; generate ideas",
    sourceSentence: "Later, AI can generate extra examples for difficult words."
  },
  {
    word: "highlight",
    phonetic: "/ˈhaɪlaɪt/",
    partOfSpeech: "v./n.",
    translation: "突出；强调；亮点",
    definition: "to mark something as important",
    collocations: "highlight a word; highlight a problem",
    sourceSentence: "Highlight the phrase you want to remember."
  },
  {
    word: "illustrate",
    phonetic: "/ˈɪləstreɪt/",
    partOfSpeech: "v.",
    translation: "说明；阐明；举例说明",
    definition: "to explain something by using examples",
    collocations: "illustrate a point; illustrate with examples",
    sourceSentence: "A sentence can illustrate how a word is used."
  },
  {
    word: "improve",
    phonetic: "/ɪmˈpruːv/",
    partOfSpeech: "v.",
    translation: "提高；改善",
    definition: "to become better or make something better",
    collocations: "improve memory; improve accuracy",
    sourceSentence: "Regular review can improve your spelling accuracy."
  },
  {
    word: "include",
    phonetic: "/ɪnˈkluːd/",
    partOfSpeech: "v.",
    translation: "包括；包含",
    definition: "to have something as part of a group or whole",
    collocations: "include examples; include details",
    sourceSentence: "A useful word card should include a source sentence."
  },
  {
    word: "indicate",
    phonetic: "/ˈɪndɪkeɪt/",
    partOfSpeech: "v.",
    translation: "表明；指出；暗示",
    definition: "to show or suggest something",
    collocations: "indicate that; indicate a trend",
    sourceSentence: "Repeated mistakes indicate that a card needs more practice."
  },
  {
    word: "influence",
    phonetic: "/ˈɪnfluəns/",
    partOfSpeech: "n./v.",
    translation: "影响；作用",
    definition: "the power to affect someone or something",
    collocations: "influence behavior; have an influence on",
    sourceSentence: "Your review schedule influences how long you remember a word."
  },
  {
    word: "interpret",
    phonetic: "/ɪnˈtɜːrprət/",
    partOfSpeech: "v.",
    translation: "解释；理解；口译",
    definition: "to understand or explain the meaning of something",
    collocations: "interpret a sentence; interpret data",
    sourceSentence: "Try to interpret the sentence before checking the translation."
  },
  {
    word: "involve",
    phonetic: "/ɪnˈvɑːlv/",
    partOfSpeech: "v.",
    translation: "涉及；包含；需要",
    definition: "to include something as a necessary part",
    collocations: "involve practice; involve several steps",
    sourceSentence: "Real learning involves recall, not just recognition."
  },
  {
    word: "justify",
    phonetic: "/ˈdʒʌstɪfaɪ/",
    partOfSpeech: "v.",
    translation: "证明有理；为……辩护",
    definition: "to give a good reason for something",
    collocations: "justify a decision; justify an answer",
    sourceSentence: "A clear example can justify adding a word to your deck."
  },
  {
    word: "limit",
    phonetic: "/ˈlɪmɪt/",
    partOfSpeech: "n./v.",
    translation: "限制；限度；限定",
    definition: "the greatest amount allowed; to keep within a boundary",
    collocations: "set a limit; limit new words",
    sourceSentence: "Limit new words if your review queue becomes too large."
  },
  {
    word: "manage",
    phonetic: "/ˈmænɪdʒ/",
    partOfSpeech: "v.",
    translation: "管理；设法做到；处理",
    definition: "to control or deal with something successfully",
    collocations: "manage time; manage a task",
    sourceSentence: "A good app helps you manage review pressure."
  },
  {
    word: "measure",
    phonetic: "/ˈmeʒər/",
    partOfSpeech: "v./n.",
    translation: "衡量；测量；措施",
    definition: "to find the size or amount of something",
    collocations: "measure progress; take measures",
    sourceSentence: "Review records help measure your learning progress."
  },
  {
    word: "modify",
    phonetic: "/ˈmɑːdɪfaɪ/",
    partOfSpeech: "v.",
    translation: "修改；调整；修饰",
    definition: "to change something slightly",
    collocations: "modify a plan; modify a sentence",
    sourceSentence: "You can modify a sentence to make it easier to remember."
  },
  {
    word: "notice",
    phonetic: "/ˈnoʊtɪs/",
    partOfSpeech: "v./n.",
    translation: "注意到；通知；公告",
    definition: "to become aware of something",
    collocations: "notice a pattern; take notice of",
    sourceSentence: "Notice which words you confuse most often."
  },
  {
    word: "observe",
    phonetic: "/əbˈzɜːrv/",
    partOfSpeech: "v.",
    translation: "观察；注意到；遵守",
    definition: "to watch or notice carefully",
    collocations: "observe a pattern; observe rules",
    sourceSentence: "Observe how the word behaves in different sentences."
  },
  {
    word: "obtain",
    phonetic: "/əbˈteɪn/",
    partOfSpeech: "v.",
    translation: "获得；取得",
    definition: "to get something",
    collocations: "obtain information; obtain results",
    sourceSentence: "You obtain better results when review is consistent."
  },
  {
    word: "occur",
    phonetic: "/əˈkɜːr/",
    partOfSpeech: "v.",
    translation: "发生；出现；存在",
    definition: "to happen or exist",
    collocations: "occur frequently; occur to someone",
    sourceSentence: "Some words occur frequently in academic texts."
  },
  {
    word: "organize",
    phonetic: "/ˈɔːrɡənaɪz/",
    partOfSpeech: "v.",
    translation: "组织；整理；安排",
    definition: "to arrange things in a useful order",
    collocations: "organize notes; organize information",
    sourceSentence: "Tags help organize your vocabulary cards."
  },
  {
    word: "participate",
    phonetic: "/pɑːrˈtɪsɪpeɪt/",
    partOfSpeech: "v.",
    translation: "参与；参加",
    definition: "to take part in an activity",
    collocations: "participate in; active participation",
    sourceSentence: "Active recall requires you to participate, not just read."
  },
  {
    word: "perceive",
    phonetic: "/pərˈsiːv/",
    partOfSpeech: "v.",
    translation: "察觉；感知；认为",
    definition: "to notice or understand something in a particular way",
    collocations: "perceive a difference; perceive as",
    sourceSentence: "Listening practice helps you perceive weak sounds."
  },
  {
    word: "perform",
    phonetic: "/pərˈfɔːrm/",
    partOfSpeech: "v.",
    translation: "执行；表现；表演",
    definition: "to do an action or task",
    collocations: "perform a task; perform well",
    sourceSentence: "You perform better when review is spaced over time."
  },
  {
    word: "predict",
    phonetic: "/prɪˈdɪkt/",
    partOfSpeech: "v.",
    translation: "预测；预言",
    definition: "to say what will happen in the future",
    collocations: "predict results; predict behavior",
    sourceSentence: "The schedule can predict when a card should appear again."
  },
  {
    word: "prepare",
    phonetic: "/prɪˈper/",
    partOfSpeech: "v.",
    translation: "准备；预备",
    definition: "to make ready for something",
    collocations: "prepare for; prepare materials",
    sourceSentence: "Prepare a few useful sentences before a speaking task."
  },
  {
    word: "prioritize",
    phonetic: "/praɪˈɔːrətaɪz/",
    partOfSpeech: "v.",
    translation: "优先考虑；确定优先级",
    definition: "to decide which things are most important",
    collocations: "prioritize tasks; prioritize review",
    sourceSentence: "Prioritize words that appear in your real materials."
  },
  {
    word: "process",
    phonetic: "/ˈprɑːses/",
    partOfSpeech: "n./v.",
    translation: "过程；处理；加工",
    definition: "a series of actions; to deal with information",
    collocations: "learning process; process information",
    sourceSentence: "Vocabulary learning is a process, not a one-time action."
  },
  {
    word: "produce",
    phonetic: "/prəˈduːs/",
    partOfSpeech: "v.",
    translation: "产生；生产；创作",
    definition: "to make or create something",
    collocations: "produce results; produce a sentence",
    sourceSentence: "A learner should be able to produce the word, not just recognize it."
  },
  {
    word: "progress",
    phonetic: "/ˈprɑːɡres/",
    partOfSpeech: "n./v.",
    translation: "进步；进展；前进",
    definition: "development or improvement over time",
    collocations: "make progress; track progress",
    sourceSentence: "Your review history shows real progress."
  },
  {
    word: "promote",
    phonetic: "/prəˈmoʊt/",
    partOfSpeech: "v.",
    translation: "促进；推广；提升",
    definition: "to help something develop or become popular",
    collocations: "promote learning; promote a habit",
    sourceSentence: "Short daily sessions promote long-term memory."
  },
  {
    word: "provide",
    phonetic: "/prəˈvaɪd/",
    partOfSpeech: "v.",
    translation: "提供；供应",
    definition: "to give someone something they need",
    collocations: "provide examples; provide support",
    sourceSentence: "A source sentence provides context for the word."
  },
  {
    word: "recognize",
    phonetic: "/ˈrekəɡnaɪz/",
    partOfSpeech: "v.",
    translation: "认出；识别；承认",
    definition: "to know who or what something is",
    collocations: "recognize a word; recognize the importance",
    sourceSentence: "Recognizing a word is easier than spelling it correctly."
  },
  {
    word: "recommend",
    phonetic: "/ˌrekəˈmend/",
    partOfSpeech: "v.",
    translation: "推荐；建议",
    definition: "to advise someone to do or choose something",
    collocations: "recommend doing; highly recommend",
    sourceSentence: "I recommend reviewing old cards before adding new ones."
  },
  {
    word: "reduce",
    phonetic: "/rɪˈduːs/",
    partOfSpeech: "v.",
    translation: "减少；降低",
    definition: "to make something smaller or less",
    collocations: "reduce errors; reduce pressure",
    sourceSentence: "Deleting useless cards can reduce review pressure."
  },
  {
    word: "reflect",
    phonetic: "/rɪˈflekt/",
    partOfSpeech: "v.",
    translation: "反映；反思；映出",
    definition: "to show, express, or think carefully",
    collocations: "reflect on; reflect a change",
    sourceSentence: "Weekly review helps you reflect on your learning."
  },
  {
    word: "relate",
    phonetic: "/rɪˈleɪt/",
    partOfSpeech: "v.",
    translation: "联系；有关；讲述",
    definition: "to connect with something",
    collocations: "relate to; closely related",
    sourceSentence: "Relate a new word to a sentence you already know."
  },
  {
    word: "require",
    phonetic: "/rɪˈkwaɪər/",
    partOfSpeech: "v.",
    translation: "需要；要求",
    definition: "to need or demand something",
    collocations: "require practice; require attention",
    sourceSentence: "Spelling requires active recall."
  },
  {
    word: "resolve",
    phonetic: "/rɪˈzɑːlv/",
    partOfSpeech: "v./n.",
    translation: "解决；决定；决心",
    definition: "to solve a problem or make a firm decision",
    collocations: "resolve a problem; resolve to do",
    sourceSentence: "Repeated practice can resolve many spelling problems."
  },
  {
    word: "respond",
    phonetic: "/rɪˈspɑːnd/",
    partOfSpeech: "v.",
    translation: "回应；作出反应",
    definition: "to answer or react",
    collocations: "respond to; respond quickly",
    sourceSentence: "The review schedule responds to your feedback."
  },
  {
    word: "retain",
    phonetic: "/rɪˈteɪn/",
    partOfSpeech: "v.",
    translation: "保留；保持；记住",
    definition: "to keep something or continue to have it",
    collocations: "retain information; retain memory",
    sourceSentence: "Spaced repetition helps you retain vocabulary."
  },
  {
    word: "review",
    phonetic: "/rɪˈvjuː/",
    partOfSpeech: "n./v.",
    translation: "复习；回顾；评论",
    definition: "to look at something again",
    collocations: "review cards; weekly review",
    sourceSentence: "Review is the engine of long-term memory."
  },
  {
    word: "select",
    phonetic: "/sɪˈlekt/",
    partOfSpeech: "v.",
    translation: "选择；挑选",
    definition: "to choose something",
    collocations: "select a word; select carefully",
    sourceSentence: "Select only the words you truly want to remember."
  },
  {
    word: "significant",
    phonetic: "/sɪɡˈnɪfɪkənt/",
    partOfSpeech: "adj.",
    translation: "重要的；显著的",
    definition: "large or important enough to be noticed",
    collocations: "a significant change; significant progress",
    sourceSentence: "Small habits can lead to significant progress."
  },
  {
    word: "simplify",
    phonetic: "/ˈsɪmplɪfaɪ/",
    partOfSpeech: "v.",
    translation: "简化；使简单",
    definition: "to make something easier to understand or do",
    collocations: "simplify a process; simplify a sentence",
    sourceSentence: "Simplify a difficult sentence before memorizing it."
  },
  {
    word: "solve",
    phonetic: "/sɑːlv/",
    partOfSpeech: "v.",
    translation: "解决；解答",
    definition: "to find an answer to a problem",
    collocations: "solve a problem; solve an issue",
    sourceSentence: "A clear example can solve a misunderstanding."
  },
  {
    word: "source",
    phonetic: "/sɔːrs/",
    partOfSpeech: "n.",
    translation: "来源；出处；源头",
    definition: "the place something comes from",
    collocations: "source material; reliable source",
    sourceSentence: "Every useful card should keep its source sentence."
  },
  {
    word: "strengthen",
    phonetic: "/ˈstreŋθn/",
    partOfSpeech: "v.",
    translation: "加强；巩固",
    definition: "to make something stronger",
    collocations: "strengthen memory; strengthen a habit",
    sourceSentence: "Repeated recall strengthens memory."
  },
  {
    word: "summarize",
    phonetic: "/ˈsʌməraɪz/",
    partOfSpeech: "v.",
    translation: "总结；概括",
    definition: "to describe the main ideas briefly",
    collocations: "summarize a text; summarize key points",
    sourceSentence: "Summarize the sentence in your own words."
  },
  {
    word: "support",
    phonetic: "/səˈpɔːrt/",
    partOfSpeech: "v./n.",
    translation: "支持；支撑；帮助",
    definition: "to help someone or something",
    collocations: "support learning; support an idea",
    sourceSentence: "A good tool should support your daily routine."
  },
  {
    word: "transfer",
    phonetic: "/trænsˈfɜːr/",
    partOfSpeech: "v./n.",
    translation: "转移；迁移；传递",
    definition: "to move something from one place to another",
    collocations: "transfer knowledge; transfer data",
    sourceSentence: "Exporting cards lets you transfer data to Anki."
  },
  {
    word: "transform",
    phonetic: "/trænsˈfɔːrm/",
    partOfSpeech: "v.",
    translation: "转变；改造",
    definition: "to change completely",
    collocations: "transform a habit; transform text into cards",
    sourceSentence: "This app transforms real materials into review cards."
  },
  {
    word: "translate",
    phonetic: "/trænsˈleɪt/",
    partOfSpeech: "v.",
    translation: "翻译；转化",
    definition: "to change words from one language into another",
    collocations: "translate a sentence; translate into English",
    sourceSentence: "Try to translate the Chinese prompt back into English."
  },
  {
    word: "utilize",
    phonetic: "/ˈjuːtəlaɪz/",
    partOfSpeech: "v.",
    translation: "利用；使用",
    definition: "to use something effectively",
    collocations: "utilize resources; utilize examples",
    sourceSentence: "Utilize source sentences to make review more meaningful."
  },
  {
    word: "verify",
    phonetic: "/ˈverɪfaɪ/",
    partOfSpeech: "v.",
    translation: "验证；核实",
    definition: "to check that something is true or correct",
    collocations: "verify an answer; verify data",
    sourceSentence: "Use spelling practice to verify your memory."
  },
  {
    word: "vary",
    phonetic: "/ˈveri/",
    partOfSpeech: "v.",
    translation: "变化；不同；使多样化",
    definition: "to be different or change",
    collocations: "vary by context; vary practice",
    sourceSentence: "Vary your practice by mixing words and sentences."
  },
  {
    word: "visualize",
    phonetic: "/ˈvɪʒuəlaɪz/",
    partOfSpeech: "v.",
    translation: "想象；可视化",
    definition: "to form a picture in your mind",
    collocations: "visualize a scene; visualize progress",
    sourceSentence: "Visualize the situation described by the sentence."
  },
  {
    word: "accurate",
    phonetic: "/ˈækjərət/",
    partOfSpeech: "adj.",
    translation: "准确的；精确的",
    definition: "correct and without mistakes",
    collocations: "accurate spelling; accurate information",
    sourceSentence: "Accurate spelling requires repeated practice."
  },
  {
    word: "adequate",
    phonetic: "/ˈædɪkwət/",
    partOfSpeech: "adj.",
    translation: "足够的；适当的",
    definition: "enough for a particular purpose",
    collocations: "adequate time; adequate support",
    sourceSentence: "Give yourself adequate time to review difficult cards."
  },
  {
    word: "brief",
    phonetic: "/briːf/",
    partOfSpeech: "adj./n.",
    translation: "简短的；简要的",
    definition: "short in time or length",
    collocations: "a brief review; keep it brief",
    sourceSentence: "A brief daily review is better than no review."
  },
  {
    word: "complex",
    phonetic: "/ˈkɑːmpleks/",
    partOfSpeech: "adj.",
    translation: "复杂的；复合的",
    definition: "having many parts and not easy to understand",
    collocations: "complex sentence; complex problem",
    sourceSentence: "Break a complex sentence into smaller parts."
  },
  {
    word: "essential",
    phonetic: "/ɪˈsenʃl/",
    partOfSpeech: "adj./n.",
    translation: "必要的；本质的；要素",
    definition: "extremely important and necessary",
    collocations: "essential vocabulary; essential for",
    sourceSentence: "Review is essential for long-term learning."
  },
  {
    word: "flexible",
    phonetic: "/ˈfleksəbl/",
    partOfSpeech: "adj.",
    translation: "灵活的；可变通的",
    definition: "able to change easily",
    collocations: "flexible schedule; flexible method",
    sourceSentence: "A flexible review system fits your daily life."
  },
  {
    word: "frequent",
    phonetic: "/ˈfriːkwənt/",
    partOfSpeech: "adj.",
    translation: "频繁的；常见的",
    definition: "happening often",
    collocations: "frequent mistakes; frequent review",
    sourceSentence: "Frequent small reviews can protect your memory."
  },
  {
    word: "general",
    phonetic: "/ˈdʒenərəl/",
    partOfSpeech: "adj.",
    translation: "一般的；普遍的；总体的",
    definition: "not detailed or specific",
    collocations: "general meaning; general idea",
    sourceSentence: "Start with the general meaning, then learn the details."
  },
  {
    word: "initial",
    phonetic: "/ɪˈnɪʃl/",
    partOfSpeech: "adj.",
    translation: "最初的；开始的",
    definition: "happening at the beginning",
    collocations: "initial review; initial stage",
    sourceSentence: "The initial review should happen soon after adding a card."
  },
  {
    word: "logical",
    phonetic: "/ˈlɑːdʒɪkl/",
    partOfSpeech: "adj.",
    translation: "合乎逻辑的；合理的",
    definition: "reasonable and based on clear thinking",
    collocations: "logical structure; logical reason",
    sourceSentence: "A logical example is easier to remember."
  },
  {
    word: "normal",
    phonetic: "/ˈnɔːrml/",
    partOfSpeech: "adj.",
    translation: "正常的；普通的",
    definition: "usual or expected",
    collocations: "normal practice; normal situation",
    sourceSentence: "It is normal to forget a word several times."
  },
  {
    word: "obvious",
    phonetic: "/ˈɑːbviəs/",
    partOfSpeech: "adj.",
    translation: "明显的；显而易见的",
    definition: "easy to see or understand",
    collocations: "an obvious mistake; obvious reason",
    sourceSentence: "A typo may look obvious after you see the answer."
  },
  {
    word: "practical",
    phonetic: "/ˈpræktɪkl/",
    partOfSpeech: "adj.",
    translation: "实际的；实用的",
    definition: "useful and suitable for real situations",
    collocations: "practical advice; practical method",
    sourceSentence: "A practical example makes the word easier to use."
  },
  {
    word: "previous",
    phonetic: "/ˈpriːviəs/",
    partOfSpeech: "adj.",
    translation: "以前的；先前的",
    definition: "happening before the present time",
    collocations: "previous review; previous example",
    sourceSentence: "Check the previous sentence if the meaning is unclear."
  },
  {
    word: "relevant",
    phonetic: "/ˈreləvənt/",
    partOfSpeech: "adj.",
    translation: "相关的；切题的",
    definition: "closely connected with what is happening",
    collocations: "relevant example; relevant information",
    sourceSentence: "Choose relevant sentences from your own materials."
  },
  {
    word: "reliable",
    phonetic: "/rɪˈlaɪəbl/",
    partOfSpeech: "adj.",
    translation: "可靠的；可信赖的",
    definition: "able to be trusted",
    collocations: "reliable source; reliable method",
    sourceSentence: "A reliable system saves your learning history."
  },
  {
    word: "sufficient",
    phonetic: "/səˈfɪʃnt/",
    partOfSpeech: "adj.",
    translation: "足够的；充分的",
    definition: "enough for a particular purpose",
    collocations: "sufficient practice; sufficient evidence",
    sourceSentence: "One exposure is not sufficient to master a word."
  },
  {
    word: "valuable",
    phonetic: "/ˈvæljuəbl/",
    partOfSpeech: "adj.",
    translation: "有价值的；宝贵的",
    definition: "useful, important, or worth a lot",
    collocations: "valuable experience; valuable phrase",
    sourceSentence: "A valuable sentence is worth reviewing many times."
  },
  {
    word: "various",
    phonetic: "/ˈveriəs/",
    partOfSpeech: "adj.",
    translation: "各种各样的；多种的",
    definition: "several different",
    collocations: "various methods; various contexts",
    sourceSentence: "Meet a word in various contexts to understand it deeply."
  },
  {
    word: "weakness",
    phonetic: "/ˈwiːknəs/",
    partOfSpeech: "n.",
    translation: "弱点；缺点；薄弱处",
    definition: "a part that is not strong or effective",
    collocations: "identify a weakness; spelling weakness",
    sourceSentence: "Repeated mistakes reveal a weakness in your memory."
  }
];
