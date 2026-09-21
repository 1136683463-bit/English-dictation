import json, collections
d = json.load(open('.tmp-analysis/inventory.json'))
L = d['lessons']
print("lessons:", d['lessonCount'], "huntCases:", d['huntCaseCount'])
print("\n--- per-lesson counts: min/max/avg ---")
for k in ['blocks','examples','guided','practice','huntCases','dialogueLines','contrast','variants','sceneSwings','summaryPoints']:
    v=[l[k] for l in L]
    print(f"{k:15} min={min(v):3} max={max(v):3} avg={sum(v)/len(v):5.2f} zero={(v.count(0)):3}")
print("\n--- optional field coverage ---")
for k in ['hasDialogue','hasDeepDive','hasSummary','hasRecall']:
    c=sum(1 for l in L if l[k]); print(f"{k:15} {c}/{len(L)}  missing in: {[l['n'] for l in L if not l[k]][:40]}")
print("\n--- guided kinds ---")
print(collections.Counter([k for l in L for k in l['guidedKinds']]))
print("\n--- practice kinds ---")
print(collections.Counter([k for l in L for k in l['practiceKinds']]))
print("\n--- recall kinds (keys) ---")
print(collections.Counter([l['recallKinds'] for l in L if l['recallKinds']]))
