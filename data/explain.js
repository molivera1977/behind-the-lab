/* ═══════════════════════════════════════════════════════
   BEHIND THE LAB · data/explain.js — the WHY behind every strand and lesson (written by hand)
   The lesson LIST comes from the Lab itself (data/catalog.js, built by tools/build-catalog.js); this file only explains
   it. tools/build-catalog.js --check fails if the Lab has a lesson this file does not explain.
   CLASS-LEVEL facts only. No student is named here or anywhere in this site's code: who is on which plan is read from
   the results sheet at run time, behind the teacher PIN. Each child's own evidence stays on Mr. O's computer.
═══════════════════════════════════════════════════════ */
window.BTL_EXPLAIN = {

/* ── each strand: the area, the level of the work, why the Lab teaches it, and who gets it (the placement rule) ── */
strands: {
  as: {
    area: 'facts',
    level: 'Grade 1–2 skill: fluency with adding and subtracting within 20 (a Grade 2 standard).',
    why: 'Every 4th-grade operation — multiplying, dividing, adding and subtracting big numbers — rests on these facts. On our fact sites (September–October), the students placed here counted on wrongly, counted the start number twice, or guessed. Mr. Olivera (10/17): "If they can\'t add or subtract, how are they going to multiply and divide?"',
    who: 'Every student on Lab math starts here. A student who already knows a lesson skips it: all 5 Show-what-you-know questions right = the lesson is skipped. Facts lessons pass at 90%.',
    decided: '10/17 — the first strand for every Lab math student.'
  },
  mu: {
    area: 'facts',
    level: 'Grade 3 skill (the meaning of multiplication and the facts), plus one Grade 4 idea ("times as many").',
    why: 'Students answered × facts by guessing on our fact sites. The strand teaches what × MEANS (equal groups, arrays, skip counting) before the facts, so a fact is something a student can rebuild, not just remember.',
    who: 'On plans that include Adding and Subtracting. It opens only after that whole strand is passed (Mr. Olivera 10/17: "repeated addition means nothing if they can\'t [add]").',
    decided: '10/17 — locked until Adding and Subtracting to 20 is passed.'
  },
  pv: {
    area: 'number',
    level: 'Grade 2–4: ones to thousands, expanded form, comparing, renaming, ×10 and ×100.',
    why: 'Place Value FIAB (10/21): 19 students tested, 6 Below, 11 At/Near, 2 Above. Comparing numbers written in different forms was 38% right. Our own place-value sites showed the same misses (expanded form with zeros, ×10, comparing).',
    who: 'Students who scored Below on the Place Value FIAB, or At/Near with many place-value misses on our sites. When Adding and Subtracting is on the plan too, Place Value waits for it.',
    decided: '10/17 (first Lab group); 10/21 added after the Place Value FIAB.'
  },
  ro: {
    area: 'number',
    level: 'Grade 3–4: round to the nearest 10 and 100 (Grade 3), then to any place (Grade 4).',
    why: 'Rounding was the class\'s weakest skill on the Place Value FIAB: 33% right (district 22%). The most common mistake on our rounding sites was picking the wrong two benchmarks (6,284 → "6,280 and 6,290" instead of 6,200 and 6,300).',
    who: 'Students weak on rounding on the Place Value FIAB or our rounding sites. Taught with the class method only — the two benchmarks, then halfway, then before or past halfway — never a digit rule (Mr. Olivera 10/21).',
    decided: '10/17 (first Lab group); 10/21 added after the Place Value FIAB.'
  },
  bp: {
    area: 'number',
    level: 'Grade 4, top of the grade: numbers to the hundred thousands, parts in any order, more than 9 in a place, comparing across forms.',
    why: 'A STRETCH strand for the middle and top math students (Mr. Olivera 10/22: "growth opportunities to kids at all levels not just my low"). On the Place Value FIAB they missed the multi-step items: 6 of the 8 missed item 10 ("11 hundreds").',
    who: 'A stretch for students At/Near or Above on the Place Value FIAB — above all those who missed the regrouping, comparing or missing-digit items (1, 3, 4, 8, 10). When Place Value is on the plan too, Big Numbers waits for it.',
    decided: '10/22 — the Big Numbers stretch strands.'
  },
  br: {
    area: 'number',
    level: 'Grade 4: round 5- and 6-digit numbers to any place, and work backwards ("which number rounds to it?").',
    why: 'The same 8 stretch students missed the FIAB\'s harder rounding items: 5 of 8 missed item 9 ("rounds to 24,000?") and 4 of 8 missed item 12 (nearest ten thousand).',
    who: 'A stretch for students At/Near or Above on the Place Value FIAB — above all those who missed the harder rounding items (6, 9, 12, 13). When Rounding is on the plan too, it waits for it. The class method only, as in Rounding.',
    decided: '10/22 — the Big Numbers stretch strands.'
  },
  rc: {
    area: 'reading',
    level: 'Grade 4 test formats (RL.4.1) on easy stories: Flesch-Kincaid grade 1.8–2.8, so the format and the thinking are what is hard, not the words.',
    why: 'Read Literary Texts IAB (10/20): 10 of 21 students Below. The class got 54% of one-answer questions but only 26% of Part A + Part B, 26% of click-the-sentences and 22% of choose-two. On the practice site, picking the sentence that PROVES an idea was missed 46% of the time. Part 2 (RC4–RC6) is for the lowest items of all: the idiom item (19%) and the simile item (10%), and on the practice site main idea (missed 34%) and summary (31%).',
    who: 'Students Below on the Read Literary IAB, or with an mCLASS focus of vocabulary and comprehension. Everything is read aloud, and the passage must be heard to the end.',
    decided: '10/20 — "build a comprehension strand"; 10/21 — on the plans of the Below readers; 10/22 — Part 2 (Choose Two, Words That Mean More, What Is It Mostly About?).'
  },
  rd: {
    area: 'reading',
    level: 'The same Grade 4 test formats on grade 4–5 stories (Flesch-Kincaid 4.0–5.0, up to 450 words), with wrong choices that are close to right.',
    why: 'For the middle and top readers. On the Read Literary IAB, the 8 students it was built for got 73% of the one-answer items but only 43% of the Part A + Part B, choose-two and click-the-sentences items — so the format is their gap, at their reading level.',
    who: 'At/Near or Above on the Read Literary IAB, with a multi-part score well below their one-answer score. Level 1 students get Level 2 after they finish Level 1 (it waits for Level 1 when both are on a plan).',
    decided: '10/22 — Reading for Meaning: Level 2.'
  }
},

/* ── each lesson: its standard, what it reviews in plain words, and its level ── */
lessons: {
  AS1: { standard: '1.OA.C.5, 1.OA.C.6', reviews: 'Adding by counting on from the bigger number, without counting the start number again.', level: 'Grade 1' },
  AS2: { standard: '1.OA.C.6', reviews: 'Making a ten to add past 10: the ten partners, then 8 + 5 = 8 + 2 + 3.', level: 'Grade 1' },
  AS3: { standard: '1.NBT.B.2', reviews: 'A teen number as 1 ten and some ones; adding to and taking from the ones.', level: 'Grade 1' },
  AS4: { standard: '1.OA.C.5, 1.OA.C.6', reviews: 'Subtracting by counting back 1, 2 or 3 without counting the start number.', level: 'Grade 1' },
  AS5: { standard: '1.OA.B.4, 1.OA.C.6', reviews: 'Subtracting by thinking of the adding fact (13 − 6: 6 + ? = 13), and counting up when the numbers are close.', level: 'Grade 1' },
  AS6: { standard: '2.OA.B.2', reviews: 'A check of all the facts to 20, mixed, with no hints or pictures. Passing it finishes the strand.', level: 'Grade 2 (fluency)' },
  MU1: { standard: '3.OA.A.1', reviews: 'Multiplication as equal groups: 3 groups of 4 is 4 + 4 + 4, not 3 + 4.', level: 'Grade 3' },
  MU2: { standard: '2.OA.C.4, 3.OA.A.1', reviews: 'Arrays: rows of the same size, counted by the row.', level: 'Grade 2–3' },
  MU3: { standard: '2.NBT.A.2, 3.OA.C.7', reviews: 'Skip counting by 2s, 5s and 10s — one count for each group.', level: 'Grade 2–3' },
  MU4: { standard: '3.OA.C.7', reviews: 'The 2s, 5s and 10s facts (doubles; counting by 5s and 10s).', level: 'Grade 3' },
  MU5: { standard: '3.OA.C.7', reviews: 'The 3s and 4s facts (×4 = double, double again; ×3 = ×2 and one more group).', level: 'Grade 3' },
  MU6: { standard: '4.OA.A.1', reviews: '"Times as many": 3 times as many as 4 means 3 groups of 4 (Math Module 3).', level: 'Grade 4' },
  MU7: { standard: '3.OA.C.7', reviews: 'A check of the 2s, 3s, 4s, 5s and 10s facts with no hints. Passing it finishes the strand.', level: 'Grade 3 (fluency)' },
  PV1: { standard: '2.NBT.A.1', reviews: 'What each digit is worth in its place (the 4 in 347 is 40).', level: 'Grade 2' },
  PV2: { standard: '2.NBT.A.3, 4.NBT.A.2', reviews: 'Expanded form: 347 = 300 + 40 + 7, and a 0 holds a place (506, not 56).', level: 'Grade 2–4' },
  PV3: { standard: '4.NBT.A.2', reviews: 'The thousands place and the comma.', level: 'Grade 3–4' },
  PV4: { standard: '2.NBT.A.4, 4.NBT.A.2', reviews: 'Comparing numbers: start at the biggest place and find the first place that is different.', level: 'Grade 2–4' },
  PV5: { standard: '2.NBT.A.1, 4.NBT.A.1', reviews: 'Renaming: 4,500 is 45 hundreds and 450 tens.', level: 'Grade 2–4' },
  PV6: { standard: '4.NBT.A.1', reviews: 'Times 10: every digit moves one place left, and a 0 holds the ones (Math Module 4).', level: 'Grade 4' },
  PV7: { standard: '4.NBT.A.1', reviews: 'Times 100: two places left, two zeros.', level: 'Grade 4' },
  PV8: { standard: '3.NBT.A.3, 4.NBT.B.5', reviews: 'Multiplying by multiples of 10: 3 × 40 = 3 × 4 tens = 120.', level: 'Grade 3–4' },
  PV9: { standard: '2.NBT.A, 4.NBT.A.1–2', reviews: 'A 20-question place value check with no hints. Passing it finishes the strand.', level: 'Grade 2–4' },
  RO1: { standard: '3.NBT.A.1', reviews: 'The two benchmarks a number is between (6,284 is between 6,200 and 6,300).', level: 'Grade 3' },
  RO2: { standard: '3.NBT.A.1', reviews: 'The number halfway between the benchmarks (45, 650, 6,250).', level: 'Grade 3' },
  RO3: { standard: '3.NBT.A.1', reviews: 'Rounding to the nearest ten: before halfway rounds down, halfway or past rounds up.', level: 'Grade 3' },
  RO4: { standard: '3.NBT.A.1', reviews: 'Rounding to the nearest hundred, the same way.', level: 'Grade 3' },
  RO5: { standard: '4.NBT.A.3', reviews: 'Rounding to the place the question names: the same number rounds differently to a ten, a hundred or a thousand.', level: 'Grade 4' },
  RO6: { standard: '3.NBT.A.1, 4.NBT.A.3', reviews: 'A 20-question rounding check with no hints. Passing it finishes the strand.', level: 'Grade 3–4' },
  BP1: { standard: '4.NBT.A.2', reviews: 'What each digit is worth in 5- and 6-digit numbers, to the hundred thousands.', level: 'Grade 4' },
  BP2: { standard: '4.NBT.A.2', reviews: 'Parts in any order ("4 tens + 7 thousands + 2 ones"): find the biggest place first; a 0 holds an empty place.', level: 'Grade 4' },
  BP3: { standard: '4.NBT.A.1', reviews: 'More than 9 in a place ("12 hundreds", "42 hundreds"): trade 10 of a place for 1 of the next place.', level: 'Grade 4' },
  BP4: { standard: '4.NBT.A.2', reviews: 'Comparing numbers written in different forms with <, > or =, and a missing digit.', level: 'Grade 4' },
  BP5: { standard: '4.NBT.A.1–2', reviews: 'A 20-question big-numbers check with no hints. Passing it finishes the strand.', level: 'Grade 4' },
  BR1: { standard: '4.NBT.A.3', reviews: 'The two benchmarks and halfway for big numbers (thousands to hundred thousands).', level: 'Grade 4' },
  BR2: { standard: '4.NBT.A.3', reviews: 'Rounding big numbers to the nearest thousand and ten thousand, with the class method.', level: 'Grade 4' },
  BR3: { standard: '4.NBT.A.3', reviews: 'Rounding to any place the question names (hundred to hundred thousand).', level: 'Grade 4' },
  BR4: { standard: '4.NBT.A.3', reviews: '"Which number rounds to it?": rounding each choice to find the one that rounds to the target (FIAB item 9, turned around).', level: 'Grade 4' },
  BR5: { standard: '4.NBT.A.3', reviews: 'A 20-question big-rounding check with no hints. Passing it finishes the strand.', level: 'Grade 4' },
  RC1: { standard: 'RL.4.1', reviews: 'Finding the ONE sentence that proves an idea — and seeing that a sentence can be true but not proof.', level: 'Grade 4 format · stories FK 2–2.7' },
  RC2: { standard: 'RL.4.1, RL.4.3', reviews: 'Part A and Part B: answer the inference in Part A, then pick the sentence that proves it in Part B (the R.A.D. Detail).', level: 'Grade 4 format · stories FK 1.9–2.6' },
  RC3: { standard: 'RL.4.1', reviews: 'Clicking the sentence — then the TWO sentences — that show an idea; both must be right for the point, like the test.', level: 'Grade 4 format · stories FK 1.9–2.7' },
  RC4: { standard: 'RL.4.1, RL.4.3', reviews: 'Choose TWO: two answers that are both right (what a character is like, a conclusion, a feeling, the lesson); all or nothing, like the test.', level: 'Grade 4 format · stories FK 2–2.8' },
  RC5: { standard: 'L.4.5a, L.4.5b, RL.4.4', reviews: 'Idioms and similes: what a phrase really means, not word for word. One-answer, Choose TWO and one Choose THREE simile question per story.', level: 'Grade 4 format · stories FK 1.9–2.6' },
  RC6: { standard: 'RL.4.2', reviews: 'What a paragraph is mostly about, the KEY event a summary leaves out (the summary is shown and read aloud), and the best summary.', level: 'Grade 4 format · stories FK 1.9–2.7' },
  RD1: { standard: 'RL.4.1', reviews: 'The sentence that BEST proves an idea in a longer story, when another sentence in the same paragraph is about the idea but does not prove it.', level: 'Grade 4 format · stories FK 3.9–4.9' },
  RD2: { standard: 'RL.4.1, RL.4.2, RL.4.3', reviews: 'Part A and Part B with harder Part A questions: a conclusion, a word that describes a character, the lesson of the story, a reason never stated.', level: 'Grade 4 format · stories FK 3.7–4.8' },
  RD3: { standard: 'RL.4.1', reviews: 'Clicking the TWO sentences that BEST show an idea, from 6-sentence lists and long paragraphs.', level: 'Grade 4 format · stories FK 4.1–4.9' },
  RD4: { standard: 'RL.4.1, RL.4.2, RL.4.3', reviews: 'Choose TWO: two answers that are both right (what a character is like, a conclusion, a feeling, the lesson); all or nothing, like the test.', level: 'Grade 4 format · stories FK 4.1–4.9' }
}
};
