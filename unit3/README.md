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

Students need class notes, textbooks and authorised practice materials. The study-task generator now includes an original starter question bank with revealed worked answers and self-check marking points. It does not automatically grade answers or include secure assessment material or student data. Selections and the count of self-checked tasks are stored in the local browser when supported. Switching exam routes resets that subject’s topic/context configuration.

## Maintain

Edit `build.py` to update the content mapping, `tasks.js` for study directions, `app.js` for behaviour, and `template.html` for presentation. The build uses the parent repository’s `content-bank.json` for subject identifiers and existing supplementary-resource links, with explicit Unit 3 replacements.

Run:

```bash
python3 unit3/build.py
node unit3/check.cjs
node --check unit3/app.js
node --check unit3/tasks.js
```

Subject accents use the approved coral, golden yellow, blue and lilac families. Accents are fixed by subject area: Mathematics and Technologies blue; Sciences and Health/Physical Education golden yellow; Humanities coral; English and Languages lilac. The same accent appears in the setup card, session choice and active-task banner, and the EA companion uses the same grouping.

The generated `index.html` remains self-contained. `bank.json` is the readable source mapping exported by the build.

## Validation and limits

Automated checks cover 1,713 task combinations, 42 task methods, timing totals, rotation, invalid selection handling, syllabus links, five-topic maths lists, science-data-task restrictions, inline-script syntax, UI element references and key text contrast pairs. A browser preview was unavailable during this build; responsive CSS and page structure were checked without browser visual QA.

The content describes syllabus boundaries, not the contents of an individual school’s unseen paper. Teachers must confirm local coverage, conditions and permitted resources. CIA themes depend on the cohort and phase; no 2026 theme is hard-coded as a future-cohort requirement.

Syllabus information summarised from QCAA sources, © State of Queensland (QCAA) 2026, https://www.qcaa.qld.edu.au/copyright. This independent resource is not a QCAA publication. AI assisted the drafting and coding; assessment mapping was checked against the cited public sources.

## Study-mode navigation

The repository root offers a choice between Unit 3 and EA preparation. The original EA page and session planner are preserved at `../ea.html`; their scripts, content bank and browser storage key are unchanged. Each game links back to the shared chooser.

## Text and topic selectors

Literature IA1 offers a searchable title/writer list drawn from QCAA’s prescribed Literature list for 2026–2029. The completion-year selector filters date-limited entries. Options include the relevant year’s EA-category texts because QCAA permits those texts elsewhere in the course, provided an individual student does not use the same text for more than one assessment. Short-story and poetry selections are listed by writer, with an optional field for the class’s actual stories, poems or focus. See `literature-texts.json` for source attribution and availability.

Essential English offers the two publicly verified 2026 CIA topics, the internet and print media. A teacher-confirmed year/topic field supports other cohorts without presenting those 2026 topics as their requirements. As at 15 October 2026, a public 2027 topic announcement could not be verified. Essential English directions use shorter, plainer language.

The English setup step blocks Continue until each selected English course has its required text or topic. Missing selections show an error and receive focus. The final setup save repeats validation.

## Original question practice

The shared `../question-bank.json` contains original questions for eligible short/combination-response and data-test routes, with supplied stimuli where needed. `../question-data.js` is the browser data build and `../question-practice.js` is the shared accessible dialog. Run `python questions/build.py` from the repository root to rebuild data before rebuilding both games. The starter bank samples topics and is not a complete paper or exhaustive coverage. Language items currently provide written comprehension/analysis, not audio. History and some religion items are clearly labelled generic source skills; use authentic class-selected sources for contextual practice. Essential English texts are generic skills practice, not predictions of an unreleased CIA topic.

Marks are indicative and self-assessed. Saved topic filters and exam routes constrain question selection. No written student answers are collected or stored, and question practice does not change the existing completed-task counts. Both single-file game exports embed the question data and interface for offline use.
