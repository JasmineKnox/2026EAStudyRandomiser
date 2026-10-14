# Unit 3 Study Randomiser

Created by Mrs Knox. Companion to the EA randomiser in the parent directory.

Open `index.html` directly, or visit the repository’s GitHub Pages address with `/unit3/` appended. The HTML contains all styles, content and JavaScript. Study links need an internet connection; the randomiser itself does not need a server or account.

## Coverage

Checked against public QCAA specifications on 15 October 2026: 37 subjects, 46 exam routes and 185 topic entries. The full subject/exam mapping and source links are in the teacher view within the game. Scope is the standard General and General (Extension) subjects represented in the EA randomiser, plus Essential English and Essential Mathematics CIAs. Other Applied subjects and alternative sequences need separate school-specific mapping.

- Legal Studies IA1: Unit 3 Topic 1, Governance in Australia.
- Economics IA1: Unit 3 Topic 1, International trade, including exchange rates and balance of payments.
- Business IA1: Competitive markets — expansion, financing, leadership and human resources.
- Accounting IA2: managing non-current assets.
- General Mathematics, Mathematical Methods and Specialist Mathematics IA2: any three of each syllabus’s five Unit 3 topics. Students select the school’s assessed topics.
- Seven science IA1 data tests: Agricultural Science, Biology, Chemistry, Earth & Environmental Science, Marine Science, Physics and Psychology. Tasks focus on applying understanding, analysing data and interpreting evidence.
- Other routes: Aboriginal & Torres Strait Islander Studies, Ancient History, Modern History, Geography, Philosophy & Reason, Study of Religion, Food & Nutrition, Health, Aerospace Systems, Engineering, Literature and EAL; six General languages and three language extensions, with separate IA1/IA2 routes; the two Essential-subject CIAs.

General English, English & Literature Extension, Physical Education, Design, Digital Solutions and the Arts subjects listed in the teacher view have no prescribed Unit 3 examination in this mapping. A supervised project or design challenge is not automatically an exam.

## Use

Save up to two English courses, three maths courses and six electives. Then choose one to three of those subjects for each session. Choose the relevant exam route and enter the school-selected text, historical context, Health elective or other focus when prompted. Untick topics not in the school’s revision scope. Choose a session length and difficulty. Tasks rotate through the selected subjects and give an explicit action, checking instructions and a retry step.

Students need class notes, textbooks and authorised practice materials. This is a study-task generator, not a question bank or automatic marker. It does not contain secure assessment questions, answer scripts or student data. Selections and the count of self-checked tasks are stored in the local browser when supported. Switching exam routes resets that subject’s topic/context configuration.

## Maintain

Edit `build.py` to update the content mapping, `tasks.js` for study directions, `app.js` for behaviour, and `template.html` for presentation. The build uses the parent repository’s `content-bank.json` for subject identifiers and existing supplementary-resource links, with explicit Unit 3 replacements.

Run:

```bash
python3 unit3/build.py
node unit3/check.cjs
node --check unit3/app.js
node --check unit3/tasks.js
```

Subject accents use the approved coral, golden yellow, blue and lilac families. Each course has a default accent that can be changed in setup. The same accent appears in its setup card, session choice and active-task banner.

The generated `index.html` remains self-contained. `bank.json` is the readable source mapping exported by the build.

## Validation and limits

Automated checks cover 1,713 task combinations, 42 task methods, timing totals, rotation, invalid selection handling, syllabus links, five-topic maths lists, science-data-task restrictions, inline-script syntax, UI element references and key text contrast pairs. A browser preview was unavailable during this build; responsive CSS and page structure were checked without browser visual QA.

The content describes syllabus boundaries, not the contents of an individual school’s unseen paper. Teachers must confirm local coverage, conditions and permitted resources. CIA themes depend on the cohort and phase; no 2026 theme is hard-coded as a future-cohort requirement.

Syllabus information summarised from QCAA sources, © State of Queensland (QCAA) 2026, https://www.qcaa.qld.edu.au/copyright. This independent resource is not a QCAA publication. AI assisted the drafting and coding; assessment mapping was checked against the cited public sources.

## Study-mode navigation

The repository root offers a choice between Unit 3 and EA preparation. The original EA page and session planner are preserved at `../ea.html`; their scripts, content bank and browser storage key are unchanged. Each game links back to the shared chooser.
