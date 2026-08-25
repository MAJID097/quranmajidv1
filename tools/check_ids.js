const fs = require("fs");
const js = fs.readFileSync("static/js/main.js", "utf8");
const html = fs.readFileSync("templates/index.html", "utf8");
const ids = new Set();
for (const m of js.matchAll(/\$\("([\w-]+)"\)/g)) ids.add(m[1]);
const missing = [...ids].filter((id) => !html.includes(`id="${id}"`));
console.log("IDs used in JS:", ids.size);
console.log("MISSING in HTML:", missing.length ? missing : "none");
const cls = [...js.matchAll(/querySelector\("\.([\w-]+)/g)].map((m) => m[1]);
const clsAll = [...js.matchAll(/querySelectorAll\("\.([\w-]+)/g)].map((m) => m[1]);
for (const c of [...new Set([...cls, ...clsAll])]) {
  if (!html.includes(c) && !fs.readFileSync("static/css/style.css", "utf8").includes("." + c)) {
    console.log("class not found anywhere:", c);
  }
}
console.log("class check done");
