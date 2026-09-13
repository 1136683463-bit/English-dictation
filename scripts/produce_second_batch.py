# 第二批课程数据生产：L21–L24 + 5 个新侦探案件（析客规格书 §1–§4）
# 追加方式：分别插入 grammarLessons.ts / huntCases.ts 的最后一个 "];" 之前
import sys

LESSONS_PATH = "/Users/liujun/Documents/英语听写/src/data/grammarLessons.ts"
CASES_PATH = "/Users/liujun/Documents/英语听写/src/data/huntCases.ts"

LESSONS = r'''
  {
    // ── 第三季 · 第二批（析客规格书 prd-grammar-second-batch-2026-09-13）：现在完成时拆 3 课 + 对比课 ──
    // L21 基本式「刚做完」：不规则做过版只引入 done / eaten；一词两义（have=有 / have+做过版）在主线对比卡正面拆解
    id: "lesson-21-have-done",
    number: 21,
    title: "作业写完了",
    grammarLabel: "现在完成时 · have + 做过版",
    episode: "小美的一天 ㉑",
    scene: "mansion",
    sceneSetupZh: "清晨出门前，妈妈指着门口的书包问作业。",
    dialogueEn: "Have you finished your homework?",
    dialogueZh: "妈妈一边帮忙整理书包一边问。",
    intentZh: "我已经写完作业了。",
    targetSentence: "I have done my homework.",
    blocks: [
      { text: "I", role: "我" },
      { text: "have", role: "信号灯（做过了）" },
      { text: "done", role: "做（做过版）" },
      { text: "my homework", role: "我的作业" }
    ],
    oneLineRule: "说「做完了、做过了」，用 have + 做过版：I have done…。have 后面站做过的版，不是原形。",
    examples: [
      { en: "I have done my homework.", zh: "我已经写完作业了。" },
      { en: "I have eaten breakfast.", zh: "我吃过早饭了。" },
      { en: "I have finished my picture.", zh: "我画完画了。" },
      { en: "I have watched the game.", zh: "我看过比赛了。" }
    ],
    dialogue: [
      { who: "npc", en: "Have you finished your homework?", zh: "妈妈一边整理书包一边问。" },
      { who: "npc", en: "Don't forget your lunch box.", zh: "她又把饭盒塞进书包。" },
      { who: "me", en: "I have done my homework.", zh: "轮到你说了——作业已经写完了。" }
    ],
    contrast: [
      {
        wrong: "I have do my homework.",
        wrongMark: "do",
        correct: "I have done my homework.",
        whyZh: "have 后面要站动词的做过版。do 的做过版是 done——have 已经占好了位置，动词要换上做过版的外套。"
      },
      {
        wrong: "I have eat breakfast.",
        wrongMark: "eat",
        correct: "I have eaten breakfast.",
        whyZh: "have 后面跟「东西」是「有」（I have a bag），跟「做过版」就是「做过了」（I have eaten breakfast）。看 have 后面站的是什么词。"
      }
    ],
    variants: [
      { label: "肯定", en: "I have done my homework.", zh: "我已经写完作业了。" },
      { label: "否定", en: "I haven't done my homework.", zh: "我还没写作业。", noteZh: "haven't = have not：have 后面加 not，就是「还没做」。" },
      { label: "疑问", en: "Have you finished your homework?", zh: "你写完作业了吗？", noteZh: "问别人时把 Have 搬到句首。回答还是 I have。" }
    ],
    sceneSwings: [
      { sceneZh: "早餐桌上，妈妈问你吃了没", en: "I have eaten breakfast.", zh: "我吃过早饭了。" },
      { sceneZh: "画室里，老师看你的画", en: "I have finished my picture.", zh: "我画完画了。" },
      { sceneZh: "球场上，朋友问你看了比赛没", en: "I have watched the game.", zh: "我看过比赛了。" }
    ],
    deepDive: {
      title: "have 明明是「有」，怎么又变成「做过了」？",
      paragraphs: [
        "have 是个多面手：后面跟「东西」，就是「有」——I have a new bag（我有一个新背包，第 3 课学过）；后面跟「做过版」，就是「做过了」——I have done my homework（我写完了作业）。判断方法只有一个：看 have 后面站的是什么词。",
        "做过版是动词的第三件外套。大多数动词的做过版和昨天版长得一样：watch→watched、finish→finished，昨天穿今天穿都是它。只有几个老词走自己的路：do→done、eat→eaten，遇到就单独记住。",
        "下一课你会见到 been 和 seen——be 和 see 的做过版。加上这课的 done、eaten，四个常客就集齐了。"
      ]
    },
    summary: {
      rule: "说「做过了」用 have + 做过版；have 后面跟东西是「有」，跟做过版是「做过了」。",
      points: [
        "I have done my homework. —— have + 做过版",
        "I haven't done my homework. —— 还没做：have 后面加 not",
        "Have you finished your homework? —— 问别人：Have 搬到句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我已经写完作业了。",
        before: "I",
        after: "done my homework.",
        options: ["have", "has", "had"],
        answer: "have",
        explain: "说「我做过了」，信号灯用 have；has 是他、她专用的，这里先不用管。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我吃过早饭了。",
        tokens: ["eaten", "I", "breakfast.", "have"],
        answer: "I have eaten breakfast.",
        explain: "have 后面站做过版：eaten 是 eat 的做过版。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我已经写完作业了。",
        tokens: ["homework.", "my", "done", "have", "I"],
        answer: "I have done my homework.",
        explain: "I have 开头，done 站在 have 后面。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "have", "do", "my", "homework."],
        wrongToken: "do",
        answer: "do",
        correctionZh: "把 do 换成做过版 done：I have done my homework。",
        explain: "have 后面要站做过版，do 的做过版是 done。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我画完画了。",
        tokens: ["picture.", "my", "finished", "have", "I"],
        distractors: ["has"],
        answer: "I have finished my picture."
      },
      {
        promptZh: "早餐桌上，你想说：我吃过早饭了。",
        tokens: ["breakfast.", "eaten", "have", "I"],
        distractors: ["eat", "ate"],
        answer: "I have eaten breakfast."
      },
      {
        promptZh: "先复习一小步——上一季学过：昨天我去了公园。",
        tokens: ["went", "Yesterday", "I", "to", "the", "park."],
        distractors: ["go"],
        answer: "Yesterday I went to the park."
      },
      {
        promptZh: "作业早写完了，你想问同桌：你写完作业了吗？",
        tokens: ["you", "Have", "homework?", "finished", "your"],
        distractors: ["done"],
        answer: "Have you finished your homework?"
      }
    ],
    // R5 忆段：析客规格 §4.5 降档——本课忆 L10 旧句热身，规避 have 一词两义 + 无提示回忆双重陡坡
    recall: {
      promptZh: "出门前最后检查：周日的日记本上，昨天最开心的一件事要写下来。凭记忆，写出那句英文。",
      intentZh: "我昨天去了公园。",
      answer: "Yesterday I went to the park.",
      noteZh: "这是第 10 课的核心句——先热个身，下一课开始回忆新句型。"
    },
    huntCaseIds: ["hunt-homework-note"]
  },
  {
    // L22 经历「去过」：引入 been / seen；gone 仅深挖卡认读不进必做题（Non-goals）
    id: "lesson-22-been-to",
    number: 22,
    title: "去过北京",
    grammarLabel: "现在完成时 · have been to / have seen",
    episode: "小美的一天 ㉒",
    scene: "city",
    sceneSetupZh: "课间，班上新来的转学生正在聊暑假去了哪儿。",
    dialogueEn: "Have you been to Beijing?",
    dialogueZh: "新同学转过身来问你。",
    intentZh: "我去过北京。",
    targetSentence: "I have been to Beijing.",
    blocks: [
      { text: "I", role: "我" },
      { text: "have", role: "信号灯" },
      { text: "been", role: "去（做过版）" },
      { text: "to Beijing", role: "去过北京" }
    ],
    oneLineRule: "说「去过某地」用 have been to：I have been to Beijing。been 是 be 的做过版——去过了、回来了。",
    examples: [
      { en: "I have been to Beijing.", zh: "我去过北京。" },
      { en: "I have seen that film.", zh: "我看过那部电影。" },
      { en: "I have been to the zoo.", zh: "我去过动物园。" },
      { en: "I have been to Shanghai.", zh: "我去过上海。" }
    ],
    dialogue: [
      { who: "npc", en: "Have you been to Beijing?", zh: "新同学转过身来问你。" },
      { who: "npc", en: "I have seen that film twice!", zh: "她还聊起了最近看的电影。" },
      { who: "me", en: "I have been to Beijing.", zh: "轮到你说了——小美去过北京。" }
    ],
    contrast: [
      {
        wrong: "I have be to Beijing.",
        wrongMark: "be",
        correct: "I have been to Beijing.",
        whyZh: "be 的做过版是 been，不是 be 本身。做过版是另一件外套，不能拿原形充数。"
      },
      {
        wrong: "I see that film yesterday.",
        wrongMark: "see",
        correct: "I saw that film yesterday.",
        whyZh: "句子里有 yesterday，就要用昨天版：I saw that film yesterday。没有时间点、只说「看过」，才用 have + 做过版。"
      }
    ],
    variants: [
      { label: "肯定", en: "I have been to Beijing.", zh: "我去过北京。" },
      { label: "否定", en: "I haven't seen that film.", zh: "我还没看过那部电影。", noteZh: "haven't = have not：还没看过。" },
      { label: "疑问", en: "Have you been to Beijing?", zh: "你去过北京吗？", noteZh: "把 Have 搬到句首，问别人去过没。" }
    ],
    sceneSwings: [
      { sceneZh: "相册前，你指着一张剧照", en: "I have seen that film.", zh: "我看过那部电影。" },
      { sceneZh: "地图前，同学问你暑假去了哪儿", en: "I have been to Beijing.", zh: "我去过北京。" },
      { sceneZh: "动物园门口，朋友约你再去", en: "I have been to the zoo.", zh: "我去过动物园。" }
    ],
    deepDive: {
      title: "been 和 was 长得像，它们是什么关系？",
      paragraphs: [
        "been 和 was 其实是同一个动词的两件外套：am / is 的昨天版是 was，做过版是 been。说「我昨天在北京」用 was（I was in Beijing yesterday），说「我去过北京」用 been（I have been to Beijing）。",
        "还有一个近亲 gone：go 的做过版。gone 是「去了还没回来」，been 是「去过了、已经回来」——说 He has gone to Beijing 是他人还在北京，说 He has been to Beijing 是他去玩过、人回来了。这两个词先混个脸熟，不用考。",
        "说「去过哪儿、看过什么」不用报日子，像翻相册：一张一张说过去就行。这也是为什么这类句子里不放 yesterday。"
      ]
    },
    summary: {
      rule: "说「去过某地」用 have been to；「看过什么」用 have + 做过版。",
      points: [
        "I have been to Beijing. —— been 是 be 的做过版",
        "I haven't seen that film. —— 还没看过：haven't + 做过版",
        "Have you been to Beijing? —— 问别人：Have 搬到句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我去过北京。",
        before: "I have",
        after: "to Beijing.",
        options: ["been", "was", "go"],
        answer: "been",
        explain: "been 是 be 的做过版；was 是昨天版，不能站错位置。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我看过那部电影。",
        tokens: ["that", "I", "film.", "seen", "have"],
        answer: "I have seen that film.",
        explain: "have 后面站 seen——see 的做过版。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我去过北京。",
        tokens: ["have", "been", "I", "Beijing.", "to"],
        answer: "I have been to Beijing.",
        explain: "been to + 地名：去过哪儿。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["She", "have", "been", "to", "the", "zoo."],
        wrongToken: "have",
        answer: "have",
        correctionZh: "她专用的信号灯是 has：She has been to the zoo。",
        explain: "说「她做过了」，信号灯要用 has。这个先认个脸，以后细讲。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我去过北京。",
        tokens: ["I", "been", "have", "Beijing.", "to"],
        distractors: ["was", "go"],
        answer: "I have been to Beijing."
      },
      {
        promptZh: "聊到电影，你想说：我看过那部电影。",
        tokens: ["film.", "seen", "that", "have", "I"],
        distractors: ["saw"],
        answer: "I have seen that film."
      },
      {
        promptZh: "先复习一小步——学过的老句子：我去图书馆。",
        tokens: ["library.", "I", "go", "to", "the"],
        distractors: ["goes"],
        answer: "I go to the library."
      },
      {
        promptZh: "同学聊起一部你没看过的电影，你想说：我还没看过那部电影。",
        tokens: ["film.", "I", "seen", "that", "haven't"],
        distractors: ["saw"],
        answer: "I haven't seen that film."
      }
    ],
    recall: {
      promptZh: "新同学笑着等你回答，轮到你介绍自己去过哪儿了。凭记忆，写出那句英文。",
      intentZh: "我去过北京。",
      answer: "I have been to Beijing.",
      noteZh: "been 是 be 的做过版：去过了、回来了。"
    },
    huntCaseIds: ["hunt-photo-album"]
  },
  {
    // L23 结果「还在呢」：引入 broken / written；lost 白捡（昨天版做过版同形）
    id: "lesson-23-have-lost",
    number: 23,
    title: "钥匙不见了",
    grammarLabel: "现在完成时 · have lost / have broken",
    episode: "小美的一天 ㉓",
    scene: "mansion",
    sceneSetupZh: "放学回家，小美站在门口翻遍了书包——钥匙不见了。",
    dialogueEn: "Is it in your bag?",
    dialogueZh: "外婆隔着门问。",
    intentZh: "我把钥匙弄丢了。",
    targetSentence: "I have lost my key.",
    blocks: [
      { text: "I", role: "我" },
      { text: "have", role: "信号灯" },
      { text: "lost", role: "弄丢（做过版）" },
      { text: "my key", role: "我的钥匙" }
    ],
    oneLineRule: "丢了、坏了、还在呢——结果现在还看得见的事，用 have + 做过版说：I have lost my key。",
    examples: [
      { en: "I have lost my key.", zh: "我把钥匙弄丢了。" },
      { en: "I have broken my cup.", zh: "我把杯子打碎了。" },
      { en: "I have written a letter.", zh: "我写好了一封信。" },
      { en: "I have lost my pen.", zh: "我把钢笔弄丢了。" }
    ],
    dialogue: [
      { who: "npc", en: "Is it in your bag?", zh: "外婆隔着门问。" },
      { who: "npc", en: "Don't worry. I have my key here.", zh: "外婆拿出备用钥匙：别担心，我这儿有。" },
      { who: "me", en: "I have lost my key.", zh: "轮到你说了——钥匙弄丢了。" }
    ],
    contrast: [
      {
        wrong: "I have lose my key.",
        wrongMark: "lose",
        correct: "I have lost my key.",
        whyZh: "lose 的做过版是 lost，不走加 -ed 的路。丢失的结果现在还在——还没进家门呢，所以用 have + 做过版。"
      },
      {
        wrong: "I break my cup yesterday.",
        wrongMark: "break",
        correct: "I broke my cup yesterday.",
        whyZh: "句子里有 yesterday，要用昨天版 broke。没提时间、只说「碎了还在」，才用 have + 做过版。"
      }
    ],
    variants: [
      { label: "肯定", en: "I have lost my key.", zh: "我把钥匙弄丢了。" },
      { label: "否定", en: "I haven't cleaned my room.", zh: "我还没打扫房间。", noteZh: "haven't = have not：还没做好。" },
      { label: "疑问", en: "Have you cleaned your room?", zh: "你打扫房间了吗？", noteZh: "把 Have 搬到句首，问别人做好了没。" }
    ],
    sceneSwings: [
      { sceneZh: "家门口，外婆问你钥匙哪去了", en: "I have lost my key.", zh: "我把钥匙弄丢了。" },
      { sceneZh: "厨房里，你收拾碗时手一滑", en: "I have broken my cup.", zh: "我把杯子打碎了。" },
      { sceneZh: "书房里，你给笔友回信", en: "I have written a letter.", zh: "我写好了一封信。" }
    ],
    deepDive: {
      title: "丢钥匙的事在昨天，为什么不用昨天版？",
      paragraphs: [
        "重点不在哪一天丢的，而在「现在还没找回来」——结果一直留到了现在。凡是结果还在的事（钥匙丢了、杯子碎了），英语用 have + 做过版来说。",
        "lost 是个白捡的词：lose 的昨天版和做过版长得一样，都是 lost。I lost my key yesterday（昨天丢的，讲故事）和 I have lost my key（还没找回来，说结果）都对，只是分工不同。",
        "broken、written 也是老词走自己的路：break 的昨天版是 broke、做过版是 broken；write 的昨天版是 wrote、做过版是 written。两件外套别穿混。"
      ]
    },
    summary: {
      rule: "结果还在的事（丢了、碎了）用 have + 做过版：I have lost my key。",
      points: [
        "I have lost my key. —— 结果还在：用做过版",
        "I broke my cup yesterday. —— 有时间点：用昨天版",
        "Have you cleaned your room? —— 问别人：Have 搬到句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我把钥匙弄丢了。",
        before: "I have",
        after: "my key.",
        options: ["lost", "lose", "losed"],
        answer: "lost",
        explain: "lose 的做过版是 lost；losed 是不存在的形状。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我写好了一封信。",
        tokens: ["letter.", "a", "written", "have", "I"],
        answer: "I have written a letter.",
        explain: "have 后面站 written——write 的做过版。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我把钥匙弄丢了。",
        tokens: ["key.", "lost", "my", "have", "I"],
        answer: "I have lost my key.",
        explain: "I have lost = 已经丢了，还没找回来。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "have", "break", "my", "cup."],
        wrongToken: "break",
        answer: "break",
        correctionZh: "把 break 换成做过版 broken：I have broken my cup。",
        explain: "have 后面要站做过版：break 的做过版是 broken。"
      }
    ],
    practice: [
      {
        promptZh: "外婆问你钥匙哪去了，你想说：我把钥匙弄丢了。",
        tokens: ["I", "lost", "have", "key.", "my"],
        distractors: ["lose", "losed"],
        answer: "I have lost my key."
      },
      {
        promptZh: "厨房里，你想说：我把杯子打碎了。",
        tokens: ["cup.", "my", "broken", "have", "I"],
        distractors: ["broke"],
        answer: "I have broken my cup."
      },
      {
        promptZh: "先复习一小步——学过的老句子：它在你书包里吗？",
        tokens: ["it", "Is", "your", "bag?", "in"],
        distractors: ["on", "at"],
        answer: "Is it in your bag?"
      },
      {
        promptZh: "妈妈快回家了，你想说：我还没打扫房间。",
        tokens: ["cleaned", "I", "room.", "my", "haven't"],
        distractors: ["clean"],
        answer: "I haven't cleaned my room."
      }
    ],
    recall: {
      promptZh: "外婆在门口等你，你翻遍了书包也没找到，该告诉她坏消息了。凭记忆，写出那句英文。",
      intentZh: "我把钥匙弄丢了。",
      answer: "I have lost my key.",
      noteZh: "丢了、还没找回来——结果还在，用 have + 做过版。"
    },
    huntCaseIds: ["hunt-lost-key"]
  },
  {
    // L24 对比收口课：targetSentence 存昨天版核心句（无提示产出题恰好考「昨天信号选昨天版」）；
    // 做过版核心句由 variants 肯定卡 + 破案/练习承载。零新增分词，全批复用。
    id: "lesson-24-past-vs-perfect",
    number: 24,
    title: "昨天去了，还是去过了？",
    grammarLabel: "对比 · 一般过去时 vs 现在完成时",
    episode: "小美的一天 ㉔",
    scene: "mystery",
    sceneSetupZh: "周日晚，小美在灯下写周记，妈妈端着水果进来聊天。",
    dialogueEn: "Have you been to the new park?",
    dialogueZh: "妈妈一边削苹果一边问。",
    intentZh: "我昨天去了公园。",
    targetSentence: "Yesterday I went to the park.",
    blocks: [
      { text: "Yesterday", role: "昨天（信号灯）" },
      { text: "I", role: "我" },
      { text: "went", role: "去（昨天版）" },
      { text: "to the park", role: "去公园" }
    ],
    oneLineRule: "句子里有具体时间点（yesterday、last week）就用昨天版；不报时间、只说「做过了、去过」就用 have + 做过版。",
    examples: [
      { en: "Yesterday I went to the park.", zh: "我昨天去了公园。" },
      { en: "I have been to the park.", zh: "我去过那个公园。" },
      { en: "I saw that film yesterday.", zh: "我昨天看了那部电影。" },
      { en: "I have seen that film.", zh: "我看过那部电影。" }
    ],
    dialogue: [
      { who: "npc", en: "Have you been to the new park?", zh: "妈妈一边削苹果一边问。" },
      { who: "npc", en: "I heard it is beautiful.", zh: "她说：听说那儿很漂亮。" },
      { who: "me", en: "I have been to the park.", zh: "轮到你说了——小美去过那个公园。" }
    ],
    contrast: [
      {
        wrong: "I have seen that film yesterday.",
        wrongMark: "seen",
        correct: "I saw that film yesterday.",
        whyZh: "yesterday 已经站在句子里了，就得用昨天版 saw。做过版和具体时间点不能同台。"
      },
      {
        wrong: "Yesterday I have done my homework.",
        wrongMark: "have",
        correct: "Yesterday I did my homework.",
        whyZh: "Yesterday 在场，讲的是哪一天干了啥——用昨天版 did。做过版只说「做过了」，不带日子。"
      }
    ],
    variants: [
      { label: "肯定", en: "I have been to the park.", zh: "我去过那个公园。" },
      { label: "否定", en: "I didn't go out yesterday.", zh: "我昨天没出门。", noteZh: "昨天 + 不 = didn't：did 出场后动词变回原形 go。" },
      { label: "疑问", en: "Have you been to the new park?", zh: "你去过新开的公园吗？", noteZh: "不报时间地问经历：Have 搬到句首。" }
    ],
    sceneSwings: [
      { sceneZh: "日记里写下昨天的行程", en: "I went to the park yesterday.", zh: "我昨天去了公园。" },
      { sceneZh: "饭桌上，妈妈问你饿不饿", en: "I have eaten breakfast, so I am full.", zh: "我吃过早饭了，所以很饱。" },
      { sceneZh: "照片前，你指着天安门", en: "I have been to Beijing.", zh: "我去过北京。" }
    ],
    deepDive: {
      title: "went 和 have been，到底怎么选？",
      paragraphs: [
        "两句话并排看：Yesterday I went to the park（我昨天去了公园——讲故事，有日子）；I have been to the park（我去过那个公园——说经历，没有日子）。同一件事，讲法分工不同。",
        "一句话判据：句子里有具体时间点吗？有——yesterday、last week——用昨天版；没有，只说「做过了、去过」，或事情和现在有关——用 have + 做过版。",
        "信号词小清单：看到 yesterday、last week，用昨天版；看到 just（刚刚）或不报时间，用做过版。just 先混个脸熟，不用考。",
        "gone 和 been 再认一次：gone 是去了还没回来，been 是去过了、回来了。说经历，用 been。"
      ]
    },
    summary: {
      rule: "有具体时间点用昨天版；不报时间、只说做过了就用 have + 做过版。",
      points: [
        "Yesterday I went to the park. —— yesterday 在场：昨天版",
        "I have been to the park. —— 不报时间的经历：做过版",
        "I didn't go out yesterday. —— 昨天版否定：did + 原形"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：昨天我去了公园。",
        before: "",
        after: "I went to the park.",
        options: ["Yesterday", "Just", "Now"],
        answer: "Yesterday",
        explain: "说哪一天干了啥，开头放时间点 Yesterday，动词穿昨天版。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：昨天我去了公园。",
        tokens: ["to", "Yesterday", "I", "the", "park.", "went"],
        answer: "Yesterday I went to the park.",
        explain: "Yesterday 开头，went 是 go 的昨天版。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我去过那个公园。",
        tokens: ["park.", "been", "I", "the", "to", "have"],
        answer: "I have been to the park.",
        explain: "不报时间，只说去过：have + been。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "have", "seen", "that", "film", "yesterday."],
        wrongToken: "seen",
        answer: "seen",
        correctionZh: "把 seen 换成昨天版 saw：I saw that film yesterday。",
        explain: "yesterday 在场，动词要用昨天版，做过版不能同台。"
      }
    ],
    practice: [
      {
        promptZh: "写周记的第一句，你想说：昨天我去了公园。",
        tokens: ["I", "went", "Yesterday", "to", "the", "park."],
        distractors: ["have", "been"],
        answer: "Yesterday I went to the park."
      },
      {
        promptZh: "回答妈妈的问题，你想说：我去过那个公园。",
        tokens: ["park.", "I", "been", "the", "have", "to"],
        distractors: ["went", "Yesterday"],
        answer: "I have been to the park."
      },
      {
        promptZh: "先复习一小步——学过的老句子：我吃了两个三明治。",
        tokens: ["I", "ate", "two", "sandwiches."],
        distractors: ["eat"],
        answer: "I ate two sandwiches."
      },
      {
        promptZh: "昨天作业太多，你想说：我昨天没出门。",
        tokens: ["go", "didn't", "I", "out", "yesterday."],
        distractors: ["went"],
        answer: "I didn't go out yesterday."
      }
    ],
    recall: {
      promptZh: "妈妈笑着等你回答——去过新开的公园没？凭记忆，写出那句英文。",
      intentZh: "我去过那个公园。",
      answer: "I have been to the park.",
      noteZh: "不报时间、只说去过：have + been to。"
    },
    huntCaseIds: ["hunt-diary-mix", "hunt-weekend-note"]
  }
'''

CASES = r'''
  {
    // ── 第二批案件（析客规格书 §4）：每案 3–4 错 = 新错（verb_form/tense）1–2 + 旧错 1–2，全部单 token 可修 ──
    // L21 配套 · 螺旋混题：新错 have do→done / eated→eaten + 旧错 say→said（tense, L10）/ sandwich→sandwiches（plural, L11）
    id: "hunt-homework-note",
    number: 29,
    reviewed: true,
    title: "书包里的字条",
    scene: "妈妈清晨塞进书包的一张字条",
    notes: [{ word: "packed", zh: "装好（pack 的昨天版）" }],
    tokens: [
      "Good", "morning!",
      "Have", "you", "finished", "your", "homework?",
      "I", "hope", "you", "have", "do", "it", "all.",
      "Yesterday", "you", "say", "it", "was", "too", "much,", "and", "it", "was", "hard.",
      "You", "have", "eated", "two", "sandwich", "for", "dinner.",
      "I", "have", "packed", "your", "lunch", "box."
    ],
    errors: [
      {
        tokenIndex: 11,
        tag: "verb_form",
        original: "do",
        correction: "done",
        explanation: "have 后面要站做过版：do 的做过版是 done。I have done it all."
      },
      {
        tokenIndex: 16,
        tag: "tense",
        original: "say",
        correction: "said",
        explanation: "Yesterday 说的是昨天的事，动词要换昨天版：say → said。"
      },
      {
        tokenIndex: 27,
        tag: "verb_form",
        original: "eated",
        correction: "eaten",
        explanation: "eat 的做过版是 eaten，不走加 -ed 的路——没有 eated 这个形状。"
      },
      {
        tokenIndex: 29,
        tag: "plural",
        original: "sandwich",
        correction: "sandwiches",
        explanation: "two 后面的可数名词要用复数：two sandwiches。"
      }
    ]
  },
  {
    // L22 配套：新错 was→been（have 后错位）/ see→seen + 旧错 a→an（article, L04）/ We was→were（sv_agreement）
    id: "hunt-photo-album",
    number: 30,
    reviewed: true,
    title: "相册里的一页",
    scene: "小美和外婆一起翻旧相册，念出照片背后的一行字",
    notes: [{ word: "Beijing", zh: "北京（地名）" }, { word: "Grandma", zh: "外婆" }],
    tokens: [
      "Summer,", "2015.",
      "This", "is", "me", "and", "Grandma.",
      "I", "have", "was", "to", "Beijing", "with", "her,",
      "and", "I", "have", "see", "the", "sea", "for", "the", "first", "time.",
      "We", "was", "so", "happy", "that", "day.",
      "On", "the", "way", "home,", "I", "ate", "a", "apple", "and", "shared", "it", "with", "her."
    ],
    errors: [
      {
        tokenIndex: 9,
        tag: "verb_form",
        original: "was",
        correction: "been",
        explanation: "be 的做过版是 been：I have been to Beijing。was 是昨天版，不能站在 have 后面。"
      },
      {
        tokenIndex: 17,
        tag: "verb_form",
        original: "see",
        correction: "seen",
        explanation: "have 后面站做过版：see 的做过版是 seen。"
      },
      {
        tokenIndex: 25,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "主语是 We（我们），昨天版要用 were。"
      },
      {
        tokenIndex: 36,
        tag: "article",
        original: "a",
        correction: "an",
        explanation: "apple 以元音开头，前面要穿 an：an apple。"
      }
    ]
  },
  {
    // L23 配套：新错 losed→lost（杜撰形陷阱）/ broke→broken + 旧错 in home→at home（preposition, L18）/ glasses is→are（sv_agreement）
    // 陷阱设计：句中两个 in——get in 是对的，waiting in home 是错的
    id: "hunt-lost-key",
    number: 31,
    reviewed: true,
    title: "门口的求助字条",
    scene: "邻居贴在楼门口的一张寻钥匙字条",
    notes: [{ word: "neighbors", zh: "邻居们" }, { word: "glasses", zh: "眼镜" }, { word: "handle", zh: "把手" }],
    tokens: [
      "To", "my", "neighbors:",
      "I", "have", "losed", "my", "key.",
      "Now", "I", "can't", "get", "in", "and", "I", "am", "waiting", "in", "home.",
      "My", "glasses", "is", "in", "the", "same", "bag,",
      "so", "I", "can't", "see", "clearly.",
      "I", "have", "also", "broke", "my", "phone", "screen.",
      "If", "you", "find", "my", "key,",
      "please", "put", "it", "on", "my", "door", "handle.",
      "Thank", "you!"
    ],
    errors: [
      {
        tokenIndex: 5,
        tag: "verb_form",
        original: "losed",
        correction: "lost",
        explanation: "lose 的做过版是 lost——没有 losed 这个形状。"
      },
      {
        tokenIndex: 17,
        tag: "preposition",
        original: "in",
        correction: "at",
        explanation: "「在家里」是 at home——home 是特例，前面不垫 in。（前面 get in 的 in 是对的，别看错）"
      },
      {
        tokenIndex: 21,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "glasses（眼镜）永远是复数，要用 are。"
      },
      {
        tokenIndex: 34,
        tag: "verb_form",
        original: "broke",
        correction: "broken",
        explanation: "have 后面站做过版：break 的做过版是 broken。"
      }
    ]
  },
  {
    // L24 主配套 · 本批核心新错型：Yesterday 与做过版同台（seen→saw，tense）
    id: "hunt-diary-mix",
    number: 32,
    reviewed: true,
    title: "混了时间的日记",
    scene: "一篇把两种时间搅在一起的周记",
    notes: [{ word: "bowls", zh: "碗（bowl 的复数）" }],
    tokens: [
      "Sunday,", "sunny.",
      "Yesterday", "I", "have", "seen", "that", "film", "with", "Dad,",
      "and", "it", "was", "funny.",
      "In", "the", "afternoon", "I", "go", "to", "school", "for", "the", "art", "class.",
      "Mom", "made", "dinner,", "and", "I", "have", "eat", "two", "bowls", "of", "rice.",
      "Before", "bed,", "I", "read", "three", "book", "about", "animals."
    ],
    errors: [
      {
        tokenIndex: 5,
        tag: "tense",
        original: "seen",
        correction: "saw",
        explanation: "Yesterday 已经站在句子里，动词要用昨天版：I saw that film。做过版和具体时间点不能同台。"
      },
      {
        tokenIndex: 18,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "下午的美术课是昨天的事，go 要换昨天版 went。"
      },
      {
        tokenIndex: 31,
        tag: "verb_form",
        original: "eat",
        correction: "eaten",
        explanation: "have 后面站做过版：eat 的做过版是 eaten。"
      },
      {
        tokenIndex: 41,
        tag: "plural",
        original: "book",
        correction: "books",
        explanation: "three 后面是可数名词复数：three books。"
      }
    ]
  },
  {
    // L24 第 2 案：新错 have did→done + 旧错 In Monday→on Monday（preposition）/ was→were（sv_agreement）/ must to go→must go（verb_form, L16）
    id: "hunt-weekend-note",
    number: 33,
    reviewed: true,
    title: "外婆的周末字条",
    scene: "外婆贴在冰箱上的周末安排便条",
    tokens: [
      "A", "note", "for", "the", "weekend:",
      "Our", "family", "have", "did", "a", "lot", "this", "weekend.",
      "In", "Monday,", "we", "cleaned", "the", "house", "together,",
      "and", "my", "little", "brother", "and", "I", "was", "tired", "but", "happy.",
      "Dad", "said", "we", "must", "to", "go", "to", "bed", "early.",
      "I", "have", "also", "done", "my", "homework,",
      "so", "tomorrow", "we", "can", "go", "to", "the", "park."
    ],
    errors: [
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "did",
        correction: "done",
        explanation: "have 后面要站做过版：do 的做过版是 done。"
      },
      {
        tokenIndex: 13,
        tag: "preposition",
        original: "In",
        correction: "On",
        explanation: "说「在星期一」用 on Monday——星期前面垫 on。"
      },
      {
        tokenIndex: 26,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "主语是 my little brother and I（两个人），昨天版要用 were。"
      },
      {
        tokenIndex: 34,
        tag: "verb_form",
        original: "to",
        correction: "去掉 to",
        explanation: "must 后面的动词保持原样，中间不垫 to：must go。"
      }
    ]
  }
'''

def append_before_closing(path, text, label):
    with open(path, encoding="utf-8") as f:
        content = f.read()
    idx = content.rfind("\n];")
    if idx < 0:
        sys.exit(f"ABORT: {label} 未找到数组结束符")
    # 校验 id 唯一
    import re
    existing_ids = set(re.findall(r'id: "([a-z0-9-]+)"', content))
    new_ids = set(re.findall(r'id: "([a-z0-9-]+)"', text))
    dup = existing_ids & new_ids
    if dup:
        sys.exit(f"ABORT: {label} 存在重复 id: {dup}")
    content = content[:idx] + ",\n" + text.strip("\n") + "\n];\n"
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"OK: {label} 追加 {len(new_ids)} 项")

append_before_closing(LESSONS_PATH, LESSONS, "grammarLessons (L21-L24)")
append_before_closing(CASES_PATH, CASES, "huntCases (29-33)")
