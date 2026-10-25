# Homework 1 — Production Enterprise Data-Grid

An accessible, reusable enterprise Data-Grid built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- Sorting: ascending and descending
- Filtering: case-insensitive search
- Pagination: five records per page
- Keyboard navigation: arrow keys, Home, End
- Row selection: Enter and Space
- Semantic HTML table structure
- ARIA grid semantics and screen reader announcements
- Responsive layout and visible focus indicators

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Playwright
- axe-core
- Google Lighthouse

## Installation

```bash
git clone https://github.com/ninitu123456/lab-02.git
cd lab-02
npm install
npm run dev
```

Open http://localhost:3000.

## Testing

Run automated tests:

```bash
npx playwright test --reporter=list
```

Run code quality checks:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Test Results

| Test | Result |
|---|---|
| Playwright | 6/6 PASS |
| Lighthouse Accessibility | 100/100 |
| Lighthouse Best Practices | 100/100 |

## Project Documentation

- [Task Decomposition](docs/TASK-DECOMPOSITION.md)
- [Test Report](docs/TEST-REPORT.md)

## Accessibility

The component targets WCAG 2.2 Level AA. Automated accessibility testing uses axe-core and Lighthouse. Manual keyboard and screen reader verification should also be completed before claiming full conformance.

## Repository

https://github.com/ninitu123456/lab-02