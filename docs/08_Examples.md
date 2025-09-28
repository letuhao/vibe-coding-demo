# 08_Examples.md

## Tổng quan
Code examples và patterns cho Expense Manager App, bao gồm backend, frontend và common utilities.

---

## Backend Examples

### Service Layer Pattern

**Base Service:**
```typescript
// src/common/base.service.ts
export abstract class BaseService<T, CreateDto, UpdateDto> {
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly logger: Logger,
    protected readonly model: string
  ) {}

  async create(userId: string, createDto: CreateDto): Promise<T> {
    try {
      this.logger.log(`Creating ${this.model} for user ${userId}`);
      
      const entity = await this.prismaService[this.model].create({
        data: { ...createDto, userId }
      });

      this.logger.log(`${this.model} created with ID: ${entity.id}`);
      return entity;
    } catch (error) {
      this.logger.error(`Failed to create ${this.model}`, error);
      throw new InternalServerErrorException(`Failed to create ${this.model}`);
    }
  }

  async findAll(userId: string, filters: any): Promise<PaginatedResponse<T>> {
    try {
      const { page = 1, limit = 10, ...whereFilters } = filters;
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prismaService[this.model].findMany({
          where: { userId, ...whereFilters },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        this.prismaService[this.model].count({
          where: { userId, ...whereFilters }
        })
      ]);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      this.logger.error(`Failed to find ${this.model}s`, error);
      throw new InternalServerErrorException(`Failed to fetch ${this.model}s`);
    }
  }
}
```

**Expense Service Implementation:**
```typescript
// src/expenses/expenses.service.ts
@Injectable()
export class ExpensesService extends BaseService<Expense, CreateExpenseDto, UpdateExpenseDto> {
  constructor(
    prismaService: PrismaService,
    logger: Logger
  ) {
    super(prismaService, logger, 'expense');
  }

  async create(userId: string, createExpenseDto: CreateExpenseDto): Promise<Expense> {
    // Validate category belongs to user
    const category = await this.prismaService.category.findFirst({
      where: { id: createExpenseDto.categoryId, userId }
    });

    if (!category) {
      throw new BadRequestException('Category not found or does not belong to user');
    }

    return super.create(userId, createExpenseDto);
  }

  async findByDateRange(
    userId: string, 
    startDate: string, 
    endDate: string
  ): Promise<Expense[]> {
    try {
      return await this.prismaService.expense.findMany({
        where: {
          userId,
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        },
        include: { category: true },
        orderBy: { date: 'desc' }
      });
    } catch (error) {
      this.logger.error('Failed to find expenses by date range', error);
      throw new InternalServerErrorException('Failed to fetch expenses');
    }
  }

  async getSummary(userId: string, startDate: string, endDate: string): Promise<ExpenseSummary> {
    try {
      const [totalExpenses, totalIncome, byCategory] = await Promise.all([
        this.prismaService.expense.aggregate({
          where: {
            userId,
            date: { gte: new Date(startDate), lte: new Date(endDate) },
            category: { type: 'EXPENSE' }
          },
          _sum: { amount: true },
          _count: { id: true }
        }),
        this.prismaService.expense.aggregate({
          where: {
            userId,
            date: { gte: new Date(startDate), lte: new Date(endDate) },
            category: { type: 'INCOME' }
          },
          _sum: { amount: true },
          _count: { id: true }
        }),
        this.prismaService.expense.groupBy({
          by: ['categoryId'],
          where: {
            userId,
            date: { gte: new Date(startDate), lte: new Date(endDate) }
          },
          _sum: { amount: true },
          _count: { id: true }
        })
      ]);

      return {
        totalExpenses: totalExpenses._sum.amount || 0,
        totalIncome: totalIncome._sum.amount || 0,
        netAmount: (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0),
        transactionCount: (totalExpenses._count.id || 0) + (totalIncome._count.id || 0),
        byCategory
      };
    } catch (error) {
      this.logger.error('Failed to get expense summary', error);
      throw new InternalServerErrorException('Failed to fetch summary');
    }
  }
}
```

### Controller Pattern

**Base Controller:**
```typescript
// src/common/base.controller.ts
export abstract class BaseController<T, CreateDto, UpdateDto> {
  constructor(protected readonly service: any) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser() user: User,
    @Body() createDto: CreateDto
  ): Promise<ApiResponse<T>> {
    const entity = await this.service.create(user.id, createDto);
    
    return {
      success: true,
      data: entity,
      message: 'Created successfully'
    };
  }

  @Get()
  async findAll(
    @GetUser() user: User,
    @Query() query: any
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const result = await this.service.findAll(user.id, query);
    
    return {
      success: true,
      data: result.data,
      pagination: result.pagination
    };
  }

  @Get(':id')
  async findOne(
    @GetUser() user: User,
    @Param('id') id: string
  ): Promise<ApiResponse<T>> {
    const entity = await this.service.findOne(id, user.id);
    
    return {
      success: true,
      data: entity
    };
  }

  @Put(':id')
  async update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateDto: UpdateDto
  ): Promise<ApiResponse<T>> {
    const entity = await this.service.update(id, user.id, updateDto);
    
    return {
      success: true,
      data: entity,
      message: 'Updated successfully'
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @GetUser() user: User,
    @Param('id') id: string
  ): Promise<void> {
    await this.service.remove(id, user.id);
  }
}
```

**Expense Controller Implementation:**
```typescript
// src/expenses/expenses.controller.ts
@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController extends BaseController<Expense, CreateExpenseDto, UpdateExpenseDto> {
  constructor(private readonly expensesService: ExpensesService) {
    super(expensesService);
  }

  @Get('summary')
  async getSummary(
    @GetUser() user: User,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ): Promise<ApiResponse<ExpenseSummary>> {
    const summary = await this.expensesService.getSummary(user.id, startDate, endDate);
    
    return {
      success: true,
      data: summary
    };
  }

  @Get('by-date-range')
  async findByDateRange(
    @GetUser() user: User,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ): Promise<ApiResponse<Expense[]>> {
    const expenses = await this.expensesService.findByDateRange(user.id, startDate, endDate);
    
    return {
      success: true,
      data: expenses
    };
  }
}
```

---

## Frontend Examples

### Custom Hooks

**useExpenses Hook:**
```typescript
// src/hooks/useExpenses.ts
interface UseExpensesReturn {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  createExpense: (data: CreateExpenseDto) => Promise<void>;
  updateExpense: (id: string, data: UpdateExpenseDto) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  fetchExpenses: (filters?: ExpenseFilters) => Promise<void>;
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
      setExpenses(prev => [...prev, response.data.data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id: string, data: UpdateExpenseDto): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.put(`/expenses/${id}`, data);
      setExpenses(prev => 
        prev.map(expense => 
          expense.id === id ? response.data.data : expense
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update expense');
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await apiClient.delete(`/expenses/${id}`);
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete expense');
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async (filters?: ExpenseFilters): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/expenses', { params: filters });
      setExpenses(response.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  return {
    expenses,
    loading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    fetchExpenses
  };
};
```

**useForm Hook:**
```typescript
// src/hooks/useForm.ts
interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: any;
  onSubmit: (values: T) => Promise<void>;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof T) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof T) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate field
    if (validationSchema) {
      try {
        validationSchema.validateSyncAt(field, values);
        setErrors(prev => ({ ...prev, [field]: undefined }));
      } catch (error) {
        setErrors(prev => ({ ...prev, [field]: error.message }));
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {} as Partial<Record<keyof T, boolean>>);
    setTouched(allTouched);

    // Validate all fields
    if (validationSchema) {
      try {
        await validationSchema.validate(values, { abortEarly: false });
        setErrors({});
      } catch (error) {
        const validationErrors = error.inner.reduce((acc: any, err: any) => ({
          ...acc,
          [err.path]: err.message
        }), {});
        setErrors(validationErrors);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  };
};
```

### Component Examples

**ExpenseForm Component:**
```typescript
// src/components/ExpenseForm.tsx
interface ExpenseFormProps {
  onSubmit: (data: CreateExpenseDto) => Promise<void>;
  categories: Category[];
  initialData?: Partial<CreateExpenseDto>;
  loading?: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  categories,
  initialData,
  loading = false
}) => {
  const validationSchema = yup.object({
    amount: yup
      .number()
      .required('Amount is required')
      .positive('Amount must be positive')
      .min(1, 'Amount must be at least 1'),
    note: yup
      .string()
      .max(500, 'Note must be less than 500 characters'),
    date: yup
      .string()
      .required('Date is required')
      .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    categoryId: yup
      .string()
      .required('Category is required')
      .uuid('Invalid category ID')
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  } = useForm({
    initialValues: {
      amount: initialData?.amount || 0,
      note: initialData?.note || '',
      date: initialData?.date || new Date().toISOString().split('T')[0],
      categoryId: initialData?.categoryId || ''
    },
    validationSchema,
    onSubmit
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount *
        </label>
        <input
          id="amount"
          type="number"
          value={values.amount}
          onChange={handleChange('amount')}
          onBlur={handleBlur('amount')}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
            errors.amount && touched.amount ? 'border-red-300' : ''
          }`}
          placeholder="Enter amount"
        />
        {errors.amount && touched.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
        )}
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700">
          Note
        </label>
        <textarea
          id="note"
          value={values.note}
          onChange={handleChange('note')}
          onBlur={handleBlur('note')}
          rows={3}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
            errors.note && touched.note ? 'border-red-300' : ''
          }`}
          placeholder="Enter note (optional)"
        />
        {errors.note && touched.note && (
          <p className="mt-1 text-sm text-red-600">{errors.note}</p>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date *
        </label>
        <input
          id="date"
          type="date"
          value={values.date}
          onChange={handleChange('date')}
          onBlur={handleBlur('date')}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
            errors.date && touched.date ? 'border-red-300' : ''
          }`}
        />
        {errors.date && touched.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date}</p>
        )}
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
          Category *
        </label>
        <select
          id="categoryId"
          value={values.categoryId}
          onChange={handleChange('categoryId')}
          onBlur={handleBlur('categoryId')}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
            errors.categoryId && touched.categoryId ? 'border-red-300' : ''
          }`}
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && touched.categoryId && (
          <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};
```

**ExpenseList Component:**
```typescript
// src/components/ExpenseList.tsx
interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onEdit,
  onDelete,
  loading = false
}) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg">No expenses found</div>
        <p className="text-gray-400 mt-2">Start by adding your first expense</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {expenses.map(expense => (
          <div
            key={expense.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {expense.category.name}
                  </span>
                </div>
                {expense.note && (
                  <p className="mt-1 text-sm text-gray-600">{expense.note}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formatDate(expense.date)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(expense)}
                  className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">Delete Expense</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this expense? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
```

---

## Common Utilities

### API Client
```typescript
// src/services/apiClient.ts
class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<T>(`${endpoint}${queryString}`);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE'
    });
  }
}

export const apiClient = new ApiClient(import.meta.env.VITE_API_BASE_URL);
```

### Date Utilities
```typescript
// src/utils/dateUtils.ts
export const dateUtils = {
  formatDate: (date: string | Date, locale: string = 'vi-VN'): string => {
    return new Date(date).toLocaleDateString(locale);
  },

  formatDateTime: (date: string | Date, locale: string = 'vi-VN'): string => {
    return new Date(date).toLocaleString(locale);
  },

  getStartOfMonth: (date: Date = new Date()): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  },

  getEndOfMonth: (date: Date = new Date()): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  },

  getStartOfYear: (date: Date = new Date()): Date => {
    return new Date(date.getFullYear(), 0, 1);
  },

  getEndOfYear: (date: Date = new Date()): Date => {
    return new Date(date.getFullYear(), 11, 31);
  },

  addDays: (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  addMonths: (date: Date, months: number): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  },

  isSameDay: (date1: Date, date2: Date): boolean => {
    return date1.toDateString() === date2.toDateString();
  },

  isToday: (date: Date): boolean => {
    return dateUtils.isSameDay(date, new Date());
  },

  isThisMonth: (date: Date): boolean => {
    const now = new Date();
    return date.getFullYear() === now.getFullYear() && 
           date.getMonth() === now.getMonth();
  },

  isThisYear: (date: Date): boolean => {
    return date.getFullYear() === new Date().getFullYear();
  }
};
```

### Currency Utilities
```typescript
// src/utils/currencyUtils.ts
export const currencyUtils = {
  formatCurrency: (amount: number, currency: string = 'VND'): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency
    }).format(amount);
  },

  formatNumber: (amount: number): string => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  },

  parseCurrency: (value: string): number => {
    // Remove currency symbols and parse as number
    const cleanValue = value.replace(/[^\d.-]/g, '');
    return parseFloat(cleanValue) || 0;
  },

  calculatePercentage: (value: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100 * 100) / 100; // Round to 2 decimal places
  },

  calculateChange: (oldValue: number, newValue: number): {
    amount: number;
    percentage: number;
  } => {
    const amount = newValue - oldValue;
    const percentage = oldValue === 0 ? 0 : (amount / oldValue) * 100;
    
    return {
      amount,
      percentage: Math.round(percentage * 100) / 100
    };
  }
};
```

### Validation Utilities
```typescript
// src/utils/validationUtils.ts
export const validationUtils = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword: (password: string): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  isValidAmount: (amount: number): boolean => {
    return typeof amount === 'number' && amount > 0 && amount <= 999999999.99;
  },

  isValidDate: (date: string): boolean => {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
  },

  isValidUUID: (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
};
```

---

## Error Handling Examples

### Global Error Handler
```typescript
// src/common/filters/global-exception.filter.ts
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.message;
        errorCode = (exceptionResponse as any).error || exception.name;
      } else {
        message = exception.message;
        errorCode = exception.name;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorCode = 'UNKNOWN_ERROR';
    }

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined
    );

    const errorResponse = {
      success: false,
      error: {
        code: errorCode,
        message,
        timestamp: new Date().toISOString(),
        path: request.url
      }
    };

    response.status(status).json(errorResponse);
  }
}
```

### React Error Boundary
```typescript
// src/components/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({
  error,
  resetError
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-medium text-gray-900">Something went wrong</h3>
        <p className="mt-2 text-sm text-gray-500">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="mt-4">
          <button
            onClick={resetError}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  </div>
);
```
