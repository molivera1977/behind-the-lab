/* ═══════════════════════════════════════════════════════
   BEHIND THE LAB · route.js — the ORDER the Lab gives a child their lessons, and why a lesson is waiting
   A copy of the Lab's own rules (the-lab/script.js: passPct, lessonWait, nextStep, isReadingStrand), so what this
   page shows is what the child sees. Used in the browser (window.BTLRoute) and by the tests (require).
   The rules, in Mr. Olivera's words:
     - lessons of a strand go in order; a lesson opens when the one before it is passed
     - a strand with "after" waits for that strand only when it is on the child's plan too (10/21)
     - math and reading TAKE TURNS (10/20): after a math lesson, reading; after reading, math; with nothing done
       yet, the plan row's first strand
     - a missed lesson is still not passed, so it comes back on its turn
═══════════════════════════════════════════════════════ */
(function (root) {
'use strict';

/* the short name shown by default (Mr. Olivera 10/22: "first name and last initial"): the sheet's
   "Last, First" → "First L." — and when two children would read the same, more letters of the last name */
function shortNames(names) {
  const parts = n => { const m = /^([^,]+),\s*(.+)$/.exec(String(n)); return m ? { first: m[2].trim(), last: m[1].trim() } : { first: String(n), last: '' }; };
  const out = {};
  const list = names.map(n => ({ n, ...parts(n) }));
  list.forEach(x => {
    let k = 1, label;
    for (;;) {
      label = x.last ? `${x.first} ${x.last.slice(0, k)}.` : x.first;
      const clash = list.some(y => y.n !== x.n && y.first === x.first && y.last.slice(0, k) === x.last.slice(0, k));
      if (!clash || k >= x.last.length) break;
      k++;
    }
    out[x.n] = label;
  });
  return out;
}

function make(catalog) {
  const S = catalog.strands, L = catalog.lessons;
  const strandOf = id => S.find(st => st.lessons.includes(id));
  const isReadingStrand = st => !!st && st.lessons.some(id => L[id] && L[id].reading);

  /* one child: plan = strand ids in plan order; passedSet = lessons passed; last = the last lesson finished (or null) */
  function child(plan, passedSet, last) {
    const passed = new Set(passedSet);
    const strands = plan.map(id => S.find(st => st.id === id)).filter(Boolean);
    const strandPassed = sid => { const st = S.find(x => x.id === sid); return !!st && st.lessons.every(id => passed.has(id)); };
    function wait(id) {
      const st = strandOf(id);
      if (!st) return 'Not in the Lab';
      if (st.after && plan.includes(st.after) && !strandPassed(st.after)) {
        const first = S.find(x => x.id === st.after);
        return `Pass ${first ? first.name : 'the strand before'} first`;
      }
      const i = st.lessons.indexOf(id);
      if (i > 0 && !passed.has(st.lessons[i - 1])) return `Pass ${L[st.lessons[i - 1]].title} first`;
      return '';
    }
    function next(lastDone) {
      const open = st => st.lessons.find(id => !passed.has(id) && !wait(id)) || null;
      const firstOpen = list => list.map(open).find(Boolean) || null;
      const math = strands.filter(st => !isReadingStrand(st)), read = strands.filter(isReadingStrand);
      const nm = firstOpen(math), nr = firstOpen(read);
      if (!nm || !nr) return nm || nr;
      if (!lastDone) return isReadingStrand(strands[0]) ? nr : nm;
      return L[lastDone] && L[lastDone].reading ? nm : nr;
    }
    /* the order still to come, if each lesson is passed when its turn comes */
    function order() {
      const out = [];
      const keep = new Set(passed);
      let lastDone = last;
      for (let guard = 0; guard < 200; guard++) {
        const n = next(lastDone);
        if (!n) break;
        out.push(n);
        passed.add(n);
        lastDone = n;
      }
      passed.clear(); keep.forEach(x => passed.add(x));
      return out;
    }
    return { strands, wait, next: () => next(last), order, passed: id => passed.has(id) };
  }
  return { child, strandOf, isReadingStrand };
}

const api = { make, shortNames };
if (typeof module === 'object' && module.exports) module.exports = api;
else root.BTLRoute = api;
})(typeof self !== 'undefined' ? self : this);
