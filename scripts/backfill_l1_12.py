# W5 数据补字段：给 L1–L12 补 recall（忆段）+ practice distractors（干扰项）
# 锚点策略：按课 id 切片；recall 插在该课 huntCaseIds 行前；distractors 按 practice 内 tokens 行顺序插入
import re, sys

PATH = "/Users/liujun/Documents/英语听写/src/data/grammarLessons.ts"

# 每课 4 组干扰项（按 practice 步骤顺序）；守卫口径 = 去标点小写整词，均不与答案词重复
DATA = {
    "lesson-01-am": {
        "distractors": [["is"], ["is"], ["are"], ["is"]],
        "recall": {
            "promptZh": "开学第一天，老师让每个人做自我介绍。凭记忆，写出小美的那句英文。",
            "intentZh": "我是小美。",
            "answer": "I am Xiaomei.",
            "noteZh": "I 和 am 是固定搭档，说「我是……」它们一起出场。"
        }
    },
    "lesson-02-is": {
        "distractors": [["is"], ["are"], ["is"], ["am"]],
        "recall": {
            "promptZh": "教室后墙贴着新同学的全家福，你要告诉大家照片上这个男生是谁。",
            "intentZh": "他是我的哥哥。",
            "answer": "He is my brother.",
            "noteZh": "他（单个的人）的搭档是 is。"
        }
    },
    "lesson-03-have": {
        "distractors": [["has"], ["an"], ["has"], ["Are"]],
        "recall": {
            "promptZh": "课间同桌夸你的新书包，你想告诉她你有什么。",
            "intentZh": "我有一个新背包。",
            "answer": "I have a new bag.",
            "noteZh": "「我有什么」用 have；一个可数的东西前面要有 a。"
        }
    },
    "lesson-04-want": {
        "distractors": [["a"], ["a"], ["a"], ["a"]],
        "recall": {
            "promptZh": "奶茶店的店员笑着问你要点什么，轮到你点单了。",
            "intentZh": "我想要一杯奶茶。",
            "answer": "I want a milk tea.",
            "noteZh": "想要什么就说 I want…；元音开头的词前面要用 an。"
        }
    },
    "lesson-05-like": {
        "distractors": [["a"], ["likes"], ["a"], ["likes"]],
        "recall": {
            "promptZh": "好朋友问你平时喜欢什么，你指了指正戴着的耳机。",
            "intentZh": "我喜欢音乐。",
            "answer": "I like music.",
            "noteZh": "music 这类数不清的词原样跟在 like 后面，不加 a。"
        }
    },
    "lesson-06-it": {
        "distractors": [["are"], ["am"], ["He"], ["are"]],
        "recall": {
            "promptZh": "你抬头看了看街口的大钟，想告诉同桌现在几点。",
            "intentZh": "现在是三点。",
            "answer": "It is three o'clock.",
            "noteZh": "说时间和天气，都用占位小凳子 It is 开头。"
        }
    },
    "lesson-07-we": {
        "distractors": [["is"], ["is"], ["am"], ["Is"]],
        "recall": {
            "promptZh": "班级春游拍照，班长喊完 say cheese，你心里想说的是——",
            "intentZh": "我们很开心。",
            "answer": "We are happy.",
            "noteZh": "一伙人（We / You / They）的搭档都是 are。"
        }
    },
    "lesson-08-my": {
        "distractors": [["her"], ["she"], ["he"], ["you"]],
        "recall": {
            "promptZh": "火车上，邻座的人好奇身边这个女生是谁。",
            "intentZh": "她是我的朋友。",
            "answer": "She is my friend.",
            "noteZh": "主角位用 She；「我的」是贴在人前面的小标签 my。"
        }
    },
    "lesson-09-go": {
        "distractors": [["at"], ["the"], ["in"], ["went"]],
        "recall": {
            "promptZh": "放学铃响了，同桌问你等下去哪写作业。",
            "intentZh": "我去图书馆。",
            "answer": "I go to the library.",
            "noteZh": "去哪里中间要垫一个 to；大家都熟悉的地方前面加 the。"
        }
    },
    "lesson-10-went": {
        "distractors": [["am"], ["eat"], ["walk"], ["went"]],
        "recall": {
            "promptZh": "周日晚上的日记本摊在桌上，你要写下昨天最开心的一件事。",
            "intentZh": "我昨天去了公园。",
            "answer": "Yesterday I went to the park.",
            "noteZh": "看到 yesterday，动词要换昨天版：go 的昨天版是 went。"
        }
    },
    "lesson-11-plural": {
        "distractors": [["drink"], ["brother"], ["buy"], ["ate"]],
        "recall": {
            "promptZh": "好朋友发消息问你，昨天中午吃了什么。",
            "intentZh": "我吃了两个三明治。",
            "answer": "I ate two sandwiches.",
            "noteZh": "两个以上要加 s；sandwich 以 ch 结尾，复数是 sandwiches。"
        }
    },
    "lesson-12-will": {
        "distractors": [["rains"], ["called"], ["to"], ["rained"]],
        "recall": {
            "promptZh": "睡觉前，你在日记本上写下明天的计划。",
            "intentZh": "我明天要画画。",
            "answer": "I will draw tomorrow.",
            "noteZh": "明天的事在动词前面加 will，动词本身保持原样。"
        }
    }
}

with open(PATH, encoding="utf-8") as f:
    lines = f.readlines()

# 找到每课的切片范围
id_re = re.compile(r'^\s+id: "(lesson-\d+-[a-z-]+)",')
lesson_spans = []  # (lesson_id, start, end)
current = None
for i, line in enumerate(lines):
    m = id_re.match(line)
    if m:
        if current:
            lesson_spans.append((current[0], current[1], i))
        current = (m.group(1), i)
if current:
    lesson_spans.append((current[0], current[1], len(lines)))

lesson_ids = {s[0] for s in lesson_spans}
missing = set(DATA) - lesson_ids
if missing:
    sys.exit(f"ABORT: 未找到课程: {missing}")

# 收集所有编辑（行号 -> 插入内容），最后统一从后往前应用
edits = []  # (line_index, text_lines)

for lid, start, end in lesson_spans:
    if lid not in DATA:
        continue
    d = DATA[lid]
    slice_lines = lines[start:end]

    # 1) distractors：定位 practice: [ 之后的 tokens 行
    prac_idx = next(i for i, l in enumerate(slice_lines) if l.rstrip().endswith("practice: ["))
    token_lines = [i for i in range(prac_idx, len(slice_lines))
                   if re.match(r'^        tokens: ', slice_lines[i])]
    assert len(token_lines) == len(d["distractors"]), f"{lid}: tokens 行数 {len(token_lines)} != 干扰项组数 {len(d['distractors'])}"
    for k, tidx in enumerate(token_lines):
        indent = " " * 8
        dis = ", ".join(f'"{w}"' for w in d["distractors"][k])
        edits.append((start + tidx + 1, [f"{indent}distractors: [{dis}],\n"]))

    # 2) recall：插在该课 huntCaseIds 行之前
    hunt_idx = next(i for i, l in enumerate(slice_lines) if re.match(r'^    huntCaseIds: ', l))
    r = d["recall"]
    block = [
        "    // R5「忆」段：遮盖回忆——不给选项，凭记忆还原核心句\n",
        "    recall: {\n",
        f'      promptZh: "{r["promptZh"]}",\n',
        f'      intentZh: "{r["intentZh"]}",\n',
        f'      answer: "{r["answer"]}",\n',
        f'      noteZh: "{r["noteZh"]}"\n',
        "    },\n",
    ]
    edits.append((start + hunt_idx, block))

for idx, content in sorted(edits, key=lambda e: -e[0]):
    lines[idx:idx] = content

with open(PATH, "w", encoding="utf-8") as f:
    f.writelines(lines)

print(f"OK: 应用了 {len(edits)} 处编辑（12 课 × (recall 1 + distractors 4) = 预期 60）")
