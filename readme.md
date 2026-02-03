# Playwright End-to-End Tests

This repository contains end-to-end (E2E) tests implemented using **Playwright**.

The goal of this project is to provide a clean, production-ready Playwright setup that can be easily cloned, installed, and executed locally or in CI.

---

## Prerequisites

Before running the tests, make sure the following tools are installed on your machine:

* **Node.js** (LTS version recommended)

  ```bash
  node --version
  ```
* **npm** (comes with Node.js)

  ```bash
  npm --version
  ```

> 💡 Recommended Node.js version: 18.x or newer

---

## Getting the Project

Clone the repository to your local machine:

```bash
git clone <REPOSITORY_URL>
cd <PROJECT_FOLDER>
```

---

## Install Dependencies

Install all required project dependencies:

```bash
npm install
```

This will install:

* Playwright Test framework
* Required Node.js dependencies defined in `package.json`

---

## Install Playwright Browsers

Playwright requires browser binaries (Chromium, Firefox, WebKit).

If browsers were not installed automatically, run:

```bash
npx playwright install
```

This step is required only once per machine.

---

## Environment Configuration (Optional)

If the project uses environment variables (for example, base URLs, credentials, tokens):

1. Create a `.env` file in the project root
2. Copy values from `.env.example` (if provided)
3. Fill in the required values

Example:

```env
BASE_URL=https://example.com
API_TOKEN=your_token_here
```

> ⚠️ Never commit `.env` files to the repository

---

## Running Tests

### Run all tests

```bash
npx playwright test
```

---

### Run tests in headed mode (with browser UI)

```bash
npx playwright test --headed
```

---

### Run tests in a specific browser

```bash
npx playwright test --project=chromium
```

Available projects depend on `playwright.config.ts`.

---

### Run a specific test file

```bash
npx playwright test tests/example.spec.ts
```

---

## Test Reports

After test execution, Playwright generates reports automatically.

### Open the HTML report

```bash
npx playwright show-report
```

Reports are generated locally and are not committed to the repository.

---

## Project Structure

```text
.
├── tests/                  # E2E test specs
├── pages/                  # Page Object Model (POM) classes
├── utils/                  # Helpers (files, paths, etc.)
├── fixtures/               # Test data (JSON)
├── test-files/             # Files used in upload tests
├── config/                 # Environment config
├── playwright.config.ts    # Playwright configuration
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Dependency lock file
├── README.md               # Project documentation
└── .gitignore              # Git ignore rules
```

---

## Test Structure

Tests are grouped by feature and use the Page Object Model from `pages/`.

Current specs in `tests/`:

- `albumCreating.spec.ts` — create and delete album flow
- `assistPage.spec.ts` — Assist page UI checks (welcome text, dialog, upload, connector, all connector elements)
- `loginPage.spec.ts` — login flows (valid/invalid, UI checks)
- `updateImageTags.spec.ts` — upload image and update tags on the uploaded image
- `updateTag.spec.ts` — update tags scenarios (existing media)
- `uploadImage.spec.ts` — upload image flows (gallery/album)

### Run specific test files

Examples (headed mode):

```bash
npx playwright test tests/loginPage.spec.ts --headed
npx playwright test tests/assistPage.spec.ts --headed
npx playwright test tests/albumCreating.spec.ts --headed
npx playwright test tests/uploadImage.spec.ts --headed
npx playwright test tests/updateImageTags.spec.ts --headed
npx playwright test tests/updateTag.spec.ts --headed
```
-g is a filter by test name (grep).
It allows you to run only those tests with the desired text in the name, rather than the entire file.

Example:
```bash
npx playwright test -g "Verify welcome message"
```
---

## Common Issues

### Browsers are missing

If you see an error related to missing browsers:

```bash
npx playwright install
```

---

### Tests fail immediately

* Check that all environment variables are set correctly
* Verify the target environment (URLs, test data)
* Make sure required services are reachable

---

## CI Usage

This project is compatible with CI systems such as **GitHub Actions**.

Test artifacts (reports, traces, screenshots) should be collected as CI artifacts and not committed to the repository.

---

## Useful Commands

```bash
npx playwright test        # Run all tests
npx playwright test --ui   # Run tests using Playwright UI mode
npx playwright codegen     # Generate tests using codegen
```

---

## Notes

* This repository intentionally does not include example tests
* The structure is designed for real-world, production test automation
* Feel free to extend it with API tests, fixtures, or custom reporters

---

Happy testing 🎭
