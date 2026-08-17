const fs = require("fs");
const zlib = require("zlib");

const buf = fs.readFileSync(process.argv[2]);
const s = buf.toString("latin1");
const streamRe = /\/Length (\d+)[\s\S]{0,120}?stream\r?\n/g;
let m;
let index = 0;

while ((m = streamRe.exec(s))) {
  const len = Number(m[1]);
  const start = m.index + m[0].length;
  let text;
  try {
    text = zlib.inflateSync(buf.subarray(start, start + len)).toString("latin1");
  } catch {
    continue;
  }
  if (!/\bTf\b/.test(text)) continue;
  index += 1;
  console.log(`===== stream ${index} =====`);

  const sizes = new Map();
  for (const t of text.matchAll(/\/(F\d+)\s+([\d.]+)\s+Tf/g)) {
    const key = `${t[1]}@${t[2]}`;
    sizes.set(key, (sizes.get(key) ?? 0) + 1);
  }
  console.log("fonts:", [...sizes.entries()].map(([k, v]) => `${k} x${v}`).join(", "));

  const colors = new Map();
  for (const t of text.matchAll(
    /([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+(rg|RG|scn|SCN)/g,
  )) {
    const hex = [t[1], t[2], t[3]]
      .map((v) => Math.round(Number(v) * 255).toString(16).padStart(2, "0"))
      .join("");
    const key = `#${hex} (${t[4]})`;
    colors.set(key, (colors.get(key) ?? 0) + 1);
  }
  console.log("colors:", [...colors.entries()].map(([k, v]) => `${k} x${v}`).join(", "));

  const rects = [...text.matchAll(/([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+) re/g)].map(
    (t) => t.slice(1).map(Number),
  );
  const big = rects.filter((r) => Math.abs(r[2]) > 40 || Math.abs(r[3]) > 40);
  console.log("large rects (x,y,w,h):", big.slice(0, 10).map((r) => r.join(",")).join(" | "));
  const small = rects.filter((r) => Math.abs(r[2]) <= 40 && Math.abs(r[3]) <= 40);
  console.log("small rects sample:", small.slice(0, 6).map((r) => r.join(",")).join(" | "));

  const tms = [...text.matchAll(/1 0 0 1 ([-\d.]+) ([-\d.]+) (?:cm|Tm)/g)].map((t) => ({
    x: Number(t[1]),
    y: Number(t[2]),
  }));
  const xs = [...new Set(tms.map((t) => Math.round(t.x)))].sort((a, b) => a - b);
  console.log("distinct x offsets:", xs.slice(0, 25).join(", "));
}
