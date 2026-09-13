#!/usr/bin/env python3
# D1/D2 决策门核验脚本（数析口径，decision-gate-d1-grammar-2026-09-13.md）
# 用法：python3 scripts/check_gate.py grammar-telemetry-*.json [--lessons lesson-21-have-done,...]
# 输入：应用内「导出遥测」生成的 JSON（含 events / archivedEvents）
# 输出：D1 放行条件逐项核验 + 止损触发器检查 + 六段 dwell 对照预算表
import json, sys, statistics
from collections import defaultdict

# D1 放行条件阈值（数析裁决）
DURATION_PASS = 360        # 首轮完课时长中位数 ≥360s 达标
DURATION_STOP_LOSS = 270   # <270s（4.5min）触发止损档
PRACTICE_MIN, PRACTICE_MAX = 0.70, 0.85
PRACTICE_STOP_LOSS = 0.92  # practice 一次通过率 >92%（回到零摩擦）触发止损
OUTPUT_MIN, OUTPUT_MAX = 0.30, 0.50

# 六段预算表（PRD §7，秒）
SECTION_BUDGET = {
    "watch": (90, 140), "guided": (50, 80), "recall": (40, 60),
    "practice": (100, 160), "output": (50, 80), "challenge": (60, 110),
}

DEFAULT_LESSONS = ["lesson-21-have-done", "lesson-22-been-to", "lesson-23-have-lost", "lesson-24-past-vs-perfect"]


def load_events(paths):
    events = []
    for path in paths:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        events.extend(data.get("events", []))
        events.extend(data.get("archivedEvents", []))
    # 去重（多份导出可能重叠）：以 (kind, ts, lessonId/caseId, stepIndex) 为键
    seen, unique = set(), []
    for e in events:
        key = (e.get("kind"), e.get("ts") or e.get("completedAt"), e.get("lessonId") or e.get("caseId"), e.get("stepIndex"), e.get("dwellMs"), e.get("tokenIndex"))
        if key in seen:
            continue
        seen.add(key)
        unique.append(e)
    return unique


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    lessons = DEFAULT_LESSONS
    for a in sys.argv[1:]:
        if a.startswith("--lessons="):
            lessons = a.split("=", 1)[1].split(",")
    if not args:
        sys.exit("用法：python3 scripts/check_gate.py <遥测导出.json> [...] [--lessons=...]")

    events = load_events(args)
    lesson_set = set(lessons)
    print(f"事件总数（去重后）: {len(events)}  目标课: {', '.join(lessons)}\n")

    # ── ① 遥测健康：双发 grammar_lesson_started ──
    started = [e for e in events if e["kind"] == "grammar_lesson_started"]
    dupes = len(started) - len({(e["lessonId"], e["ts"]) for e in started})
    print(f"① 双发 grammar_lesson_started: {dupes} 组  {'✓' if dupes == 0 else '✗ R22 回归！'}")

    # ── ② 完课时长：每课首次完课 = 首轮（中位数口径） ──
    completions = [e for e in events if e["kind"] == "grammar_lesson_completed"]
    first_done = {}
    for e in sorted(completions, key=lambda e: e["completedAt"]):
        first_done.setdefault(e["lessonId"], e)
    target_first = [first_done[l] for l in lessons if l in first_done]
    if target_first:
        durations = [e["durationMs"] / 1000 for e in target_first]
        median_s = statistics.median(durations)
        mark = "✓" if median_s >= DURATION_PASS else ("🛑 止损线" if median_s < DURATION_STOP_LOSS else "✗ 未达标")
        per_lesson = ", ".join(
            e["lessonId"].split("-")[1] + ":" + str(round(e["durationMs"] / 1000)) + "s"
            for e in target_first
        )
        print(f"② 首轮完课时长中位数: {median_s:.0f}s（{per_lesson}）  {mark}")
    else:
        print(f"② 首轮完课时长: 目标课暂无完课事件（共 {len(completions)} 条完课，均为其他课）")
        median_s = None

    # ── ③ 一次通过率（目标课） ──
    def first_try_rate(section, step_filter=None):
        evs = [e for e in events if e["kind"] == "lesson_step_result" and e.get("section") == section
               and e.get("lessonId") in lesson_set and (step_filter is None or step_filter(e))]
        if not evs:
            return None, 0
        hits = sum(1 for e in evs if e["passed"] and e["attempts"] == 1)
        return hits / len(evs), len(evs)

    pr, pn = first_try_rate("practice")
    if pr is not None:
        mark = "✓" if PRACTICE_MIN <= pr <= PRACTICE_MAX else ("🛑 止损线" if pr > PRACTICE_STOP_LOSS else "✗")
        print(f"③a practice 一次通过率: {pr*100:.1f}%（n={pn}，目标 {PRACTICE_MIN*100:.0f}–{PRACTICE_MAX*100:.0f}%）  {mark}")
    else:
        print("③a practice: 目标课暂无数据")

    ot, on = first_try_rate("output", lambda e: e.get("stepKind") == "free_type")  # 未用提示口径
    if ot is not None:
        mark = "✓" if OUTPUT_MIN <= ot <= OUTPUT_MAX else "✗"
        print(f"③b output 无提示一次通过率: {ot*100:.1f}%（n={on}，目标 {OUTPUT_MIN*100:.0f}–{OUTPUT_MAX*100:.0f}%）  {mark}")
    else:
        print("③b output: 目标课暂无数据")

    rc, rn = first_try_rate("recall")
    if rc is not None:
        print(f"③c recall 一次通过率: {rc*100:.1f}%（n={rn}，观察项：阶梯提示后完成率应为 100%）")

    # ── ④ 破案结算 ──
    settled = [e for e in events if e["kind"] == "hunt_case_settled"]
    target_settled = [e for e in settled if e.get("caseId", "").startswith("hunt-")]
    solve = sum(1 for e in target_settled if e.get("solved"))
    print(f"④ hunt_case_settled: {len(target_settled)} 条（破案 {solve}，破案率 {solve/len(target_settled)*100:.0f}%）  {'✓ 埋点在工作' if target_settled else '✗ 无结算事件'}" if target_settled else "④ hunt_case_settled: 0 条  ✗ 未进入破案段或埋点异常")

    # ── ⑤ 六段 dwell 对照预算（R20 后才有数据） ──
    dwell = defaultdict(list)
    for e in events:
        if e["kind"] == "section_dwell" and e.get("lessonId") in lesson_set:
            dwell[e["section"]].append(e["dwellMs"] / 1000)
    if dwell:
        print("⑤ 六段 dwell 均值 vs 预算（PRD §7）:")
        for section, (lo, hi) in SECTION_BUDGET.items():
            vals = dwell.get(section, [])
            if not vals:
                print(f"   {section:9s} 无数据（预算 {lo}–{hi}s）")
                continue
            avg = statistics.mean(vals)
            mark = "✓" if lo <= avg <= hi else ("↘ 低于预算" if avg < lo else "↗ 高于预算")
            print(f"   {section:9s} {avg:6.1f}s（n={len(vals)}，预算 {lo}–{hi}s）  {mark}")
    else:
        print("⑤ section_dwell: 无数据（R20 于 2026-09-13 上线，早于该版本的导出不含段级事件）")

    # ── 汇总裁决建议 ──
    print("\n── D1 放行条件汇总 ──")
    print("  放行：首轮时长中位数 ≥360s、双发=0、hunt_case_settled ≥1、practice 70–85%、output 30–50%")
    print("  止损：时长中位数 <270s 或 practice >92% → 回落止损档，暂停第三批")


if __name__ == "__main__":
    main()
