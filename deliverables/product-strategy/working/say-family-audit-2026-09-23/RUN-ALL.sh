#!/usr/bin/env bash
# 第 49 批 · say 家族形状不均衡核查 —— 全部核查命令（**只读**，不改任何代码/数据）
#
# 口径声明（重要）：
#   本批全部词形计数一律用 **node 词边界正则** `(?<![A-Za-z-])FORM(?![A-Za-z-])`（i 旗标）。
#   **刻意不用 grep**：本机 grep 是 ugrep，对这类模式会假返回 0。
#   所有脚本经 vite-node 载入真实数据模块（src/data/grammarLessons.ts、src/data/huntCases.ts），
#   不是文本扫描——因此拿到的是**运行时对象**，不存在「扫到注释/代码」的污染。
#
# 排除的两类（任务书要求）：
#   ① guided[kind=spot].answer —— 它在数据里 === wrongToken，是让用户点出的**错词**
#   ② contrast[].wrong 且 bothRight===true —— 该字段装的是**正确句**（见 src/types.ts 批四十七注释）

set -u
cd /Users/liujun/Documents/英语听写
D=deliverables/product-strategy/working/say-family-audit-2026-09-23
V=./node_modules/.bin/vite-node

echo "### 环境"
node --version
$V --version
echo

echo "### s01 · 四口径阶梯（V0 原始 / V1 内容字段 / V2 正错二分 / V3 权威口径）"
$V $D/s01-scan.ts

echo "### s02 · 关键课结构 + L197-L204 家族 + 案件全文"
$V $D/s02-keylessons.ts

echo "### s03 · 句子级去重 + 案件里的 say 家族真实曝光"
$V $D/s03-sentences.ts

echo "### s04 · Cambridge《Say or tell》逐字摘取（先在 HTML 上定位 → 会漏检，见 s04c）"
$V $D/s04-cambridge-extract.ts

echo "### s04b · 同上，局部剥标签版"
$V $D/s04b-cambridge-verbatim.ts

echo "### s04c · ✅ 正确做法：先转纯文本再定位（本报告引用以 s04c 为准）"
$V $D/s04c-cambridge-text.ts

echo "### s05 · Cambridge 词典 say / said 词条 + Oxford say_1（curl 200）"
$V $D/s05-dict-excerpt.ts

echo "### s06 · 时序审计（v1，含口径 bug：把 errors[].correction 误当曝光）"
$V $D/s06-harm-path.ts

echo "### s07 · 对照卡「单点可修」核查 + L38 八卡逐张"
$V $D/s07-card-audit.ts

echo "### s08 · ⭐ 时序审计（v2，修正口径）+ wore/said/told 三条对照"
$V $D/s08-timeline.ts

echo "### s09 · 同课自相矛盾（判据 A 过宽，保留以说明收窄过程）"
$V $D/s09-selfcontradiction.ts

echo "### s10 · 收窄判据 C / D"
$V $D/s10-narrow.ts

echo "### s11 · 若挂靠 L38 的 8 项守门预演"
$V $D/s11-gate-preview.ts

echo "### s12 · 错卡编辑类型分布 + 补词型划线落点"
$V $D/s12-mark-placement.ts

echo "### s13 · ⭐ gap 指标（被要求 → 其后首次见到正确用法）"
$V $D/s13-gap-metric.ts

echo "### s14 · ⭐ 槽位计数 vs 去重句子计数"
$V $D/s14-dedup.ts

echo "### s15 · 与任务书对账 + 回流配对"
$V $D/s15-reconcile.ts

echo "### s16 · 逐槽位分解 + 穷举字段组合"
$V $D/s16-exhaustive.ts

echo "### s17 · ⭐ 口径精确定位（复现任务书 2/21/1）+ 划线词与讲解对齐"
$V $D/s17-mark-align.ts

echo "### s18 · 任务书口径确认 + says=21 的构成拆解 + said 是否被要求产出"
$V $D/s18-final.ts

echo "### s19 · contrast[6] 真实编辑结构 + 建议改法"
$V $D/s19-fix-recommend.ts

echo "### s20 · 诚实核查（多改动卡惯例）"
$V $D/s20-honest.ts

echo "### s21 · 精确错位判据（X 划线点 vs Y 讲解点）"
$V $D/s21-precise.ts

echo "### s22 · 「教的特征在正确侧缺席」初筛（过宽）"
$V $D/s22-feature-absent.ts

echo "### s23 · ⭐ 收窄为类型乙（该补 to 但 correct 也无 to）"
$V $D/s23-refine.ts

echo "### s24 · ⭐ 自查更正：修正 s09-D 的「碎片入池」瑕疵（28 处 → 4 处）"
$V $D/s24-clash-recheck.ts

echo
echo "### 既有守门回归（证明当前全库 35 条断言 + 31 条案件断言全绿）"
./node_modules/.bin/vitest run src/data/grammarLessons.test.ts src/services/huntService.test.ts

echo
echo "### 外部源可达性记录"
echo "-- Cambridge（curl 可达）"
curl -s -o /dev/null -w "  say-or-tell            HTTP=%{http_code}\n" -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36" "https://dictionary.cambridge.org/grammar/british-grammar/say-or-tell"
curl -s -o /dev/null -w "  dictionary/english/say HTTP=%{http_code}\n" -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36" "https://dictionary.cambridge.org/dictionary/english/say"
curl -s -o /dev/null -w "  dictionary/english/said HTTP=%{http_code}\n" -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36" "https://dictionary.cambridge.org/dictionary/english/said"
echo "-- Oxford（curl 可达）"
curl -s -o /dev/null -w "  say_1                  HTTP=%{http_code}\n" -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36" "https://www.oxfordlearnersdictionaries.com/definition/english/say_1"
echo "-- British Council（本机 curl 抓不到；经 WebFetch 服务端代取可读）"
curl -s -o /dev/null -w "  irregular-verbs        HTTP=%{http_code}\n" "https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/irregular-verbs"
curl -s -o /dev/null -w "  reported-speech        HTTP=%{http_code}\n" "https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/reported-speech"
echo "-- 中文侧"
curl -s -o /dev/null -w "  iciba w=say            HTTP=%{http_code}\n" -A "Mozilla/5.0" "https://www.iciba.com/word?w=say"
