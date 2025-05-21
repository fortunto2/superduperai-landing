/* eslint-disable */
const fs = require("fs");
const path = require("path");

const DICT_PATH = path.join(__dirname, "../src/config/dictionaries/en.json");
const OUT_PATH = path.join(__dirname, "../src/types/translation.d.ts");

const interfaces = new Map();

function toInterface(obj: any, name = "TranslationDictionary"): string {
  let result = `export interface ${name} {\n`;
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === "string") {
      result += `  ${key}?: string;\n`;
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      const subName = capitalize(key) + "Dict";
      result += `  ${key}?: ${subName};\n`;
      if (!interfaces.has(subName)) {
        interfaces.set(subName, toInterface(value, subName));
      }
    }
    // Arrays and other types are not expected in translation files
  }
  result += `}\n`;
  return result;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function collectKeys(obj: any, prefix = ""): string[] {
  let keys: string[] = [];
  for (const key in obj) {
    const value = obj[key];
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      keys.push(path);
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      keys = keys.concat(collectKeys(value, path));
    }
  }
  return keys;
}

function main() {
  const dict = JSON.parse(fs.readFileSync(DICT_PATH, "utf-8"));
  interfaces.clear();
  const header = `// AUTO-GENERATED FILE. DO NOT EDIT.\n// Run scripts/generate-translation-types.ts to update.\n\n`;
  const mainIface = toInterface(dict, "TranslationDictionary");
  let allIfaces = mainIface;
  for (const [name, iface] of interfaces) {
    if (name !== "TranslationDictionary") {
      allIfaces += "\n" + iface;
    }
  }
  // Хардкод для CategoriesDict — делаем все ключи обязательными
  allIfaces = allIfaces.replace(
    /export interface CategoriesDict \{[^}]+\}/,
    `export interface CategoriesDict {\n  \"ai-video\": string;\n  business: string;\n  creative: string;\n  teams: string;\n}`
  );
  // Генерация типа TranslationKey
  const allKeys = collectKeys(dict);
  const keyType = `\nexport type TranslationKey =\n  ${allKeys.map((k) => `| '${k}'`).join("\n  ")};\n`;
  fs.writeFileSync(OUT_PATH, header + allIfaces + keyType, "utf-8");
  console.log(`Generated types at ${OUT_PATH}`);
}

main();
