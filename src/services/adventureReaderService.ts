export const splitAdventureSentences = (text: string) => {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (!normalized) return [];

  const sentences: string[] = [];
  let start = 0;
  let insideDoubleQuote = false;

  for (let index = 0; index < normalized.length; index += 1) {
    if (normalized[index] === '"') {
      insideDoubleQuote = !insideDoubleQuote;
      continue;
    }
    if (!".!?".includes(normalized[index])) continue;

    let boundary = index + 1;
    while (boundary < normalized.length && "\"')]".includes(normalized[boundary])) boundary += 1;
    const closesDoubleQuote = normalized.slice(index + 1, boundary).includes('"');
    if (insideDoubleQuote && !closesDoubleQuote) continue;
    if (boundary < normalized.length && !/\s/.test(normalized[boundary])) continue;

    sentences.push(normalized.slice(start, boundary).trim());
    start = boundary;
    if (closesDoubleQuote) insideDoubleQuote = false;
    index = boundary - 1;
  }

  const trailing = normalized.slice(start).trim();
  if (trailing) sentences.push(trailing);
  return sentences;
};

export const groupAdventureSentences = (sentences: string[], sentencesPerParagraph = 3) => {
  const size = Math.max(1, Math.round(sentencesPerParagraph));
  const groups: string[][] = [];
  for (let index = 0; index < sentences.length; index += size) {
    groups.push(sentences.slice(index, index + size));
  }
  return groups;
};

export const getReadingProgress = (sentenceIndex: number, sentenceCount: number) => {
  if (sentenceCount <= 0 || sentenceIndex < 0) return 0;
  return Math.min(100, Math.round(((sentenceIndex + 1) / sentenceCount) * 100));
};
