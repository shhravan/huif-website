# Reference: how public/scene/*.webp were rendered. Sources: Poly Haven (CC0), see CREDITS.md.
"""Render the scene plate: a real sky (Poly Haven pure sky, CC0) projected through a level
camera, and a real red-sandstone paving texture (Poly Haven, CC0, 2.15 m tile) on the ground
plane in true perspective. Horizon at 76% of the frame, eye height 1.6 m."""
import sys, numpy as np
from PIL import Image
R = "/tmp/claude-0/-home-user-huif-website/a627a7b2-9fdf-5047-83bf-4b69d2179029/scratchpad/ref/ph2"
sky_f, out, mode = sys.argv[1], sys.argv[2], sys.argv[3]   # mode: dawn | day
W, H = 2880, 1620
HOR = 0.76*H; f = (H/2)/np.tan(np.radians(30)); cx = W/2
EYE = 1.6; TILE = 4.6   # texture covers 2.15 m, scaled up to match the large Sanchi slabs

sky = np.asarray(Image.open(f"{R}/{sky_f}").convert("RGB"), dtype=np.float32)
SH, SW = sky.shape[:2]
# face away from the sun: find the brightest spot near the horizon and turn 180°
band = sky[SH//2-400:SH//2, :, :].mean(2)
sun_col = np.argmax(band.mean(0))
yaw = (sun_col/SW - 0.5)*2*np.pi + np.pi
v, u = np.mgrid[0:H, 0:W].astype(np.float32)
x = (u - cx)/f; y = (HOR - v)/f
az = np.arctan2(x, 1.0) + yaw
el = np.arctan2(y, np.sqrt(x*x + 1.0))
col = ((az/(2*np.pi) + 0.5) % 1.0)*(SW-1)
row = np.clip((0.5 - el/np.pi)*(SH-1), 0, SH/2 - 2)   # never sample below the sky's horizon
def bilinear(img, r, c):
    r0 = np.floor(r).astype(int); c0 = np.floor(c).astype(int)
    r1 = np.minimum(r0+1, img.shape[0]-1); c1 = (c0+1) % img.shape[1]
    fr = (r - r0)[..., None]; fc = (c - c0)[..., None]
    return (img[r0, c0]*(1-fr)*(1-fc) + img[r0, c1]*(1-fr)*fc + img[r1, c0]*fr*(1-fc) + img[r1, c1]*fr*fc)
out_img = bilinear(sky, row, col)
horizon_col = bilinear(sky, np.full((1, W), SH/2 - 6, np.float32), col[int(HOR)-1:int(HOR), :])[0]

# ground: paving texture with a simple mip pyramid (avoids shimmer/moire in the distance)
tex = Image.open(f"{R}/pave_diff.jpg").convert("RGB")
mips = [np.asarray(tex, dtype=np.float32)]
while mips[-1].shape[0] > 16:
    s = mips[-1].shape[0]//2
    mips.append(np.asarray(Image.fromarray(mips[-1].astype(np.uint8)).resize((s, s), Image.BOX), dtype=np.float32))
g = v > HOR + 0.5
dy = (v - HOR)[g]; z = f*EYE/dy; X = ((u - cx)[g])*z/f
foot = z/f                                   # metres per pixel
ss = []
for ox, oy in ((-.25, -.25), (.25, -.25), (-.25, .25), (.25, .25)):   # 4x supersample
    dy2 = dy + oy; z2 = f*EYE/dy2; X2 = ((u - cx)[g] + ox)*z2/f
    tu = (X2/TILE) % 1.0; tv = (z2/TILE) % 1.0
    lvl = np.clip(np.log2(np.maximum(foot*mips[0].shape[0]/TILE, 1e-6)) - 0.5, 0, len(mips)-1).astype(int)
    acc = np.zeros((dy.shape[0], 3), np.float32)
    for L in np.unique(lvl):
        sel = lvl == L; m = mips[L]; n = m.shape[0]
        acc[sel] = bilinear(m, tv[sel]*(n-1), tu[sel]*(n-1))
    ss.append(acc)
ground = np.mean(ss, 0)
# light: dawn = dim, cool skylight; day = soft warm morning light from behind the viewer
if mode == "dawn":
    ground = ground*np.array([0.50, 0.54, 0.66])
else:
    ground = ground*np.array([1.04, 0.98, 0.90])*0.98
# large-scale weathering variation in the stone (world-space value noise)
rng = np.random.default_rng(3)
def vnoise(px, pz, scale, seed):
    r = np.random.default_rng(seed); grid = r.random((64, 64)).astype(np.float32)
    gx = px/scale; gz = pz/scale
    x0 = np.floor(gx).astype(int); z0 = np.floor(gz).astype(int); fx = gx - x0; fz = gz - z0
    fx = fx*fx*(3-2*fx); fz = fz*fz*(3-2*fz)
    a = grid[z0 % 64, x0 % 64]; b = grid[z0 % 64, (x0+1) % 64]; c = grid[(z0+1) % 64, x0 % 64]; d = grid[(z0+1) % 64, (x0+1) % 64]
    return (a*(1-fx)+b*fx)*(1-fz) + (c*(1-fx)+d*fx)*fz
wv = 0.6*vnoise(X, z, 3.0, 1) + 0.4*vnoise(X, z, 9.0, 2)
ground = ground*(0.86 + 0.26*wv)[:, None]
# gentle falloff toward the viewer (we stand in the gate's shadow side) and atmospheric haze toward the horizon
near = np.clip((dy/(H-HOR)), 0, 1)
ground = ground*(1 - 0.10*near[:, None])
fog = 1 - np.exp(-z/ (90.0 if mode == "dawn" else 140.0))
hz = horizon_col[(u[g]).astype(int)]
ground = ground*(1-fog[:, None]) + hz*fog[:, None]
out_img[g] = ground
Image.fromarray(np.clip(out_img, 0, 255).astype(np.uint8)).save(out, quality=94)
print("ok", out, "sun_col", sun_col)
