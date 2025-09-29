import { SlideData } from '../types/slides'

export const slides: SlideData[] = [
    {
        id: 'title',
        type: 'title',
        title: 'Vibe Coding với Cursor AI',
        subtitle: 'Live Demo: Expense Manager (FE/BE)',
        highlight: 'Pair‑programming with an AI agent under explicit rules & repeatable loops.'
    },
    {
        id: 'agenda',
        type: 'content',
        title: 'Agenda / Chương trình',
        content: [
            'What is Vibe Coding? — Vibe Coding là gì?',
            'Cursor AI overview & models — Tổng quan Cursor & lựa chọn model',
            'Effective workflow — Quy trình hiệu quả',
            'Live Demo: Expense Manager (NestJS + React)',
            'Testing strategy (UT/IT/E2E)',
            'Prompting tips & Q&A'
        ]
    },
    {
        id: 'what-is-vibe-coding',
        type: 'content',
        title: 'Vibe Coding là gì? / What is Vibe Coding?',
        content: [
            'Lập trình theo "nhịp" hợp tác với AI: bạn giữ ý định & tiêu chuẩn, AI hỗ trợ scaffold, boilerplate, phân tích',
            'Khác với "prompt & pray": có rules + pre-train + loop ngắn → đề bài → kết quả → review → chỉnh',
            'Mục tiêu: Tăng tốc x2–x5 nhưng vẫn kiểm soát chất lượng'
        ],
        highlight: 'Pair‑programming with an AI agent under explicit rules and short, reviewable loops.'
    },
    {
        id: 'why-matters',
        type: 'content',
        title: 'Tại sao quan trọng? / Why it matters',
        content: [
            'Tốc độ: scaffold nhanh, viết test, sinh tài liệu',
            'Chất lượng: rules, template, checklist giúp giữ chuẩn',
            'Khả chuyển giao: pipeline & docs có thể reuse giữa projects'
        ]
    },
    {
        id: 'cursor-overview',
        type: 'content',
        title: 'Cursor AI: Overview',
        content: [
            'Cursor = IDE + Agent + Context Management tối ưu cho code',
            'Khả năng: Chat‑in‑editor, Edit, Composer, Rules, cấu hình context/knowledge',
            'Khi nào dùng: sinh scaffolding, refactor, test, tài liệu nhanh'
        ],
        highlight: 'Tập trung cách dùng hiệu quả, không sa đà chi tiết công cụ.'
    },
    {
        id: 'model-selection',
        type: 'content',
        title: 'Model chọn thế nào? / Model selection',
        content: [
            'Nhóm mạnh (GPT‑4.x, Claude Sonnet…): Thiết kế, refactor lớn, logic nhạy cảm',
            'Nhóm cân bằng (mix): CRUD, unit test, docs thường ngày',
            'Nhóm rẻ/nhanh: Sinh file lặp, mock/fixtures, ít rủi ro',
            'Nguyên tắc: Chọn theo độ rủi ro × nhu cầu suy luận × chi phí'
        ]
    },
    {
        id: 'overall-loop',
        type: 'content',
        title: 'Overall Loop / Quy trình tổng quan',
        content: [
            'Define Rules – chuẩn code, kiến trúc, naming, testing',
            'Pre‑train Data – docs/domain/ERD/API spec súc tích',
            'Organize – repo structure, README, seeds',
            'Plan & Checklist – breakdown + acceptance criteria',
            'Execute – generate/refine/review với Cursor',
            'Test – UT/IT/E2E → Iterate'
        ]
    },
    {
        id: 'rules',
        type: 'content',
        title: 'Step 1 — RULES (in Cursor)',
        content: [
            'Clean Architecture, SOLID, naming (EN), commit style, PR template',
            'Thêm Do/Don\'t: không hardcode secret, yêu cầu log/metrics',
            'Đưa checklist vào Rules của Cursor, link về docs trong repo'
        ]
    },
    {
        id: 'pre-train',
        type: 'content',
        title: 'Step 2 — Pre‑train Data',
        content: [
            'Chuẩn bị README, ADR, ERD, API spec, UX mock, Coding Style',
            'Context nhỏ gọn: tóm tắt + link "source of truth"',
            'Seeds: JSON fixtures, curl, Postman/Supertest'
        ]
    },
    {
        id: 'organize',
        type: 'content',
        title: 'Step 3 — Tổ chức & Tự động hoá',
        content: [
            'Repo layout: apps/, packages/, docs/, scripts/, .github/',
            'Docs nên có: 01_Architecture.md, 02_API_Spec.md, 03_Data_Model.md, 04_Testing.md, 05_Rules.md',
            'Automation: Makefile/NPM scripts: test, lint, seed để AI gọi nhanh'
        ]
    },
    {
        id: 'plan-checklist',
        type: 'content',
        title: 'Step 4 — Plan & Checklist',
        content: [
            'Epics → Tasks → Subtasks (BE/FE/Test)',
            'Acceptance Criteria: Given/When/Then + dữ liệu cụ thể',
            'Definition of Done: code + UT + docs + review + CI pass'
        ]
    },
    {
        id: 'execute',
        type: 'content',
        title: 'Step 5 — Execute với Cursor',
        content: [
            'Prompt pattern: Bối cảnh (rules) + mục tiêu + ràng buộc + output format',
            'Edit‑in‑place: Chọn vùng code → yêu cầu Cursor chỉnh theo rule',
            'Composer: Sinh nhiều file scaffold đúng spec'
        ]
    },
    {
        id: 'testing-strategy',
        type: 'content',
        title: 'Step 6 — Testing Strategy (tổng quan)',
        content: [
            'Unit Test: logic đơn vị, không cần I/O thật',
            'Integration Test: API với DB thật (SQLite) / container test DB',
            'E2E: Selenium/Playwright cho UI + API end‑to‑end',
            'CI: test matrix, coverage reports, screenshot on fail'
        ]
    },
    {
        id: 'demo-goals',
        type: 'demo',
        title: 'Live Demo — Expense Manager (Goals)',
        tech: ['NestJS', 'Prisma', 'SQLite', 'React', 'Vite', 'Tailwind', 'JWT'],
        content: [
            'CRUD chi tiêu, phân loại (category), báo cáo nhanh, lọc theo ngày',
            'Backend: NestJS + Prisma + SQLite',
            'Frontend: React + Vite + Tailwind',
            'Auth: JWT (access + refresh), interceptors'
        ],
        highlight: 'Nhanh, local‑friendly, đủ CRUD + chart + auth cơ bản.'
    },
    {
        id: 'architecture',
        type: 'content',
        title: 'Architecture & Flow',
        content: [
            'BE (NestJS, REST): /auth, /categories, /expenses, /reports',
            'DB: SQLite + Prisma (migrations & seeds)',
            'FE (React/Vite): Pages: Login, Dashboard, Expenses, Reports',
            'Auth: JWT + axios/fetch interceptors'
        ]
    },
    {
        id: 'data-model',
        type: 'content',
        title: 'Data Model (ERD — simple)',
        content: [
            'User: id, email, password_hash, createdAt',
            'Category: id, name, type (expense|income), userId',
            'Expense: id, userId, categoryId, amount, note, date'
        ]
    },
    {
        id: 'api-spec',
        type: 'content',
        title: 'API Spec — chính (REST)',
        content: [
            '/auth — POST /login, POST /register, POST /refresh',
            '/categories — GET/POST/PUT/DELETE',
            '/expenses — GET (filter by date, category), POST/PUT/DELETE',
            '/reports — GET /summary?from=..&to=.. (total by category, monthly)'
        ]
    },
    {
        id: 'demo-script',
        type: 'demo',
        title: 'Demo Script (5–7 phút)',
        content: [
            'BE scaffold: Module NestJS + Prisma schema + CRUD + seed',
            'FE scaffold: React routes + forms + table + chart',
            'Connect: Gọi API thật, nhập vài khoản chi, xem dashboard/chart',
            'Test nhanh: UT cho service, Integration test cho /expenses'
        ]
    },
    {
        id: 'unit-test',
        type: 'content',
        title: 'Unit Test — Outline (ví dụ)',
        content: [
            'BE: ExpenseService: validate amount > 0, mapping DTO→entity',
            'FE: Utils: formatCurrency, dateRange helpers',
            'Mocking: Repository/HTTP mocked; no DB'
        ]
    },
    {
        id: 'integration-test',
        type: 'content',
        title: 'Integration Test — Outline',
        content: [
            'BE: Supertest: /auth, CRUD /expenses (SQLite test DB)',
            'Seed: user test, categories, sample expenses',
            'Assertions: filter theo from/to, tổng theo category'
        ]
    },
    {
        id: 'e2e-test',
        type: 'content',
        title: 'E2E (Selenium/Playwright)',
        content: [
            'Flows: Login → Add Expense → Filter → View Report',
            'Selectors: Dùng data-testid để ổn định',
            'CI: Headless run, HTML report, screenshot on failure'
        ]
    },
    {
        id: 'cursor-rules',
        type: 'code',
        title: 'Cursor RULES — ví dụ rút gọn',
        code: `- TypeScript strict, ESLint + Prettier, DTO validated
- Architecture: NestJS modules per resource; FE tách pages/components/hooks
- Testing: UT ≥ 70% cover; IT cho endpoints critical; E2E smoke
- Docs: Mọi PR kèm README cập nhật & curl samples`
    },
    {
        id: 'pre-train-pack',
        type: 'content',
        title: 'Pre‑train Pack — cho /docs',
        content: [
            '01_Architecture.md (kiến trúc + flow)',
            '02_API_Spec.md (OpenAPI/curl)',
            '03_Data_Model.md (ERD)',
            '04_Testing.md (UT/IT/E2E)',
            '05_Rules.md (coding/testing/review)'
        ]
    },
    {
        id: 'prompt-patterns-backend',
        type: 'code',
        title: 'Prompt Patterns — Backend',
        code: `Scaffold:
"Dựa trên Rules & API Spec, sinh module NestJS cho /expenses với DTO, controller, service, prisma model. Thêm UT."

Fix:
"Refactor ExpenseService để validate date & amount; thêm edge‑case tests."

Docs:
"Sinh README cho module expenses kèm curl mẫu."`
    },
    {
        id: 'prompt-patterns-frontend',
        type: 'code',
        title: 'Prompt Patterns — Frontend',
        code: `Scaffold:
"Sinh trang /expenses với bảng + form add/edit (React Hook Form + Zod). Gọi API theo spec."

Charts:
"Tạo component PieChart & BarChart (Recharts) từ /reports/summary."

Auth:
"Thêm interceptor JWT; redirect 401."`
    },
    {
        id: 'prompting-tips',
        type: 'content',
        title: 'Prompting Tips / Mẹo đặt câu hỏi',
        content: [
            'Rõ ràng & ràng buộc: nêu rule, input, output mong đợi, tiêu chí đánh giá',
            'Iterate ngắn: yêu cầu diff nhỏ, review từng bước',
            'Cho ví dụ: 1–2 ví dụ chuẩn giúp AI giữ style',
            'Giữ nguồn sự thật: OpenAPI/ERD là chuẩn; yêu cầu AI bám theo'
        ]
    },
    {
        id: 'summary',
        type: 'summary',
        title: 'Summary',
        content: [
            'Vibe Coding = Quy trình + Rules + Loop ngắn',
            'Cursor AI tăng tốc đáng kể khi có pre‑train & checklist',
            'Demo Expense Manager: CRUD + báo cáo + test → áp dụng ngay'
        ],
        highlight: 'Q&A — Câu hỏi & thảo luận.'
    }
]
