/* ═══════════════════════════════════════════════════════
   BEHIND THE LAB · app.js
   Mr. Olivera 10/22: "a site to help with management and keep track of what each child is assigned and in what order …
   visual … an explanation of what each skill is reviewing and at what level … clickable … so if admin wanted to
   understand this project, it is easily explainable."
     The Lab in one page · The Map (every lesson, click for the details) · Who gets what (the placement rules)
     🔒 My Students (teacher PIN): each child's plan and the ORDER the Lab gives it (route.js = the Lab's own rules)
   PRIVACY: no student name is written in this file. Names come from the results sheet, only after the PIN, and show as
   "First L." (Mr. Olivera 10/22) until the teacher switches on full names — the switch is off again on every visit.
   This site only READS the sheet; it never writes to it.
═══════════════════════════════════════════════════════ */
(function () {
'use strict';
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzv8CWv1yyi8NeH04now9UxVL4IZm5yMqqsEGMcgGdrcAOWVB-aSp5siTvSSJXIUpzFMA/exec';
const TEACHER_PIN = '9377';
const C = window.BTL_CATALOG, E = window.BTL_EXPLAIN;
const R = window.BTLRoute.make(C);
const AREA_NAME = { facts: 'Math facts', number: 'Number sense', reading: 'Reading' };

const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strand = id => C.strands.find(s => s.id === id);
const areaOf = st => (E.strands[st.id] || {}).area || 'number';
const allLessons = C.strands.flatMap(s => s.lessons);

/* ── the explanations behind the "More" buttons on the first page ── */
const TOPICS = {
  'why-lab': ['Where the numbers come from', [
    'Grade 3 SBAC, Spring 2026: 17 of 22 students in this class scored Level 1 in ELA and 12 of 22 in math.',
    'Read Literary Texts IAB (10/20/2026): 10 of 21 students Below. The class got 54% of one-answer questions right, but 26% of Part A + Part B questions, 26% of "click the sentences" and 22% of "choose two".',
    'Place Value FIAB (10/21/2026): 6 Below, 11 At/Near, 2 Above. Rounding was the weakest skill (33% right; district 22%).',
    'The class\'s own practice sites (fact sites, rounding, place value, reading practice) show each student\'s exact mistakes — those are what each lesson is tailored to.']],
  'step-pre': ['🎯 Show what you know', [
    'A few questions first (5 in math, 2 or 3 in reading), only on the first try.',
    'All right = the lesson is skipped and counts as passed, so a child never sits through what they already know.',
    'Any wrong = the lesson teaches it, starting with "Now let\'s learn it."']],
  'step-watch': ['👀 Watch', [
    'A worked example, one idea per screen, with the same picture or story the questions use.',
    'It is read aloud and must be heard to the end before Next appears.',
    'In Adding and Subtracting, Big Numbers and Reading Level 2, a retry brings a NEW worked example, taught the same way (Mr. Olivera 10/21: "one method, new numbers"). In the other lessons the worked example repeats and the questions are new. Each lesson\'s page says which.']],
  'step-mine': ['⭐ One you missed before', [
    'On the first try, the child sees one of their OWN past mistakes from the class sites, worked out: the question, what they picked, the right answer and why.',
    'In reading, it comes from their own Read Literary practice misses.']],
  'step-steps': ['🪜 Step by step', [
    'The skill broken into small steps the child answers one at a time. Not scored.',
    'A miss shows the right answer and why, read aloud.']],
  'step-turn': ['✏️ Your turn', [
    'The scored questions: 10 in a math lesson (20 in a check), 8 points in reading (a Part A + Part B question is worth 2).',
    'Every wrong choice names the mistake, in the child\'s words.',
    'Passing opens the next lesson. Not passing: try again with new numbers or new stories.']],
  tailor: ['Made for each child', [
    'Each lesson adds the child\'s own missed facts or problems from the class sites (up to 4 per try), marked "You missed this one before".',
    'Picking the same wrong answer again is logged as a repeat — the teacher sees it on the dashboard.',
    'In reading, every wrong choice has a KIND (for example "true but not proof"). A child who keeps making one kind hears a short warning before the next lesson.',
    'A fact stays on the child\'s list until it is answered right twice in the Lab.']],
  pass: ['Passing and trying again', [
    'Math-facts lessons (adding, subtracting, multiplying) pass at 90%: 9 of 10, or 18 of 20 on a check (Mr. Olivera 10/17: "90% for facts only").',
    'Every other lesson passes at 75%: 8 of 10, 15 of 20 on a check, 6 of 8 points in reading (Mr. Olivera 10/20).',
    'A retry gets the next of 4 versions: new numbers or new stories, taught the same way. The best try counts.',
    'After 3 tries under the mark, the dashboard flags the lesson for the teacher (the child sees nothing).']],
  route: ['The order of lessons', [
    'Inside a strand, lessons go in order: a lesson opens when the one before it is passed.',
    'Some strands wait for another strand — but only when that strand is on the child\'s plan too (for example, Multiplying waits for Adding and Subtracting).',
    'Math and reading TAKE TURNS: after a math lesson comes a reading lesson, then math again. A missed lesson comes back on its turn.',
    'The plan page has one big ▶ Continue button that always points at the next lesson on this route.']],
  aloud: ['Everything is read aloud', [
    'Most students in the class read below grade level, so the Lab never lets reading get in the way of the math or the thinking.',
    'Every question, choice and passage has a speaker button; the choices stay locked until the question has been heard to the end.',
    'Reading stories must be heard all the way through before the questions open.']],
  records: ['Records', [
    'Every finished try is a row on the results sheet: the score, the time, every miss with what the child picked.',
    'The teacher\'s dashboard shows each child\'s lessons passed, their repeated mistakes, the kind of reading mistake they make most, and who is stuck.',
    'A written rationale for each child (the evidence for each assignment) and a running log of every try are kept on the teacher\'s computer.']],
  privacy: ['Privacy', [
    'No student\'s name is written in the Lab\'s code or in this site\'s code. Who is on a plan is a row on the results sheet.',
    'This site shows names only after the teacher PIN, and then as "First L." until the teacher switches on full names.',
    'Each child\'s scores and the evidence behind their assignments are not on the web at all: they stay on the teacher\'s computer.']]
};

/* ── the drawer ── */
let drawerBack = null;
function openDrawer(html, back) {
  drawerBack = back || null;
  $('#drawer-body').innerHTML = (back ? `<button class="more back" id="drawer-back">← ${esc(back.label)}</button>` : '') + html;
  $('#drawer').hidden = false;
  const b = $('#drawer-back');
  if (b) b.onclick = () => back.open();
  $('#drawer-close').focus();
}
function closeDrawer() { $('#drawer').hidden = true; }

function topicHTML(key) {
  const [title, lines] = TOPICS[key];
  return `<h2 id="drawer-title">${esc(title)}</h2>` + lines.map(l => `<p>${esc(l)}</p>`).join('');
}

/* one lesson, in full */
function lessonHTML(id) {
  const l = C.lessons[id], x = E.lessons[id] || {}, st = strand(l.strand), se = E.strands[st.id] || {};
  const what = l.reading
    ? `${l.parts.pre} Show-what-you-know question${l.parts.pre === 1 ? '' : 's'} on a short story · ${l.parts.watch} worked example${l.parts.watch === 1 ? '' : 's'} · ${l.parts.step} steps · ${l.parts.scored} scored question${l.parts.scored === 1 ? '' : 's'} (${l.points} points) on two new stories`
    : `${l.pre ? `${l.parts.pre} Show-what-you-know questions · ` : ''}${l.parts.watch} worked example${l.parts.watch === 1 ? '' : 's'} · ${l.parts.step} steps · ${l.parts.scored} scored questions`;
  const TYPE = { mc: 'one answer', ebsr: 'Part A + Part B', hot: 'click the sentences', ms: 'choose TWO' };
  const retry = `${l.versions} versions: a retry gets ${l.reading ? 'new stories' : 'new numbers'}` +
    (!l.parts.watch ? '.' : l.newTeach ? ' and a new worked example, taught the same way.' : ' (the worked example stays the same).');
  const s = l.sample;
  let sample = '';
  if (s) {
    const list = (choices, answer) => `<ul>${choices.map(c => `<li class="${c === answer ? 'right' : ''}">${esc(c)}</li>`).join('')}</ul>`;
    sample = `<div class="sample"><p><b>${esc(s.q)}</b></p>` +
      (s.type === 'hot' ? `<p class="muted">The child clicks sentences in the story. Right: ${esc(s.answer)}</p>` : list(s.choices, s.answer)) +
      (s.b ? `<p><b>${esc(s.b.q)}</b></p>${list(s.b.choices, s.b.answer)}` : '') +
      (s.why ? `<p class="muted">Why (what the child hears): ${esc(s.why)}</p>` : '') +
      (s.story ? `<details><summary>The story: "${esc(s.story.title)}"</summary>${s.story.paragraphs.map((p, i) => `<p>${i + 1}. ${esc(p)}</p>`).join('')}</details>` : '') + '</div>';
  }
  return `<h2 id="drawer-title">${esc(l.icon)} ${esc(l.title)}</h2>
    <p class="muted">${esc(st.icon)} ${esc(st.name)} · lesson ${l.order} of ${st.lessons.length} · ${esc(id)}</p>
    <div class="kid-view"><span class="lbl">What the child sees</span><p><b>${esc(l.title)}</b> — "You are learning to ${esc(l.goal)}."</p></div>
    <dl class="facts-list">
      <dt>Reviews</dt><dd>${esc(x.reviews || l.skill)}</dd>
      <dt>Standard</dt><dd>${esc(x.standard || '—')}</dd>
      <dt>Level</dt><dd>${esc(x.level || '')}${l.stories ? ` · ${l.stories.count} stories, ${l.stories.words[0]}–${l.stories.words[1]} words` : ''}</dd>
      <dt>On screen</dt><dd>${esc(what)}${l.types.length ? ` · ${esc(l.types.map(t => TYPE[t] || t).join(', '))}` : ''}</dd>
      <dt>To pass</dt><dd>${l.need} of ${l.points} (${l.passPct}%)${l.check ? ' · a check: no hints or pictures' : ''}</dd>
      <dt>Retries</dt><dd>${esc(retry)}</dd>
    </dl>
    <h4>A real question from this lesson</h4>${sample || '<p class="muted">—</p>'}
    <h4>Why this lesson is in the Lab</h4><p>${esc(se.why || '')}</p>
    <h4>Who gets it</h4><p>${esc(se.who || '')}</p>`;
}
function strandHTML(id) {
  const st = strand(id), se = E.strands[id] || {}, after = st.after && strand(st.after);
  return `<h2 id="drawer-title">${esc(st.icon)} ${esc(st.name)}</h2>
    <p class="muted">${esc(AREA_NAME[se.area] || '')} · ${st.lessons.length} lessons${after ? ` · opens after ${esc(after.name)} when both are on a plan` : ''}</p>
    <dl class="facts-list"><dt>Level</dt><dd>${esc(se.level)}</dd><dt>Why</dt><dd>${esc(se.why)}</dd><dt>Who gets it</dt><dd>${esc(se.who)}</dd><dt>Decided</dt><dd>${esc(se.decided || '')}</dd></dl>
    <h4>The lessons</h4><ol>${st.lessons.map(l => `<li><button class="more" data-lesson="${l}">${esc(C.lessons[l].title)}</button></li>`).join('')}</ol>`;
}

/* ── The Map ── */
function renderMap() {
  $('#n-lessons').textContent = String(allLessons.length);
  $('#map').innerHTML = C.strands.map(st => {
    const after = st.after && strand(st.after);
    return `<section class="lane ${areaOf(st)}" aria-label="${esc(st.name)}">
      <div class="lane-head"><h3>${esc(st.icon)} ${esc(st.name)}</h3>
        <button class="more" data-strand="${st.id}">Why this strand</button>
        ${after ? `<span class="gate">🔒 opens after ${esc(after.name)} (when both are on a plan)</span>` : ''}</div>
      <div class="tiles">${st.lessons.map((id, i) => `${i ? '<span class="arrow" aria-hidden="true">→</span>' : ''}<button class="tile" data-lesson="${id}" id="tile-${id}"><span class="code">${id}</span><span class="t">${esc(C.lessons[id].icon)} ${esc(C.lessons[id].title)}</span></button>`).join('')}</div>
    </section>`;
  }).join('');
}

/* ── Who gets what ── */
function renderWho() {
  $('#who').innerHTML = C.strands.map(st => {
    const se = E.strands[st.id] || {}, after = st.after && strand(st.after);
    return `<article class="card who-card ${areaOf(st)}"><h3>${esc(st.icon)} ${esc(st.name)}</h3>
      <dl><dt>Who gets it</dt><dd>${esc(se.who)}</dd><dt>Why</dt><dd>${esc(se.why)}</dd><dt>Level</dt><dd>${esc(se.level)}</dd>
      ${after ? `<dt>Order</dt><dd>Opens after ${esc(after.name)} when both are on the plan.</dd>` : ''}<dt>Decided</dt><dd>${esc(se.decided || '')}</dd></dl>
      <p><button class="more" data-strand="${st.id}">See its ${st.lessons.length} lessons</button></p></article>`;
  }).join('');
}

/* ── the sheet (read only) ── */
async function readTab(game) {
  const res = await fetch(`${SHEET_URL}?action=leaderboard&game=${encodeURIComponent(game)}`, { cache: 'no-store' });
  const rows = await res.json();
  return Array.isArray(rows) ? rows : [];
}
const planOf = row => { const m = row && /plan=([a-z,]+)/.exec(row.form || ''); return m ? m[1].split(',').filter(id => strand(id)) : null; };

/* live counts on the first page: how many students are on each strand (no names shown) */
async function renderCounts() {
  const box = $('#live-counts');
  try {
    const seed = await readTab('lab-seed');
    const plans = seed.map(planOf).filter(p => p && p.length);
    box.innerHTML = `<span class="n">${plans.length}</span> students have a Lab plan right now.` +
      `<span class="counts">${C.strands.map(st => `<span class="count-chip">${esc(st.icon)} ${esc(st.name)}: ${plans.filter(p => p.includes(st.id)).length}</span>`).join('')}</span>`;
  } catch (e) { box.textContent = 'The live counts could not be loaded right now.'; }
}

/* ── 🔒 My Students ── */
let ROWS = [], DASH = null, SHORT = {};
function displayName(n) { return $('#full-names').checked ? n : (SHORT[n] || n); }

function childState(name) {
  const seed = ROWS.seed.find(r => r.name === name);
  const plan = planOf(seed) || [];
  const prog = ROWS.progress.find(r => r.name === name);
  const passed = new Set(((/passed=([^|]*)/.exec((prog && prog.form) || '') || [])[1] || '').split(',').filter(id => C.lessons[id]));
  const tries = {}, best = {}, when = {};
  let last = null, lastT = 0;
  if (DASH) allLessons.forEach(id => {
    const st = (DASH['lab-' + id.toLowerCase()] || []).find(s => s.name === name);
    (st && st.sessions || []).filter(s => s.status === 'complete').forEach(s => {
      tries[id] = (tries[id] || 0) + 1;
      const pct = Number(s.percent) || 0;
      if (!best[id] || pct > best[id].pct) best[id] = { pct, score: s.score, total: s.total };
      const t = new Date(s.timestamp).getTime() || 0;
      if (pct >= C.lessons[id].passPct) { passed.add(id); if (!when[id] || t < when[id]) when[id] = t; }
      if (t > lastT && plan.some(p => strand(p).lessons.includes(id))) { lastT = t; last = id; }
    });
  });
  const route = R.child(plan, [...passed], last);
  return { plan, passed, tries, best, when, route, order: route.order(), hasRow: !!seed };
}

function renderRoster() {
  const names = ROWS.seed.map(r => r.name).sort((a, b) => a.localeCompare(b));
  SHORT = window.BTLRoute.shortNames(names);
  $('#roster').innerHTML = `<table class="roster"><thead><tr><th>Student</th><th>Plan, in order</th><th>Next lesson</th><th>Passed</th></tr></thead><tbody>` +
    names.map(n => {
      const c = childState(n);
      const total = c.plan.reduce((k, p) => k + strand(p).lessons.length, 0);
      const done = c.plan.reduce((k, p) => k + strand(p).lessons.filter(id => c.passed.has(id)).length, 0);
      const next = c.order[0];
      return `<tr class="kid" data-kid="${esc(n)}"><td><button class="kid-name" data-kid="${esc(n)}">${esc(displayName(n))}</button></td>
        <td>${c.plan.length ? c.plan.map(p => { const st = strand(p); return `<span class="chip ${areaOf(st)}">${esc(st.icon)} ${esc(st.name)}</span>`; }).join('') : '<span class="no-plan">No plan yet</span>'}</td>
        <td>${next ? `${esc(C.lessons[next].icon)} ${esc(C.lessons[next].title)}` : (c.plan.length ? '✅ all open lessons passed' : '—')}</td>
        <td>${c.plan.length ? `${done} of ${total}` : ''}</td></tr>`;
    }).join('') + '</tbody></table>';
}

function childHTML(name) {
  const c = childState(name);
  const head = `<h2 id="drawer-title">${esc(displayName(name))}</h2>`;
  if (!c.plan.length) return head + '<p class="no-plan">No Lab plan yet.</p>';
  const node = id => {
    const cls = c.passed.has(id) ? 'passed' : id === c.order[0] ? 'next' : c.tries[id] ? 'tried' : c.route.wait(id) ? 'waiting' : '';
    const mark = c.passed.has(id) ? '✅' : id === c.order[0] ? '⭐' : c.tries[id] ? '🔁' : c.route.wait(id) ? '🔒' : '·';
    const tip = c.passed.has(id) ? `Passed${c.best[id] ? `, best ${c.best[id].score} of ${c.best[id].total}` : ''}${c.when[id] ? ` on ${new Date(c.when[id]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}`
      : c.tries[id] ? `${c.tries[id]} tr${c.tries[id] === 1 ? 'y' : 'ies'}, best ${c.best[id].pct}%` : c.route.wait(id) || 'Open';
    return `<button class="node ${cls}" data-lesson="${id}" title="${esc(tip)}">${mark} ${esc(C.lessons[id].title)}<br><small>${esc(tip)}</small></button>`;
  };
  const strands = c.plan.map(p => { const st = strand(p), se = E.strands[p] || {};
    return `<div class="route-strand ${areaOf(st)}"><h4>${esc(st.icon)} ${esc(st.name)}</h4><div class="nodes">${st.lessons.map(node).join('')}</div>
      <div class="why-box"><b>Why this assignment:</b> ${esc(se.who)}</div></div>`; }).join('');
  const order = c.order.length
    ? `<ol class="order">${c.order.map((id, i) => `<li>${i === 0 ? '⭐ ' : ''}${esc(C.lessons[id].title)} <span class="muted">(${esc(strand(C.lessons[id].strand).name)})</span></li>`).join('')}</ol>`
    : '<p>Every lesson on the plan is passed.</p>';
  return head + `<p class="muted">Plan: ${c.plan.map(p => esc(strand(p).name)).join(' → ')}</p>
    <h4>The order the Lab will give the lessons still to do</h4><p class="muted">If each lesson is passed when its turn comes; a missed lesson comes back on its turn. Math and reading take turns.</p>${order}
    <h4>Every lesson on the plan</h4>${strands}
    <p class="evidence-note">The evidence for this child (their test items, scores and the decision behind each assignment) is in your local copy: <b>Behind the LAB - Evidence.html</b> in Student Data (local only)/lab-docs. It is never put on the web.</p>`;
}

async function openStudents() {
  $('#pin-box').hidden = true;
  $('#students').hidden = false;
  $('#full-names').checked = false;   // off on every visit
  $('#students-status').textContent = 'Reading the plans…';
  try {
    const [seed, progress] = await Promise.all([readTab('lab-seed'), readTab('lab-progress')]);
    ROWS = { seed, progress };
    renderRoster();
    $('#students-status').textContent = 'Plans loaded. Reading every try and date (about a minute)…';
    const res = await fetch(`${SHEET_URL}?action=dashboard`, { cache: 'no-store' });
    const raw = await res.json();
    DASH = {};
    Object.entries(raw).forEach(([k, v]) => { if (/^lab-/.test(k.toLowerCase())) DASH[k.toLowerCase()] = v; });
    renderRoster();
    $('#students-status').textContent = `Up to date at ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}.`;
  } catch (e) {
    $('#students-status').textContent = 'The results sheet could not be reached. Try again in a minute.';
  }
}

/* ── views ── */
function show(view) {
  ['overview', 'map', 'who', 'students'].forEach(v => {
    $(`#view-${v}`).hidden = v !== view;
    $(`#tab-${v}`).setAttribute('aria-selected', String(v === view));
  });
  if (location.hash !== '#' + view) history.replaceState(null, '', '#' + view);
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-view],[data-explain],[data-lesson],[data-strand],[data-kid]');
  if (!t) { if (e.target === $('#drawer')) closeDrawer(); return; }
  if (t.dataset.view) return show(t.dataset.view);
  if (t.dataset.explain) return openDrawer(topicHTML(t.dataset.explain));
  const inKid = $('#drawer').hidden ? null : $('#drawer-body').dataset.kid;
  if (t.dataset.lesson) {
    const back = inKid ? { label: displayName(inKid), open: () => openKid(inKid) } : null;
    $('#drawer-body').dataset.kid = '';
    return openDrawer(lessonHTML(t.dataset.lesson), back);
  }
  if (t.dataset.strand) { $('#drawer-body').dataset.kid = ''; return openDrawer(strandHTML(t.dataset.strand)); }
  if (t.dataset.kid) return openKid(t.dataset.kid);
});
function openKid(name) { openDrawer(childHTML(name)); $('#drawer-body').dataset.kid = name; }
$('#drawer-close').onclick = closeDrawer;
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
$('#pin-form').addEventListener('submit', e => {
  e.preventDefault();
  if ($('#pin-input').value === TEACHER_PIN) { $('#pin-msg').textContent = ''; $('#pin-input').value = ''; openStudents(); }
  else $('#pin-msg').textContent = 'That PIN is not right.';
});
$('#full-names').addEventListener('change', () => { renderRoster(); const k = $('#drawer-body').dataset.kid; if (k && !$('#drawer').hidden) openKid(k); });

renderMap();
renderWho();
renderCounts();
show(['overview', 'map', 'who', 'students'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'overview');
})();
