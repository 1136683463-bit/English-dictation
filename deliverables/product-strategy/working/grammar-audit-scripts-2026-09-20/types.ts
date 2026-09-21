/** 新增课程类型（供批次定义共用） */
export interface NewLesson {
  id: string; number: number; title: string; grammarLabel: string; episode: string; scene: string;
  sceneSetupZh: string; dialogueEn: string; dialogueZh: string; intentZh: string; targetSentence: string;
  blocks: { text: string; role: string }[];
  oneLineRule: string;
  examples: { en: string; zh: string }[];
  dialogue: { who: string; en: string; zh: string }[];
  contrast: { wrong: string; wrongMark: string | null; correct: string; whyZh: string; bothRight?: boolean }[];
  variants: { label: string; en: string; zh: string; noteZh: string }[];
  sceneSwings: { sceneZh: string; en: string; zh: string }[];
  deepDive: { title: string; paragraphs: string[] };
  summary: { rule: string; points: string[] };
  guided: any[];
  practice: { promptZh: string; tokens: string[]; distractors: string[]; answer: string }[];
  recall: { promptZh: string; intentZh: string; answer: string; noteZh: string };
  huntCaseIds: string[];
}
