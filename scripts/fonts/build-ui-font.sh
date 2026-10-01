#!/usr/bin/env bash
# Rebuilds apps/web/src/fonts/Archivo-grafish.woff2, the studio's UI face.
#
# Source: google/fonts ofl/archivo/Archivo[wdth,wght].ttf (OFL 1.1, no Reserved Font Name),
# pinned to commit 9710da1eacb3be272583c3224dcb70f9da6eadbb.
# Clipped to the axis ranges the UI uses (wght 400-900, wdth 62-100) and subset to Latin +
# Latin-1 + common punctuation: 90 KB (Google's latin subset) -> 56 KB.
#
# Requires: python3 with `pip install fonttools brotli`.
set -euo pipefail

REV=9710da1eacb3be272583c3224dcb70f9da6eadbb
OUT="$(cd "$(dirname "$0")/../.." && pwd)/apps/web/src/fonts"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

curl -sfL -o "$WORK/Archivo.ttf" \
  "https://raw.githubusercontent.com/google/fonts/$REV/ofl/archivo/Archivo%5Bwdth%2Cwght%5D.ttf"

python3 - "$WORK" <<'PY'
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
work = sys.argv[1]
font = TTFont(f"{work}/Archivo.ttf")
instantiateVariableFont(font, {"wght": (400, 400, 900), "wdth": (62, 100, 100)}, inplace=True)
font.save(f"{work}/clipped.ttf")
PY

pyftsubset "$WORK/clipped.ttf" \
  --unicodes="U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2013-2014,U+2018-201E,U+2022,U+2026,U+2039-203A,U+2044,U+20AC,U+2122,U+2212" \
  --layout-features="kern,liga,calt,tnum,lnum,case,ccmp,locl,mark,mkmk" \
  --flavor=woff2 \
  --output-file="$OUT/Archivo-grafish.woff2"

ls -l "$OUT/Archivo-grafish.woff2"
