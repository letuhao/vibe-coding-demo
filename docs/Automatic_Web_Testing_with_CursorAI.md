
# Automatic Web Testing with Cursor AI
### Selenium & Playwright for a React/NestJS (Expense Manager) stack

> Mục tiêu: Bạn có thể dùng **Cursor AI** để **khởi tạo, sinh, và duy trì** test tự động cho web (UI + API), với 2 lựa chọn: **Playwright** (khuyến nghị) hoặc **Selenium** (tương thích rộng). Tài liệu này gồm: quy trình, rules, prompts, ví dụ test, CI, và mẹo chống flaky.

---

## 0) Tại sao dùng Cursor AI cho testing?
- **Tăng tốc** khởi tạo khung test, scaffold Page Object, sinh nhiều case lặp nhanh.
- **Giữ chuẩn** khi bạn nạp rules + pre-train docs để AI bám theo (selector, dữ liệu, DOD).
- **Duy trì dễ**: khi UI thay đổi, yêu cầu AI cập nhật selectors, refactor POM.

---

## 1) Chọn framework test UI
**Khuyến nghị**: **Playwright (TypeScript)** cho web hiện đại (rất nhanh, ổn định, API gọn).  
**Cũng được**: **Selenium WebDriver** (Node/TS hoặc Python) nếu bạn cần tương thích/có sẵn hạ tầng Selenium Grid.

| Tiêu chí | Playwright | Selenium |
|---|---|---|
| Cài đặt & DX | Dễ, tích hợp test runner | Cần runner (Jest/Mocha) hoặc selenium-side |
| Tốc độ/ổn định | Nhanh, auto-wait tốt | Phụ thuộc driver, dễ flaky hơn |
| API | Gọn, nhiều tiện ích (trace, video) | Chuẩn W3C, đa ngôn ngữ |
| Headless/CI | Tích hợp rất tốt | OK nhưng cấu hình thêm |
| Debug | Trace viewer, video | Log + video qua tool phụ |

> Bạn có thể giữ **Selenium** cho legacy/e2e cross-lang, và dùng **Playwright** làm default cho dự án mới.

---

## 2) Cấu trúc thư mục gợi ý
```
apps/
  backend/              # NestJS API
  frontend/             # React app
tests/
  e2e/
    playwright/         # hoặc selenium/
      pages/            # Page Objects (LoginPage, ExpensesPage, ...)
      specs/            # *.spec.ts - test cases
      fixtures/         # seed data, helpers
      config/           # playwright.config.ts / selenium config
  integration/
    api/                # Supertest specs cho API
scripts/
  seed/                 # seed DB cho test
docs/
  04_Testing.md         # bạn đã có trong bundle
```

---

## 3) Thiết lập bằng Playwright (khuyến nghị)

### 3.1 Cài đặt
```bash
cd tests/e2e
npm init -y
npm i -D @playwright/test
npx playwright install
```

### 3.2 `playwright.config.ts` (ví dụ)
```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  timeout: 60_000,
  retries: 1,
  use: {
    baseURL: process.env.APP_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

### 3.3 Page Object mẫu
`tests/e2e/playwright/pages/LoginPage.ts`
```ts
import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.getByTestId('email-input').fill(email);
    await this.page.getByTestId('password-input').fill(password);
    await this.page.getByTestId('login-submit').click();
    await expect(this.page).toHaveURL(/dashboard/i);
  }
}
```

### 3.4 Test case mẫu (happy path)
`tests/e2e/playwright/specs/expense-flow.spec.ts`
```ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Expense flow', () => {
  test('Login → Add Expense → Filter → View Report', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('demo@user.com', 'Passw0rd!');

    // Add expense
    await page.getByTestId('add-expense').click();
    await page.getByTestId('expense-amount').fill('125.50');
    await page.getByTestId('expense-category').selectOption('food');
    await page.getByTestId('expense-date').fill('2025-09-28');
    await page.getByTestId('expense-note').fill('Dinner');
    await page.getByTestId('save-expense').click();

    // Filter
    await page.getByTestId('filter-from').fill('2025-09-01');
    await page.getByTestId('filter-to').fill('2025-09-30');
    await page.getByTestId('apply-filter').click();

    // Assert table & report
    await expect(page.getByTestId('expense-row')).toContainText('Dinner');
    await expect(page.getByTestId('report-total')).toContainText('125.50');
  });
});
```

> **Selector strategy:** trong FE, thêm `data-testid="..."` cho các element quan trọng để test ổn định.

### 3.5 Scripts chạy test
Thêm vào `package.json` (ở `tests/e2e`):
```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test --ui",
    "report": "playwright show-report"
  }
}
```

---

## 4) Thiết lập bằng Selenium (Node + TypeScript)

### 4.1 Cài đặt
```bash
cd tests/e2e
npm init -y
npm i -D selenium-webdriver chromedriver mocha ts-node typescript @types/mocha
npx tsc --init
```

### 4.2 Test mẫu với Selenium + Mocha
`tests/e2e/selenium/specs/login.spec.ts`
```ts
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import 'chromedriver';
import { strict as assert } from 'assert';

describe('Login flow (Selenium)', function () {
  this.timeout(60_000);
  let driver: WebDriver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    await driver.quit();
  });

  it('should login and reach dashboard', async () => {
    await driver.get(process.env.APP_BASE_URL || 'http://localhost:5173/login');
    await driver.findElement(By.css('[data-testid="email-input"]')).sendKeys('demo@user.com');
    await driver.findElement(By.css('[data-testid="password-input"]')).sendKeys('Passw0rd!');
    await driver.findElement(By.css('[data-testid="login-submit"]')).click();

    await driver.wait(until.urlContains('dashboard'), 10_000);
    const url = await driver.getCurrentUrl();
    assert.ok(url.includes('dashboard'));
  });
});
```

### 4.3 Scripts cho Selenium
```json
{
  "scripts": {
    "test": "mocha -r ts-node/register tests/e2e/selenium/specs/**/*.spec.ts"
  }
}
```

> Bạn có thể dùng **Selenium Grid** hoặc Docker image riêng nếu cần cross-browser ở quy mô lớn.

---

## 5) Integration Test (API) bằng Supertest (NestJS)
`tests/integration/api/expenses.spec.ts`
```ts
import request from 'supertest';

const base = process.env.API_BASE_URL || 'http://localhost:3000';

describe('Expenses API', () => {
  it('POST /auth/login → 200', async () => {
    const res = await request(base).post('/auth/login').send({
      email: 'demo@user.com', password: 'Passw0rd!'
    });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it('CRUD /expenses', async () => {
    // ...login, set auth header
    // ...POST /expenses, GET list, PUT update, DELETE
  });
});
```

---

## 6) Cursor AI – Rules dành cho Testing (dán vào tab Rules)
```
TESTING RULES:
- Ưu tiên Playwright (TypeScript); Selenium chỉ khi cần tương thích đặc biệt.
- Sử dụng Page Object Model cho flows quan trọng (Login, Expenses, Reports).
- Luôn dùng data-testid selectors; tránh Xpath dài hoặc selectors phụ thuộc CSS layout.
- Mọi test E2E phải có: Arrange (seed/fixtures) → Act → Assert rõ ràng.
- Gộp setup/teardown vào fixtures; tái sử dụng helper (auth, seed).
- Test đặt tên theo hành vi người dùng: "Login → Add Expense → Filter → View Report".
- CI: headless, trace on retry, artifact report (HTML + videos/screenshots).
- Không hardcode wait; dùng auto-wait/expect (Playwright) hoặc explicit wait (Selenium).
```

---

## 7) Prompt mẫu cho Cursor AI

### 7.1 Bootstrap Playwright
```
Dựa trên 04_Testing.md và Rules, hãy tạo khung Playwright trong thư mục tests/e2e/playwright:
- playwright.config.ts với baseURL = env APP_BASE_URL
- pages/LoginPage.ts, pages/ExpensesPage.ts (có phương thức addExpense)
- specs/expense-flow.spec.ts cho flow: Login → Add → Filter → Report
- cập nhật package.json scripts: test, test:ui, report
Output diff patch từng file.
```

### 7.2 Sinh test E2E cụ thể
```
Sinh test cho kịch bản:
- Đăng nhập demo@user.com / Passw0rd!
- Thêm expense 125.50, category food, note "Dinner", date hôm nay
- Lọc theo khoảng ngày tháng này
- Kiểm tra tổng report = 125.50
Hãy dùng data-testid như đã quy ước trong Rules. Output 1 file spec.
```

### 7.3 Refactor sang Page Object
```
Refactor expense-flow.spec.ts sang POM:
- Tạo ExpensesPage với method addExpense(...) và filterByDate(from,to)
- Áp dụng trong spec, giữ nguyên asserts
- Trả về diff patch
```

### 7.4 Viết Integration test API
```
Tạo tests/integration/api/expenses.spec.ts dùng Supertest:
- Login để lấy token
- CRUD /expenses (POST/GET/PUT/DELETE) với SQLite test DB
- Dọn dữ liệu sau khi test
```

### 7.5 Cấu hình CI (GitHub Actions)
```
Sinh .github/workflows/e2e.yml:
- chạy backend & frontend (pnpm hoặc npm)
- seed DB
- chạy Playwright headless
- upload test report (HTML), video, screenshot làm artifact
```

---

## 8) GitHub Actions (Playwright) – ví dụ
`.github/workflows/e2e.yml`
```yaml
name: e2e
on: [push, pull_request]
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install root
        run: npm ci

      - name: Start backend
        run: |
          cd apps/backend
          npm ci
          npm run prisma:migrate
          npm run seed:test || true
          npm run start:dev &
      - name: Start frontend
        run: |
          cd apps/frontend
          npm ci
          npm run dev &

      - name: Install Playwright deps
        run: |
          cd tests/e2e
          npm ci
          npx playwright install --with-deps

      - name: Run Playwright tests
        run: |
          cd tests/e2e
          npx playwright test
        env:
          APP_BASE_URL: http://localhost:5173

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: tests/e2e/playwright-report
```

---

## 9) Seed & Fixtures
- Tạo scripts seed (DB) để test có dữ liệu sẵn: user demo, categories mặc định.  
- Với Playwright: bạn có thể gọi API directly trong `test.beforeAll` để seed nhanh.

```ts
// pseudo example
await request.post(`${API}/seed/test`, { data: {...} });
```

---

## 10) Chống flaky
- Dùng **data-testid** selectors ổn định.
- Tránh `waitForTimeout`; dùng auto-wait (Playwright) hoặc explicit waits (Selenium).
- Gói network call quan trọng trong `expect` (ví dụ chờ table cập nhật).
- Tách bớt logic fragile ra API tests (integration) thay vì UI.
- Chạy test trên **fixed viewport** & stable test data.

---

## 11) Báo cáo & theo dõi lỗi
- Playwright: HTML report, trace viewer, video/screenshot.
- Selenium: tích hợp Allure/HTML reporter, lưu screenshot khi fail.
- Lưu artifact trong CI để debug sau.

---

## 12) Liên kết với dự án Expense Manager
- FE: thêm `data-testid` cho input, button, bảng, chart.
- BE: cung cấp endpoint seed test (`/test/seed`) hoặc script db seed.
- Rules: dán Testing Rules vào Cursor → AI sinh test đúng chuẩn.
- Tài liệu: cập nhật `04_Testing.md` để team hiểu và áp dụng thống nhất.

---

### Kết luận
- **Playwright**: chọn mặc định cho tốc độ & DX;  
- **Selenium**: dùng khi cần tương thích/hạ tầng có sẵn;  
- **Cursor AI**: biến test thành pipeline repeatable – từ scaffold → case → refactor → CI, tiết kiệm 60–80% thời gian so với viết tay.
