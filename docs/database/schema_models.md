# Database Schema Models - Prisma Schema

## 🎯 Purpose

This document defines the database schema models for the Expense Manager project using Prisma ORM. These models represent the core business entities and their relationships.

## 📋 Core Models

### 1. **User Model**

#### **Schema Definition:**

```prisma
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
```

#### **Purpose:**

- Stores user authentication and profile information
- Central entity for user-related data
- Links to categories and expenses

#### **Fields:**

- **id**: Unique identifier (UUID)
- **email**: User email address (unique)
- **passwordHash**: Hashed password for security
- **createdAt**: Account creation timestamp
- **updatedAt**: Last update timestamp

#### **Relationships:**

- **One-to-Many**: User → Categories
- **One-to-Many**: User → Expenses

#### **Constraints:**

- **Unique**: Email must be unique
- **Required**: All fields except timestamps are required
- **Cascade**: Deleting user cascades to categories and expenses

### 2. **Category Model**

#### **Schema Definition:**

```prisma
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
```

#### **Purpose:**

- Categorizes expenses for better organization
- Supports both expense and income categories
- User-specific categories

#### **Fields:**

- **id**: Unique identifier (UUID)
- **name**: Category name
- **type**: Category type (EXPENSE or INCOME)
- **userId**: Foreign key to User
- **createdAt**: Category creation timestamp
- **updatedAt**: Last update timestamp

#### **Relationships:**

- **Many-to-One**: Category → User
- **One-to-Many**: Category → Expenses

#### **Constraints:**

- **Unique**: Category name must be unique per user
- **Required**: All fields except timestamps are required
- **Cascade**: Deleting user cascades to categories

### 3. **Expense Model**

#### **Schema Definition:**

```prisma
model Expense {
  id         String   @id @default(uuid())
  amount     Float
  note       String?
  date       DateTime
  categoryId String   @map("category_id")
  userId     String   @map("user_id")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  // Relations
  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("expenses")
}
```

#### **Purpose:**

- Stores financial transactions
- Links to categories for organization
- Tracks expense details and timing

#### **Fields:**

- **id**: Unique identifier (UUID)
- **amount**: Expense amount (Float)
- **note**: Optional expense description
- **date**: Expense date
- **categoryId**: Foreign key to Category
- **userId**: Foreign key to User
- **createdAt**: Expense creation timestamp
- **updatedAt**: Last update timestamp

#### **Relationships:**

- **Many-to-One**: Expense → Category
- **Many-to-One**: Expense → User

#### **Constraints:**

- **Required**: Amount, date, categoryId, userId are required
- **Optional**: Note field is optional
- **Cascade**: Deleting user or category cascades to expenses

### 4. **CategoryType Enum**

#### **Schema Definition:**

```prisma
enum CategoryType {
  EXPENSE
  INCOME
}
```

#### **Purpose:**

- Defines category types for expense management
- Supports both expense and income tracking
- Ensures data consistency

#### **Values:**

- **EXPENSE**: For expense categories
- **INCOME**: For income categories

## 🔗 Relationships Overview

### **Entity Relationship Diagram:**

```
User (1) ←→ (Many) Category
User (1) ←→ (Many) Expense
Category (1) ←→ (Many) Expense
```

### **Relationship Details:**

#### **User → Category:**

- **Type**: One-to-Many
- **Constraint**: Cascade delete
- **Purpose**: User owns categories

#### **User → Expense:**

- **Type**: One-to-Many
- **Constraint**: Cascade delete
- **Purpose**: User owns expenses

#### **Category → Expense:**

- **Type**: One-to-Many
- **Constraint**: Cascade delete
- **Purpose**: Expenses belong to categories

## 🎨 Database Design Patterns

### **UUID Primary Keys:**

```prisma
id String @id @default(uuid())
```

- **Purpose**: Globally unique identifiers
- **Benefits**: Security, scalability, distributed systems
- **Usage**: All entities use UUID primary keys

### **Timestamp Tracking:**

```prisma
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")
```

- **Purpose**: Track record creation and modification
- **Benefits**: Audit trail, debugging, analytics
- **Usage**: All entities include timestamp fields

### **Foreign Key Relationships:**

```prisma
userId String @map("user_id")
user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
```

- **Purpose**: Maintain referential integrity
- **Benefits**: Data consistency, automatic cleanup
- **Usage**: All relationships use foreign keys

### **Cascade Delete:**

```prisma
onDelete: Cascade
```

- **Purpose**: Automatic cleanup of related records
- **Benefits**: Data consistency, prevents orphaned records
- **Usage**: All relationships use cascade delete

## 🔧 Query Patterns

### **User Queries:**

```typescript
// Find user by email
const user = await prisma.user.findUnique({
  where: { email: "user@example.com" },
});

// Find user with categories and expenses
const userWithData = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    categories: true,
    expenses: true,
  },
});
```

### **Category Queries:**

```typescript
// Find categories by user
const categories = await prisma.category.findMany({
  where: { userId: userId },
});

// Find category with expenses
const categoryWithExpenses = await prisma.category.findUnique({
  where: { id: categoryId },
  include: { expenses: true },
});
```

### **Expense Queries:**

```typescript
// Find expenses by user
const expenses = await prisma.expense.findMany({
  where: { userId: userId },
  include: { category: true },
});

// Find expenses by category
const categoryExpenses = await prisma.expense.findMany({
  where: { categoryId: categoryId },
});
```

## 🚀 Best Practices

### **Schema Design:**

- Use UUID primary keys for security
- Include timestamp fields for audit trail
- Use foreign keys for relationships
- Implement cascade delete for data consistency

### **Query Optimization:**

- Use include for related data
- Use select for specific fields
- Use where for filtering
- Use orderBy for sorting

### **Data Integrity:**

- Use unique constraints where appropriate
- Use required fields for critical data
- Use cascade delete for cleanup
- Use proper data types

### **Performance:**

- Index frequently queried fields
- Use efficient query patterns
- Avoid N+1 queries
- Use pagination for large datasets

---

**Last Updated**: January 2024  
**Maintained By**: Vibe Coding Demo Team  
**Purpose**: Database schema patterns for AI training
