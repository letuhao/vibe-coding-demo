# 03_Data_Model.md

## Tổng quan
Database schema và data model cho Expense Manager App sử dụng Prisma ORM với SQLite (development) và PostgreSQL (production).

---

## Database Schema

### Prisma Schema File
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // "postgresql" for production
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  // Relations
  categories Category[]
  expenses  Expense[]

  @@map("users")
}

model Category {
  id        String      @id @default(uuid())
  name      String
  type      CategoryType
  userId    String      @map("user_id")
  createdAt DateTime    @default(now()) @map("created_at")
  updatedAt DateTime    @updatedAt @map("updated_at")

  // Relations
  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  expenses Expense[]

  @@unique([name, userId])
  @@map("categories")
}

model Expense {
  id         String   @id @default(uuid())
  amount     Decimal  @db.Decimal(10, 2)
  note       String?
  date       DateTime @db.Date
  categoryId String   @map("category_id")
  userId     String   @map("user_id")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  // Relations
  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("expenses")
}

enum CategoryType {
  EXPENSE
  INCOME
}
```

---

## Entity Relationships

### ERD Diagram
```
User (1) -----> (N) Category
  |                    |
  |                    |
  v                    v
Expense (N) -----> (1) Category
  |
  |
  v
User (1)
```

### Relationship Details

**User ↔ Category (1:N)**
- Một user có thể có nhiều categories
- Một category thuộc về một user duy nhất
- Cascade delete: Khi xóa user, tất cả categories của user đó cũng bị xóa

**User ↔ Expense (1:N)**
- Một user có thể có nhiều expenses
- Một expense thuộc về một user duy nhất
- Cascade delete: Khi xóa user, tất cả expenses của user đó cũng bị xóa

**Category ↔ Expense (1:N)**
- Một category có thể có nhiều expenses
- Một expense thuộc về một category duy nhất
- Cascade delete: Khi xóa category, tất cả expenses của category đó cũng bị xóa

---

## Table Definitions

### Users Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid() | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| created_at | TIMESTAMP | DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT now(), ON UPDATE | Last update timestamp |

### Categories Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid() | Unique identifier |
| name | VARCHAR(100) | NOT NULL | Category name |
| type | ENUM | NOT NULL | 'expense' or 'income' |
| user_id | UUID | FOREIGN KEY, NOT NULL | Reference to users.id |
| created_at | TIMESTAMP | DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT now(), ON UPDATE | Last update timestamp |

**Unique Constraint**: (name, user_id) - Mỗi user không thể có 2 categories cùng tên

### Expenses Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid() | Unique identifier |
| amount | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Expense amount |
| note | TEXT | NULL | Optional note |
| date | DATE | NOT NULL | Expense date |
| category_id | UUID | FOREIGN KEY, NOT NULL | Reference to categories.id |
| user_id | UUID | FOREIGN KEY, NOT NULL | Reference to users.id |
| created_at | TIMESTAMP | DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT now(), ON UPDATE | Last update timestamp |

---

## Data Types & Constraints

### String Types
- **VARCHAR(255)**: Email addresses, general text
- **VARCHAR(100)**: Category names
- **TEXT**: Long text content (notes)

### Numeric Types
- **DECIMAL(10,2)**: Currency amounts (max 99,999,999.99)
- **UUID**: Primary keys and foreign keys

### Date/Time Types
- **TIMESTAMP**: Creation and update times
- **DATE**: Expense dates only

### Constraints
- **NOT NULL**: Required fields
- **UNIQUE**: Email addresses, category names per user
- **CHECK**: Amount must be greater than 0
- **FOREIGN KEY**: Referential integrity
- **CASCADE DELETE**: Maintain data consistency

---

## Indexes

### Primary Indexes
- `users.id` (PRIMARY KEY)
- `categories.id` (PRIMARY KEY)
- `expenses.id` (PRIMARY KEY)

### Unique Indexes
- `users.email` (UNIQUE)
- `categories.name + categories.user_id` (UNIQUE)

### Performance Indexes
- `expenses.user_id` (FOREIGN KEY)
- `expenses.category_id` (FOREIGN KEY)
- `expenses.date` (for date range queries)
- `expenses.amount` (for amount range queries)
- `categories.user_id` (FOREIGN KEY)
- `categories.type` (for filtering by type)

---

## Seed Data

### Default Categories
```typescript
// prisma/seed.ts
const defaultCategories = [
  // Expense Categories
  { name: 'Food & Dining', type: 'EXPENSE' },
  { name: 'Transportation', type: 'EXPENSE' },
  { name: 'Shopping', type: 'EXPENSE' },
  { name: 'Entertainment', type: 'EXPENSE' },
  { name: 'Bills & Utilities', type: 'EXPENSE' },
  { name: 'Healthcare', type: 'EXPENSE' },
  { name: 'Education', type: 'EXPENSE' },
  { name: 'Travel', type: 'EXPENSE' },
  { name: 'Other Expenses', type: 'EXPENSE' },
  
  // Income Categories
  { name: 'Salary', type: 'INCOME' },
  { name: 'Freelance', type: 'INCOME' },
  { name: 'Investment', type: 'INCOME' },
  { name: 'Gift', type: 'INCOME' },
  { name: 'Other Income', type: 'INCOME' }
];
```

### Sample Data
```typescript
const sampleExpenses = [
  {
    amount: 50000,
    note: 'Lunch at restaurant',
    date: '2024-01-15',
    categoryName: 'Food & Dining'
  },
  {
    amount: 150000,
    note: 'Grab ride to office',
    date: '2024-01-15',
    categoryName: 'Transportation'
  },
  {
    amount: 2000000,
    note: 'Monthly salary',
    date: '2024-01-01',
    categoryName: 'Salary'
  }
];
```

---

## Migration Strategy

### Development (SQLite)
```bash
# Generate migration
npx prisma migrate dev --name init

# Reset database
npx prisma migrate reset

# Apply migrations
npx prisma migrate deploy
```

### Production (PostgreSQL)
```bash
# Generate migration
npx prisma migrate dev --name init

# Deploy to production
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

---

## Query Examples

### Common Queries

**Get user expenses with category info:**
```typescript
const expenses = await prisma.expense.findMany({
  where: { userId },
  include: {
    category: true
  },
  orderBy: { date: 'desc' }
});
```

**Get expenses by date range:**
```typescript
const expenses = await prisma.expense.findMany({
  where: {
    userId,
    date: {
      gte: startDate,
      lte: endDate
    }
  },
  include: { category: true }
});
```

**Get category summary:**
```typescript
const summary = await prisma.expense.groupBy({
  by: ['categoryId'],
  where: { userId },
  _sum: { amount: true },
  _count: { id: true }
});
```

**Get monthly totals:**
```typescript
const monthlyTotals = await prisma.expense.groupBy({
  by: ['date'],
  where: {
    userId,
    date: {
      gte: startOfMonth,
      lte: endOfMonth
    }
  },
  _sum: { amount: true }
});
```

---

## Data Validation

### Application Level
- Amount must be greater than 0
- Email must be valid format
- Date must be valid ISO date
- Category name must be unique per user
- Password must meet security requirements

### Database Level
- Foreign key constraints
- Unique constraints
- Check constraints for amount > 0
- NOT NULL constraints for required fields

---

## Backup & Recovery

### Backup Strategy
```bash
# SQLite backup
cp database.sqlite backup_$(date +%Y%m%d).sqlite

# PostgreSQL backup
pg_dump -h localhost -U user expense_manager > backup_$(date +%Y%m%d).sql
```

### Recovery Strategy
```bash
# SQLite restore
cp backup_20240115.sqlite database.sqlite

# PostgreSQL restore
psql -h localhost -U user expense_manager < backup_20240115.sql
```

---

## Performance Considerations

### Query Optimization
- Use indexes for frequently queried fields
- Limit result sets with pagination
- Use select specific fields instead of SELECT *
- Implement proper WHERE clauses

### Connection Management
- Use connection pooling
- Implement proper connection timeouts
- Monitor connection usage

### Caching Strategy
- Cache frequently accessed data
- Implement Redis for session storage
- Use CDN for static assets