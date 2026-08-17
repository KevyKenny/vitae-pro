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

  console.log(
    "all re:",
    [...text.matchAll(/([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+) re\s*(f|S|W n|B)?/g)]
      .map((t) => `[${t[1]},${t[2]},${t[3]},${t[4]}]${t[5] ? t[5] : ""}`)
      .slice(0, 30)
      .join(" "),
  );

  console.log(
    "lines:",
    [...text.matchAll(/([-\d.]+) ([-\d.]+) m\s+([-\d.]+) ([-\d.]+) l/g)]
      .map((t) => `(${t[1]},${t[2]})->(${t[3]},${t[4]})`)
      .slice(0, 20)
      .join(" "),
  );

  console.log(
    "gray fills (g):",
    [...new Set([...text.matchAll(/(^|\s)([\d.]+)\s+g\s/g)].map((t) => t[2]))].join(", "),
  );

  const firstText = [...text.matchAll(/([-\d.]+) ([-\d.]+) Td/g)]
    .map((t) => `${t[1]},${t[2]}`)
    .slice(0, 8);
  console.log("first Td:", firstText.join(" | "));

  const bt = [...text.matchAll(/BT[\s\S]{0,120}?([-\d.]+) ([-\d.]+) Td/g)]
    .map((t) => Math.round(Number(t[1])))
    .filter((x) => Number.isFinite(x));
  console.log("distinct BT x:", [...new Set(bt)].sort((a, b) => a - b).join(", "));
}
