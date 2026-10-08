# EA Study Randomiser

Created by Mrs Knox.

Working prototype for the 2026 QCAA General and General Extension external assessments. Includes 48 selectable subjects/specialisations and 426 specific content items. The three Music Extension specialisations are listed separately; this is not 48 distinct examination papers.

## Try it

Open `EA_Study_Randomiser.html` in a browser. It is self-contained and does not need an internet connection for normal revision tasks. Internet access is needed for the help websites and official QCAA links. All 48 subject choices, including each extension specialisation, have at least one researched non-QCAA resource. There are 67 supplementary resource entries pointing to 50 distinct resource pages. The same site may support more than one subject. Links appear on each task and in “Study websites for your subjects”, where you can browse your saved subjects without generating a task. Each link explains its use and access conditions. Supplementary resources cover selected concepts or skills, rather than the full QCAA syllabus. Alternatively, open `index.html` with its companion files in the same folder.

Save your courses through three pages: English → maths → electives. The Back button keeps your selections, and you can leave a page unticked if it does not apply. English, EAL, Literature and History require your school-selected text/topic; Language Extension requires your independent-investigation topic.

Set up each study session by choosing 5–180 minutes, one to three of your saved subjects, and easy, medium or hard mode. Every selected subject receives at least one block, so allow at least five minutes per subject. The app splits your total into blocks of 5–20 minutes and rotates through the selected subjects. A 30-minute session with three subjects gives three 10-minute blocks. A 60-minute session with three subjects gives three 20-minute blocks. Longer plans repeat subjects. These are planned working times, including checking; the optional task timer does not automatically mark work completed.

Easy mode adds a starting model/definition, key-word prompts and a smaller response. Medium uses the standard subject-specific strategy. Hard keeps solutions closed until checking and adds a transfer, alternative interpretation or justified challenge. Blocks of ten minutes or less use a smaller response in every mode. “Make this task easier” adds support to the current task without changing its allocated time.

Instructions, checking and starting help use dot points. Done records the task as checked and advances to the next block. Swap this task changes the topic/task inside the same block and does not count completion. Change session returns to duration, mode and subject choices without adding a completion. Practice exams remain separate full-paper activities.

Courses, options, progress, session plan and current block are saved locally in this browser. Reloading resumes a valid session. Existing versions’ saved subjects and completed counts are retained and brought to the new session setup. Browser data does not synchronise across devices; private browsing or clearing data may remove it. If storage is unavailable, the app works for the current visit. No student accounts, analytics, cloud records or automatic marking are included.

Topics avoid the last three assignments for each subject where possible; tasks avoid repeating the immediately previous strategy where possible. Changing session settings keeps completed counts and topic history. Clear progress resets counts, history and the current session, while preserving saved courses and preferences.

## GitHub Pages

Upload `index.html`, `bank.js`, `engine.js`, `app.js`, `style.css` and `.nojekyll` to the repository root. In the repository's Settings → Pages, select deployment from the main branch and root folder. Follow GitHub's current [Pages instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

The files use relative paths, so they also work under a repository subpath. No package installation or build step is required. This package is ready to upload; it has not been published to a GitHub repository.

## Content review

Use the app's “Content bank and sources — for review” section to inspect every topic and a representative task. This review section does not alter student progress. `Content_Audit.csv` lists each topic's syllabus source, unit and focus. `content-bank.json` is the editable data source; `bank.js` is its browser wrapper. After changing JSON, regenerate `bank.js` and the self-contained HTML using `python3 rebuild.py`.

EA boundaries and the 2026 English/History selections were checked against current QCAA syllabuses and the 2026 timetable on 6 October 2026. Topic names and focus cues are original revision summaries. They are not verbatim syllabus statements or an exhaustive mapping of every dot point. Mathematics assumes relevant earlier-unit knowledge; the main pool concentrates on Units 3 and 4. Arts EAs assess analysis of unseen stimuli using course knowledge, so their pools focus on specific analytical content and skills rather than a prescribed stimulus.

Applied subjects and the distinct Senior External Examination (SEE) pathway are outside this mainstream EA prototype.

## What this prototype supplies

Specific topic + matched strategy + concrete instructions + checking guidance. Most tasks expect the student's own notes, textbook and class source materials. An original short literary practice text and an original design brief are embedded where required. Other prompts are original study activities, not past exam questions. Open analytical tasks use checking prompts rather than a single model answer.

Full practice exam sessions select a subject and show its current per-paper timings. They direct students first to a teacher-approved current-format paper, then to the QCAA archive. They do not yet choose individual QCAA question numbers or embed the papers, marking guides, recordings or textbooks. Earlier-cohort papers may differ in topic coverage, selected texts and format. Current-format simulation should use a teacher-approved paper. This limitation is visible in the app.

The next content pass can add verified question-level links, more granular topics, prepared source packs and answer checks without changing the student interface. The interface uses the Mrs Knox Teaches deep green and sage palette, a visible subject picker, large action buttons and separate task/checking sections. It includes responsive layouts, keyboard focus indicators, reduced-motion support and a print layout. Work Sans and Roboto Slab are used when available on the device; Arial is the built-in fallback. No external fonts or images need to load.

## Files

* `index.html`, `style.css`, `app.js`: student screen and review controls.
* `engine.js`: strategy matching, task creation and randomisation.
* `content-bank.json`, `bank.js`: content and syllabus sources.
* `EA_Study_Randomiser.html`: self-contained version for review or offline use.
* `Content_Audit.csv`: one row per content item.
* `rebuild.py`: rebuild browser data and standalone version after content edits.
* `tests/`: behaviour and data checks.

## Attribution

Topic and assessment summaries adapted from QCAA syllabuses. © State of Queensland (QCAA) 2026. [QCAA copyright and licensing](https://www.qcaa.qld.edu.au/copyright). This is an independent Mrs Knox Teaches resource, not a QCAA publication or endorsement. Original activities and code were developed with AI assistance and checked against the named sources.

## Validation

Run `node tests/engine.test.cjs` for task generation, one- to three-subject session filtering and rotation, strategy repetition, selected text/topic filtering, EA boundary checks and five-minute tasks. These checks passed, as did JavaScript syntax and static HTML control checks. A live browser check was unavailable in the build environment, so mobile rendering and browser interaction still need a user review.

## Updating an existing GitHub copy

For the visual update, replace `index.html`, `style.css` and `app.js` in the existing repository with the files in this package. Keep the companion data and engine files alongside them. The self-contained `EA_Study_Randomiser.html` has also been rebuilt. Subject selections and progress retain the same browser storage key when the website address stays the same.

## Updating an existing GitHub repository

Replace the files with the matching names from this package. Keep your existing repository and Pages configuration. Upload the extracted contents, not the ZIP itself. `EA_Study_Randomiser.html` is the updated standalone option; GitHub Pages uses `index.html` with its companion files. Existing browser selections and progress use the same storage key.

## Checks

Run `node engine.test.cjs` for the engine, session-planning and resource checks. Run `NODE_PATH=/path/to/jsdom/node_modules node tests/session-dom.test.cjs` and `tests/resources-dom.test.cjs` for DOM integration checks, with jsdom installed in the selected test environment. Run `node tests/ui.test.cjs` where Playwright and Chromium are installed for wizard, session, persistence and mobile layout checks. Run `python rebuild.py` after editing the HTML, CSS, JavaScript or content bank to regenerate the standalone file.

## Supplementary website research

Resources were reviewed on 8 October 2026 using provider pages and current search results. The directory is in each subject’s `resources` array in `content-bank.json`; `Study_Websites.csv` lists all 67 subject/resource entries, descriptions, access notes and source URLs. Search verification confirms provider content and relevance, not uninterrupted availability in every school or country. Sites may change, and embedded videos can be blocked by school filters or region restrictions.

Examples include Khan Academy, LitCharts, NASA, AIATSIS, History Skills, Geoscience Australia, AIMS, the Australian Human Rights Commission, OpenLearn, Goethe-Institut, TV5MONDE, Rai Scuola, the Japan Foundation, Smarthistory and the Harvard Pluralism Project. Language levels and overseas course structures are not described as QCAA equivalents. Use the school-selected text or topic for English and History. Extension students should choose material relevant to their own investigation or critical approach.

Run `node tests/resources.test.cjs` to check that every subject has supplementary resources, safe links and access notes. To run the DOM integration checks, install `jsdom` in a temporary test environment, then run `tests/resources-dom.test.cjs` with that environment in `NODE_PATH`. Browser layout checks remain in `tests/ui.test.cjs` for an environment with Chromium installed.

The multi-file HTML now uses versioned asset URLs so this update fetches fresh JavaScript and CSS after deployment. Run `python rebuild.py` after future changes to keep the standalone file in sync.
