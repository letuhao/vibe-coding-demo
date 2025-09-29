---
title: Vibe Coding with Cursor AI — Expense Manager Live Demo
author: You
paginate: true
theme: gaia
_class: lead
size: 16:9
---

# Vibe Coding với Cursor AI  
### + Live Demo: Expense Manager (FE/BE)  
*(VN/EN bilingual slides)*

**Duration:** 60 minutes

> Pair‑programming with an AI agent under explicit rules & repeatable loops.

---

## Agenda / Chương trình

1. What is Vibe Coding? — **Vibe Coding là gì?**  
2. Cursor AI overview & models — **Tổng quan Cursor & lựa chọn model**  
3. Effective workflow — **Quy trình hiệu quả**  
4. Live Demo: Expense Manager (NestJS + React)  
5. Testing strategy (UT/IT/E2E)  
6. Prompting tips & Q&A

---

## Vibe Coding là gì? / What is Vibe Coding?

**Định nghĩa**  
- Lập trình theo “nhịp” hợp tác với AI: bạn giữ **ý định & tiêu chuẩn**, AI hỗ trợ **scaffold, boilerplate, phân tích**.  
- Khác với “prompt & pray”: có **rules + pre-train + loop ngắn** → đề bài → kết quả → review → chỉnh.

**Mục tiêu**  
- Tăng tốc **x2–x5** nhưng vẫn **kiểm soát chất lượng**.

> Pair‑programming with an AI agent under explicit rules and short, reviewable loops.

---

## Tại sao quan trọng? / Why it matters

- **Tốc độ:** scaffold nhanh, viết test, sinh tài liệu.  
- **Chất lượng:** rules, template, checklist giúp **giữ chuẩn**.  
- **Khả chuyển giao:** pipeline & docs có thể **reuse** giữa projects.

---

## Cursor AI: Overview

- **Cursor = IDE + Agent + Context Management** tối ưu cho code.  
- Khả năng: Chat‑in‑editor, Edit, Composer, Rules, cấu hình context/knowledge.  
- **Khi nào dùng**: sinh scaffolding, refactor, test, tài liệu nhanh.

> Tập trung **cách dùng hiệu quả**, không sa đà chi tiết công cụ.

---

## Model chọn thế nào? / Model selection

**Nhóm mạnh** (GPT‑4.x, Claude Sonnet…):  
- Thiết kế, refactor lớn, logic nhạy cảm.

**Nhóm cân bằng** (mix):  
- CRUD, unit test, docs thường ngày.

**Nhóm rẻ/nhanh**:  
- Sinh file lặp, mock/fixtures, ít rủi ro.

**Nguyên tắc**  
- Chọn theo **độ rủi ro × nhu cầu suy luận × chi phí**.  
- Cấu hình **per‑task** trong Cursor.

---

## Overall Loop / Quy trình tổng quan

1. **Define Rules** – chuẩn code, kiến trúc, naming, testing.  
2. **Pre‑train Data** – docs/domain/ERD/API spec súc tích.  
3. **Organize** – repo structure, README, seeds.  
4. **Plan & Checklist** – breakdown + acceptance criteria.  
5. **Execute** – generate/refine/review với Cursor.  
6. **Test** – UT/IT/E2E → Iterate.

---

## Step 1 — RULES (in Cursor)

- Clean Architecture, SOLID, naming (EN), commit style, PR template.  
- Thêm **Do/Don’t**: không hardcode secret, yêu cầu log/metrics.  
- Đưa checklist vào **Rules** của Cursor, link về docs trong repo.

---

## Step 2 — Pre‑train Data

- Chuẩn bị **README, ADR, ERD, API spec, UX mock, Coding Style**.  
- **Context nhỏ gọn**: tóm tắt + link “source of truth”.  
- **Seeds**: JSON fixtures, curl, Postman/Supertest.

---

## Step 3 — Tổ chức & Tự động hoá

**Repo layout**  
```
apps/, packages/, docs/, scripts/, .github/
```

**Docs nên có**  
- 01_Architecture.md, 02_API_Spec.md, 03_Data_Model.md, 04_Testing.md, 05_Rules.md

**Automation**  
- Makefile/NPM scripts: `test`, `lint`, `seed` để AI gọi nhanh.

---

## Step 4 — Plan & Checklist

- **Epics → Tasks → Subtasks** (BE/FE/Test).  
- **Acceptance Criteria**: Given/When/Then + dữ liệu cụ thể.  
- **Definition of Done**: code + UT + docs + review + CI pass.

---

## Step 5 — Execute với Cursor

**Prompt pattern**  
- Bối cảnh (rules) + mục tiêu + ràng buộc + **output format**.  

**Edit‑in‑place**  
- Chọn vùng code → yêu cầu Cursor chỉnh theo rule.  

**Composer**  
- Sinh **nhiều file scaffold** đúng spec.

---

## Step 6 — Testing Strategy (tổng quan)

- **Unit Test**: logic đơn vị, không cần I/O thật.  
- **Integration Test**: API với DB thật (SQLite) / container test DB.  
- **E2E**: Selenium/Playwright cho UI + API end‑to‑end.  
- **CI**: test matrix, coverage reports, screenshot on fail.

---

## Live Demo — Expense Manager (Goals)

**Mục tiêu**  
- CRUD chi tiêu, phân loại (category), báo cáo nhanh, lọc theo ngày.

**Tech đề xuất**  
- **Backend**: NestJS + Prisma + SQLite  
- **Frontend**: React + Vite + Tailwind  
- **Auth**: JWT (access + refresh), interceptors

> Nhanh, local‑friendly, đủ CRUD + chart + auth cơ bản.

---

## Architecture & Flow

**BE (NestJS, REST)**  
- `/auth`, `/categories`, `/expenses`, `/reports`

**DB**  
- SQLite + Prisma (migrations & seeds)

**FE (React/Vite)**  
- Pages: Login, Dashboard, Expenses, Reports

**Auth**  
- JWT + axios/fetch interceptors

---

## Data Model (ERD — simple)

**User**: id, email, password_hash, createdAt  
**Category**: id, name, type (expense|income), userId  
**Expense**: id, userId, categoryId, amount, note, date

---

## API Spec — chính (REST)

- `/auth` — `POST /login`, `POST /register`, `POST /refresh`  
- `/categories` — `GET/POST/PUT/DELETE`  
- `/expenses` — `GET` (filter by date, category), `POST/PUT/DELETE`  
- `/reports` — `GET /summary?from=..&to=..` (total by category, monthly)

---

## Demo Script (5–7 phút)

1) **BE scaffold**: Module NestJS + Prisma schema + CRUD + seed.  
2) **FE scaffold**: React routes + forms + table + chart.  
3) **Connect**: Gọi API thật, nhập vài khoản chi, xem dashboard/chart.  
4) **Test nhanh**: UT cho service, Integration test cho `/expenses`.

---

## Unit Test — Outline (ví dụ)

**BE**  
- `ExpenseService`: validate `amount > 0`, mapping DTO→entity.

**FE**  
- Utils: `formatCurrency`, `dateRange` helpers.

**Mocking**  
- Repository/HTTP mocked; **no DB**.

---

## Integration Test — Outline

**BE**  
- Supertest: `/auth`, CRUD `/expenses` (SQLite test DB).  
- **Seed**: user test, categories, sample expenses.  
- **Assertions**: filter theo `from/to`, tổng theo category.

---

## E2E (Selenium/Playwright)

**Flows**  
- Login → Add Expense → Filter → View Report

**Selectors**  
- Dùng `data-testid` để ổn định.

**CI**  
- Headless run, HTML report, screenshot on failure.

---

## Cursor RULES — ví dụ rút gọn

- **TypeScript strict**, ESLint + Prettier, DTO validated.  
- **Architecture**: NestJS modules per resource; FE tách pages/components/hooks.  
- **Testing**: UT ≥ 70% cover; IT cho endpoints critical; E2E smoke.  
- **Docs**: Mọi PR kèm README cập nhật & `curl` samples.

---

## Pre‑train Pack — cho /docs

- `01_Architecture.md` (kiến trúc + flow)  
- `02_API_Spec.md` (OpenAPI/curl)  
- `03_Data_Model.md` (ERD)  
- `04_Testing.md` (UT/IT/E2E)  
- `05_Rules.md` (coding/testing/review)

---

## Prompt Patterns — Backend

**Scaffold**  
> “Dựa trên Rules & API Spec, sinh module NestJS cho `/expenses` với DTO, controller, service, prisma model. Thêm UT.”

**Fix**  
> “Refactor `ExpenseService` để validate `date` & `amount`; thêm edge‑case tests.”

**Docs**  
> “Sinh README cho module `expenses` kèm `curl` mẫu.”

---

## Prompt Patterns — Frontend

**Scaffold**  
> “Sinh trang `/expenses` với bảng + form add/edit (React Hook Form + Zod). Gọi API theo spec.”

**Charts**  
> “Tạo component `PieChart` & `BarChart` (Recharts) từ `/reports/summary`.”

**Auth**  
> “Thêm interceptor JWT; redirect 401.”

---

## Prompting Tips / Mẹo đặt câu hỏi

- **Rõ ràng & ràng buộc**: nêu rule, input, output mong đợi, tiêu chí đánh giá.  
- **Iterate ngắn**: yêu cầu **diff nhỏ**, review từng bước.  
- **Cho ví dụ**: 1–2 ví dụ chuẩn giúp AI giữ style.  
- **Giữ nguồn sự thật**: OpenAPI/ERD là chuẩn; yêu cầu AI bám theo.

---

## Summary

- **Vibe Coding = Quy trình + Rules + Loop ngắn**.  
- **Cursor AI** tăng tốc đáng kể khi có **pre‑train & checklist**.  
- Demo **Expense Manager**: CRUD + báo cáo + test → áp dụng ngay.

**Q&A** — Câu hỏi & thảo luận.

---

### Appendix — Quick Commands

```bash
# FE
npm create vite@latest expense-fe -- --template react-ts
cd expense-fe && npm i && npm i -D tailwindcss postcss autoprefixer && npx tailwindcss init -p

# BE
npm i -g @nestjs/cli
nest new expense-be --package-manager npm
npm i @prisma/client && npm i -D prisma && npx prisma init

# Test
npm t
```

---

### Appendix — Minimal HTML App to Show Slides

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Vibe Coding Slides</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js/dist/reveal.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js/dist/theme/black.css">
  </head>
  <body>
    <div class="reveal"><div class="slides">
      <!-- Put your Markdown in a script tag -->
      <section data-markdown>
        <script type="text/template">
# Load slides.md via fetch or paste content here
        </script>
      </section>
    </div></div>
    <script src="https://cdn.jsdelivr.net/npm/reveal.js/dist/reveal.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/reveal.js/plugin/markdown/markdown.js"></script>
    <script>
      Reveal.initialize({ hash: true, slideNumber: true });
    </script>
  </body>
</html>
```
