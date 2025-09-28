# Expense Manager – Quản lý chi tiêu

## 📖 Overview
Ứng dụng quản lý chi tiêu cá nhân với backend (NestJS + Prisma + SQLite) và frontend (React + Vite + Tailwind).  
Người dùng có thể đăng nhập, thêm khoản chi tiêu, phân loại theo category, và xem báo cáo theo ngày/tháng.

## ⚙️ Tech Stack
- **Backend**: NestJS, Prisma ORM, SQLite (có thể thay MySQL/Postgres sau)
- **Frontend**: React + Vite + TailwindCSS
- **Auth**: JWT (Access + Refresh)
- **Testing**: Jest (UT), Supertest (Integration), Playwright/Selenium (E2E)

## 📂 Project Structure
```
apps/
  backend/
    src/...
  frontend/
    src/...
docs/
  01_Architecture.md
  02_API_Spec.md
  03_Data_Model.md
  04_Testing.md
  05_Rules.md
```

## 🚀 Quick Start (Dev)
```bash
# Backend
cd apps/backend
npm install
npm run start:dev

# Frontend
cd apps/frontend
npm install
npm run dev
```

## 🧪 Testing
- `npm run test` → Unit test
- `npm run test:e2e` → End-to-end

## 🗺 Roadmap
- [x] CRUD Expenses
- [x] Categories
- [ ] Reports with charts
- [ ] Export CSV/PDF
- [ ] Multi-user support
