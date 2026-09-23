#!/usr/bin/env bash
# 瑞思 · 第 50 批（审计口径的系统性复盘）—— 全部核查命令。**只读**，不改任何代码 / 数据。
#
# 口径声明（重要）：
#   ① 全部脚本经 vite-node 载入**真实数据模块**（src/data/grammarLessons.ts / huntCases.ts），
#      拿到的是运行时对象，不存在「扫到注释或代码」的污染。
#   ② 词形计数一律用 **node 词边界正则** `(?<![A-Za-z-])W(?![A-Za-z-])`（视需要加 i 旗标）。
#      **刻意不用 grep**：本机 grep 是 ugrep，对这类模式会假返回 0。
#   ③ 全库量级（本批实测）：grammarLessons 204 课 / huntCases 213 案 / 季分组 28 季 /
#      对照卡 1228 张 / 有值 wrongMark 674 张 / HuntError 796 处。

set -u
cd /Users/liujun/Documents/英语听写
D=deliverables/product-strategy
V=./node_modules/.bin/vite-node

echo "### 环境"
node --version
$V --version
echo

echo "### a · 三类语义全库回扫（六种判定约定并列，看数字随口径移动）"
$V $D/.audit50-brute2.mts

echo "### b · 反解 499 / 110 / 65 是哪一种约定"
$V $D/.audit50-final.mts

echo "### c · 独立复现任务书口径 T + 第三桶 65 的真实身份"
$V $D/.audit50-t.mts

echo "### d · 第四类：按「标注词在编辑里演什么角色」切（LCS 编辑脚本 + 交叉表）"
$V $D/.audit50-axis.mts
$V $D/.audit50-cross.mts

echo "### e · 170 张「两边都有」的机制再切 + 两个疑似异常复核"
$V $D/.audit50-decomp.mts

echo "### f · 「两个 65」是否为同一批卡（决定能否断定第三桶身份）"
$V $D/.audit50-65.mts

echo "### g · 52 张无标注卡是否真的都是「缺了一块」（UI 无条件渲染这句）"
$V $D/.audit50-nomark.mts

echo "### h · 【】 与 wrongMark 不一致条数 + 字段分布（零机器消费方）"
$V $D/.audit50-wrongmark-classes.mts

echo "### h2 · 【】 规模与不一致张数的精确复核（报告 §3.2 用数）"
$V $D/.audit50-verify-report.mts

echo "### h3 · 【】 里的内容对应编辑的哪一半（推翻「【】=缺块」）"
$V $D/.audit50-bracket.mts

echo "### i · 渲染层：UI 用 indexOf（子串语义）划词的实际后果"
$V $D/.audit50-uirender.mts
$V $D/.audit50-render.mts

echo "### j · 字段语义未文档化扫描（guided.answer 按 kind / 各接口注释覆盖）"
$V $D/.audit50-fields.mts

echo "### k · types.ts 注释里的数字 vs 现库（注释漂移）"
$V $D/.audit50-docdrift.mts

echo "### l · HuntError.correction 的语义家族（换词 / 删除 / 移动混用）"
$V $D/.audit50-hunt.mts

echo "### m · spot 题 answer 与 wrongToken 的逐字差（L96 / L102）"
$V $D/.audit50-spot2.mts

echo "### n · practice / guided 的 distractors 机制核对"
$V $D/.audit50-distract.mts

echo "### o · 全库量级 + 对照卡二分/题型分布（报告 §5.1 用数）"
$V $D/.audit50-cnt.mts
$V $D/.audit50-final-check.mts

echo
echo "### 既有守门回归（当前有 1 项**预先存在**的失败，见报告 §7.9——与本批无关）"
./node_modules/.bin/vitest run src/data/grammarLessons.test.ts src/services/huntService.test.ts 2>&1 | tail -20
