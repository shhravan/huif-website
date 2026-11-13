# Reference: how public/gate was produced. Source photos are not in the repo (see CREDITS.md).
"""Build the website's gate + scene images from the source photos.
Gate: Photo Dharma, CC BY 2.0 (Wikimedia Commons). Plate: Poly Haven 'Dikhololo Sunset' backplate DSC09878, CC0."""
import numpy as np
from PIL import Image, ImageFilter
R = "/tmp/claude-0/-home-user-huif-website/a627a7b2-9fdf-5047-83bf-4b69d2179029/scratchpad/ref"
OUT = "/home/user/huif-website/public"
TARGET_RGB = [float(x) for x in __import__("os").environ.get("PAVE_RGB", "120,100,85").split(",")]

# ---------- gate ----------
G = Image.open(f"{R}/full/front.jpg").convert("RGB")
M = Image.open(f"{R}/full/mask_clean.png").convert("L")
gx0, gy0, gx1, gy1 = 216, 229, 3681, 5760
g = G.crop((gx0, gy0, gx1, gy1)); m = M.crop((gx0, gy0, gx1, gy1))
w, h = g.size
key = 0.10; d = w*key/2
quad = (d, 0, 0, h, w, h, w-d, 0)
g = g.transform((w, h), Image.QUAD, quad, Image.BICUBIC)
m = m.transform((w, h), Image.QUAD, quad, Image.BICUBIC)
rgb = np.asarray(g, dtype=np.float32)
a = np.asarray(m, dtype=np.float32)/255.

# edge decontamination: replace edge colours with colours pulled from the solid interior
solid = (a > 0.97).astype(np.float32)
num = np.zeros_like(rgb); den = np.zeros_like(solid)
for r in (3, 7, 15):
    k = Image.fromarray((solid*255).astype(np.uint8)).filter(ImageFilter.BoxBlur(r))
    s = np.asarray(k, dtype=np.float32)/255.
    c = np.stack([np.asarray(Image.fromarray(np.clip(rgb[..., i]*solid, 0, 255).astype(np.uint8)).filter(ImageFilter.BoxBlur(r)), dtype=np.float32) for i in range(3)], -1)
    take = (den < 1e-3) & (s > 1e-3)
    num[take] = c[take]; den[take] = s[take]
fg = np.where(den[..., None] > 1e-3, num/np.maximum(den[..., None], 1e-3), rgb)
edge = ((a > 0.01) & (a < 0.97))[..., None]
rgb = np.where(edge, fg, rgb)
# slightly firmer alpha so edges are crisp, not mushy
a = np.clip((a - 0.12)/0.76, 0, 1)

# grade: a touch warmer and darker to sit in the soft dusk-light plate; gentle base occlusion
rgb = rgb*np.array([1.06, 1.0, 0.92])*0.92
rgb = np.clip((rgb - 118)*1.05 + 118, 0, 255)
yy, xx = np.mgrid[0:h, 0:w]
base = 5290 - gy0
occl = 1 - 0.28*np.clip(1 - np.abs(yy - base)/260., 0, 1)
rgb = rgb*occl[..., None]

# contact shadow on the paving under each pillar (premultiplied: dark colour + alpha, under the gate)
sh = np.zeros((h, w), np.float32)
for cxp in (734, 2615):
    sh += np.exp(-(((xx - cxp)/330.)**2 + ((yy - (base + 8))/46.)**2))
sh = np.asarray(Image.fromarray((np.clip(sh, 0, 1)*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(28)), dtype=np.float32)/255.
sh = sh*0.62*(yy > base - 60)
alpha = a + sh*(1 - a)
shadow_rgb = np.array([34, 28, 24], np.float32)
rgb = (rgb*a[..., None] + shadow_rgb*(sh*(1 - a))[..., None])/np.maximum(alpha[..., None], 1e-4)
im = Image.fromarray(rgb.astype(np.uint8)); im.putalpha(Image.fromarray((alpha*255).astype(np.uint8)))
for W in (3200, 2400, 1400):
    im.resize((W, round(h*W/w)), Image.LANCZOS).save(f"{OUT}/gate/torana-{W}.webp", quality=86, method=6)
print("gate", w, h, "aspect %.4f" % (w/h), "base %.4f" % (base/h), "eye %.4f" % ((0.82*5082)/h),
      "origin %.4f %.4f" % (((1320+2515)/2 - gx0)/w, (3700-gy0)/h))

