"""插画资源处理：透明抠底 + 主体自动裁切 + 排进目标画布。

用法：python process-illustration.py [主体高度] [主体右缘X] [主体顶部Y] [源图路径]
默认目标画布 1600x448（今日页 Hero 用）。其余尺寸改 TARGET 即可。
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

SRC = sys.argv[4] if len(sys.argv) > 4 else "generated-images/input.png"   # ImageGen 原始图
TARGET = (1600, 448)
SUBJECT_H = int(sys.argv[1]) if len(sys.argv) > 1 else 250
POS_X = int(sys.argv[2]) if len(sys.argv) > 2 else 1490
POS_Y = int(sys.argv[3]) if len(sys.argv) > 3 else 16

rgb = Image.open(SRC).convert("RGB")
A = np.asarray(rgb).astype(np.int16)
H, W, _ = A.shape

# 1) 背景色 = 四角与四边中点均值
pts = [(2, 2), (W - 3, 2), (2, H - 3), (W - 3, H - 3), (W // 2, 2), (W // 2, H - 3), (2, H // 2), (W - 3, H // 2)]
bg = np.mean([A[y, x] for x, y in pts], axis=0)
print("背景色:", np.round(bg).astype(int))

# 2) 候选背景（与背景色接近）
dist = np.abs(A - bg.astype(np.int16)).sum(axis=2)
near = dist <= 72
print("候选背景占比: %.1f%%" % (100.0 * near.mean()))

# 3) 扫描式 flood fill：只把「与画布边缘连通」的背景标为透明，主体内部的米色区域得以保留
free = near.copy()
free[1, :] = near[1, :]; free[-2, :] = near[-2, :]; free[:, 1] = near[:, 1]; free[:, -2] = near[:, -2]
free[0, :] = False; free[-1, :] = False; free[:, 0] = False; free[:, -1] = False
for _ in range(6):
    before = free.sum()
    for y in range(1, H):
        free[y] |= free[y - 1] & near[y]
    for y in range(H - 2, -1, -1):
        free[y] |= free[y + 1] & near[y]
    for x in range(1, W):
        free[:, x] |= free[:, x - 1] & near[:, x]
    for x in range(W - 2, -1, -1):
        free[:, x] |= free[:, x + 1] & near[:, x]
    if free.sum() == before:
        break
print("透明(与边缘连通)占比: %.1f%%" % (100.0 * free.mean()))

alpha = np.where(free, 0, 255).astype(np.uint8)

# 4) 主体外框：用强对比像素定框（弱铅笔痕/暗角不参与），再留边距把柔和阴影带进来
STRONG = dist > 200
ys, xs = np.where(STRONG[:880])
bx0, bx1, by0, by1 = int(xs.min()), int(xs.max()), int(ys.min()), int(ys.max())
print("主体外框(强对比):", (bx0, by0, bx1, by1), "尺寸", (bx1 - bx0, by1 - by0))

# 4.5) 只保留紧贴主体的柔和阴影；散落在空白处的铅笔碎屑/纸纹一律清除
MARGIN = 8
keep = np.zeros_like(near, dtype=bool)
keep[max(0, by0 - MARGIN):by1 + MARGIN, max(0, bx0 - MARGIN):bx1 + MARGIN] = True
stray = (dist <= 175) & (~keep)
alpha[stray] = 0

# 对强内容做膨胀，得到「主体邻域」；邻域外的淡像素（地面碎屑）也清掉
halo = STRONG.copy()
for _ in range(7):
    h = halo.copy()
    h[1:, :] |= halo[:-1, :]; h[:-1, :] |= halo[1:, :]
    h[:, 1:] |= halo[:, :-1]; h[:, :-1] |= halo[:, 1:]
    halo = h
dust = (dist <= 175) & (~halo)
alpha[dust] = 0
print("清理散落碎屑/淡痕像素:", int(stray.sum() + dust.sum()))

m = Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(0.6))

out = rgb.convert("RGBA")
out.putalpha(m)

PAD = 22
subject = out.crop((max(0, bx0 - PAD), max(0, by0 - PAD), min(W, bx1 + PAD), min(H, by1 + PAD)))
sw, sh = subject.size
scale = SUBJECT_H / sh
subject = subject.resize((max(1, round(sw * scale)), SUBJECT_H), Image.LANCZOS)

canvas = Image.new("RGBA", TARGET, (0, 0, 0, 0))
x0 = max(0, POS_X - subject.size[0])
canvas.paste(subject, (x0, POS_Y), subject)
print("主体落位: x %d..%d  y %d..%d  缩放 %.3f" % (x0, x0 + subject.size[0], POS_Y, POS_Y + SUBJECT_H, scale))
canvas.save(OUT)

# 5) 预览：上=棋盘格查 alpha，下=Hero 同款米色底
from PIL import ImageDraw
def checker(size, box=16):
    im = Image.new("RGBA", size, (255, 255, 255, 255))
    d = ImageDraw.Draw(im)
    for yy in range(0, size[1], box):
        for xx in range(0, size[0], box):
            if (xx // box + yy // box) % 2:
                d.rectangle([xx, yy, xx + box - 1, yy + box - 1], fill=(214, 214, 214, 255))
    return im

sheet = checker((TARGET[0], TARGET[1] * 2 + 16))
sheet.alpha_composite(canvas, (0, 0))
warm = Image.new("RGBA", TARGET, (253, 246, 238, 255)); warm.alpha_composite(canvas, (0, 0))
sheet.alpha_composite(warm, (0, TARGET[1] + 16))
sheet.convert("RGB").save(OUT_PREVIEW)
print("输出:", OUT, " 预览:", OUT_PREVIEW)
