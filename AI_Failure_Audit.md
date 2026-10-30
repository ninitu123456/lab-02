# AI Failure Audit — Homework 1

**Project:** Production Enterprise Data-Grid

**Audit date:** 2026-10-30

**Method:** Static review of source code, tests, documentation, and local Git history.

## 1. Scope and evidence

This audit reviews implementation and verification failures relevant to AI-assisted development of the data-grid homework. No prompt history or AI conversation transcript is included in the repository, so individual changes cannot be attributed conclusively to AI. Historical fixes are distinguished from issues identified during this review.

Reviewed evidence:

- `components/data-grid/DataGrid.tsx`
- `types/data-grid-contract.ts`
- `tests/data-grid.spec.ts`
- `data/employees.ts`
- `README.md` and `docs/TEST-REPORT.md`
- Git commits `99e5cff` and `46bcdd6`
- `test-results/.last-run.json`

No application code was changed, and no lint, build, browser tests, or Lighthouse audits were rerun as part of this document review. The existing test report records 6/6 passing tests and Lighthouse Accessibility and Best Practices scores of 100/100. Those are previously recorded results, not fresh measurements from this audit.

## 2. Failure log

### F01 — Updating pagination state inside an effect

- **Evidence:** Commit `99e5cff`, titled `fix: resolve React setState in effect lint error`, removes an effect that called `setPage(totalPages)` when the page exceeded the available page count.
- **Failure:** The implementation used an effect to synchronize a value that could be derived while rendering. The commit records a lint problem with that approach.
- **Impact:** A lint failure can block code-quality checks; synchronizing state this way also introduces an additional update.
- **Recorded correction:** The component derives `currentPage = Math.min(page, totalPages)` and uses it to slice the visible data.
- **Status:** Historical correction confirmed in the diff. Lint was not rerun during this audit. The consistency issue in F03 remains.
- **Lesson:** Review generated state logic before accepting it. Prefer derived values where appropriate, and check all consumers when replacing stored state with a derived value.

### F02 — Ambiguous pagination test locators

- **Evidence:** Commit `46bcdd6` is titled `test: fix strict locator conflicts in pagination test`. The committed test uses `getByRole("button", { name: "Next", exact: true })` and scopes the page indicator to a paragraph.
- **Failure:** The commit message records a strict locator conflict. A broad text or accessible-name match can identify more than one element and prevent the test from reaching its intended assertion.
- **Impact:** Test failures can reflect selector ambiguity rather than a product defect.
- **Recorded correction:** Use an exact accessible name for the Next button and a more specific locator for the page indicator.
- **Status:** The corrected locator is present. This commit adds the test file, so the earlier failing locator is not available in its parent diff and is not reconstructed here.
- **Lesson:** Inspect locator matches and use roles, accessible names, and appropriate scope when reviewing generated browser tests.

### F03 — Derived page and displayed page can disagree

- **Evidence:** `pageData` uses `currentPage`, but the page label, pagination controls, and cell `aria-rowindex` still use `page`. Row-level `aria-rowindex` uses `currentPage`.
- **Failure:** Pagination does not use one consistent effective page value.
- **Trigger:** With the grid on page 3 of the current 12-row dataset, a parent could replace `data` with three records. `currentPage` becomes 1 while `page` remains 3.
- **Expected impact:** Data from page 1 would be displayed with `Page 3 of 1`; Next would remain enabled because `page !== totalPages`; row and cell indices would disagree. This is a reusable-component scenario, not a behavior reproduced in the current static demo.
- **Proposed correction:** Use a consistent effective page for labels, controls, indices, and navigation bounds. Ensure subsequent navigation remains within the available range.
- **Verification needed:** Add a component/browser scenario that shrinks the supplied dataset while on a later page, then checks the label, disabled controls, and ARIA indices.
- **Status:** Open; identified by static inspection.
- **Lesson:** A local lint fix can leave a wider state-consistency defect. Audit every use of the changed state.

### F04 — Sorting test checks metadata without checking order

- **Evidence:** The sorting test clicks Name once and asserts only `aria-sort="ascending"`.
- **Failure:** The assertion can pass even if the displayed rows are not sorted. It does not verify descending order or numeric comparisons.
- **Impact:** A passing test provides less assurance than the feature name suggests.
- **Proposed correction:** Assert the visible Name values after ascending and descending sorts, and verify a numeric column such as Salary. Include sorting combined with filtering and pagination.
- **Verification needed:** Confirm the test fails if sorting is disabled while the ARIA attribute still updates.
- **Status:** Open test-coverage gap; no sorting malfunction is established by this finding.
- **Lesson:** Generated tests should assert user-visible outcomes as well as accessibility metadata.

### F05 — Fixed search ID limits component reuse

- **Evidence:** The input uses the literal `id="grid-search"`, and the label uses `htmlFor="grid-search"`.
- **Failure:** Rendering two DataGrid instances produces duplicate IDs.
- **Impact:** A label may target the wrong search input, undermining the component's reuse and accessibility goals.
- **Proposed correction:** Generate a per-instance ID, for example with React `useId`, and share that value between the input and label.
- **Verification needed:** Render two grids and confirm each label targets its own uniquely identified input.
- **Status:** Open; conditional on rendering multiple instances. The current page renders one grid.
- **Lesson:** Review generated reusable components under multiple-instance conditions, not only in a single demo.

### F06 — Automated results do not establish full accessibility conformance

- **Evidence:** The axe test scans the initial page. Keyboard coverage checks ArrowRight and Space only. The README and test report correctly acknowledge that manual verification is still required.
- **Failure risk:** Treating the recorded automated results as proof of complete WCAG 2.2 AA conformance would exceed the available evidence.
- **Impact:** Keyboard, screen-reader, zoom, and dynamic-state issues could remain undetected.
- **Proposed follow-up:** Verify all documented keyboard commands, focus behavior after filtering and pagination, empty results, and screen-reader announcements. Record manual results and tool/environment details with future automated runs.
- **Status:** Verification remains incomplete; this finding does not establish a specific WCAG violation.
- **Lesson:** Keep implementation claims, automated evidence, and manual verification separate.

## 3. Recommended next steps

1. Resolve F03 and verify pagination when the supplied dataset shrinks.
2. Resolve F05 and verify two grids on the same page.
3. Strengthen sorting tests as described in F04 and extend keyboard/state coverage from F06.
4. Run lint, TypeScript checking, the production build, and browser tests after code changes. Start the application before running the current Playwright suite, which navigates to `http://localhost:3000`.
5. Record fresh test and Lighthouse evidence, then complete manual accessibility verification before making a full conformance claim.

## 4. Reflection on AI-assisted development

The repository illustrates why plausible implementation and passing basic tests still need review. A fix must be checked across related state consumers, tests must verify behavior rather than only attributes, and reusable components must be assessed beyond the sample page. AI-generated suggestions should be treated as proposals whose correctness is supported by source inspection, meaningful tests, and recorded evidence.
