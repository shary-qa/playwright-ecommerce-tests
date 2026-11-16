# 🛒 Playwright E-commerce Tests

[![Playwright tests](https://github.com/shary-qa/playwright-ecommerce-tests/actions/workflows/playwright.yml/badge.svg)](https://github.com/shary-qa/playwright-ecommerce-tests/actions/workflows/playwright.yml)
[![Live test report](https://img.shields.io/badge/Live_report-open-2EAD33?logo=playwright&logoColor=white)](https://shary-qa.github.io/playwright-ecommerce-tests/)

End-to-end test suite for an online shop ([Sauce Demo](https://www.saucedemo.com), a public practice site), built with **Playwright + TypeScript**.
It covers the flows that make or lose money in e-commerce: login, product list, cart and checkout, on **desktop, iPhone and Android**.

> Built **AI-assisted with Claude Code in VS Code**. I decide what to test and which risks matter, review every test, and run and maintain the suite.
> This is a sample project. Client code from my real work is private (NDA); this repo shows the same approach.

## ✅ At a glance

| | |
|---|---|
| **Tests** | 31 tests × 3 devices = **93 runs**, all green |
| **Devices** | Desktop Chrome · iPhone 15 (Safari engine) · Android Pixel 7 |
| **Bugs found** | **11** (3 critical) → [BUGS.md](BUGS.md) |
| **CI** | GitHub Actions on every push + every Monday, HTML report published online |

## 🧪 What is covered

| Area | Tests |
|---|---|
| **Login** | valid login, locked-out user, wrong password, empty fields, page protection without login, logout + back button |
| **Product list** | 6 products with name / price / image, sort by price (both ways) and name, detail page matches list |
| **Cart** | badge count on add / remove, cart contents, cart survives page reload |
| **Checkout** | full order (happy path), **order maths: items + tax = total**, required-field checks (data-driven) |
| **Known bugs** | 11 bugs found by exploratory testing, each locked in as a test (see below) |

## 🐞 How known bugs are tracked

Each bug in [BUGS.md](BUGS.md) has a test in [`tests/known-bugs.spec.ts`](tests/known-bugs.spec.ts) that checks the **correct** behaviour and is marked `test.fail()`:

- While the bug exists, the test "fails as expected" and the pipeline stays green.
- When a developer fixes it, Playwright flags it right away ("expected to fail, but passed"), so the ticket can be closed and the test becomes a normal regression test.

This keeps bugs visible without breaking the build.

## 🗂️ Project structure

```
pages/            Page Objects: one class per screen, all selectors in one place
  LoginPage.ts
  InventoryPage.ts
  CartPage.ts
  CheckoutPage.ts
tests/            Test files, grouped by feature
test-data/        Users and customer data
docs/screenshots/ Bug evidence
.github/workflows/playwright.yml   CI pipeline
playwright.config.ts               Devices, base URL, reports, traces
```

**Design choices**
- **Page Object Model:** if the UI changes, the fix is in one file, not in every test
- **`data-test` selectors** (`getByTestId`), the most stable kind, not CSS classes
- **Screenshots + traces on failure**, so every failure can be replayed step by step
- **Retries only on CI**, so flaky tests stay visible when run locally

## ▶️ Run it yourself

```bash
npm ci
npx playwright install chromium webkit
npm test                 # all devices
npm run test:desktop     # desktop only
npm run test:mobile      # iPhone + Android
npm run test:headed      # watch the browser
npm run report           # open the HTML report
```

## 👤 About me

**Shahryar Abbas**, Senior QA Engineer, 10+ years of remote testing (web, mobile, API, AI/LLM products).
Upwork Top Rated Plus · 100% Job Success.
[GitHub profile](https://github.com/shary-qa) · [LinkedIn](https://www.linkedin.com/in/shahryar-abbas-03b33b46/) · [Upwork](https://www.upwork.com/freelancers/~0113960ee4681b8bf5)
