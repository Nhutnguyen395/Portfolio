"""
Prepare sphere images.

Reads every original image in archive-originals/ (never modified; that folder
is git-ignored, so originals stay on your machine and out of the repo) and:

  1. Gives each image a card size: "small", "medium" or "large".
     - Mixed automatically (stable pseudo-random by file name, so re-running
       or adding photos doesn't reshuffle everything).
     - "large" only goes to images with enough resolution to stay crisp.
     - Force a size for any photo with FORCE_SIZE below.
  2. Keeps each image's own proportions (no cropping, no stretching).
  3. Resizes with Lanczos to the exact pixel size its card is drawn at in
     components/scene/SphereLattice.ts, so the browser draws it 1:1, then
     applies a light sharpen. Never upscales unless the source is too small
     for even a small card (it warns you when that happens).
  4. Writes public/archive/sphere/<name>.webp (high-quality WebP).
  5. Writes lib/data/archiveImages.generated.ts listing every image with its
     size and dimensions (don't edit that file by hand; re-run this script).

Usage (from the project root):   python scripts/prepare_archive.py
Requires Pillow:                  pip install pillow
"""
from __future__ import annotations

import hashlib
import math
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps

# ── Settings ────────────────────────────────────────────────────────────────
# Photo area (pixels) of a "medium" card. Matches the old 464x696 poster card.
# Keep in sync with PX_TO_WORLD in SphereLattice.ts (card size = pixels x scale).
BASE_AREA = 464 * 696

SCALES = {"small": 0.78, "medium": 1.0, "large": 1.35}
LARGE_SHARE = 0.18   # ~18% of cards are large
SMALL_SHARE = 0.30   # ~30% are small, the rest medium

# Force a size for specific photos (file name without extension), e.g.
# FORCE_SIZE = {"godzilla": "large", "rx7": "large"}
FORCE_SIZE: dict[str, str] = {}

# Extreme shapes are trimmed to these limits so no card becomes a sliver.
MIN_RATIO, MAX_RATIO = 0.45, 1.8   # width / height

QUALITY = 90
# ────────────────────────────────────────────────────────────────────────────

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "archive-originals"                 # originals (git-ignored)
OUT = ROOT / "public" / "archive" / "sphere"     # what the website loads
TS_OUT = ROOT / "lib" / "data" / "archiveImages.generated.ts"
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".bmp", ".tif", ".tiff"}


def target_size(w: int, h: int, scale: float) -> tuple[int, int]:
    ratio = min(max(w / h, MIN_RATIO), MAX_RATIO)
    area = BASE_AREA * scale * scale
    tw = round(math.sqrt(area * ratio))
    th = round(tw / ratio)
    return tw, th


def fits(w: int, h: int, size: str) -> bool:
    tw, th = target_size(w, h, SCALES[size])
    return w >= tw * 0.97 and h >= th * 0.97   # allow ~3% (invisible)


def stable_rank(name: str) -> int:
    return int(hashlib.md5(name.encode()).hexdigest()[:8], 16)


def load_rgb(path: Path) -> Image.Image:
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)
    if im.mode in ("RGBA", "LA", "P", "PA"):
        im = im.convert("RGBA")
        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[-1])
        return bg
    return im.convert("RGB")


def assign_sizes(dims: dict[str, tuple[int, int]]) -> dict[str, str]:
    names = sorted(dims, key=stable_rank)          # stable shuffle
    sizes: dict[str, str] = {}
    for n, s in FORCE_SIZE.items():
        if n in dims:
            sizes[n] = s

    n_large = round(len(names) * LARGE_SHARE)
    n_small = round(len(names) * SMALL_SHARE)
    large_now = sum(1 for s in sizes.values() if s == "large")
    for n in names:                                  # large: only crisp-enough images
        if large_now >= n_large:
            break
        if n not in sizes and fits(*dims[n], "large"):
            sizes[n] = "large"
            large_now += 1

    small_now = sum(1 for s in sizes.values() if s == "small")
    for n in names:                                  # too low-res for medium -> small
        if n not in sizes and not fits(*dims[n], "medium"):
            sizes[n] = "small"
            small_now += 1
    for n in reversed(names):                        # fill remaining small slots
        if small_now >= n_small:
            break
        if n not in sizes:
            sizes[n] = "small"
            small_now += 1
    for n in names:
        sizes.setdefault(n, "medium")
    return sizes


def main() -> None:
    files = sorted(p for p in SRC.iterdir() if p.is_file() and p.suffix.lower() in EXTS)
    if not files:
        print(f"No images found in {SRC}")
        return
    stems = [p.stem for p in files]
    dupes = {s for s in stems if stems.count(s) > 1}
    if dupes:
        raise SystemExit(f"Two files share a name (different extensions): {sorted(dupes)}")

    OUT.mkdir(parents=True, exist_ok=True)
    dims = {}
    for p in files:
        with Image.open(p) as im:
            im = ImageOps.exif_transpose(im)
            dims[p.stem] = im.size
    sizes = assign_sizes(dims)

    entries = []
    print(f"{'image':<26}{'source':>12}  {'size':<7}{'card px':>10}  {'file':>7}")
    for p in files:
        name, (w, h), size = p.stem, dims[p.stem], sizes[p.stem]
        tw, th = target_size(w, h, SCALES[size])
        im = load_rgb(p)
        upscale = tw > w * 1.03 or th > h * 1.03
        # ImageOps.fit only trims when the shape was clamped by MIN/MAX_RATIO
        im = ImageOps.fit(im, (tw, th), method=Image.Resampling.LANCZOS)
        im = im.filter(ImageFilter.UnsharpMask(radius=0.8, percent=55, threshold=2))
        dst = OUT / f"{name}.webp"
        im.save(dst, "WEBP", quality=QUALITY, method=6)
        kb = dst.stat().st_size // 1024
        flag = "  ! source too small, slightly soft" if upscale else ""
        print(f"{name:<26}{f'{w}x{h}':>12}  {size:<7}{f'{tw}x{th}':>10}  {kb:>4} KB{flag}")
        entries.append((name, tw, th, size))

    lines = [
        "// AUTO-GENERATED by scripts/prepare_archive.py. Do not edit by hand.",
        "// Re-run `python scripts/prepare_archive.py` after adding/removing photos.",
        "",
        'export type CardSize = "small" | "medium" | "large";',
        "",
        "export interface ArchiveImage {",
        "  readonly name: string;",
        "  readonly url: string;",
        "  /** pixel size of the prepared image = the card's photo area */",
        "  readonly width: number;",
        "  readonly height: number;",
        "  readonly size: CardSize;",
        "}",
        "",
        "export const ARCHIVE_IMAGES: readonly ArchiveImage[] = [",
    ]
    for name, tw, th, size in entries:
        lines.append(
            f'  {{ name: "{name}", url: "/archive/sphere/{name}.webp", '
            f'width: {tw}, height: {th}, size: "{size}" }},'
        )
    lines += ["];", ""]
    TS_OUT.write_text("\n".join(lines), encoding="utf-8", newline="\n")

    counts = {s: list(sizes.values()).count(s) for s in SCALES}
    orphans = sorted(p.name for p in OUT.glob("*.webp") if p.stem not in dims)
    print(f"\n{len(files)} images ready  ->  {counts}")
    print(f"Wrote {TS_OUT.relative_to(ROOT)}")
    if orphans:
        print(f"Unused files in sphere/ (safe to delete): {', '.join(orphans)}")


if __name__ == "__main__":
    main()
