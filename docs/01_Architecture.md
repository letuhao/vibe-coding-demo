# 01_Architecture

## Tổng quan
Ứng dụng chia thành 2 phần chính:
- **Backend (NestJS)**: REST API, xử lý logic, kết nối DB.
- **Frontend (React/Vite)**: UI hiển thị dữ liệu, biểu đồ.

## Kiến trúc BE
- NestJS modules: `auth`, `users`, `categories`, `expenses`, `reports`.
- Prisma ORM + SQLite.
- Layered: Controller → Service → Repository.

## Kiến trúc FE
- Pages: Login, Dashboard, Expenses, Reports.
- Components: ExpenseTable, ExpenseForm, Charts.
- State: React Query hoặc Zustand.

## Auth Flow
- User đăng ký → lưu password hash (bcrypt).
- Đăng nhập → JWT access + refresh.
- Refresh token → renew access token.
