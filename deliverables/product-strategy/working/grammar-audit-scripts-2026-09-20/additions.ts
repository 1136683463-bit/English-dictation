/**
 * L145–L160 补 C 层新句（阶段一 · 末段可抄率治理）
 *
 * 逐课分析每课的「已用句」后重新设计——避免撞目标句/例句/变体/场景/现有练习题。
 * 纪律：中文提示与英文答案必须语义一致（最高优先级）。
 */
export interface CAddition {
  n: number;
  promptZh: string;
  tokens: string[];
  distractors: string[];
  answer: string;
}

export const LATE_C_ADDITIONS: CAddition[] = [
  // ── L145 too 站句尾 ── 已用: I like tea too / Drawing is fun too / I want one too / Do you like tea too
  { n: 145, promptZh: "说你也是这个爱好，你想说：我也喜欢音乐。",
    tokens: ["I", "like", "music", "too."], distractors: ["either"], answer: "I like music too." },
  { n: 145, promptZh: "说他也想要一个，你想说：他也想要一个。",
    tokens: ["He", "wants", "one", "too."], distractors: ["either"], answer: "He wants one too." },

  // ── L147 收口（也的两张脸）── 已用: I like tea too / I don't like coffee either / Drawing is fun too / I don't have anything for you / I want one too
  { n: 147, promptZh: "说我也不要这个，你想说：我也不要这个。",
    tokens: ["I", "don't", "want", "one", "either."], distractors: ["too"], answer: "I don't want one either." },
  { n: 147, promptZh: "说她也不喜欢咖啡，你想说：她也不喜欢咖啡。",
    tokens: ["She", "doesn't", "like", "coffee", "either."], distractors: ["too"], answer: "She doesn't like coffee either." },

  // ── L148 both ── 已用: Both books are good / Both are good / We are happy / I ate two sandwiches / Are both books good
  { n: 148, promptZh: "说两个都是新的，你想说：两个都是新的。",
    tokens: ["Both", "are", "new."], distractors: ["All"], answer: "Both are new." },
  { n: 148, promptZh: "说两本书都是新的，你想说：两本书都是新的。",
    tokens: ["Both", "books", "are", "new."], distractors: ["All"], answer: "Both books are new." },

  // ── L151 all ── 已用: All the books are good / All my books are new / All three are good / Both books are good / Are all the books good
  { n: 151, promptZh: "说所有学生都到了，你想说：所有学生都到了。",
    tokens: ["All", "the", "students", "are", "here."], distractors: ["Both"], answer: "All the students are here." },
  { n: 151, promptZh: "说所有书都是好的，你想说：所有书都是好的。",
    tokens: ["All", "the", "books", "are", "nice."], distractors: ["Both"], answer: "All the books are nice." },

  // ── L152 every ── 已用: Every student is here / All the students are here / I go to school every day / Every book is good / Is every student here
  { n: 152, promptZh: "说每本书都是新的，你想说：每本书都是新的。",
    tokens: ["Every", "book", "is", "new."], distractors: ["All"], answer: "Every book is new." },
  { n: 152, promptZh: "说她每天都读书，你想说：她每天都读书。",
    tokens: ["She", "reads", "every", "day."], distractors: ["read"], answer: "She reads every day." },

  // ── L154 still ── 已用: She is still waiting / She hasn't come yet / I have already eaten / I was reading at eight / Is she still waiting
  { n: 154, promptZh: "说弟弟还在睡，你想说：他还在睡。",
    tokens: ["He", "is", "still", "sleeping."], distractors: ["yet"], answer: "He is still sleeping." },
  { n: 154, promptZh: "问同学还在等吗，你想问：你还在等吗？",
    tokens: ["Are", "you", "still", "waiting?"], distractors: ["Does"], answer: "Are you still waiting?" },

  // ── L155 ago ── 已用: She left three days ago / She left two hours ago / I watched TV / It takes ten minutes / Did she leave three days ago
  { n: 155, promptZh: "说他两天前来的，你想说：他两天前来的。",
    tokens: ["He", "came", "two", "days", "ago."], distractors: ["before"], answer: "He came two days ago." },
  { n: 155, promptZh: "说我一个小时前走的，你想说：我一个小时前走的。",
    tokens: ["I", "left", "an", "hour", "ago."], distractors: ["before"], answer: "I left an hour ago." },

  // ── L156 for ── 已用: I waited for an hour / She left three days ago / I waited for two hours / It takes an hour by bus / Did you wait for an hour
  { n: 156, promptZh: "说她等了三个小时，你想说：她等了三个小时。",
    tokens: ["She", "waited", "for", "three", "hours."], distractors: ["ago"], answer: "She waited for three hours." },
  { n: 156, promptZh: "说我们等了十分钟，你想说：我们等了十分钟。",
    tokens: ["We", "waited", "for", "ten", "minutes."], distractors: ["ago"], answer: "We waited for ten minutes." },

  // ── L158 nobody ── 已用: Nobody is at home / Nobody is here / None of the cups are mine / Someone is at the door / Is anyone at home
  { n: 158, promptZh: "说屋里一个人都没有，你想说：屋里一个人都没有。",
    tokens: ["Nobody", "is", "in", "the", "room."], distractors: ["are"], answer: "Nobody is in the room." },
  { n: 158, promptZh: "问盒子里有沒有人，你想问：盒子里有人吗？",
    tokens: ["Is", "anyone", "in", "the", "box?"], distractors: ["Are"], answer: "Is anyone in the box?" },

  // ── L159 look like ── 已用: It looks like a boat / It looks like a cat / The sky looks dark / You look tired / Does it look like a boat
  { n: 159, promptZh: "说这朵云像一只鸟，你想说：它看起来像一只鸟。",
    tokens: ["It", "looks", "like", "a", "bird."], distractors: ["look"], answer: "It looks like a bird." },
  { n: 159, promptZh: "说她看起来很累，你想说：她看起来很累。",
    tokens: ["She", "looks", "tired."], distractors: ["look"], answer: "She looks tired." },

  // ── L160 seem to ── 已用: He seems to know you / She seems to like the boat / I want to go / It looks like a boat / Does he seem to know you
  { n: 160, promptZh: "说她好像很开心，你想说：她好像很开心。",
    tokens: ["She", "seems", "to", "be", "happy."], distractors: ["seem"], answer: "She seems to be happy." },
  { n: 160, promptZh: "说他好像认识路，你想说：他好像认识路。",
    tokens: ["He", "seems", "to", "know", "the", "way."], distractors: ["seem"], answer: "He seems to know the way." },
];
