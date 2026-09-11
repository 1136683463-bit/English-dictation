# Product Design UI/UX Audit

Date: 2026-07-06
Target: English dictation / personal vocabulary training app
Capture: Playwright + local Chrome against `http://127.0.0.1:1421`

## Audit Scope

This audit reviews the core learning loop: entry, today plan, training choice, spelling, review, library management, add/import content, mistake book, stats, settings, units, words, and sentences.

Evidence:

- Screenshots: `screenshots-playwright/`
- First-screen contact sheets: `overview/`
- Layout evidence: `screenshot-evidence.json`
- Accessibility heuristics: `accessibility-heuristics.json`

The earlier in-app browser screenshots were discarded because Retina scaling produced cropped evidence. The Playwright screenshots are the accepted source for this audit.

## User Goal And Accessibility Target

Primary user goal: open the app, know what to practice next, complete a short spelling/review session, then understand what to fix next.

Accessibility target: keyboard and touch users should be able to navigate, read instructions, enter answers, recover from errors, and manage learning data without hidden controls, tiny targets, or unlabeled fields.

## Step Health

1. Entry page: Healthy, but underuses available desktop space.
   Screenshot: `screenshots-playwright/01-entry-desktop.png`, `screenshots-playwright/01-entry-mobile.png`

2. Today plan: Strong learning direction, moderate mobile crowding.
   Screenshot: `screenshots-playwright/02-today-desktop.png`, `screenshots-playwright/02-today-mobile.png`

3. Training hub: Healthy; good mode separation and clear recommendation.
   Screenshot: `screenshots-playwright/03-training-desktop.png`, `screenshots-playwright/03-training-mobile.png`

4. Spelling session: Strong task focus; mobile navigation competes with the exercise.
   Screenshot: `screenshots-playwright/04-spelling-desktop.png`, `screenshots-playwright/04-spelling-mobile.png`

5. Review session: Healthy structure; answer/reveal flow is understandable.
   Screenshot: `screenshots-playwright/05-review-desktop.png`, `screenshots-playwright/05-review-mobile.png`

6. Library: Strongest management screen; good list/detail pattern.
   Screenshot: `screenshots-playwright/06-library-desktop.png`, `screenshots-playwright/06-library-mobile.png`

7. Add content hub: Healthy; clear capture loop.
   Screenshot: `screenshots-playwright/07-add-desktop.png`

8. Import content: Powerful but dense, especially on mobile.
   Screenshot: `screenshots-playwright/08-import-desktop.png`, `screenshots-playwright/08-import-mobile.png`

9. Mistake book: Empty/low-data state is understandable, but needs a stronger next action.
   Screenshot: `screenshots-playwright/09-mistakes-desktop.png`, `screenshots-playwright/09-mistakes-mobile.png`

10. Stats: Rich, but too long and report-like on mobile.
    Screenshot: `screenshots-playwright/10-stats-desktop.png`, `screenshots-playwright/10-stats-mobile.png`

11. Settings/export: Useful and complete; mobile form density is high.
    Screenshot: `screenshots-playwright/11-settings-desktop.png`, `screenshots-playwright/11-settings-mobile.png`

12. Units: Visually clear; color swatches and compact controls need larger targets.
    Screenshot: `screenshots-playwright/12-units-desktop.png`

13. Words: Healthy list layout; search input needs an explicit accessible label.
    Screenshot: `screenshots-playwright/13-words-desktop.png`

14. Sentences: Simple and stable; empty state could route to import/add.
    Screenshot: `screenshots-playwright/14-sentences-desktop.png`

15. Spelling feedback: Needs more explicit error recovery controls.
    Screenshot: `screenshots-playwright/15-spelling-feedback-desktop.png`

16. Review answer state: Healthy; scoring choices should stay visible and thumb-friendly.
    Screenshot: `screenshots-playwright/16-review-answer-desktop.png`

## Strengths

- The product has a coherent learning model: collect material, choose training, practice, inspect mistakes, and review stats.
- Visual language is consistent: warm background, orange primary action, teal learning accents, soft cards, clear icons.
- The best screens already show a good direction: Library, Add, Words, Sentences, and desktop Training are calm, readable, and action-oriented.
- The spelling screen has a strong core: current mode, remaining count, phonetic hint, definition, audio, input, and submit all appear in one focused place.
- The app avoids a generic dashboard feel; it has a specific learning product point of view.

## UX Risks

1. Mobile bottom navigation is too tall and visually dominant.

   Evidence: `02-today-mobile.png`, `04-spelling-mobile.png`, `08-import-mobile.png`, `10-stats-mobile.png`.

   The nav shows eight main destinations plus a separate "设置与导出" row. On task screens it takes enough height to compete with the practice UI. On long full-page screenshots it visibly interrupts content, which mirrors the real experience of a large fixed element staying present while the user scrolls.

2. The information architecture has more top-level destinations than mobile can comfortably hold.

   Today, Training, Mistake Book, Units, Add, Library, Stats, and Settings are all first-class nav items. On mobile that makes the nav feel like a mini sitemap instead of a fast way back to the learning loop.

3. Stats is doing two jobs at once: weekly report and next-step coach.

   Evidence: `10-stats-mobile.png` is 5048px tall. The page has valuable content, but the first decision the learner needs is simpler: "what should I do next?" The deeper report can sit below or behind tabs.

4. Import is powerful but cognitively heavy on mobile.

   Evidence: `08-import-mobile.png`. It includes pipeline explanation, material form, word candidates, sentence candidates, batch import, and previews in one long flow. It is complete, but the user must parse several workflows before acting.

5. Empty and low-data states are polite but sometimes passive.

   Evidence: `09-mistakes-desktop.png`, `09-mistakes-mobile.png`, `14-sentences-desktop.png`. Empty states explain what is missing, but they could more often include the best next action, such as start spelling, import material, or add a sentence.

6. The entry page is visually underpowered on desktop.

   Evidence: `01-entry-desktop.png`. The compact card is clear, but it leaves a large blank canvas. As a first screen, it could better preview today's plan and the most likely action.

## Accessibility Risks

1. Some common inputs rely on placeholder text instead of explicit labels.

   Evidence from `accessibility-heuristics.json`: spelling input, Library search, Words search, Sentences search, and a Library select were detected without programmatic labels.

   Recommendation: add visible labels or `aria-label`/`aria-labelledby` where the label is intentionally visual-only.

2. Several touch targets are below 44px height on mobile.

   Evidence: spelling topbar actions, filter chips, unit color swatches, and some mobile buttons measured below 44px.

   Recommendation: make mobile interactive controls at least 44px in one dimension, especially controls used during practice.

3. Icon-only or compact controls need consistent accessible names and tooltips.

   Many are named already, which is good. Keep this discipline for every new icon button and swatch.

4. Screenshot-only audit cannot verify keyboard focus order, screen reader announcements, audio behavior, or color contrast under all states.

   Recommendation: run a keyboard pass and an automated accessibility scan after the next UI polish pass.

## Opportunity Areas

1. Make mobile navigation task-based.

   Keep 4-5 persistent items: Today, Train, Library, Mistakes, Settings or More. Move Add, Units, Stats, and Export into contextual entry points or a More sheet. Remove the separate bottom "设置与导出" row from mobile.

2. Turn Today into the true command center.

   Today already has the right idea. Tighten it into one primary action, one reason why, and a compact queue. Stats, mistakes, and units should feed Today instead of competing with it.

3. Split Stats into "Next action" and "Report".

   First screen: health status, next task, top risk, and trend sparkline. Below or tabbed: weekly details, goals, full card distribution, review history.

4. Break Import into staged steps.

   Suggested mobile flow: Material -> Extract -> Review candidates -> Start training. Keep the desktop power layout, but mobile should show one step at a time with a sticky progress indicator.

5. Improve empty states with direct recovery.

   Mistake Book empty: "Start spelling to collect mistakes." Sentences empty: "Import material" and "Add sentence." Stats low-data: "Complete one session to unlock trend."

6. Reduce desktop entry-page blankness.

   Use the extra space to show today's recommendation, due count, and last session outcome. Keep it lightweight; avoid turning it into a landing page.

## Recommendations

### P0

- Redesign mobile bottom navigation into a single compact row plus a More menu.
- Remove or relocate the mobile "设置与导出" footer row.
- Add accessible labels to search/input fields flagged in `accessibility-heuristics.json`.
- Ensure spelling-screen controls are at least 44px high on mobile.

### P1

- Reframe Stats mobile around next action first, detailed report second.
- Split Import mobile into step-by-step panels.
- Add direct CTAs to Mistake Book and Sentences empty states.
- Make Today the primary home route after entry, with the strongest recommendation above the fold.

### P2

- Improve the desktop Entry page with a fuller first-session preview.
- Standardize chip/filter target sizes.
- Add keyboard-focus QA for Training, Spelling, Review, Import, and Settings.
- Consider a compact/mobile-specific header for long form pages.

## Evidence Limits

- This audit used local seed data and browser screenshots. It did not test real user history, large imported documents, or long custom vocabulary names.
- It did not perform a full WCAG audit, screen reader pass, keyboard-only pass, or contrast scan.
- Audio playback, speech synthesis quality, and cross-browser behavior were not deeply tested.

## Best Next Design Pass

Start with the mobile learning loop:

1. Mobile bottom nav cleanup.
2. Spelling screen touch target polish.
3. Today page queue compaction.
4. Mistake empty-state CTA.

This pass would improve the highest-frequency path without changing the product's core model.
