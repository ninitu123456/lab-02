# Homework 1 — Task Decomposition

## Project Overview

**Project:** Production Enterprise Data-Grid (WCAG 2.2 AA)

**Technology Stack:** Next.js, React, TypeScript, Tailwind CSS

**Objective:** Develop a reusable, accessible enterprise data-grid component with sorting, filtering, pagination, keyboard navigation, and screen reader support.

## Functional Decomposition

| ID | Task | Description | Deliverable |
|---|---|---|---|
| T01 | Requirements Analysis | Identify functional and accessibility requirements | Task decomposition |
| T02 | Type Contract | Define generic TypeScript interfaces | data-grid-contract.ts |
| T03 | Data Preparation | Create typed employee mock data | employees.ts |
| T04 | Grid Structure | Implement semantic table elements | DataGrid.tsx |
| T05 | Sorting | Implement ascending and descending sorting | Sorting logic |
| T06 | Filtering | Implement case-insensitive search | Filtering logic |
| T07 | Pagination | Implement paginated results and controls | Pagination logic |
| T08 | Keyboard Navigation | Support arrow keys, Enter, Space, Home, End | Keyboard interactions |
| T09 | Accessibility | Implement ARIA grid semantics, focus handling, and announcements | Accessible component |
| T10 | UI Styling | Implement responsive layout and accessible contrast | Tailwind styling |
| T11 | Testing | Verify functionality, keyboard behavior, WCAG and Lighthouse | Test evidence |
| T12 | Documentation | Document installation, features, and audit results | README and test report |

## Dependency Flow

T01 → T02 → T03 → T04 → T05/T06/T07 → T08/T09 → T10 → T11 → T12

## Acceptance Criteria

- Sorting works correctly for numeric and text columns.
- Filtering searches across configured columns.
- Pagination correctly handles filtered and sorted data.
- Arrow keys navigate grid cells.
- Enter and Space toggle row selection.
- The component uses semantic HTML table elements.
- Screen readers can identify table structure, sorting and selection states.
- Text contrast meets WCAG 2.2 AA requirements.
- Accessibility and Best Practices achieve verified Lighthouse scores of 100/100.
- Source code is committed and documented on GitHub.

## Verification Status

Implementation and testing results must be recorded separately. No WCAG compliance or Lighthouse score is claimed until verified.