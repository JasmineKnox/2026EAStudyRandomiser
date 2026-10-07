# EA Study Randomiser

Created by Mrs Knox.

Working prototype for the 2026 QCAA General and General Extension external assessments. Includes 48 selectable subjects/specialisations and 426 specific content items. The three Music Extension specialisations are listed separately; this is not 48 distinct examination papers.

## Try it

Open `EA_Study_Randomiser.html` in a browser. It is self-contained and does not need an internet connection for normal revision tasks. Internet access is needed for official QCAA links. Alternatively, open `index.html` with its companion files in the same folder.

Select subjects once. English, EAL, Literature and History require the school's selected EA text/topic. Language Extension requires the student's own independent-investigation topic. Choose one, two or three saved subjects in the visible “What are you studying?” picker. Tasks and practice exams use only that selection. Untick a subject to swap it when three are selected. The session selection is remembered; initial setup defaults to the first three saved subjects (or all, if fewer). Normal use is one task button. Each task identifies specific content, instructions, suggested time, checking and a starting scaffold.

Setup, completed-task count, recent assignments and the current task are saved locally in this browser. They do not synchronise across browsers or devices. Private browsing or clearing browser data may remove them. If storage is unavailable, the app continues for the current visit.

The one to three subjects selected for the current session rotate through a shuffled queue. Changing the session selection resets the queue; the current task stays visible if its subject remains selected. Removing that subject returns to the task button without recording completion. Topics avoid the last three assignments for that subject where possible. Consecutive tasks avoid the same strategy where possible. Clicking another task counts as an assignment for rotation, but not as a completed task. No student account, analytics, cloud records or automatic marking is included.

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
