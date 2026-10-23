#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════
   BEHIND THE LAB · tools/build-catalog.js
   Builds data/catalog.js FROM THE LAB'S OWN FILES, so this site can never list a lesson the Lab does not have
   (or miss one it does). It reads ../the-lab:
     script.js   STRANDS, LESSONS, LESSON_GOALS, PASS_PCT, FACTS_PASS_PCT (the lesson list, titles, goals, gates)
     lessons.js  each math lesson's skill
     data/*.js   each lesson's 4 versions: how many questions, the parts of a lesson, one real sample question
     reading.js + data/rc*.js, rd*.js   the reading lessons (stories, item types, reading levels)
   No student data is read. Run:  node tools/build-catalog.js        (writes data/catalog.js)
                                  node tools/build-catalog.js --check (exit 1 if data/catalog.js is out of date
                                                                       or data/explain.js misses a lesson)
═══════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const HERE = path.resolve(__dirname, '..');
const LAB = process.env.LAB_DIR ? path.resolve(process.env.LAB_DIR) : path.resolve(HERE, '..', 'the-lab');
const read = rel => fs.readFileSync(path.join(LAB, rel), 'utf8');

/* a literal that starts at `const NAME =` in script.js, cut out by matching its brackets */
function literal(src, name) {
  const at = src.indexOf(`const ${name} = `);
  if (at < 0) throw new Error(`script.js has no "const ${name} ="`);
  let i = src.indexOf('=', at) + 1;
  while (/\s/.test(src[i])) i++;
  const open = src[i], close = open === '[' ? ']' : '}';
  let depth = 0, inStr = null;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (inStr) { if (c === '\\') { j++; continue; } if (c === inStr) inStr = null; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '/' && src[j + 1] === '/') { j = src.indexOf('\n', j); continue; }
    if (c === open) depth++;
    else if (c === close && --depth === 0) return vm.runInNewContext('(' + src.slice(i, j + 1) + ')');
  }
  throw new Error(`could not read ${name}`);
}
const num = (src, name) => Number((new RegExp(`const ${name}\\s*=\\s*(\\d+)`).exec(src) || [])[1]);

function build() {
  const src = read('script.js');
  const STRANDS = literal(src, 'STRANDS');
  const LESSONS = literal(src, 'LESSONS');
  const GOALS = literal(src, 'LESSON_GOALS');
  const PASS = num(src, 'PASS_PCT'), FACTS = num(src, 'FACTS_PASS_PCT');
  const LL = require(path.join(LAB, 'lessons.js'));
  const R = require(path.join(LAB, 'reading.js'));

  // every data file in one sandbox, the way the page loads them
  const box = { window: {} };
  box.self = box.window;
  vm.createContext(box);
  fs.readdirSync(path.join(LAB, 'data')).filter(f => /\.js$/.test(f)).sort()
    .forEach(f => vm.runInContext(fs.readFileSync(path.join(LAB, 'data', f), 'utf8'), box));
  const W = box.window;
  const RC = W.LAB_RC || {};

  const clean = s => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  const lessons = {};
  STRANDS.forEach(st => st.lessons.forEach((id, order) => {
    const L = LESSONS[id] || {};
    const reading = !!L.reading;
    let versions = [], stories = null;
    if (reading && RC[id]) {
      versions = RC[id].versions.map((_, vi) => R.bankOf(id, RC[id], vi));
      const all = [];
      RC[id].versions.forEach(v => { [v.teach && v.teach.story, v.pre.story, ...v.turn.map(x => x.story)].filter(Boolean).forEach(s => all.push(R.stats(s.paragraphs))); });
      if (RC[id].teach && RC[id].teach.story) all.push(R.stats(RC[id].teach.story.paragraphs));   // one teaching story for every version (Level 1)
      const fk = all.map(x => x.fk), words = all.map(x => x.words);
      stories = { count: all.length, fk: [Math.min(...fk), Math.max(...fk)].map(x => Math.round(x * 10) / 10), words: [Math.min(...words), Math.max(...words)],
        newTeachEveryTry: RC[id].versions.every(v => !!v.teach) };
    } else versions = W[`LAB_${id}_V`] || (W[`LAB_${id}`] ? [W[`LAB_${id}`]] : []);
    const v1 = versions[0] || [];
    // a retry teaches again on a NEW worked example? (the watch screens differ from version to version)
    const watchText = v => (v || []).filter(q => q.kind === 'watch').map(q => q.text || '').join('\n');
    const newTeach = versions.length > 1 && new Set(versions.map(watchText)).size === versions.length;
    const count = k => v1.filter(q => (k ? q.kind === k : !q.kind)).length;
    const points = v1.filter(q => !q.kind).reduce((n, q) => n + (reading ? R.pointsOf(q) : 1), 0);
    const pct = L.facts ? FACTS : PASS;
    const types = [...new Set(v1.filter(q => !q.kind).map(q => q.type || 'mc'))];
    const s = v1.find(q => !q.kind) || null;
    let sample = null;
    if (s) {
      if (s.type === 'ebsr') sample = { type: 'ebsr', q: clean(s.partA.q), choices: s.partA.choices.map(clean), answer: clean(s.partA.answer),
        b: { q: clean(s.partB.q), choices: s.partB.choices.map(clean), answer: clean(s.partB.answer) }, why: clean(s.partA.explanation) };
      else sample = { type: s.type || 'mc', q: clean(s.q), choices: (s.choices || []).map(clean), answer: clean(s.answer), why: clean(s.explanation) };
      if (s.story && W.LAB_STORIES && W.LAB_STORIES[s.story]) sample.story = { title: W.LAB_STORIES[s.story].title, paragraphs: W.LAB_STORIES[s.story].paragraphs.slice() };
    }
    const ll = (LL.LESSONS || []).find(x => x.id === id) || {};
    lessons[id] = {
      id, strand: st.id, order: order + 1, title: L.title, icon: L.icon, goal: GOALS[id] || '',
      skill: ll.skill || (reading ? [...new Set(v1.filter(q => !q.kind).flatMap(q => [].concat(q.skill || [])))].join(', ') : ''),
      facts: !!L.facts, check: !!L.check, reading, pre: L.pre !== false,
      parts: { pre: count('pre'), watch: count('watch'), step: count('step'), scored: count() },
      points, passPct: pct, need: Math.ceil(pct / 100 * points), versions: versions.length, newTeach, types, stories, sample
    };
  }));
  return { strands: STRANDS.map(st => ({ id: st.id, icon: st.icon, name: st.name, lessons: st.lessons.slice(), after: st.after || null })),
    lessons, pass: { other: PASS, facts: FACTS } };
}

function text(cat) {
  return '/* BUILT BY tools/build-catalog.js FROM ../the-lab — do not edit by hand; rebuild. No student data. */\n' +
    'window.BTL_CATALOG = ' + JSON.stringify(cat, null, 1) + ';\n';
}

/* every lesson of the Lab has its explanation (data/explain.js), and every strand its placement rule */
function explainGaps(cat) {
  const box = { window: {} }; vm.createContext(box);
  vm.runInContext(fs.readFileSync(path.join(HERE, 'data', 'explain.js'), 'utf8'), box);
  const E = box.window.BTL_EXPLAIN || { strands: {}, lessons: {} };
  const gaps = [];
  cat.strands.forEach(st => {
    const s = E.strands[st.id];
    if (!s) gaps.push(`strand ${st.id}: no explanation`);
    else ['area', 'level', 'why', 'who'].forEach(k => { if (!s[k]) gaps.push(`strand ${st.id}: no ${k}`); });
  });
  Object.keys(cat.lessons).forEach(id => {
    const l = E.lessons[id];
    if (!l) gaps.push(`lesson ${id}: no explanation`);
    else ['standard', 'reviews', 'level'].forEach(k => { if (!l[k]) gaps.push(`lesson ${id}: no ${k}`); });
  });
  Object.keys(E.lessons).forEach(id => { if (!cat.lessons[id]) gaps.push(`lesson ${id}: explained here but the Lab has no such lesson`); });
  return gaps;
}

if (require.main === module) {
  const cat = build();
  const out = path.join(HERE, 'data', 'catalog.js');
  const n = Object.keys(cat.lessons).length;
  if (process.argv.includes('--check')) {
    const stale = !fs.existsSync(out) || fs.readFileSync(out, 'utf8') !== text(cat);
    const gaps = explainGaps(cat);
    if (stale) console.log('✗ data/catalog.js is out of date with the Lab: run node tools/build-catalog.js');
    gaps.forEach(g => console.log('✗ ' + g));
    if (stale || gaps.length) process.exit(1);
    console.log(`✓ catalog matches the Lab: ${cat.strands.length} strands, ${n} lessons, every one explained`);
  } else {
    fs.writeFileSync(out, text(cat));
    console.log(`Wrote data/catalog.js: ${cat.strands.length} strands, ${n} lessons`);
  }
}
module.exports = { build, text, explainGaps };
