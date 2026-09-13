#!/usr/bin/env python3
# 站台关卡页 v1 北极星与埋点分析（PRD §3 成功指标 + 决策门）
# 用法：python3 scripts/check_station_gate.py adventure-telemetry-*.json
# 输入：应用内「导出遥测」JSON（buildAdventureTelemetryExport 产物，含 events/archivedEvents）
# 输出：北极星（无提示一次 pass 率）、story 停留、hint 依赖、TTS 触达、流失归因、scaffold 预警
import json, sys, statistics
from collections import defaultdict

NORTH_STAR_RELATIVE_TARGET = 0.20   # 相对提升 ≥20%（需基线对照）
NORTH_STAR_ABSOLUTE_TARGET = 0.50   # 或绝对值 ≥50%
STORY_DWELL_TARGET_MS = 8000        # story 停留中位数 ≥8s（说明真在读）
SCAFFOLD_DWELL_FLOOR_MS = 3000      # 提示卡打开且停留 <3s = scaffold 过强预警信号

def load_events(paths):
    events = []
    for path in paths:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        events.extend(data.get("events", []))
        events.extend(data.get("archivedEvents", []))
    return [e for e in events if isinstance(e, dict) and "kind" in e]

def pct(a, b):
    return f"{a}/{b} ({a/b*100:.0f}%)" if b else "0/0 (—)"

def median_or_none(values):
    return round(statistics.median(values)) if values else None

def main(paths):
    events = load_events(paths)
    by_gate_shown = [e for e in events if e["kind"] == "gate_shown"]
    submitted = [e for e in events if e["kind"] == "gate_submitted"]
    story_left = [e for e in events if e["kind"] == "gate_story_left"]
    hints = [e for e in events if e["kind"] == "gate_hint_used"]
    tts = [e for e in events if e["kind"] == "tts_played" and e.get("gateId")]
    abandoned = [e for e in events if e["kind"] == "gate_abandoned"]
    tips = [e for e in events if e["kind"] == "story_tip_opened"]

    print("=" * 64)
    print("站台关卡页 v1 · 北极星与埋点分析")
    print(f"事件总量 {len(events)} ｜ gate_shown {len(by_gate_shown)} 次进门")
    print("=" * 64)

    # ── 北极星：无提示一次 pass 率 ─────────────────────────────
    north_star = [e for e in submitted if e.get("verdict") == "pass" and e.get("attemptIndex") == 1 and e.get("hintLevel", 0) == 0]
    rate = len(north_star) / len(submitted) if submitted else None
    status = "—"
    if rate is not None:
        status = "✅ 达标（绝对值口径）" if rate >= NORTH_STAR_ABSOLUTE_TARGET else "⏳ 未达 50%，攒满 30 session 再判"
    print(f"\n【北极星】无提示一次 pass 率: {pct(len(north_star), len(submitted))}  {status}")

    # 分关明细
    per_gate = defaultdict(lambda: [0, 0])  # gateId -> [north_star, total]
    for e in submitted:
        per_gate[e.get("gateId", "?")][1] += 1
        if e.get("verdict") == "pass" and e.get("attemptIndex") == 1 and e.get("hintLevel", 0) == 0:
            per_gate[e.get("gateId", "?")][0] += 1
    if per_gate:
        print("  分关:")
        for gid in sorted(per_gate):
            ns, total = per_gate[gid]
            print(f"    {gid:<18} {pct(ns, total)}")

    # ── story 停留时长 ─────────────────────────────────────────
    dwells = [e["dwellMs"] for e in story_left if isinstance(e.get("dwellMs"), (int, float))]
    med = median_or_none(dwells)
    dwell_status = "✅ ≥8s，真在读" if med and med >= STORY_DWELL_TARGET_MS else ("⚠️ <8s，可能被秒点跳过" if med else "— 无数据")
    print(f"\n【story 停留】中位数 {med}ms（样本 {len(dwells)}） {dwell_status}")

    # ── hint 依赖 ──────────────────────────────────────────────
    hint_rate = len(hints) / len(by_gate_shown) if by_gate_shown else None
    print(f"\n【hint 依赖】{pct(len(hints), len(by_gate_shown))} 次提示/进门（改版有效应下降）")
    deep = [h for h in hints if h.get("hintLevel", 0) >= 2]
    print(f"  深度提示（≥2 级）: {pct(len(deep), len(hints))}（巩固增强后应降）")

    # ── TTS 触达 ───────────────────────────────────────────────
    print(f"\n【TTS 触达】{pct(len(tts), len(by_gate_shown))} 次播放/进门（观测项，不设目标）")

    # ── 流失归因（phase 维度） ─────────────────────────────────
    phases = defaultdict(int)
    for e in abandoned:
        phases[e.get("phase", "unknown")] += 1
    print(f"\n【流失归因】gate_abandoned 共 {len(abandoned)} 次: " + (", ".join(f"{p} {c}" for p, c in sorted(phases.items())) or "—"))
    if phases.get("story", 0) > phases.get("gate", 0) and phases.get("story", 0) >= 3:
        print("  ⚠️ story 阶段流失多于 gate——剧情页仍在赶人，触发 M1 决策门'调整'档")

    # ── scaffold 过强预警（提示卡打开 + 停留骤降 + 通过率暴涨） ──
    print(f"\n【scaffold 观测】story_tip_opened {len(tips)} 次")
    if tips and med is not None and rate is not None:
        if med < SCAFFOLD_DWELL_FLOOR_MS and rate > 0.85:
            print("  🚨 提示卡打开率高 + story 停留极短 + 通过率 >85%——疑似'免费看答案'，检查提示卡例句是否直接给答案")

    # ── 判定误伤观测（答对判 fail 信号：near/misread 后无重试直接流失） ──
    misread = [e for e in submitted if e.get("verdict") == "misread"]
    print(f"\n【判定分布】misread {pct(len(misread), len(submitted))}（3/4/6 关 acceptRegex 补全后，合理答案被误判应降）")

    print("\n判定口径: 北极星 = verdict=pass ∧ attemptIndex=1 ∧ hintLevel=0；攒满 30 个 gate_submitted 后下结论。")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    main(sys.argv[1:])
