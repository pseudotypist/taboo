#!/usr/bin/env node
// Builds cards.js from data/*.txt.
//   node tools/build-cards.mjs [path/to/cefrj-vocabulary-profile.csv]
// Without the CSV it keeps the levels stored in data/levels.json (or the estimates in the txt files).
// With the CSV it looks every English head word up in the CEFR-J list, rewrites data/levels.json
// and reports where the list disagrees with the estimate.
// A level written with a leading '=' (e.g. "=A2|penguin,...") is forced: it is used as-is and
// never replaced by the stored level or the CEFR-J lookup.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'data');
const LEVELS = ['A1', 'A2', 'B1', 'B2'];
const CATS = ['food', 'nature', 'home', 'places', 'people', 'body', 'tech', 'fun', 'school', 'actions', 'daily', 'world'];
const csvPath = process.argv[2];

// ---- optional CEFR-J lookup -------------------------------------------------
let cefr = null;
if (csvPath) {
  cefr = new Map();
  const rank = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4, C2: 5 };
  for (const line of readFileSync(csvPath, 'utf8').split(/\r?\n/).slice(1)) {
    const [head, , lvl] = line.split(',');
    if (!head || !(lvl in rank)) continue;
    for (const variant of head.split('/')) {
      const key = variant.trim().toLowerCase();
      if (!cefr.has(key) || rank[lvl] < rank[cefr.get(key)]) cefr.set(key, lvl);
    }
  }
}
const spellings = (w) => {
  const out = [w];
  if (w.endsWith('s')) out.push(w.slice(0, -1));
  out.push(w.replace(/ise$/, 'ize'), w.replace(/our$/, 'or'), w.replace(/tre$/, 'ter'), w.replace(/ing$/, ''));
  return out;
};
const lookup = (word) => {
  if (!cefr) return null;
  for (const s of spellings(word.toLowerCase())) if (cefr.has(s)) return cefr.get(s);
  return null;
};

// ---- read + validate --------------------------------------------------------
const levelsFile = join(dataDir, 'levels.json');
const stored = !cefr && existsSync(levelsFile) ? JSON.parse(readFileSync(levelsFile, 'utf8')) : {};
const errors = [], changed = [], notFound = [], hardTaboo = [], forcedList = [];
const cards = [], ids = new Set(), levelsOut = {};

// Card files are numbered ("01-food.txt"); the other txt files in data/ are the gloss tables.
for (const file of readdirSync(dataDir).filter((f) => /^\d+-.+\.txt$/.test(f)).sort()) {
  const cat = file.replace(/^\d+-/, '').replace(/\.txt$/, '');
  const ci = CATS.indexOf(cat);
  if (ci < 0) { errors.push(`${file}: unknown category "${cat}"`); continue; }
  readFileSync(join(dataDir, file), 'utf8').split(/\r?\n/).forEach((raw, n) => {
    const line = raw.trim();
    if (!line || line.startsWith('#')) return;
    const where = `${file}:${n + 1}`;
    const parts = line.split('|');
    if (![4, 5].includes(parts.length)) return errors.push(`${where}: expected 4 or 5 fields, got ${parts.length}`);
    const [rawLevel] = parts;
    const langs = parts.slice(1, 4);
    const forced = rawLevel.startsWith('=');
    const est = forced ? rawLevel.slice(1) : rawLevel;
    if (!LEVELS.includes(est)) return errors.push(`${where}: bad level "${est}"`);
    const [en, tr, zh] = langs.map((l) => l.split(',').map((s) => s.trim()));
    const pinyin = parts[4] === undefined ? [] : parts[4].split(',').map((s) => s.trim());
    if (parts[4] !== undefined && (pinyin.length !== 6 || pinyin.some((s) => !s))) {
      errors.push(`${where}: pinyin must contain the target reading and 5 taboo readings`);
    }
    for (const [name, arr] of [['en', en], ['tr', tr], ['zh', zh]]) {
      if (arr.length !== 6) errors.push(`${where}: ${name} has ${arr.length} items, need 6 (${arr[0]})`);
      if (arr.some((s) => !s)) errors.push(`${where}: ${name} has an empty item`);
      if (new Set(arr.map((s) => s.toLowerCase())).size !== arr.length) errors.push(`${where}: ${name} repeats a word (${arr[0]})`);
    }
    const id = en[0].toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (ids.has(id)) return errors.push(`${where}: duplicate card "${en[0]}"`);
    ids.add(id);

    let level = forced ? est : stored[id] || est;
    if (cefr) {
      const found = lookup(en[0]);
      if (forced) forcedList.push(`${en[0]}: ${est} (CEFR-J: ${found || 'not listed'})`);
      else if (!found) notFound.push(`${en[0]} (kept ${est})`);
      else if (LEVELS.includes(found)) { if (found !== est) changed.push(`${en[0]}: ${est} -> ${found}`); level = found; }
      else { changed.push(`${en[0]}: ${est} -> ${found} (capped at B2)`); level = 'B2'; }
      for (const t of en.slice(1)) {
        const tl = lookup(t);
        if (tl && !LEVELS.includes(tl)) hardTaboo.push(`${en[0]}: "${t}" is ${tl}`);
      }
    }
    levelsOut[id] = level;
    cards.push([id, ci, LEVELS.indexOf(level), en, tr, zh, pinyin]);
  });
}

if (errors.length) { console.error('ERRORS:\n' + errors.join('\n')); process.exit(1); }

// ---- glosses: English for Chinese taboo words, Chinese (+ pinyin) for English ones ----
// data/gloss-zh-en.txt   汉字|english        and  汉字@card-id|english
// data/gloss-en-zh.txt   english|汉字        and  english@card-id|汉字
// data/pinyin-extra.txt  汉字|pin yin        for Chinese glosses the deck itself never uses
const readTable = (name) => {
  const file = join(dataDir, name), general = new Map(), perCard = new Map();
  if (!existsSync(file)) return { general, perCard };
  readFileSync(file, 'utf8').split(/\r?\n/).forEach((raw, n) => {
    const line = raw.trim();
    if (!line || line.startsWith('#')) return;
    const cut = line.indexOf('|');
    const key = line.slice(0, cut).trim(), value = line.slice(cut + 1).trim();
    if (cut < 1 || !value) return errors.push(`${name}:${n + 1}: expected "word|gloss"`);
    const at = key.lastIndexOf('@');
    if (at < 0) general.set(key, value);
    else perCard.set(`${key.slice(at + 1)}|${key.slice(0, at)}`, value);
  });
  return { general, perCard };
};
const zhEn = readTable('gloss-zh-en.txt'), enZh = readTable('gloss-en-zh.txt');
const pinyinOf = new Map(readTable('pinyin-extra.txt').general);
for (const c of cards) c[5].forEach((w, i) => { if (c[6][i]) pinyinOf.set(w, c[6][i]); });

const byEnHead = new Map(cards.map((c) => [c[3][0], c])), byZhHead = new Map(cards.map((c) => [c[5][0], c]));
const gloss = { ze: {}, ez: {}, zo: {}, eo: {} };
const noGloss = { zh: new Set(), en: new Set() }, noPinyin = new Set(), usedOverrides = new Set();
const withPinyin = (zh) => { if (!pinyinOf.has(zh)) noPinyin.add(zh); return [zh, pinyinOf.get(zh) || '']; };
for (const c of cards) {
  for (let i = 1; i < 6; i++) {
    const zw = c[5][i], ew = c[3][i], zKey = `${c[0]}|${zw}`, eKey = `${c[0]}|${ew}`;
    if (zhEn.perCard.has(zKey)) { gloss.zo[zKey] = zhEn.perCard.get(zKey); usedOverrides.add('zh ' + zKey); }
    const zDefault = zhEn.general.get(zw) || (byZhHead.has(zw) ? byZhHead.get(zw)[3][0] : '');
    if (zDefault) gloss.ze[zw] = zDefault; else if (!gloss.zo[zKey]) noGloss.zh.add(zw);
    if (enZh.perCard.has(eKey)) { gloss.eo[eKey] = withPinyin(enZh.perCard.get(eKey)); usedOverrides.add('en ' + eKey); }
    const eDefault = enZh.general.get(ew) || (byEnHead.has(ew) ? byEnHead.get(ew)[5][0] : '');
    if (eDefault) gloss.ez[ew] = withPinyin(eDefault); else if (!gloss.eo[eKey]) noGloss.en.add(ew);
  }
}
const staleOverrides = [
  ...[...zhEn.perCard.keys()].filter((k) => !usedOverrides.has('zh ' + k)),
  ...[...enZh.perCard.keys()].filter((k) => !usedOverrides.has('en ' + k)),
];

if (errors.length) { console.error('ERRORS:\n' + errors.join('\n')); process.exit(1); }

if (cefr) writeFileSync(levelsFile, JSON.stringify(levelsOut, null, 0).replace(/,"/g, ',\n"') + '\n');
writeFileSync(
  join(root, 'cards.js'),
  '// Generated by tools/build-cards.mjs — edit data/*.txt instead.\n' +
    '// [id, category index, level index (A1,A2,B1,B2), [en word + 5 taboo], [tr …], [zh …], [pinyin …]]\n' +
    'window.TABU_CATS = ' + JSON.stringify(CATS) + ';\n' +
    'window.TABU_CARDS = [\n' + cards.map((c) => JSON.stringify(c)).join(',\n') + '\n];\n' +
    '// Glosses for taboo words. ze: 汉字 -> English, ez: English -> [汉字, pinyin];\n' +
    '// zo / eo: the same for one card only, keyed "card-id|word".\n' +
    'window.TABU_GLOSS = ' + JSON.stringify(gloss) + ';\n'
);

// ---- report -----------------------------------------------------------------
const byLevel = LEVELS.map((l, i) => `${l}: ${cards.filter((c) => c[2] === i).length}`).join('  ');
const byCat = CATS.map((c, i) => `${c}: ${cards.filter((x) => x[1] === i).length}`).join('  ');
console.log(`cards: ${cards.length}\nlevels  ${byLevel}\ncats    ${byCat}`);
console.log(`glosses 汉字->English: ${Object.keys(gloss.ze).length} (+${Object.keys(gloss.zo).length} per card)  English->汉字: ${Object.keys(gloss.ez).length} (+${Object.keys(gloss.eo).length} per card)`);
const warn = (title, list) => { if (list.length) console.log(`\nWARNING ${title} (${list.length}):\n  ` + list.join(', ')); };
warn('Chinese taboo words without an English gloss', [...noGloss.zh]);
warn('English taboo words without a Chinese gloss', [...noGloss.en]);
warn('Chinese glosses without pinyin (add them to data/pinyin-extra.txt)', [...noPinyin]);
warn('per-card glosses that match no card or word', staleOverrides);
if (cefr) {
  console.log(`\nCEFR-J changed ${changed.length} level(s):\n  ` + changed.join('\n  '));
  console.log(`\nforced levels (${forcedList.length}), lookup ignored:\n  ` + forcedList.join('\n  '));
  console.log(`\nnot in CEFR-J (${notFound.length}), estimate kept:\n  ` + notFound.join(', '));
  console.log(`\ntaboo words above B2 (${hardTaboo.length}):\n  ` + hardTaboo.join('\n  '));
}
