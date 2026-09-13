"""单元封面处理：抠底 + 裁切 + 居中排进 300x244 透明画布。"""
import numpy as np
from PIL import Image, ImageFilter

JOBS = [
    ("/Users/liujun/Documents/英语听写/generated-images/Using_the_same_hand_drawn_art__2026-09-13T00-30-06.png",
     "/Users/liujun/Documents/英语听写/src/assets/today-unit-1.png"),
    ("/Users/liujun/Documents/英语听写/generated-images/Using_the_exact_same_hand_draw_2026-09-13T00-30-53.png",
     "/Users/liujun/Documents/英语听写/src/assets/today-unit-2.png"),
    ("/Users/liujun/Documents/英语听写/generated-images/Using_the_exact_same_hand_draw_2026-09-13T00-31-20.png",
     "/Users/liujun/Documents/英语听写/src/assets/today-unit-3.png"),
    ("/Users/liujun/Documents/英语听写/generated-images/Using_the_exact_same_hand_draw_2026-09-13T00-31-43.png",
     "/Users/liujun/Documents/英语听写/src/assets/today-unit-4.png"),
]
TARGET = (300, 244)
FIT = (272, 212)   # 主体最大尺寸，留边


def key_out(rgb: Image.Image) -> Image.Image:
    A = np.asarray(rgb).astype(np.int16)
    H, W, _ = A.shape
    pts = [(2, 2), (W - 3, 2), (2, H - 3), (W - 3, H - 3), (W // 2, 2), (2, H // 2)]
    bg = np.mean([A[y, x] for x, y in pts], axis=0).astype(np.int16)
    dist = np.abs(A - bg).sum(axis=2)
    near = dist <= 80
    free = near.copy()
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
    alpha = np.where(free, 0, 255).astype(np.uint8)

    strong = dist > 200
    strong[900:, :] = False   # 排除右下角水印
    ys, xs = np.where(strong)
    bx0, bx1, by0, by1 = int(xs.min()), int(xs.max()), int(ys.min()), int(ys.max())

    halo = strong.copy()
    for _ in range(8):
        h = halo.copy()
        h[1:, :] |= halo[:-1, :]; h[:-1, :] |= halo[1:, :]
        h[:, 1:] |= halo[:, :-1]; h[:, :-1] |= halo[:, 1:]
        halo = h
    alpha[(dist <= 175) & (~halo)] = 0

    out = rgb.convert("RGBA")
    out.putalpha(Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(0.6)))
    PAD = 10
    return out.crop((max(0, bx0 - PAD), max(0, by0 - PAD), min(W, bx1 + PAD), min(H, by1 + PAD)))


for src, out_path in JOBS:
    rgb = Image.open(src).convert("RGB")
    subject = key_out(rgb)
    sw, sh = subject.size
    scale = min(FIT[0] / sw, FIT[1] / sh, 1.0)
    subject = subject.resize((max(1, round(sw * scale)), max(1, round(sh * scale))), Image.LANCZOS)
    canvas = Image.new("RGBA", TARGET, (0, 0, 0, 0))
    canvas.paste(subject, ((TARGET[0] - subject.size[0]) // 2, (TARGET[1] - subject.size[1]) // 2), subject)
    canvas.save(out_path)
    print(out_path.split("/")[-1], "主体", subject.size, "缩放 %.2f" % scale)

# 预览：四张分别放在对应粉彩卡底上
tints = ["#fdefe3", "#e7f1fd", "#ecebfc", "#e6f5ee"]
sheet = Image.new("RGB", (TARGET[0] * 4 + 50, TARGET[1] + 40), (255, 255, 255))
d = ImageDraw = None
for i, (_, out_path) in enumerate(JOBS):
    card = Image.new("RGBA", TARGET, tints[i])
    card.alpha_composite(Image.open(out_path), (0, 0))
    sheet.paste(card.convert("RGB"), (10 + i * (TARGET[0] + 10), 20))
sheet.save("/tmp/covers-preview.png")
print("预览: /tmp/covers-preview.png")
