/**
 * P2-3 内置精选词书：四级 / 六级 / 考研高频各 30 词，解决冷启动空词库。
 * 三包词汇互不重复；音标/词性在装入时由 hydrateWordInput 按内置词典补齐。
 */

export interface BuiltinBookWord {
  word: string;
  translation: string;
}

export interface BuiltinBookPack {
  /** 稳定 id，装入后词书 id = `builtin-${id}`（幂等判断依据）。 */
  id: string;
  title: string;
  description: string;
  color: string;
  words: BuiltinBookWord[];
}

const cet4Words: BuiltinBookWord[] = [
  { word: "abandon", translation: "放弃；抛弃" },
  { word: "ability", translation: "能力；才能" },
  { word: "academic", translation: "学术的；学业的" },
  { word: "access", translation: "进入；使用权；存取" },
  { word: "accomplish", translation: "完成；实现" },
  { word: "account", translation: "账户；说明；解释" },
  { word: "accurate", translation: "准确的；精确的" },
  { word: "achieve", translation: "实现；取得" },
  { word: "adapt", translation: "适应；改编" },
  { word: "adequate", translation: "足够的；胜任的" },
  { word: "adjust", translation: "调整；适应" },
  { word: "advance", translation: "前进；进展；提前" },
  { word: "advantage", translation: "优势；好处" },
  { word: "affect", translation: "影响；感动" },
  { word: "afford", translation: "负担得起；提供" },
  { word: "ambition", translation: "雄心；抱负" },
  { word: "amount", translation: "数量；总计" },
  { word: "analyze", translation: "分析" },
  { word: "announce", translation: "宣布；通告" },
  { word: "annual", translation: "每年的；年度的" },
  { word: "anxious", translation: "焦虑的；渴望的" },
  { word: "apologize", translation: "道歉" },
  { word: "apparent", translation: "明显的；表面上的" },
  { word: "apply", translation: "申请；应用；涂敷" },
  { word: "approach", translation: "接近；方法；处理" },
  { word: "appropriate", translation: "合适的；恰当的" },
  { word: "aspect", translation: "方面；外观" },
  { word: "assign", translation: "分配；指派" },
  { word: "assume", translation: "假定；承担" },
  { word: "attitude", translation: "态度；看法" }
];

const cet6Words: BuiltinBookWord[] = [
  { word: "abstract", translation: "抽象的；摘要" },
  { word: "abundant", translation: "丰富的；充裕的" },
  { word: "accelerate", translation: "加速；促进" },
  { word: "accommodate", translation: "容纳；适应；提供住宿" },
  { word: "accumulate", translation: "积累；堆积" },
  { word: "acknowledge", translation: "承认；致谢" },
  { word: "acquire", translation: "获得；习得" },
  { word: "advocate", translation: "提倡；拥护者" },
  { word: "alleviate", translation: "减轻；缓解" },
  { word: "allocate", translation: "分配；拨给" },
  { word: "ambiguous", translation: "含糊的；有歧义的" },
  { word: "anticipate", translation: "预期；预料" },
  { word: "appreciate", translation: "欣赏；感激；理解" },
  { word: "approximate", translation: "近似的；大约的" },
  { word: "arbitrary", translation: "任意的；武断的" },
  { word: "assemble", translation: "集合；组装" },
  { word: "assert", translation: "断言；坚持" },
  { word: "assess", translation: "评估；评定" },
  { word: "associate", translation: "联想；交往；同事" },
  { word: "assure", translation: "使确信；保证" },
  { word: "attain", translation: "达到；获得" },
  { word: "attribute", translation: "归因于；属性" },
  { word: "compel", translation: "强迫；迫使" },
  { word: "compensate", translation: "补偿；赔偿" },
  { word: "compile", translation: "编纂；汇编" },
  { word: "complement", translation: "补充；补足物" },
  { word: "comply", translation: "遵守；服从" },
  { word: "conceive", translation: "构想；怀孕；想象" },
  { word: "confer", translation: "授予；商议" },
  { word: "confine", translation: "限制；禁闭" }
];

const kaoyanWords: BuiltinBookWord[] = [
  { word: "adhere", translation: "坚持；粘附" },
  { word: "adjacent", translation: "邻近的；毗连的" },
  { word: "administer", translation: "管理；施行" },
  { word: "adolescent", translation: "青少年；青春期的" },
  { word: "adverse", translation: "不利的；相反的" },
  { word: "aesthetic", translation: "美学的；审美的" },
  { word: "affiliate", translation: "使隶属；附属机构" },
  { word: "agenda", translation: "议程；日程" },
  { word: "agony", translation: "极度痛苦" },
  { word: "aisle", translation: "过道；通道" },
  { word: "album", translation: "相册；专辑" },
  { word: "alien", translation: "外国的；陌生的；外星人" },
  { word: "alliance", translation: "联盟；结盟" },
  { word: "allowance", translation: "津贴；零用钱；限额" },
  { word: "alongside", translation: "在旁边；与……一起" },
  { word: "alter", translation: "改变；改动" },
  { word: "alternate", translation: "交替的；轮流" },
  { word: "amateur", translation: "业余爱好者；业余的" },
  { word: "ambassador", translation: "大使；使节" },
  { word: "amend", translation: "修正；修订" },
  { word: "amplify", translation: "放大；详述" },
  { word: "analogy", translation: "类比；相似" },
  { word: "ancestor", translation: "祖先；先辈" },
  { word: "anchor", translation: "锚；主播；抛锚" },
  { word: "anecdote", translation: "轶事；趣闻" },
  { word: "anonymous", translation: "匿名的；无名的" },
  { word: "apparatus", translation: "仪器；装置" },
  { word: "appendix", translation: "附录；阑尾" },
  { word: "applaud", translation: "鼓掌；称赞" },
  { word: "appraisal", translation: "评价；鉴定" }
];

export const BUILTIN_BOOK_PACKS: BuiltinBookPack[] = [
  {
    id: "cet4",
    title: "四级高频 30",
    description: "内置精选 · 四级考试最高频的 30 个核心词",
    color: "#3157d5",
    words: cet4Words
  },
  {
    id: "cet6",
    title: "六级高频 30",
    description: "内置精选 · 六级考试最高频的 30 个核心词",
    color: "#7c3aed",
    words: cet6Words
  },
  {
    id: "kaoyan",
    title: "考研高频 30",
    description: "内置精选 · 考研英语最高频的 30 个核心词",
    color: "#0f766e",
    words: kaoyanWords
  }
];
