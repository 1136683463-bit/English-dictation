import { addWordsBatchWithAudio, hydrateWordInput, type WordInput } from "./cardService";
import { nowIso } from "./storage";
import { AppData, Settings, Unit } from "../types";
import type { BuiltinBookPack } from "../data/builtinBooks";

/**
 * P2-3 内置精选词书：一键装入四级/六级/考研高频包，解决冷启动空词库。
 * 词书 id 确定性（`builtin-${packId}`），重复装入幂等跳过。
 */

export const builtinUnitIdFor = (packId: string) => `builtin-${packId}`;

export const isBuiltinPackInstalled = (data: AppData, packId: string): boolean =>
  data.units.some((unit) => unit.id === builtinUnitIdFor(packId));

export interface BuiltinInstallResult {
  data: AppData;
  /** false = 已安装过或包为空，原样返回。 */
  installed: boolean;
  /** 本次入库词数（created + merged）。 */
  wordCount: number;
}

/** 装入一个内置词书包（走与文件导入一致的 hydrate + 批量入库 + 配音链路）。 */
export const installBuiltinBook = async (
  data: AppData,
  pack: BuiltinBookPack,
  lang?: Settings["speechLang"]
): Promise<BuiltinInstallResult> => {
  if (pack.words.length === 0 || isBuiltinPackInstalled(data, pack.id)) {
    return { data, installed: false, wordCount: 0 };
  }

  const timestamp = nowIso();
  const unitId = builtinUnitIdFor(pack.id);
  const maxOrder = data.units.reduce((max, unit) => Math.max(max, unit.order), 0);
  const unit: Unit = {
    id: unitId,
    title: pack.title,
    description: `内置精选 · ${pack.words.length} 词`,
    order: maxOrder + 1,
    color: pack.color,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  const withUnit: AppData = { ...data, units: [...data.units, unit] };

  const wordInputs: WordInput[] = pack.words.map((word) => {
    const hydrated = hydrateWordInput(withUnit, word.word);
    return {
      ...hydrated,
      translation: word.translation.trim() || hydrated.translation,
      unitId,
      note: `内置精选：${pack.title}`,
      tags: "内置精选"
    };
  });

  const result = await addWordsBatchWithAudio(withUnit, wordInputs, lang, { maxAudioLookups: 30 });
  return { data: result.data, installed: true, wordCount: result.created + result.merged };
};
