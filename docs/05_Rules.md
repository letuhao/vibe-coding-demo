# 05_Rules.md

## Tổng quan
Coding rules và conventions cho Expense Manager App, bao gồm TypeScript, NestJS, React và database standards.

---

## TypeScript Rules

### General Rules
- **Strict Mode**: Luôn enable TypeScript strict mode
- **No Any Types**: Không sử dụng `any` type, sử dụng `unknown` hoặc specific types
- **Interface over Type**: Sử dụng `interface` cho objects, `type` cho unions/primitives
- **Explicit Return Types**: Luôn khai báo return type cho functions
- **No Implicit Any**: Không cho phép implicit any

### Naming Conventions
```typescript
// ✅ Good
interface UserData {
  id: string;
  email: string;
  createdAt: Date;
}

class ExpenseService {
  private readonly prismaService: PrismaService;
  
  public async createExpense(userId: string, data: CreateExpenseDto): Promise<Expense> {
    // implementation
  }
}

// ❌ Bad
interface userData {
  id: any;
  email: any;
  createdAt: any;
}

class expenseService {
  private prismaService: any;
  
  async createExpense(userId: any, data: any): any {
    // implementation
  }
}
```

---

## NestJS Rules

### Project Structure
```
src/
├── modules/           # Feature modules
│   ├── auth/
│   ├── users/
│   ├── categories/
│   ├── expenses/
│   └── reports/
├── common/            # Shared utilities
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── filters/
├── config/            # Configuration
└── main.ts
```

### Service Rules
```typescript
// ✅ Good - Service with proper dependency injection
@Injectable()
export class ExpensesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger
  ) {}

  async create(userId: string, createExpenseDto: CreateExpenseDto): Promise<Expense> {
    try {
      this.logger.log(`Creating expense for user ${userId}`);
      
      const expense = await this.prismaService.expense.create({
        data: {
          ...createExpenseDto,
          userId
        }
      });

      this.logger.log(`Expense created with ID: ${expense.id}`);
      return expense;
    } catch (error) {
      this.logger.error('Failed to create expense', error);
      throw new InternalServerErrorException('Failed to create expense');
    }
  }
}
```

### Controller Rules
```typescript
// ✅ Good - Controller with proper validation
@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser() user: User,
    @Body() createExpenseDto: CreateExpenseDto
  ): Promise<ApiResponse<Expense>> {
    const expense = await this.expensesService.create(user.id, createExpenseDto);
    
    return {
      success: true,
      data: expense,
      message: 'Expense created successfully'
    };
  }
}
```

### DTO Rules
```typescript
// ✅ Good - DTO with validation
export class CreateExpenseDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @IsDateString()
  date: string;

  @IsUUID()
  categoryId: string;
}
```

---

## React Rules

### Component Structure
```typescript
// ✅ Good - Functional component with TypeScript
interface ExpenseFormProps {
  onSubmit: (data: CreateExpenseDto) => void;
  categories: Category[];
  loading?: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  categories,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateExpenseDto>({
    amount: 0,
    note: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
    </form>
  );
};
```

### Hook Rules
```typescript
// ✅ Good - Custom hook with TypeScript
interface UseExpensesReturn {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  createExpense: (data: CreateExpenseDto) => Promise<void>;
}

export const useExpenses = (): UseExpensesReturn => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createExpense = async (data: CreateExpenseDto): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.post('/expenses', data);
      setExpenses(prev => [...prev, response.data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { expenses, loading, error, createExpense };
};
```

---

## Database Rules

### Prisma Schema Rules
```prisma
// ✅ Good - Proper schema with constraints
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  categories Category[]
  expenses  Expense[]

  @@map("users")
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

  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("expenses")
}
```

### Query Rules
```typescript
// ✅ Good - Proper query with error handling
async findExpensesByUser(userId: string, filters: ExpenseFilters): Promise<Expense[]> {
  try {
    return await this.prismaService.expense.findMany({
      where: {
        userId,
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.startDate && filters.endDate && {
          date: {
            gte: new Date(filters.startDate),
            lte: new Date(filters.endDate)
          }
        })
      },
      include: {
        category: true
      },
      orderBy: { date: 'desc' }
    });
  } catch (error) {
    this.logger.error('Failed to find expenses', error);
    throw new InternalServerErrorException('Failed to fetch expenses');
  }
}
```

---

## Error Handling Rules

### Backend Error Handling
```typescript
// ✅ Good - Proper error handling
@Injectable()
export class ExpensesService {
  async findOne(id: string, userId: string): Promise<Expense> {
    try {
      const expense = await this.prismaService.expense.findFirst({
        where: { id, userId },
        include: { category: true }
      });

      if (!expense) {
        throw new NotFoundException('Expense not found');
      }

      return expense;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.error(`Failed to find expense ${id}`, error);
      throw new InternalServerErrorException('Failed to fetch expense');
    }
  }
}
```

### Frontend Error Handling
```typescript
// ✅ Good - Proper error handling in React
export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateExpenseDto) => {
    try {
      setLoading(true);
      setError(null);
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>
      )}
      {/* Form fields */}
    </form>
  );
};
```

---

## Security Rules

### Authentication & Authorization
```typescript
// ✅ Good - Proper JWT guard
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
```

### Input Validation
```typescript
// ✅ Good - DTO with validation
export class CreateExpenseDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(999999999.99)
  amount: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Matches(/^[a-zA-Z0-9\s.,!?-]*$/)
  note?: string;

  @IsDateString()
  @IsDate()
  date: string;

  @IsUUID()
  categoryId: string;
}
```

---

## File Organization Rules

### Backend Structure
```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── dto/
│   └── expenses/
│       ├── expenses.controller.ts
│       ├── expenses.service.ts
│       ├── expenses.module.ts
│       └── dto/
├── common/
└── config/
```

### Frontend Structure
```
src/
├── components/
│   ├── common/
│   ├── forms/
│   └── layout/
├── pages/
├── hooks/
├── services/
├── stores/
├── types/
└── utils/
```

---

## Code Review Checklist

### Backend Checklist
- [ ] TypeScript strict mode enabled
- [ ] All functions have explicit return types
- [ ] Proper error handling with try-catch
- [ ] Input validation with DTOs
- [ ] Authentication/authorization implemented
- [ ] Database queries optimized
- [ ] Logging implemented
- [ ] Unit tests written
- [ ] No hardcoded values
- [ ] Environment variables used

### Frontend Checklist
- [ ] TypeScript interfaces defined
- [ ] Components are properly typed
- [ ] Error boundaries implemented
- [ ] Loading states handled
- [ ] Form validation implemented
- [ ] Accessibility considerations
- [ ] Responsive design
- [ ] Performance optimized
- [ ] Unit tests written
- [ ] No console.log statements

### General Checklist
- [ ] Code follows naming conventions
- [ ] Comments are meaningful
- [ ] No duplicate code
- [ ] Security best practices followed
- [ ] Performance considerations
- [ ] Maintainability and readability