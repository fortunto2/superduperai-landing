/* eslint-disable */
const fs = require('fs');
const { execSync } = require('child_process');

if (process.argv.length < 3) {
  console.error('Usage: node translate-dictionary.js <lang>');
  process.exit(1);
}

const target = process.argv[2];
const enPath = 'src/config/dictionaries/en.json';
const outPath = `src/config/dictionaries/${target}.json`;
const data = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

function translate(text) {
  // escape quotes
  const escaped = text.replace(/"/g, '\\"');
  const cmd = `echo "${escaped}" | trans -b en:${target}`;
  let out = execSync(cmd).toString().trim();
  // Restore any {year} placeholders that may be translated
  out = out.replace(/\{[^\}]*\}/g, '{year}');
  return out;
}

function walk(obj) {
  if (typeof obj === 'string') {
    return translate(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(walk);
  } else if (obj && typeof obj === 'object') {
    const res = {};
    for (const k in obj) {
      res[k] = walk(obj[k]);
    }
    return res;
  } else {
    return obj;
  }
}

async function main() {
  const translated = walk(data);
  fs.writeFileSync(outPath, JSON.stringify(translated, null, 2));
  console.log('Written', outPath);
}

main();
