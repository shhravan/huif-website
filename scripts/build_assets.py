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

# neutralise the modern yellow tactile strip in the paving (desaturate yellow pixels below the base)
low = yy > base - 120
r_, g_, b_ = rgb[..., 0], rgb[..., 1], rgb[..., 2]
yellow = low & (xx > w*0.55) & (r_ > b_ + 14) & (g_ > b_ + 8)
grey = (0.3*r_ + 0.59*g_ + 0.11*b_)[..., None] * np.array([1.04, 0.99, 0.95])
rgb = np.where(yellow[..., None], grey*0.92, rgb)
# match the photo's paving tone to the rendered sandstone paving around it (outside the gate itself)
pav = (yy > base - 20) & (a < 0.5)
src_mean = rgb[pav].reshape(-1, 3).mean(0)
TARGET = np.array(TARGET_RGB)
rgb[pav] = np.clip(rgb[pav]*(TARGET/src_mean), 0, 255)
# real Sanchi paving under and in front of the pillars, feathered into the plate's earth
ground = np.clip((yy - base + 95)/110., 0, 1)
cx = w*0.49
side = np.clip(1 - (np.abs(xx - cx) - w*0.26)/(w*0.30), 0, 1)**1.8
bottom_fade = np.clip((h - yy)/120., 0, 1)
ground = ground*side*bottom_fade
alpha = np.maximum(a, ground*0.96)

im = Image.fromarray(rgb.astype(np.uint8)); im.putalpha(Image.fromarray((alpha*255).astype(np.uint8)))
for W in (2400, 1400):
    im.resize((W, round(h*W/w)), Image.LANCZOS).save(f"{OUT}/gate/torana-{W}.webp", quality=86, method=6)
print("gate", w, h, "aspect %.4f" % (w/h), "base %.4f" % (base/h), "eye %.4f" % ((0.82*5082)/h),
      "origin %.4f %.4f" % (((1320+2515)/2 - gx0)/w, (3700-gy0)/h))

