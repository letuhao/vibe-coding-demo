# Vibe Coding Demo - Expense Manager & Workshop

Dự án demo toàn diện về **Vibe Coding methodology** sử dụng Cursor AI, bao gồm ứng dụng Expense Manager và workshop presentation.

## 🎯 Mục tiêu

### Expense Manager App

- Quản lý chi tiêu cá nhân với CRUD operations
- Phân loại expenses theo categories
- Báo cáo và thống kê chi tiêu
- Giao diện thân thiện và responsive

### Workshop Presentation

- Demo trực tiếp Vibe Coding methodology
- Showcase Cursor AI capabilities
- Interactive presentation với modern web tech
- Training materials và documentation

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
vibe-coding-demo/
├── apps/
│   ├── backend/          # NestJS API
│   ├── frontend/         # React SPA
│   └── workshop/         # Interactive Presentation
├── docs/                 # Comprehensive Documentation
│   ├── Architecture & Design
│   │   ├── 01_Architecture.md
│   │   ├── 02_API_Spec.md
│   │   ├── 03_Data_Model.md
│   │   ├── 04_Testing.md
│   │   ├── 05_Rules.md
│   │   ├── 06_Implementation_Plan.md
│   │   ├── 07_Deployment.md
│   │   ├── 08_Examples.md
│   │   ├── 09_Testing_Strategy.md
│   │   └── 10_Production_Deployment.md
│   ├── tests/            # Test Documentation
│   │   └── e2e/          # E2E Test Specifications
│   ├── ux_ui/            # UI/UX Documentation
│   │   ├── Screen Specifications
│   │   └── friendly/     # Human-friendly docs
│   ├── code_patterns/    # Code Patterns & Best Practices
│   ├── api_specs/        # API Specifications
│   ├── database/         # Database Documentation
│   ├── business_logic/   # Business Logic & Domain Knowledge
│   └── Workshop Materials
│       ├── VibeCoding_Workshop_Slides.md
│       └── workshop_script.md
├── tests/                # Test Implementation
│   ├── e2e/              # End-to-End Tests
│   ├── integration/      # Integration Tests
│   └── fixtures/         # Test Data
├── monitoring/           # Monitoring & Observability
├── nginx/               # Web Server Config
├── scripts/             # Automation Scripts
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
cd vibe-coding-demo
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

4. **Setup Workshop Presentation**

```bash
cd apps/workshop
npm install
npm run dev
```

5. **Access Applications**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api/v1
- **Workshop Presentation**: http://localhost:3001

## 📚 Documentation

### Architecture & Design

- **[Architecture](docs/01_Architecture.md)**: Kiến trúc tổng quan
- **[API Spec](docs/02_API_Spec.md)**: REST API documentation
- **[Data Model](docs/03_Data_Model.md)**: Database schema
- **[Testing](docs/04_Testing.md)**: Testing strategy
- **[Rules](docs/05_Rules.md)**: Coding conventions
- **[Implementation Plan](docs/06_Implementation_Plan.md)**: Development phases
- **[Deployment](docs/07_Deployment.md)**: Deployment guide
- **[Examples](docs/08_Examples.md)**: Code examples
- **[Testing Strategy](docs/09_Testing_Strategy.md)**: Comprehensive testing approach
- **[Production Deployment](docs/10_Production_Deployment.md)**: Production deployment guide

### AI Training Documentation

- **[Code Patterns](docs/code_patterns/)**: React, NestJS patterns & best practices
- **[API Specifications](docs/api_specs/)**: REST API patterns & specifications
- **[Database Documentation](docs/database/)**: Schema, queries & patterns
- **[Business Logic](docs/business_logic/)**: Domain knowledge & business rules

### Testing Documentation

- **[E2E Test Specs](docs/tests/e2e/)**: 10 comprehensive E2E test scenarios
- **[Test Implementation](tests/)**: Actual test code & fixtures

### UI/UX Documentation

- **[Screen Specifications](docs/ux_ui/)**: Detailed UI/UX specs for all screens
- **[Friendly Documentation](docs/ux_ui/friendly/)**: Human-friendly docs with Figma integration

### Workshop Materials

- **[Workshop Slides](docs/VibeCoding_Workshop_Slides.md)**: Presentation content
- **[Workshop Script](docs/workshop_script.md)**: Detailed presentation script
- **[Interactive Presentation](apps/workshop/)**: Web-based presentation app

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

### Workshop Presentation

- **Interactive Slides**: 25 slides với animations
- **Keyboard Controls**: Professional presentation controls
- **Auto-play Mode**: Hands-free presentation
- **Responsive Design**: Works on all devices
- **Modern Tech**: React 19, TypeScript, Tailwind CSS, Framer Motion

## 🧪 Testing

### Test Coverage

- **Unit Tests**: Backend services và frontend utilities
- **Integration Tests**: API endpoints với database
- **E2E Tests**: Complete user workflows với Playwright
- **Test Documentation**: 10 comprehensive E2E test scenarios

### Running Tests

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
cd tests/e2e
npm run test:e2e

# All tests
npm run test:all
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

# Workshop Presentation
cd apps/workshop
npm run build
npm run preview
```

### Production

- **Docker**: Containerized deployment với Docker Compose
- **Nginx**: Reverse proxy và static file serving
- **Monitoring**: Prometheus + Grafana setup
- **CI/CD**: Automated deployment pipeline

Xem chi tiết trong [Deployment Guide](docs/07_Deployment.md) và [Production Deployment](docs/10_Production_Deployment.md)

## 📊 Features

### Expense Manager App

#### Authentication

- [x] User registration
- [x] User login
- [x] JWT authentication
- [x] Password hashing

#### Categories

- [x] CRUD operations
- [x] Expense/Income types
- [x] User-specific categories

#### Expenses

- [x] CRUD operations
- [x] Category association
- [x] Date filtering
- [x] Amount validation

#### Reports

- [x] Summary dashboard
- [x] Category breakdown
- [x] Date range filtering
- [x] Charts and graphs

### Workshop Presentation

#### Interactive Features

- [x] 25 professional slides
- [x] Smooth animations với Framer Motion
- [x] Keyboard navigation (arrows, space, P, H)
- [x] Auto-play mode với 8-second intervals
- [x] Progress tracking và slide counter
- [x] Responsive design cho mọi thiết bị

#### Content Coverage

- [x] Vibe Coding methodology explanation
- [x] Cursor AI overview và model selection
- [x] 6-step workflow demonstration
- [x] Live Expense Manager demo
- [x] Testing strategy (UT/IT/E2E)
- [x] Best practices và prompting tips

## 🎨 UI/UX

### Expense Manager App

- **Design System**: Tailwind CSS
- **Components**: Reusable và accessible
- **Responsive**: Mobile-first approach
- **Dark Mode**: Theme switching
- **Loading States**: User feedback

### Workshop Presentation

- **Modern Design**: Gradient backgrounds với dark theme
- **Typography**: Inter + Poppins font stack
- **Animations**: Smooth transitions với Framer Motion
- **Interactive Elements**: Hover effects và micro-interactions
- **Professional Controls**: Keyboard shortcuts và navigation

## 🔒 Security

- **Authentication**: JWT tokens
- **Authorization**: Role-based access
- **Validation**: Input sanitization
- **CORS**: Cross-origin protection
- **Rate Limiting**: API protection

## 📈 Performance

### Expense Manager App

- **Backend**: Database optimization với Prisma
- **Frontend**: Code splitting với Vite
- **Caching**: Redis integration
- **CDN**: Static assets
- **Monitoring**: Performance metrics với Prometheus

### Workshop Presentation

- **Bundle Size**: Optimized với Vite tree-shaking (328KB JS, 16KB CSS)
- **Loading**: Lazy loading cho animations
- **Memory**: Efficient state management
- **Smooth**: 60fps animations với Framer Motion
- **Responsive**: Optimized cho mọi thiết bị

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Follow coding standards
4. Write tests
5. Submit pull request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

### Technologies

- **NestJS** - Progressive Node.js framework
- **React** - UI library
- **Prisma** - Database toolkit
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Vite** - Fast build tool
- **Cursor AI** - AI-powered development

### Documentation & Training

- **Comprehensive Documentation**: 10+ architecture documents
- **AI Training Materials**: Code patterns, API specs, database docs
- **Test Specifications**: 10 E2E test scenarios
- **UI/UX Documentation**: Screen specs và friendly docs
- **Workshop Materials**: Interactive presentation và scripts

---

**Built with ❤️ using Vibe Coding methodology**

## 📞 Support & Resources

- **Workshop Demo**: Run `cd apps/workshop && npm run dev`
- **Documentation**: Comprehensive docs trong `/docs` folder
- **AI Training**: Structured patterns cho AI agents
- **Testing**: Complete test suite với documentation
- **Deployment**: Production-ready với Docker và monitoring
