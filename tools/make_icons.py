"""Generate PWA icons (pure stdlib PNG writer). Run: python tools/make_icons.py"""
import os
import struct
import zlib

OUT = os.path.join(os.path.dirname(__file__), "..", "static", "icons")

# Palette
BG_TOP = (6, 78, 59)
BG_BOTTOM = (4, 47, 36)
GOLD = (212, 168, 83)
GOLD_LIGHT = (232, 196, 120)
WHITE = (236, 253, 245)


def png_chunk(tag, data):
    raw = tag + data
    return struct.pack(">I", len(data)) + raw + struct.pack(">I", zlib.crc32(raw) & 0xFFFFFFFF)


def write_png(path, size, get_rgba):
    rows = bytearray()
    for y in range(size):
        rows.append(0)
        for x in range(size):
            r, g, b, a = get_rgba(x, y)
            rows += bytes((r, g, b, a))
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    data = b"".join([
        b"\x89PNG\r\n\x1a\n",
        png_chunk(b"IHDR", ihdr),
        png_chunk(b"IDAT", zlib.compress(bytes(rows), 9)),
        png_chunk(b"IEND", b""),
    ])
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(data)
    print("wrote", path, len(data), "bytes")


def smoothstep(edge0, edge1, x):
    t = max(0.0, min(1.0, (x - edge0) / (edge1 - edge0)))
    return t * t * (3 - 2 * t)


def clamp(v):
    return max(0, min(255, int(round(v))))


def sample(fn, x, y, ss=3):
    """Average fn over an ss x ss grid."""
    r = g = b = a = 0.0
    n = ss * ss
    for sy in range(ss):
        for sx in range(ss):
            pr, pg, pb, pa = fn(x + (sx + 0.5) / ss, y + (sy + 0.5) / ss)
            r += pr
            g += pg
            b += pb
            a += pa
    return (clamp(r / n), clamp(g / n), clamp(b / n), clamp(a / n))


def make_icon(maskable=False):
    def base(u, v):
        """u,v in [0,size). Returns RGBA."""
        S = ICON_SIZE
        x, y = u, v

        # Rounded-rect mask
        radius = 0.0 if maskable else S * 0.22
        alpha = 1.0
        if radius > 0:
            cx = min(max(x, radius), S - radius)
            cy = min(max(y, radius), S - radius)
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            inside = d <= radius or (radius <= x < S - radius and radius <= y < S - radius) \
                or (radius <= x < S - radius) or (radius <= y < S - radius)
            edge_dist = radius - d
            alpha = smoothstep(-1.0, 1.0, edge_dist)

        # Vertical gradient background
        t = y / S
        bg_r = BG_TOP[0] + (BG_BOTTOM[0] - BG_TOP[0]) * t
        bg_g = BG_TOP[1] + (BG_BOTTOM[1] - BG_TOP[1]) * t
        bg_b = BG_TOP[2] + (BG_BOTTOM[2] - BG_TOP[2]) * t

        # Radial glow top-right (emerald light)
        gx, gy = S * 0.72, S * 0.22
        gd = ((x - gx) ** 2 + (y - gy) ** 2) ** 0.5 / (S * 0.75)
        glow = max(0.0, 1.0 - gd) ** 2 * 0.35

        r = bg_r + (16 - bg_r) * glow
        g = bg_g + (185 - bg_g) * glow * 0.55
        b = bg_b + (129 - bg_b) * glow * 0.55

        out_r, out_g, out_b, out_a = r, g, b, alpha * 255.0

        # Crescent moon (gold): big circle minus offset circle
        scale = 1.0 if not maskable else 0.86
        ccx, ccy = S * 0.46, S * 0.50
        R = S * 0.30 * scale
        cut_cx, cut_cy = S * 0.56, S * 0.44
        Rc = S * 0.26 * scale

        d_out = ((x - ccx) ** 2 + (y - ccy) ** 2) ** 0.5 - R
        d_cut = ((x - cut_cx) ** 2 + (y - cut_cy) ** 2) ** 0.5 - Rc
        crescent = min(d_out, -d_cut)
        ca = smoothstep(-1.2, 1.2, crescent)

        # Gold gradient across the crescent
        gt = (x + y) / (2 * S)
        gr = GOLD[0] + (GOLD_LIGHT[0] - GOLD[0]) * gt
        gg = GOLD[1] + (GOLD_LIGHT[1] - GOLD[1]) * gt
        gb = GOLD[2] + (GOLD_LIGHT[2] - GOLD[2]) * gt

        if ca > 0:
            af = ca
            ab = out_a / 255.0
            oa = af + ab * (1 - af)
            out_r = (gr * af + out_r * ab * (1 - af)) / oa
            out_g = (gg * af + out_g * ab * (1 - af)) / oa
            out_b = (gb * af + out_b * ab * (1 - af)) / oa
            out_a = oa * 255

        # Small star (diamond sparkle) upper right, clear of the crescent
        star_cx, star_cy = S * 0.72, S * 0.24
        st_size = S * 0.045 * scale
        dx = abs(x - star_cx)
        dy = abs(y - star_cy)
        sd = dx + dy - st_size  # diamond distance
        sa = smoothstep(-1.0, 1.0, -sd)
        if sa > 0:
            af = sa * 0.95
            ab = out_a / 255.0
            oa = af + ab * (1 - af)
            wr, wg, wb = WHITE
            out_r = (wr * af + out_r * ab * (1 - af)) / oa
            out_g = (wg * af + out_g * ab * (1 - af)) / oa
            out_b = (wb * af + out_b * ab * (1 - af)) / oa
            out_a = oa * 255

        # Three ayah lines (bottom area) - subtle horizontal strokes
        if not maskable:
            line_y_start = S * 0.74
            gap = S * 0.075
            lw = S * 0.34
            lx0 = S * 0.33
            for i in range(3):
                ly = line_y_start + i * gap
                dy2 = abs(y - ly)
                within_x = lx0 <= x <= lx0 + lw * (1.0 - i * 0.22)
                la = smoothstep(1.2, 0.0, dy2) if within_x else 0.0
                if la > 0:
                    la *= 0.75
                    af = la
                    ab = out_a / 255.0
                    oa = af + ab * (1 - af)
                    lr, lg, lb = WHITE
                    out_r = (lr * af + out_r * ab * (1 - af)) / oa
                    out_g = (lg * af + out_g * ab * (1 - af)) / oa
                    out_b = (lb * af + out_b * ab * (1 - af)) / oa
                    out_a = oa * 255

        return (out_r, out_g, out_b, out_a)

    return base


ICON_SIZE = 512


def build():
    icon_fn = make_icon(maskable=False)
    write_png(os.path.join(OUT, "icon-192.png"), 192,
              lambda x, y: sample(icon_fn, x * ICON_SIZE / 192, y * ICON_SIZE / 192, ss=3))
    write_png(os.path.join(OUT, "icon-512.png"), 512,
              lambda x, y: sample(icon_fn, x, y, ss=2))

    mask_fn = make_icon(maskable=True)
    write_png(os.path.join(OUT, "maskable-512.png"), 512,
              lambda x, y: sample(mask_fn, x, y, ss=2))


if __name__ == "__main__":
    build()
