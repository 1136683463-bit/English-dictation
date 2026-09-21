/**
 * B1 级语法缺口 · 批次 B（L176–L179）
 *   L176 would rather · L177 prefer · L178 过去完成时 had done · L179 shall（征求意见）
 */
import type { NewLesson } from "./types";

export const B1_LESSONS_B: NewLesson[] = [
  // ══════════════ L176 · would rather ══════════════
  {
    id: "lesson-176-would-rather",
    number: 176,
    title: "我宁愿走路",
    grammarLabel: "宁愿 · would rather",
    episode: "小美的一天 一百七十六",
    scene: "city",
    sceneSetupZh: "下雨天，同学说着打车去吧，小美看了看窗外——路上堵成这样，坐车还不如走过去快。",
    dialogueEn: "I would rather walk.",
    dialogueZh: "小美把伞撑开。",
    intentZh: "我宁愿走路。",
    targetSentence: "I would rather walk.",
    blocks: [
      { text: "I would rather", role: "我宁愿（rather 站 would 后面）" },
      { text: "walk", role: "走路（后面跟原样）" }
    ],
    oneLineRule: "说「宁愿」用 would rather——I would rather walk（我宁愿走路）。rather 站在 would 后面，后面那个动作穿原样。它比 would like 更带一层「跟他比，我选这个」的意思。",
    examples: [
      { en: "I would rather walk.", zh: "我宁愿走路。" },
      { en: "She would rather stay at home.", zh: "她宁愿待在家里。" },
      { en: "I would like a cup of tea.", zh: "我想要一杯茶。（第 62 课）" },
      { en: "I would rather walk than wait.", zh: "与其等着，我宁愿走。（多一个 than，说「与其…」）" }
    ],
    dialogue: [
      { who: "npc", en: "Let's take a taxi.", zh: "同学看着路上的车流说。" },
      { who: "npc", en: "Look at the traffic!", zh: "她指了指堵成一条龙的车队。" },
      { who: "me", en: "I would rather walk.", zh: "轮到你说了——我宁愿走路。" }
    ],
    contrast: [
      {
        wrong: "I would rather to walk.",
        wrongMark: "to",
        correct: "I would rather walk.",
        whyZh: "would rather 后面那个动作穿原样，不垫 to——I would rather 【walk】。垫 to 的是 would like（第 62 课）。"
      },
      {
        wrong: "I would rather walking.",
        wrongMark: "walking",
        correct: "I would rather walk.",
        whyZh: "后面穿原样，不穿 -ing——I would rather 【walk】。"
      },
      {
        wrong: "I rather would walk.",
        wrongMark: "rather would",
        correct: "I would rather walk.",
        whyZh: "rather 站在 would 后面——I 【would】【rather】 walk。两个词的顺序是固定的。"
      },
      {
        wrong: "I would like a cup of tea.",
        wrongMark: null,
        correct: "I would rather walk.",
        bothRight: true,
        whyZh: "两句都对——第 62 课那个 would like 是「想要」；今天这个 would rather 是「宁愿」，带一层「两样比，我选这个」。"
      },
      {
        wrong: "I would rather walk than wait.",
        wrongMark: null,
        correct: "I would rather walk.",
        bothRight: true,
        whyZh: "两句都对——加上 than 那半句，就把「不选什么」也说了出来：与其等着，宁愿走。"
      },
      {
        wrong: "I don't want to go.",
        wrongMark: null,
        correct: "I would rather walk.",
        bothRight: true,
        whyZh: "两句都对——第 15 课那句是「不想去」；今天这句是「两样比，我选走路」。"
      }
    ],
    variants: [
      { label: "肯定", en: "I would rather walk.", zh: "我宁愿走路。", noteZh: "would rather 后面穿原样。" },
      { label: "否定", en: "I would rather not go out.", zh: "我宁愿不出门。", noteZh: "说「宁愿不」把 not 插在 rather 后面。" },
      { label: "疑问", en: "Would you rather walk?", zh: "你宁愿走路吗？", noteZh: "Would 搬到句首，rather 跟着它。" }
    ],
    sceneSwings: [
      { sceneZh: "说宁愿走路", en: "I would rather walk.", zh: "我宁愿走路。" },
      { sceneZh: "说她宁愿待在家", en: "She would rather stay at home.", zh: "她宁愿待在家里。" },
      { sceneZh: "说与其等，宁愿走", en: "I would rather walk than wait.", zh: "与其等着，我宁愿走。" }
    ],
    deepDive: {
      title: "想要、宁愿，差在那一层比较",
      paragraphs: [
        "第 62 课学过 would like：I would like a cup of tea.（我想要一杯茶）——直接说想要什么。",
        "would rather 不一样：它自带一层比较。I would rather walk.（我宁愿走路）这句话背后总有个「跟别的选项比」——打车也堵、等着也慢，所以我选走。中文里最接近的是「宁愿／宁可」。",
        "用法上只有两个要点：rather 站在 would 后面（不能说 I rather would）；后面那个动作穿原样（would rather walk，不是 to walk 也不是 walking）。",
        "想把「不选什么」也说出来，加半句 than：I would rather walk than wait.（与其等着，我宁愿走）。这一加，比较的两头就都清楚了。"
      ]
    },
    summary: {
      rule: "说「宁愿」用 would rather + 动作原样——I would rather walk；rather 站在 would 后面，空间固定。",
      points: [
        "I would rather walk. —— 两样比，选这个",
        "would rather to walk ❌ —— 后面穿原样",
        "would like（第 62 课·想要）／ would rather（今天·宁愿）"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我宁愿走路。",
        before: "I would",
        after: "walk.",
        options: ["rather", "like", "want"],
        answer: "rather",
        explain: "说「宁愿」用 would rather——I would 【rather】 walk。rather 站在 would 后面。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我宁愿走路。",
        tokens: ["I", "would", "rather", "walk."],
        answer: "I would rather walk.",
        explain: "我宁愿（I would rather）＋ 走路（walk，穿原样）。"
      },
      {
        kind: "arrange",
        promptZh: "先复习一小步——第 62 课学过：我想要一杯茶。",
        tokens: ["I", "would", "like", "a", "cup", "of", "tea."],
        answer: "I would like a cup of tea.",
        explain: "复现第 62 课：那个 would like 是「想要」；今天换成「宁愿」。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "would", "rather", "to", "walk."],
        wrongToken: "to",
        answer: "to",
        correctionZh: "把 to 去掉：I would rather walk。",
        explain: "would rather 后面穿原样，不垫 to——垫 to 的是 would like。"
      },
      {
        kind: "arrange",
        promptZh: "再对照一句——第 15 课学过：我不想去了。",
        tokens: ["I", "don't", "want", "to", "go."],
        answer: "I don't want to go.",
        explain: "复现第 15 课：那句是「不想」；今天这句是「两样比，我选这个」。"
      },
      {
        kind: "replace",
        promptZh: "句子换人：「I would rather walk.」换成说她宁愿待在家，怎么变？",
        replaceBase: "I would rather walk.",
        replaceTarget: "换成说她宁愿待在家里",
        options: [
          "She would rather stay at home.",
          "She would rather to stay at home.",
          "She would rather staying at home."
        ],
        answer: "She would rather stay at home.",
        explain: "换人只换前面那个词——She would rather ＋ 动作原样（stay at home）。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我宁愿走路。",
        tokens: ["I", "would", "rather", "walk."],
        distractors: ["to"],
        answer: "I would rather walk."
      },
      {
        promptZh: "你想说：我宁愿不出门。",
        tokens: ["I", "would", "rather", "not", "go", "out."],
        distractors: ["don't"],
        answer: "I would rather not go out."
      },
      {
        promptZh: "复习第 62 课：我想要一杯茶。",
        tokens: ["I", "would", "like", "a", "cup", "of", "tea."],
        distractors: ["want"],
        answer: "I would like a cup of tea."
      },
      {
        promptZh: "你想说：与其等着，我宁愿走。",
        tokens: ["I", "would", "rather", "walk", "than", "wait."],
        distractors: ["then"],
        answer: "I would rather walk than wait."
      }
    ],
    recall: {
      promptZh: "下雨天路上堵成一条龙，同学说打车去吧，你把伞撑开说了一句。凭记忆，写出你那句英文。",
      intentZh: "我宁愿走路。",
      answer: "I would rather walk.",
      noteZh: "rather 站在 would 后面——后面动作穿原样。"
    },
    huntCaseIds: ["hunt-would-rather-walk"]
  },

  // ══════════════ L177 · prefer ══════════════
  {
    id: "lesson-177-prefer",
    number: 177,
    title: "更喜欢茶",
    grammarLabel: "更喜欢 · prefer",
    episode: "小美的一天 一百七十七",
    scene: "city",
    sceneSetupZh: "茶铺老板娘问小美平时喝咖啡多还是喝茶多，小美想了想——两样都行，但她更常喝茶。",
    dialogueEn: "I prefer tea to coffee.",
    dialogueZh: "小美指了指玻璃罐里的茶叶。",
    intentZh: "比起咖啡，我更喜欢茶。",
    targetSentence: "I prefer tea to coffee.",
    blocks: [
      { text: "I prefer tea", role: "我更喜欢茶（prefer 站在两样中间）" },
      { text: "to coffee", role: "比起咖啡（to 把那一样带上）" }
    ],
    oneLineRule: "说「更喜欢」用 prefer——I prefer tea to coffee（比起咖啡我更喜欢茶）。两样东西中间站着 prefer，后面那半截用 to 领出来，不用 than。",
    examples: [
      { en: "I prefer tea to coffee.", zh: "比起咖啡，我更喜欢茶。" },
      { en: "She prefers walking to running.", zh: "比起跑步，她更喜欢走路。" },
      { en: "I would rather walk.", zh: "我宁愿走路。（第 176 课）" },
      { en: "I am taller than my brother.", zh: "我比我哥哥高。（第 17 课——那是比较，用 than）" }
    ],
    dialogue: [
      { who: "npc", en: "Coffee or tea?", zh: "老板娘擦了擦柜台问。" },
      { who: "npc", en: "Most people take coffee.", zh: "她指了指旁边的咖啡罐。" },
      { who: "me", en: "I prefer tea to coffee.", zh: "轮到你说了——比起咖啡，我更喜欢茶。" }
    ],
    contrast: [
      {
        wrong: "I prefer tea than coffee.",
        wrongMark: "than",
        correct: "I prefer tea to coffee.",
        whyZh: "prefer 后面那半截用 to 领——prefer tea 【to】 coffee。than 是第 17 课比较大小用的，prefer 不跟着它。"
      },
      {
        wrong: "I prefer tea to coffee.",
        wrongMark: null,
        correct: "I prefer tea to coffee.",
        bothRight: true,
        whyZh: "这句是对的——记住形状：prefer ＋ 更喜欢的那样 ＋ to ＋ 另一 样。"
      },
      {
        wrong: "I prefer drink tea.",
        wrongMark: "drink",
        correct: "I prefer tea.",
        whyZh: "prefer 后面可以直接跟东西（prefer tea）；要跟动作就穿 -ing（prefer walking）。光用原样（drink）两样都不像。"
      },
      {
        wrong: "I would rather walk.",
        wrongMark: null,
        correct: "I prefer tea to coffee.",
        bothRight: true,
        whyZh: "两句都对——第 176 课那个 would rather 是「宁愿」（当场做选择）；prefer 是「平时更喜欢」，说的是长期的偏好。"
      },
      {
        wrong: "I am taller than my brother.",
        wrongMark: null,
        correct: "I prefer tea to coffee.",
        bothRight: true,
        whyZh: "两句都对——第 17 课那句是用 than 比高矮；prefer 说的是喜好，后面用 to。"
      },
      {
        wrong: "I like tea.",
        wrongMark: null,
        correct: "I prefer tea to coffee.",
        bothRight: true,
        whyZh: "两句都对——like 只说「喜欢」；prefer 说了「两样里更喜欢哪一个」。"
      }
    ],
    variants: [
      { label: "肯定", en: "I prefer tea to coffee.", zh: "比起咖啡，我更喜欢茶。", noteZh: "prefer 后面那半截用 to。" },
      { label: "否定", en: "I don't prefer coffee.", zh: "我不太喜欢咖啡。", noteZh: "「不」用 don't。" },
      { label: "疑问", en: "Do you prefer tea to coffee?", zh: "比起咖啡你更喜欢茶吗？", noteZh: "Do 搬到句首。" }
    ],
    sceneSwings: [
      { sceneZh: "说更喜歡茶", en: "I prefer tea to coffee.", zh: "比起咖啡，我更喜欢茶。" },
      { sceneZh: "说她更喜欢走路", en: "She prefers walking to running.", zh: "比起跑步，她更喜欢走路。" },
      { sceneZh: "说宁愿走路（第 176 课）", en: "I would rather walk.", zh: "我宁愿走路。" }
    ],
    deepDive: {
      title: "宁愿、更喜欢、比较，三件事别混",
      paragraphs: [
        "第 17 课学过 than：I am taller than my brother.（我比哥哥高）。那是比大小、比高矮，后面用 than。",
        "第 176 课学过 would rather：I would rather walk.（我宁愿走路）。那是当场做选择——眼前两个选项，我挑这个。",
        "今天的 prefer 说的是第三种：平时的偏好。I prefer tea to coffee.（比起咖啡，我更喜欢茶）——不是今天这一杯，而是长期的口味。它后面那半截用 to 领，不用 than。",
        "形状记住三段：prefer ＋ 更喜欢的那样 ＋ to ＋ 另一 样。要跟动作就两头都穿 -ing：prefer walking to running。"
      ]
    },
    summary: {
      rule: "说「更喜欢」用 prefer ＋ 甲 ＋ to ＋ 乙——I prefer tea to coffee；那半截用 to，不用 than。",
      points: [
        "I prefer tea to coffee. —— 长期的偏好",
        "prefer tea than coffee ❌ —— 用 to，不用 than",
        "would rather（第 176 课·当场选）／ prefer（今天·平时更喜欢）"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：比起咖啡，我更喜欢茶。",
        before: "I prefer tea",
        after: "coffee.",
        options: ["to", "than", "and"],
        answer: "to",
        explain: "prefer 后面那半截用 to 领——prefer tea 【to】 coffee。than 是比大小用的。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：比起咖啡，我更喜欢茶。",
        tokens: ["I", "prefer", "tea", "to", "coffee."],
        answer: "I prefer tea to coffee.",
        explain: "更喜欢（prefer）＋ 茶（tea）＋ 比起（to）＋ 咖啡（coffee）——三段。"
      },
      {
        kind: "arrange",
        promptZh: "先复习一小步——第 17 课学过：我比我哥哥高。",
        tokens: ["I", "am", "taller", "than", "my", "brother."],
        answer: "I am taller than my brother.",
        explain: "复现第 17 课：比大小用 than；prefer 说的是喜好，那半截用 to。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "prefer", "tea", "than", "coffee."],
        wrongToken: "than",
        answer: "than",
        correctionZh: "把 than 换成 to：I prefer tea to coffee。",
        explain: "prefer 后面那半截用 to 领——than 是比大小用的。"
      },
      {
        kind: "arrange",
        promptZh: "再对照一句——第 176 课学过：我宁愿走路。",
        tokens: ["I", "would", "rather", "walk."],
        answer: "I would rather walk.",
        explain: "复现第 176 课：那句是当场做选择；今天说的是平时的偏好。"
      },
      {
        kind: "replace",
        promptZh: "句子换两样东西：「I prefer tea to coffee.」换成说她更喜欢走路，怎么变？",
        replaceBase: "I prefer tea to coffee.",
        replaceTarget: "换成说她比起跑步更喜欢走路",
        options: [
          "She prefers walking to running.",
          "She prefers walk to run.",
          "She prefers walking than running."
        ],
        answer: "She prefers walking to running.",
        explain: "换人换两样动作，两头都穿 -ing：prefers 【walking】 to 【running】——那半截照样用 to。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：比起咖啡，我更喜欢茶。",
        tokens: ["I", "prefer", "tea", "to", "coffee."],
        distractors: ["than"],
        answer: "I prefer tea to coffee."
      },
      {
        promptZh: "你想说：比起跑步，她更喜欢走路。",
        tokens: ["She", "prefers", "walking", "to", "running."],
        distractors: ["walk"],
        answer: "She prefers walking to running."
      },
      {
        promptZh: "复习第 17 课：我比我哥哥高。",
        tokens: ["I", "am", "taller", "than", "my", "brother."],
        distractors: ["to"],
        answer: "I am taller than my brother."
      },
      {
        promptZh: "你想问：比起咖啡你更喜欢茶吗？",
        tokens: ["Do", "you", "prefer", "tea", "to", "coffee?"],
        distractors: ["Does"],
        answer: "Do you prefer tea to coffee?"
      }
    ],
    recall: {
      promptZh: "茶铺老板娘问小美平时喝咖啡多还是喝茶多，你指了指玻璃罐里的茶叶。凭记忆，写出你那句英文。",
      intentZh: "比起咖啡，我更喜欢茶。",
      answer: "I prefer tea to coffee.",
      noteZh: "三段：prefer ＋ 甲 ＋ to ＋ 乙——那半截用 to，不用 than。"
    },
    huntCaseIds: ["hunt-prefer-tea"]
  },

  // ══════════════ L178 · 过去完成时 had done ══════════════
  {
    id: "lesson-178-had-done",
    number: 178,
    title: "到家才发现钥匙丢了",
    grammarLabel: "更早的那件 · had + 做过版",
    episode: "小美的一天 一百七十八",
    scene: "city",
    sceneSetupZh: "小美到家门口一摸口袋，心一沉——钥匙在放学路上就丢了。她站在门口给妈妈打电话，说的是那把钥匙「已经」丢了。",
    dialogueEn: "I had lost my key before I got home.",
    dialogueZh: "小美靠在门上给妈妈打电话。",
    intentZh: "到家之前我就把钥匙弄丢了。",
    targetSentence: "I had lost my key before I got home.",
    blocks: [
      { text: "I had lost my key", role: "我已经丢了钥匙（比「到家」更早的那件事）" },
      { text: "before I got home", role: "在我到家之前（后来才发现的那件事）" }
    ],
    oneLineRule: "两件过去的事排先后，更早那件用 had + 做过版——I had lost my key before I got home（到家之前我就把钥匙弄丢了）。第 21 课那个 have + 做过版说的是「到现在为止已经」，今天这个 had 是说「在那件事之前就已经」。",
    examples: [
      { en: "I had lost my key before I got home.", zh: "到家之前我就把钥匙弄丢了。" },
      { en: "She had finished her homework before dinner.", zh: "晚饭前她就把作业写完了。" },
      { en: "I have lost my key.", zh: "我丢了钥匙。（第 23 课——那是「到现在」）" },
      { en: "I was reading at eight.", zh: "八点的时候我正在看书。（第 95 课）" }
    ],
    dialogue: [
      { who: "npc", en: "Are you home?", zh: "妈妈在电话那头问。" },
      { who: "npc", en: "Have you found your key?", zh: "她听出小美声音不对。" },
      { who: "me", en: "I had lost my key before I got home.", zh: "轮到你说了——到家之前我就把钥匙弄丢了。" }
    ],
    contrast: [
      {
        wrong: "I had lose my key before I got home.",
        wrongMark: "lose",
        correct: "I had lost my key before I got home.",
        whyZh: "had 后面要跟做过版——had 【lost】。第 21 课那个 have + 做过版是同一条规矩，换成 had 也一样。"
      },
      {
        wrong: "I lost my key before I had got home.",
        wrongMark: "had got",
        correct: "I had lost my key before I got home.",
        whyZh: "前后两件要分主次：更早那件用 had（丢钥匙），后面那件用普通的过去式（到家）——before I 【got】 home。两个都加 had 就乱了。"
      },
      {
        wrong: "I have lost my key before I got home.",
        wrongMark: "have",
        correct: "I had lost my key before I got home.",
        whyZh: "两件都是过去的事，更早那件要用 had，不是 have——have 是在说「到现在为止」（第 23 课那种）。"
      },
      {
        wrong: "I have lost my key.",
        wrongMark: null,
        correct: "I had lost my key before I got home.",
        bothRight: true,
        whyZh: "两句都对——第 23 课那句是「（到现在）我丢了钥匙」；今天这句多说了一层「比到家更早」。"
      },
      {
        wrong: "I was reading at eight.",
        wrongMark: null,
        correct: "I had lost my key before I got home.",
        bothRight: true,
        whyZh: "两句都对——第 95 课那句说「那时正在做」（一直进行）；今天这句说「比那件事更早做完」。"
      },
      {
        wrong: "I have done my homework.",
        wrongMark: null,
        correct: "I had lost my key before I got home.",
        bothRight: true,
        whyZh: "两句都对——第 21 课那句是「已经做完」；今天这句是「在某个时间点之前就已经」。"
      }
    ],
    variants: [
      { label: "肯定", en: "I had lost my key before I got home.", zh: "到家之前我就把钥匙弄丢了。", noteZh: "had + 做过版，说更早那件。" },
      { label: "否定", en: "I hadn't lost my key.", zh: "我没丢钥匙。", noteZh: "说「不」用 hadn't。" },
      { label: "疑问", en: "Had she finished her homework?", zh: "她写完作业了吗？", noteZh: "Had 搬到句首。" }
    ],
    sceneSwings: [
      { sceneZh: "说到家之前就把钥匙丢了", en: "I had lost my key before I got home.", zh: "到家之前我就把钥匙弄丢了。" },
      { sceneZh: "说晚饭前她就把作业写完了", en: "She had finished her homework before dinner.", zh: "晚饭前她就把作业写完了。" },
      { sceneZh: "说我丢了钥匙（第 23 课）", en: "I have lost my key.", zh: "我丢了钥匙。" }
    ],
    deepDive: {
      title: "have 和 had，差在「站哪看」",
      paragraphs: [
        "第 21 课学过 have + 做过版：I have done my homework.（我已经写完作业了）。它是站在「现在」往回看——到现在为止，这件事做完了。",
        "今天这个 had + 做过版，是把那个「往回看」挪到过去某个时间点：I had lost my key before I got home.（到家之前我就把钥匙弄丢了）。站在「到家那一刻」往回看，丢钥匙已经发生了。",
        "所以规矩就一句：两件过去的事要分先后，更早那件用 had ＋ 做过版，晚一点那件用普通的过去式。I 【had lost】 my key before I 【got】 home——前面是 had，后面是普通的过去式。",
        "别把两件都加上 had：That's why I 【lost】 my key before I 【got】 home 里，只有更早那件该用 had。两个都加，听话的人就分不出哪件更早了。"
      ]
    },
    summary: {
      rule: "两件过去的事分先后：更早那件用 had ＋ 做过版，晚的那件用普通过去式——I had lost my key before I got home。",
      points: [
        "I had lost my key before I got home. —— 更早的那件",
        "I had lose my key ❌ —— had 后面跟做过版",
        "have lost（第 23 课·到现在）／ had lost（今天·到那时）"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：到家之前我就把钥匙弄丢了。",
        before: "I",
        after: "my key before I got home.",
        options: ["had lost", "have lost", "lose"],
        answer: "had lost",
        explain: "两件过去的事，更早那件用 had + 做过版——I 【had lost】 my key。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：到家之前我就把钥匙弄丢了。",
        tokens: ["I", "had", "lost", "my", "key", "before", "I", "got", "home."],
        answer: "I had lost my key before I got home.",
        explain: "更早那件（I had lost my key）＋ 晚一点那件（before I got home，用普通过去式）。"
      },
      {
        kind: "arrange",
        promptZh: "先复习一小步——第 23 课学过：我丢了钥匙。",
        tokens: ["I", "have", "lost", "my", "key."],
        answer: "I have lost my key.",
        explain: "复现第 23 课：那是站在「现在」往回看；今天把那个「往回看」挪到过去。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "had", "lose", "my", "key", "before", "I", "got", "home."],
        wrongToken: "lose",
        answer: "lose",
        correctionZh: "把 lose 换成 lost：I had lost my key。",
        explain: "had 后面要跟做过版——第 21 课那个 have + 做过版是同一条规矩。"
      },
      {
        kind: "arrange",
        promptZh: "再对照一句——第 95 课学过：八点的时候我正在看书。",
        tokens: ["I", "was", "reading", "at", "eight."],
        answer: "I was reading at eight.",
        explain: "复现第 95 课：那句说「那时正在做」；今天说「比那件事更早做完」。"
      },
      {
        kind: "replace",
        promptZh: "句子换事：「I had lost my key before I got home.」换成说她晚饭前写完作业，怎么变？",
        replaceBase: "I had lost my key before I got home.",
        replaceTarget: "换成说她晚饭前就把作业写完了",
        options: [
          "She had finished her homework before dinner.",
          "She has finished her homework before dinner.",
          "She had finish her homework before dinner."
        ],
        answer: "She had finished her homework before dinner.",
        explain: "换人换事，形状不变：had ＋ 做过版（had finished）＋ 晚那件用普通过去式。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：到家之前我就把钥匙弄丢了。",
        tokens: ["I", "had", "lost", "my", "key", "before", "I", "got", "home."],
        distractors: ["lose"],
        answer: "I had lost my key before I got home."
      },
      {
        promptZh: "你想说：晚饭前她就把作业写完了。",
        tokens: ["She", "had", "finished", "her", "homework", "before", "dinner."],
        distractors: ["finish"],
        answer: "She had finished her homework before dinner."
      },
      {
        promptZh: "复习第 23 课：我丢了钥匙。",
        tokens: ["I", "have", "lost", "my", "key."],
        distractors: ["had"],
        answer: "I have lost my key."
      },
      {
        promptZh: "你想问：她写完作业了吗？",
        tokens: ["Had", "she", "finished", "her", "homework?"],
        distractors: ["Have"],
        answer: "Had she finished her homework?"
      }
    ],
    recall: {
      promptZh: "小美到家门口一摸口袋，心一沉——钥匙在放学路上就丢了。凭记忆，写出她那句英文。",
      intentZh: "到家之前我就把钥匙弄丢了。",
      answer: "I had lost my key before I got home.",
      noteZh: "更早那件用 had ＋ 做过版；晚那件用普通过去式。"
    },
    huntCaseIds: ["hunt-had-lost-key"]
  },

  // ══════════════ L179 · shall（征求意见） ══════════════
  {
    id: "lesson-179-shall",
    number: 179,
    title: "我们走哪条路",
    grammarLabel: "征求意见 · Shall we…?",
    episode: "小美的一天 一百七十九",
    scene: "city",
    sceneSetupZh: "岔路口，两条路都能到地铁站：一条近但人多，一条绕但清静。小美看着同伴，把选择交给大家。",
    dialogueEn: "Shall we take the quiet way?",
    dialogueZh: "小美指了指那条绕远的小路。",
    intentZh: "我们走清静的那条好吗？",
    targetSentence: "Shall we take the quiet way?",
    blocks: [
      { text: "Shall we", role: "我们…好吗（征求意见的开头）" },
      { text: "take the quiet way?", role: "走清静的那条（后面动作穿原样）" }
    ],
    oneLineRule: "问「我们…好吗」用 Shall we——Shall we take the quiet way?（我们走清静的那条好吗？）。它和第 75 课那个 Let's 是一对：Let's 是「咱们去吧」，Shall we 是「咱们…行吗」——把决定权递出去。",
    examples: [
      { en: "Shall we take the quiet way?", zh: "我们走清静的那条好吗？" },
      { en: "Shall we go now?", zh: "我们现在走好吗？" },
      { en: "Let's go to the park.", zh: "咱们去公园吧。（第 75 课）" },
      { en: "Why don't you take a rest?", zh: "你怎么不歇一会儿？（第 168 课——那是劝对方）" }
    ],
    dialogue: [
      { who: "npc", en: "Which way?", zh: "同伴在岔路口停下来。" },
      { who: "npc", en: "The short one is crowded.", zh: "她往那条人多的小路看了看。" },
      { who: "me", en: "Shall we take the quiet way?", zh: "轮到你说了——我们走清静的那条好吗？" }
    ],
    contrast: [
      {
        wrong: "Shall we to take the quiet way?",
        wrongMark: "to",
        correct: "Shall we take the quiet way?",
        whyZh: "Shall we 后面那个动作穿原样，不垫 to——Shall we 【take】。"
      },
      {
        wrong: "Shall we taking the quiet way?",
        wrongMark: "taking",
        correct: "Shall we take the quiet way?",
        whyZh: "后面穿原样，不穿 -ing——Shall we 【take】。"
      },
      {
        wrong: "Shall you take the quiet way?",
        wrongMark: "you",
        correct: "Shall we take the quiet way?",
        whyZh: "Shall 后面站的是 we——它问的是「咱们一起…好吗」。要说对方，用第 168 课的 Why don't you。"
      },
      {
        wrong: "Let's go to the park.",
        wrongMark: null,
        correct: "Shall we take the quiet way?",
        bothRight: true,
        whyZh: "两句都对——第 75 课那句是「咱们去吧」（拿主意）；今天这句是「咱们…好吗」（把决定权递出去）。"
      },
      {
        wrong: "Why don't you take a rest?",
        wrongMark: null,
        correct: "Shall we take the quiet way?",
        bothRight: true,
        whyZh: "两句都对——第 168 课那句是劝对方做；今天这句是问「咱们一起做行吗」。"
      },
      {
        wrong: "Can I have a milk tea?",
        wrongMark: null,
        correct: "Shall we take the quiet way?",
        bothRight: true,
        whyZh: "两句都对——第 14 课那句是问「我能不能」；今天这句是问「咱们一起…行吗」。"
      }
    ],
    variants: [
      { label: "肯定", en: "Shall we take the quiet way?", zh: "我们走清静的那条好吗？", noteZh: "Shall we 后面穿原样。" },
      { label: "否定", en: "Shall we not go now?", zh: "我们现在别走好吗？", noteZh: "说「别」把 not 插在 we 后面。" },
      { label: "疑问", en: "Shall we go now?", zh: "我们现在走好吗？", noteZh: "换个动作照样用。" }
    ],
    sceneSwings: [
      { sceneZh: "问走清静的那条好吗", en: "Shall we take the quiet way?", zh: "我们走清静的那条好吗？" },
      { sceneZh: "问现在走好吗", en: "Shall we go now?", zh: "我们现在走好吗？" },
      { sceneZh: "说咱们去公园吧（第 75 课）", en: "Let's go to the park.", zh: "咱们去公园吧。" }
    ],
    deepDive: {
      title: "拿主意和递决定权",
      paragraphs: [
        "第 75 课学过 Let's：Let's go to the park.（咱们去公园吧）。它是「拿主意」——我先定了，你来跟。",
        "Shall we 换了个位置：Shall we take the quiet way?（我们走清静的那条好吗？）——把它变成一个问句，决定权递出去，让对方说行不行。中文里最接近的是「咱们…好吗」「要不咱们…」。",
        "用法上和 Let's 一样简单：后面那个动作穿原样（Shall we take，不是 to take 也不是 taking）；Shall 后面固定是 we，因为问的是「咱们一起」。",
        "想说对方一个人该做什么，用第 168 课的 Why don't you；想说自己想做什么，用第 62 课的 I would like。三个都跟「提要求」有关，看你把谁放进句子里。"
      ]
    },
    summary: {
      rule: "问「咱们…好吗」用 Shall we + 动作原样——Shall we take the quiet way?；Shall 后面固定是 we。",
      points: [
        "Shall we take the quiet way? —— 把决定权递出去",
        "Shall we to take ❌ —— 后面穿原样",
        "Let's（第 75 课·拿主意）／ Shall we（今天·问行不行）／ Why don't you（第 168 课·劝对方）"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我们走清静的那条好吗？",
        before: "",
        after: "take the quiet way?",
        options: ["Shall we", "Shall you", "Will we"],
        answer: "Shall we",
        explain: "问「咱们一起…好吗」用 Shall we——Shall 【we】 take。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我们走清静的那条好吗？",
        tokens: ["Shall", "we", "take", "the", "quiet", "way?"],
        answer: "Shall we take the quiet way?",
        explain: "咱们…好吗（Shall we）＋ 走清静的那条（take the quiet way，穿原样）。"
      },
      {
        kind: "arrange",
        promptZh: "先复习一小步——第 75 课学过：咱们去公园吧。",
        tokens: ["Let's", "go", "to", "the", "park."],
        answer: "Let's go to the park.",
        explain: "复现第 75 课：那句是「拿主意」；今天把它变成问句。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["Shall", "we", "to", "take", "the", "quiet", "way?"],
        wrongToken: "to",
        answer: "to",
        correctionZh: "把 to 去掉：Shall we take the quiet way?",
        explain: "Shall we 后面穿原样，不垫 to。"
      },
      {
        kind: "arrange",
        promptZh: "再对照一句——第 168 课学过：你怎么不歇一会儿？",
        tokens: ["Why", "don't", "you", "take", "a", "rest?"],
        answer: "Why don't you take a rest?",
        explain: "复现第 168 课：那句是劝对方；今天这句是问「咱们一起」。"
      },
      {
        kind: "replace",
        promptZh: "句子换动作：「Shall we take the quiet way?」把动作换成「现在走」，怎么变？",
        replaceBase: "Shall we take the quiet way?",
        replaceTarget: "把动作换成「现在走」",
        options: ["Shall we go now?", "Shall we to go now?", "Shall we going now?"],
        answer: "Shall we go now?",
        explain: "换动作只换后面那截，照样穿原样——Shall we 【go】 now。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我们走清静的那条好吗？",
        tokens: ["Shall", "we", "take", "the", "quiet", "way?"],
        distractors: ["to"],
        answer: "Shall we take the quiet way?"
      },
      {
        promptZh: "你想说：我们现在走好吗？",
        tokens: ["Shall", "we", "go", "now?"],
        distractors: ["going"],
        answer: "Shall we go now?"
      },
      {
        promptZh: "复习第 75 课：咱们去公园吧。",
        tokens: ["Let's", "go", "to", "the", "park."],
        distractors: ["Shall"],
        answer: "Let's go to the park."
      },
      {
        promptZh: "你想说：我们现在别走好吗？",
        tokens: ["Shall", "we", "not", "go", "now?"],
        distractors: ["don't"],
        answer: "Shall we not go now?"
      }
    ],
    recall: {
      promptZh: "岔路口两条路都能到地铁站，你把选择交给同伴。凭记忆，写出你那句英文。",
      intentZh: "我们走清静的那条好吗？",
      answer: "Shall we take the quiet way?",
      noteZh: "Shall 后面固定是 we——后面动作穿原样。"
    },
    huntCaseIds: ["hunt-shall-we-quiet"]
  }
];
