# Vibe Coding Workshop with Cursor AI
## + Live Demo: Expense Manager App (Ứng dụng Quản lý chi tiêu)

---

## Agenda / Chương trình
- Vibe Coding là gì? (What & Why)
- Cursor AI: Overview, models, khi nào dùng gì
- Workflow hiệu quả: Rule → Pre-train → Docs → Plan/Checklist → Execute → Test
- Live Demo: Expense Manager (FE/BE)
- Tips đặt câu hỏi (Prompting) & Q&A

---

## 1. Vibe Coding là gì?

### Định nghĩa
- Vibe Coding là cách lập trình mới, nơi chúng ta coi **AI như một đồng đội pair programming**.  
- Thay vì “prompt and pray” (ra lệnh và cầu mong AI trả đúng), Vibe Coding dựa trên:  
  - **Rules (luật lệ)**: quy tắc, coding style, kiến trúc.  
  - **Pre-train data**: tài liệu dự án (README, API spec, ERD).  
  - **Workflow lặp ngắn**: ra đề → nhận kết quả → review → refine.  

### Ví dụ dễ hiểu
- Nếu coding truyền thống: dev phải tự viết tất cả.  
- Nếu dùng AI không có rule: kết quả có thể nhanh nhưng dễ sai, không nhất quán.  
- Với Vibe Coding: AI viết theo chuẩn mà team đã đặt, dev chỉ cần điều chỉnh.  

### Mục tiêu
- **Tốc độ**: tăng năng suất x2–x5.  
- **Chất lượng**: vẫn giữ được chuẩn kiến trúc, quy tắc.  
- **Khả năng tái sử dụng**: tài liệu & pipeline có thể dùng lại cho nhiều dự án khác.  

---

## 2. Cursor AI

### Cursor là gì?
- Một IDE thế hệ mới, tích hợp AI ngay trong editor.  
- Không chỉ là chat – Cursor có thể **edit code trực tiếp**, **nhớ context repo**, và **áp dụng rules**.  

### Các tính năng chính
- **Chat-in-editor**: hỏi/trao đổi với AI như 1 mentor.  
- **Edit mode**: chọn vùng code → ra lệnh chỉnh sửa.  
- **Composer**: sinh scaffold nhiều file cùng lúc.  
- **Rules**: định nghĩa coding style, kiến trúc, checklist.  

### Pricing & Limit (tóm tắt)
- Có bản miễn phí, bản Pro, bản Team.  
- Điểm khác biệt: số request/ngày, context size, tốc độ model.  
*(Bạn update con số mới nhất khi trình bày, vì giá thường thay đổi.)*

### Models (Modals) – Chi tiết

#### Vì sao cần hiểu models?
Mỗi model có khả năng suy luận, tốc độ, chi phí và giới hạn context khác nhau. Chọn sai model có thể:
- Tốn chi phí không cần thiết
- Kết quả không đạt chất lượng (thiếu chiều sâu, thiếu tính nhất quán)
- Mất thời gian refine nhiều lần

#### Danh sách Models hiện tại

**🔹 Cursor Default / Balanced**
- **Mục tiêu**: cân bằng giữa tốc độ và chất lượng
- **Điểm mạnh**: nhanh, ổn định, đủ tốt cho phần lớn tác vụ CRUD, UT, refactor nhỏ
- **Hạn chế**: chưa đủ sâu cho thiết kế kiến trúc lớn, đôi khi thiếu nhất quán trong dự án lớn
- **Khi nào dùng**: Sinh module CRUD (controller, service), viết test cơ bản (UT), sinh docs đơn giản

**🔹 High-capability Models (GPT-4.x, Claude Sonnet, Cursor-4 Strong)**
- **Mục tiêu**: độ chính xác và suy luận cao, hiểu context lớn
- **Điểm mạnh**: Viết code phức tạp nhiều tầng logic, hiểu docs dài/ERD lớn, viết tài liệu (ADR-Architecture Decision Record, design doc) tốt hơn
- **Hạn chế**: Chậm hơn, tốn credit, đôi khi trả lời "dài quá mức cần thiết"
- **Khi nào dùng**: Thiết kế kiến trúc (Clean Architecture, Microservice), refactor codebase lớn, viết/chuẩn hoá tài liệu

**🔹 Low-cost / Fast Model**
- **Mục tiêu**: tốc độ, tiết kiệm chi phí
- **Điểm mạnh**: Trả kết quả nhanh, dùng cho tác vụ lặp đi lặp lại
- **Hạn chế**: Khả năng hiểu ngữ cảnh thấp, dễ sinh lỗi nếu task phức tạp
- **Khi nào dùng**: Sinh mock data/JSON fixture, sinh boilerplate code (interfaces, DTOs), sinh unit test đơn giản nhiều case

**🔹 Custom / Fine-tuned Models**
- **Mục tiêu**: đào tạo AI để phù hợp riêng với dự án hoặc công ty
- **Điểm mạnh**: AI tuân thủ coding style riêng, giữ consistency cao cho nhiều dự án cùng domain
- **Hạn chế**: Tốn công sức chuẩn bị data để fine-tune, chỉ hữu ích khi có nhiều dự án tương tự
- **Khi nào dùng**: Khi công ty muốn AI "code giống dev nội bộ", khi domain đặc thù (fintech, loyalty, ERP)

#### Cách chọn model theo tình huống
- **Thiết kế & Refactor phức tạp** → High-capability
- **CRUD & Test cơ bản** → Default/Balanced  
- **Mock data, code lặp** → Fast/cheap model
- **Nhiều dự án dài hạn cùng domain** → Fine-tuned

#### Ví dụ áp dụng trong Expense Manager
- **Scaffold module Expenses (CRUD)** → Default/Balanced
- **Thiết kế chức năng Reports (aggregation, filter)** → High-capability
- **Sinh seed data JSON (expenses, categories)** → Low-cost/Fast model
- **Triển khai nhiều app loyalty/fintech cùng style** → Custom/fine-tuned  

---

## 3. Workflow hiệu quả với Cursor AI

### 3.1 Define Rules
- Mọi dự án nên có **rules rõ ràng** ngay từ đầu:  
  - Kiến trúc: Clean Architecture, Layered, Module separation.  
  - Code style: TypeScript strict, ESLint, naming convention.  
  - Testing: UT ≥ 70%, integration cho API quan trọng.  
- Thực tế: paste rules vào tab **Rules** của Cursor, kèm link tới docs.  

### 3.2 Pre-train Data

#### Cấu trúc thư mục `/docs` chuẩn
```
docs/
├── 01_Architecture.md          # Kiến trúc tổng quan
├── 02_API_Spec.md             # REST API specification  
├── 03_Data_Model.md           # ERD + Database schema
├── 04_Testing.md              # Testing strategy & plan
├── 05_Rules.md                # Coding rules & conventions
├── 06_Deployment.md           # Deployment & environment
└── 07_Examples.md             # Code examples & patterns
```

#### Nội dung chi tiết từng file

**01_Architecture.md**
```markdown
# Architecture Overview
## Tech Stack
- Backend: NestJS + Prisma + SQLite
- Frontend: React + Vite + Tailwind CSS
- Auth: JWT (access + refresh tokens)

## Folder Structure
apps/
├── backend/           # NestJS API
│   ├── src/
│   │   ├── modules/   # Feature modules
│   │   ├── common/    # Shared utilities
│   │   └── config/    # Configuration
│   └── prisma/        # Database schema
└── frontend/          # React SPA
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── services/
```

**02_API_Spec.md**
```markdown
# API Specification
## Base URL: /api/v1

### Authentication
POST /auth/register
POST /auth/login  
POST /auth/refresh
POST /auth/logout

### Categories
GET /categories
POST /categories
PUT /categories/:id
DELETE /categories/:id

### Expenses
GET /expenses?page=1&limit=10&categoryId=1
POST /expenses
PUT /expenses/:id
DELETE /expenses/:id

### Reports
GET /reports/summary?from=2024-01-01&to=2024-01-31
GET /reports/categories?period=month
```

**03_Data_Model.md**
```markdown
# Database Schema

## Users Table
- id: UUID (Primary Key)
- email: VARCHAR(255) UNIQUE
- password_hash: VARCHAR(255)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

## Categories Table  
- id: UUID (Primary Key)
- name: VARCHAR(100)
- type: ENUM('expense', 'income')
- user_id: UUID (Foreign Key)
- created_at: TIMESTAMP

## Expenses Table
- id: UUID (Primary Key)
- amount: DECIMAL(10,2)
- note: TEXT
- date: DATE
- category_id: UUID (Foreign Key)
- user_id: UUID (Foreign Key)
- created_at: TIMESTAMP
```

**04_Testing.md**
```markdown
# Testing Strategy

## Unit Tests (≥70% coverage)
- Service layer logic
- Utility functions
- Component logic

## Integration Tests
- API endpoints
- Database operations
- Authentication flow

## E2E Tests
- Complete user journeys
- Cross-browser compatibility

## Test Commands
npm run test:unit
npm run test:integration  
npm run test:e2e
```

**05_Rules.md**
```markdown
# Coding Rules & Conventions

## TypeScript
- Strict mode enabled
- No any types
- Interface over type for objects
- PascalCase for classes, camelCase for functions

## NestJS
- Use DTOs for validation
- Service methods return Promises
- Use dependency injection
- Follow single responsibility principle

## React
- Functional components with hooks
- Props interface defined
- Custom hooks for business logic
- Error boundaries for error handling

## Database
- Use Prisma ORM
- Foreign key constraints
- Soft delete for important data
- Indexes on frequently queried fields
```

#### Lợi ích của Pre-train Data
- **Consistency**: AI hiểu rõ kiến trúc và quy tắc
- **Context**: AI biết được mối quan hệ giữa các module
- **Quality**: Code sinh ra tuân thủ chuẩn đã định
- **Speed**: Không cần giải thích lại context mỗi lần  

### 3.3 Organize tài liệu
- Đặt folder gọn gàng: `apps/backend`, `apps/frontend`, `docs/`, `scripts/`.  
- Có **README** tổng quan + seed data + script test.  

### 3.4 Plan & Checklist

#### Template Breakdown Task
```
Epic: [Tên tính năng lớn]
├── Task 1: [Mô tả task cụ thể]
│   ├── Subtask 1.1: [Chi tiết implementation]
│   ├── Subtask 1.2: [Chi tiết implementation]
│   └── Acceptance Criteria: [Given/When/Then]
├── Task 2: [Mô tả task cụ thể]
│   └── ...
```

#### Ví dụ thực tế: Expense Management Module

**Epic: Expense Management System**
```
Task 1: Backend API cho Expenses
├── Subtask 1.1: Tạo Expense Entity & DTO
│   ├── Tạo Prisma model Expense
│   ├── Tạo CreateExpenseDto với validation
│   ├── Tạo UpdateExpenseDto với validation
│   └── Tạo ExpenseResponseDto cho response
├── Subtask 1.2: Implement Expense Service
│   ├── createExpense(userId, dto)
│   ├── findAllExpenses(userId, filters)
│   ├── findOneExpense(id, userId)
│   ├── updateExpense(id, userId, dto)
│   └── removeExpense(id, userId)
├── Subtask 1.3: Implement Expense Controller
│   ├── POST /expenses
│   ├── GET /expenses
│   ├── GET /expenses/:id
│   ├── PUT /expenses/:id
│   └── DELETE /expenses/:id
└── Acceptance Criteria:
    Given user đã đăng nhập
    When POST /expenses với valid data
    Then trả về 201 Created với expense data
    And lưu vào database thành công
    And validate amount > 0
    And validate categoryId tồn tại
```

**Task 2: Frontend Expense Form**
```
├── Subtask 2.1: Tạo Expense Form Component
│   ├── Form fields: amount, note, date, categoryId
│   ├── Validation: amount required & > 0
│   ├── Date picker với default = today
│   └── Category dropdown từ API
├── Subtask 2.2: Tạo Expense List Component
│   ├── Table hiển thị expenses
│   ├── Pagination
│   ├── Filter theo category & date range
│   └── Actions: Edit, Delete
└── Acceptance Criteria:
    Given user ở trang Expenses
    When nhập form hợp lệ và submit
    Then form submit thành công
    And list expenses được refresh
    And hiển thị success message
```

#### Checklist Template cho AI Prompt
```
□ Context: [Dựa trên file docs nào]
□ Task: [Mô tả cụ thể cần làm]
□ Constraints: [Rules, validation, testing requirements]
□ Output: [File nào cần tạo/sửa]
□ Dependencies: [Module nào cần import]
□ Testing: [UT/Integration test requirements]
```

#### Ví dụ Prompt hoàn chỉnh
```
Context: Dựa trên 02_API_Spec.md và 05_Rules.md
Task: Tạo ExpenseService cho CRUD operations
Constraints: 
- Sử dụng Prisma ORM
- Validate amount > 0
- Chỉ user owner mới được access
- Return Promise<ExpenseResponseDto>
Output: expense.service.ts
Dependencies: PrismaService, NotFoundException
Testing: Unit test cho tất cả methods với coverage ≥80%
```

#### Lợi ích của Planning chi tiết
- **Clarity**: AI hiểu rõ yêu cầu cụ thể
- **Quality**: Code sinh ra đúng spec từ đầu
- **Efficiency**: Giảm số lần refine
- **Consistency**: Tất cả dev trong team làm theo cùng pattern  

### 3.5 Ra lệnh (Execute)
- Prompt nên có cấu trúc:  
  - **Bối cảnh**: “Dựa trên Rules & API Spec…”  
  - **Mục tiêu**: “Sinh module NestJS cho /expenses…”  
  - **Ràng buộc**: “DTO validated, thêm UT, ESLint pass…”  
- Lệnh nhỏ, review liên tục.  

### 3.6 Testing
- **UT**: kiểm tra logic service.  
- **Integration**: chạy API với DB test.  
- **E2E**: Selenium/Playwright test toàn flow.  
- Tích hợp CI để auto chạy test khi commit.  

---

## 4. Case Study Demo: Expense Manager

### Mục tiêu ứng dụng
- Quản lý chi tiêu cá nhân: CRUD Expense, Category.  
- Báo cáo theo ngày/tháng.  
- Biểu đồ trực quan (pie, bar).  

### Kiến trúc
- **Backend**: NestJS + Prisma + SQLite.  
- **Frontend**: React + Vite + Tailwind.  
- **Auth**: JWT (access + refresh).  

### Data Model
- **User**: id, email, password_hash.  
- **Category**: id, name, type (expense|income).  
- **Expense**: id, amount, note, date, categoryId, userId.  

### API
- `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh`.  
- `GET/POST/PUT/DELETE /categories`.  
- `GET/POST/PUT/DELETE /expenses`.  
- `GET /reports/summary?from&to`.  

### Demo Script (30 phút)

#### Phase 1: Setup & Backend (10 phút)

**Bước 1: Khởi tạo dự án (2 phút)**
```bash
# Tạo workspace mới
mkdir expense-manager-demo
cd expense-manager-demo

# Khởi tạo NestJS backend
npx @nestjs/cli new apps/backend --package-manager npm
cd apps/backend
npm install prisma @prisma/client class-validator class-transformer
npx prisma init --datasource-provider sqlite
```

**Bước 2: Setup Prisma Schema (3 phút)**
- Mở `prisma/schema.prisma`
- Paste schema từ `03_Data_Model.md`
- Chạy `npx prisma generate && npx prisma db push`

**Bước 3: Scaffold với Cursor AI (5 phút)**
```
Prompt: "Dựa trên 02_API_Spec.md và 05_Rules.md, tạo module expenses với:
- ExpenseService với CRUD operations
- ExpenseController với REST endpoints  
- DTOs với validation
- Unit tests cho service
Output: expenses.module.ts, expenses.service.ts, expenses.controller.ts, dto files, test files"
```

#### Phase 2: Frontend Setup (8 phút)

**Bước 4: Khởi tạo React app (2 phút)**
```bash
cd ../../
npm create vite@latest apps/frontend -- --template react-ts
cd apps/frontend
npm install axios tailwindcss @headlessui/react @heroicons/react
npm install -D @types/node
```

**Bước 5: Setup Tailwind (1 phút)**
```bash
npx tailwindcss init -p
# Cấu hình tailwind.config.js
```

**Bước 6: Scaffold với Cursor AI (5 phút)**
```
Prompt: "Dựa trên 02_API_Spec.md, tạo React components cho:
- ExpenseForm component với validation
- ExpenseList component với table
- ExpensePage để combine form + list
- API service để call backend
- TypeScript interfaces cho data
Output: components/, services/, types/ folders"
```

#### Phase 3: Integration & Testing (12 phút)

**Bước 7: Kết nối Frontend-Backend (3 phút)**
- Cấu hình CORS trong NestJS
- Setup API base URL trong React
- Test API connection

**Bước 8: Demo Flow (6 phút)**
1. **Đăng ký/Đăng nhập** (1 phút)
   - Tạo user mới
   - Login và lấy JWT token

2. **Tạo Categories** (1 phút)
   - Thêm categories: Food, Transport, Entertainment
   - Show dropdown trong form

3. **Thêm Expenses** (2 phút)
   - Nhập expense: amount=50000, note="Lunch", category="Food"
   - Submit form → show success message
   - Thêm 2-3 expenses khác

4. **Xem Dashboard** (2 phút)
   - Show expense list với pagination
   - Filter theo category
   - Show total amount

**Bước 9: Testing Demo (3 phút)**
```bash
# Backend tests
cd apps/backend
npm run test

# Frontend tests  
cd ../frontend
npm run test

# Show test coverage
npm run test:coverage
```

#### Demo Script Tips

**Trước khi demo:**
- Chuẩn bị sẵn terminal với commands
- Có sẵn sample data (categories, expenses)
- Test trước tất cả flows
- Chuẩn bị backup plan nếu AI không generate đúng

**Trong khi demo:**
- Giải thích từng bước cho audience
- Highlight các tính năng của Cursor AI
- Show code quality và structure
- Emphasize speed và consistency

**Sau demo:**
- Q&A về workflow
- Tips troubleshooting
- Resources để học thêm

#### Troubleshooting Common Issues

**AI không hiểu context:**
- Nhắc lại "Dựa trên docs/02_API_Spec.md"
- Show file structure trước khi prompt

**Code không đúng format:**
- Sử dụng "Refactor theo 05_Rules.md"
- Specify "Use TypeScript strict mode"

**Test fail:**
- Check imports và dependencies
- Verify database connection
- Run individual test files  

---

## 5. Testing Chi tiết

### Unit Test
- `ExpenseService`: validate amount > 0.  
- `CategoryService`: CRUD logic.  
- FE: `formatCurrency`, date utils.  

### Integration Test
- Auth flow: register/login/refresh.  
- Expenses CRUD với SQLite test DB.  
- Reports summary filter by date.  

### E2E Test
- Flow: Login → Add Expense → View Report.  
- Tool: Playwright hoặc Selenium.  
- CI: chạy headless, export HTML report.  

---

## 6. Tips đặt câu hỏi (Prompting)

### Nguyên tắc vàng
1. **Rõ ràng**: Luôn chỉ định rule, input, output mong muốn
2. **Ngắn gọn & lặp nhanh**: Yêu cầu từng patch nhỏ, dễ review
3. **Cho ví dụ**: 1–2 case chuẩn để AI đồng bộ style
4. **Nguồn sự thật**: Luôn nhắc AI bám vào docs (ERD, API spec)

### Cấu trúc Prompt hiệu quả

#### Template chuẩn
```
Context: [Dựa trên file docs nào]
Task: [Mô tả cụ thể cần làm]
Constraints: [Rules, validation, requirements]
Output: [File/folder nào cần tạo]
Dependencies: [Module nào cần import]
Testing: [Test requirements]
```

### Ví dụ Prompts theo từng tình huống

#### 1. Scaffold Module mới
**❌ Prompt dở:**
```
"Tạo module expenses"
```

**✅ Prompt tốt:**
```
Context: Dựa trên 02_API_Spec.md và 05_Rules.md
Task: Tạo module expenses hoàn chỉnh cho NestJS
Constraints:
- Sử dụng Prisma ORM với SQLite
- Validate amount > 0, categoryId required
- JWT authentication required
- Error handling với proper HTTP status
Output: expenses.module.ts, expenses.service.ts, expenses.controller.ts, dto files
Dependencies: PrismaService, JwtService, NotFoundException
Testing: Unit test cho service methods với coverage ≥80%
```

#### 2. Refactor Code
**❌ Prompt dở:**
```
"Refactor code này"
```

**✅ Prompt tốt:**
```
Context: Dựa trên 05_Rules.md
Task: Refactor ExpenseService để tuân thủ Clean Architecture
Constraints:
- Tách business logic khỏi data access
- Sử dụng Repository pattern
- Dependency injection đúng cách
- TypeScript strict mode
Output: Refactor file expense.service.ts
Dependencies: ExpenseRepository interface
Testing: Giữ nguyên existing tests, thêm tests cho new methods
```

#### 3. Fix Bug
**❌ Prompt dở:**
```
"Fix lỗi này"
```

**✅ Prompt tốt:**
```
Context: Dựa trên error log và 05_Rules.md
Task: Fix lỗi "Cannot read property 'id' of undefined" trong ExpenseController
Constraints:
- Giữ nguyên API contract
- Proper error handling
- TypeScript strict mode
- Add validation cho edge cases
Output: Fix expense.controller.ts
Dependencies: Check PrismaService injection
Testing: Add test case cho scenario gây lỗi
```

#### 4. Generate Tests
**❌ Prompt dở:**
```
"Viết test cho service này"
```

**✅ Prompt tốt:**
```
Context: Dựa trên expense.service.ts và 04_Testing.md
Task: Tạo comprehensive unit tests cho ExpenseService
Constraints:
- Jest testing framework
- Mock PrismaService
- Test all methods: create, findAll, findOne, update, remove
- Test error scenarios: invalid data, not found, unauthorized
- Coverage ≥80%
Output: expense.service.spec.ts
Dependencies: @nestjs/testing, jest-mock-extended
Testing: Include both positive và negative test cases
```

#### 5. Frontend Component
**❌ Prompt dở:**
```
"Tạo form cho expenses"
```

**✅ Prompt tốt:**
```
Context: Dựa trên 02_API_Spec.md và design system
Task: Tạo ExpenseForm component với React + TypeScript
Constraints:
- Form validation với react-hook-form
- Tailwind CSS styling
- TypeScript interfaces cho props
- Error handling và loading states
- Responsive design
Output: ExpenseForm.tsx, expense-form.types.ts
Dependencies: react-hook-form, @hookform/resolvers, yup
Testing: Component test với React Testing Library
```

### Advanced Prompting Techniques

#### 1. Chain of Thought Prompting
```
Context: Dựa trên 02_API_Spec.md
Task: Implement pagination cho GET /expenses
Reasoning: 
1. Cần thêm query params: page, limit
2. Calculate offset = (page - 1) * limit
3. Return metadata: total, page, totalPages
4. Update DTO và service method
Output: expenses.controller.ts, expenses.service.ts, pagination.dto.ts
```

#### 2. Few-shot Learning
```
Context: Dựa trên 05_Rules.md
Task: Tạo CategoryService theo pattern giống ExpenseService
Example: ExpenseService có methods: create, findAll, findOne, update, remove
Pattern: Sử dụng PrismaService, validate input, return DTOs
Output: category.service.ts với cùng pattern
```

#### 3. Iterative Refinement
```
Bước 1: "Tạo basic ExpenseService với CRUD"
Bước 2: "Thêm validation cho amount > 0"
Bước 3: "Thêm error handling cho not found"
Bước 4: "Thêm unit tests cho tất cả methods"
```

### Common Prompting Mistakes

#### ❌ Tránh những lỗi này:
1. **Quá chung chung**: "Tạo API" → "Tạo REST API cho expenses với CRUD"
2. **Thiếu context**: Không mention docs → "Dựa trên 02_API_Spec.md"
3. **Quá dài**: 1 prompt làm quá nhiều việc → Chia nhỏ ra
4. **Không có constraints**: AI sẽ tự suy diễn → Specify rõ ràng
5. **Không có output format**: AI không biết tạo file gì → List cụ thể

#### ✅ Best Practices:
1. **Specific & Actionable**: Mô tả cụ thể cần làm gì
2. **Context-rich**: Luôn reference docs và rules
3. **Iterative**: Làm từng bước nhỏ, review, refine
4. **Example-driven**: Cho ví dụ cụ thể khi cần
5. **Testable**: Luôn yêu cầu testing

### Debugging Prompts

#### Khi AI không hiểu:
```
"Refine prompt: Dựa trên 02_API_Spec.md, tạo ExpenseController với endpoints POST /expenses, GET /expenses, GET /expenses/:id. Sử dụng class-validator cho DTOs."
```

#### Khi code không đúng format:
```
"Refactor theo 05_Rules.md: Sử dụng TypeScript strict mode, proper error handling, và dependency injection pattern."
```

#### Khi thiếu functionality:
```
"Enhance: Thêm pagination, filtering, và sorting cho GET /expenses endpoint. Update DTOs và service accordingly."
```  

---

## 7. Kết luận
- Vibe Coding = kết hợp AI + rule + loop ngắn → tăng tốc mà vẫn giữ chuẩn.  
- Cursor AI cực kỳ mạnh nếu bạn chuẩn bị pre-train pack tốt.  
- Expense Manager là ví dụ dễ hiểu, gần gũi, đủ CRUD + báo cáo + test.  
- Thực hành nhiều → sẽ quen cách “ra vibe” để AI hiểu ý.  

---
