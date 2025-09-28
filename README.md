# Expense Manager App

Ứng dụng quản lý chi tiêu cá nhân được xây dựng với **Vibe Coding methodology** sử dụng Cursor AI.

## 🎯 Mục tiêu

- Quản lý chi tiêu cá nhân với CRUD operations
- Phân loại expenses theo categories
- Báo cáo và thống kê chi tiêu
- Giao diện thân thiện và responsive

## 🏗️ Kiến trúc

### Backend
- **Framework**: NestJS
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: class-validator

### Frontend
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Forms**: React Hook Form

## 📁 Cấu trúc dự án

```
expense-manager/
├── apps/
│   ├── backend/          # NestJS API
│   └── frontend/         # React SPA
├── docs/                 # Documentation
│   ├── 01_Architecture.md
│   ├── 02_API_Spec.md
│   ├── 03_Data_Model.md
│   ├── 04_Testing.md
│   ├── 05_Rules.md
│   ├── 06_Implementation_Plan.md
│   ├── 07_Deployment.md
│   └── 08_Examples.md
├── .cursor/
│   └── rules/            # Cursor AI Rules
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Development Setup

1. **Clone repository**
```bash
git clone <repository-url>
cd expense-manager
```

2. **Setup Backend**
```bash
cd apps/backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

3. **Setup Frontend**
```bash
cd apps/frontend
npm install
npm run dev
```

4. **Access Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api/v1

## 📚 Documentation

- **[Architecture](docs/01_Architecture.md)**: Kiến trúc tổng quan
- **[API Spec](docs/02_API_Spec.md)**: REST API documentation
- **[Data Model](docs/03_Data_Model.md)**: Database schema
- **[Testing](docs/04_Testing.md)**: Testing strategy
- **[Rules](docs/05_Rules.md)**: Coding conventions
- **[Implementation Plan](docs/06_Implementation_Plan.md)**: Development phases
- **[Deployment](docs/07_Deployment.md)**: Deployment guide
- **[Examples](docs/08_Examples.md)**: Code examples

## 🛠️ Development

### Vibe Coding Workflow

1. **Define Rules**: Coding standards và conventions
2. **Pre-train Data**: Documentation và context
3. **Plan & Checklist**: Task breakdown
4. **Execute**: AI-assisted development
5. **Test**: Automated testing
6. **Review**: Code quality assurance

### Cursor AI Usage

- **Chat**: Hỏi đáp về code và architecture
- **Edit Mode**: Chỉnh sửa code trực tiếp
- **Composer**: Generate multiple files
- **Rules**: Tuân thủ coding standards

## 🧪 Testing

```bash
# Backend tests
cd apps/backend
npm run test
npm run test:watch
npm run test:coverage

# Frontend tests
cd apps/frontend
npm run test
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Development
```bash
# Backend
cd apps/backend
npm run build
npm run start:prod

# Frontend
cd apps/frontend
npm run build
npm run preview
```

### Production
Xem chi tiết trong [Deployment Guide](docs/07_Deployment.md)

## 📊 Features

### Authentication
- [x] User registration
- [x] User login
- [x] JWT authentication
- [x] Password hashing

### Categories
- [x] CRUD operations
- [x] Expense/Income types
- [x] User-specific categories

### Expenses
- [x] CRUD operations
- [x] Category association
- [x] Date filtering
- [x] Amount validation

### Reports
- [x] Summary dashboard
- [x] Category breakdown
- [x] Date range filtering
- [x] Charts and graphs

## 🎨 UI/UX

- **Design System**: Tailwind CSS
- **Components**: Reusable và accessible
- **Responsive**: Mobile-first approach
- **Dark Mode**: Theme switching
- **Loading States**: User feedback

## 🔒 Security

- **Authentication**: JWT tokens
- **Authorization**: Role-based access
- **Validation**: Input sanitization
- **CORS**: Cross-origin protection
- **Rate Limiting**: API protection

## 📈 Performance

- **Backend**: Database optimization
- **Frontend**: Code splitting
- **Caching**: Redis integration
- **CDN**: Static assets
- **Monitoring**: Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Follow coding standards
4. Write tests
5. Submit pull request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **NestJS** - Progressive Node.js framework
- **React** - UI library
- **Prisma** - Database toolkit
- **Tailwind CSS** - Utility-first CSS
- **Cursor AI** - AI-powered development

---

**Built with ❤️ using Vibe Coding methodology**