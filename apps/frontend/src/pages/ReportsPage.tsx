/**
 * @fileoverview Reports Page - Comprehensive financial reports with charts
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useExpensesStore } from '../services/expenses.store';
import { useCategoriesStore } from '../services/categories.store';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * ReportsPage component provides comprehensive financial reports
 * Shows various charts and analytics for income/expense tracking
 */
const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { stats, fetchStats, expenses, fetchExpenses, isLoading } = useExpensesStore();
  
  // Get expenses array from paginated response
  const expensesList = expenses.data || [];
  const { categories, fetchCategories } = useCategoriesStore();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [chartData, setChartData] = useState<any[]>([]);

  /**
   * Redirect to login if not authenticated
   */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  /**
   * Load data when component mounts
   */
  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchExpenses();
      fetchCategories();
    }
  }, [isAuthenticated, fetchStats, fetchExpenses, fetchCategories]);

  /**
   * Generate chart data based on selected period
   */
  useEffect(() => {
    if (expensesList.length > 0) {
      generateChartData();
    }
  }, [expensesList, selectedPeriod]);

  /**
   * Generate chart data for different periods
   */
  const generateChartData = () => {
    const now = new Date();
    let data: any[] = [];

    if (selectedPeriod === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayExpenses = expensesList.filter((expense: any) => 
          expense.date.startsWith(dateStr)
        );

        const income = dayExpenses
          .filter((expense: any) => expense.category?.type === 'INCOME')
          .reduce((sum: number, expense: any) => sum + expense.amount, 0);
        
        const expense = dayExpenses
          .filter((expense: any) => expense.category?.type === 'EXPENSE')
          .reduce((sum: number, expense: any) => sum + expense.amount, 0);

        data.push({
          date: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
          income,
          expense,
          net: income - expense,
        });
      }
    } else if (selectedPeriod === 'month') {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toISOString().substring(0, 7);
        
        const monthExpenses = expensesList.filter((expense: any) => 
          expense.date.startsWith(monthStr)
        );

        const income = monthExpenses
          .filter((expense: any) => expense.category?.type === 'INCOME')
          .reduce((sum: number, expense: any) => sum + expense.amount, 0);
        
        const expense = monthExpenses
          .filter((expense: any) => expense.category?.type === 'EXPENSE')
          .reduce((sum: number, expense: any) => sum + expense.amount, 0);

        data.push({
          date: date.toLocaleDateString('vi-VN', { month: 'short', year: '2-digit' }),
          income,
          expense,
          net: income - expense,
        });
      }
    } else {
      // Last 5 years
      for (let i = 4; i >= 0; i--) {
        const date = new Date(now);
        date.setFullYear(date.getFullYear() - i);
        const yearStr = date.getFullYear().toString();
        
        const yearExpenses = expensesList.filter((expense: any) => 
          expense.date.startsWith(yearStr)
        );

        const income = yearExpenses
          .filter((expense: any) => expense.category?.type === 'INCOME')
          .reduce((sum: number, expense: any) => sum + expense.amount, 0);
        
        const expense = yearExpenses
          .filter((expense: any) => expense.category?.type === 'EXPENSE')
          .reduce((sum: number, expense: any) => sum + expense.amount, 0);

        data.push({
          date: yearStr,
          income,
          expense,
          net: income - expense,
        });
      }
    }

    setChartData(data);
  };

  /**
   * Generate category breakdown data
   */
  const getCategoryBreakdown = () => {
    const breakdown = categories.map(category => {
      const categoryExpenses = expensesList.filter((expense: any) => expense.categoryId === category.id);
      const totalAmount = categoryExpenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
      
      return {
        name: category.name,
        value: totalAmount,
        type: category.type,
        count: categoryExpenses.length,
      };
    }).filter(item => item.value > 0);

    return breakdown;
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  /**
   * Get colors for charts
   */
  const COLORS = ['#10B981', '#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Financial Reports
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Period Selector */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select Period</h3>
              <div className="flex space-x-4">
                {[
                  { key: 'week', label: 'Last 7 Days' },
                  { key: 'month', label: 'Last 12 Months' },
                  { key: 'year', label: 'Last 5 Years' },
                ].map((period) => (
                  <button
                    key={period.key}
                    onClick={() => setSelectedPeriod(period.key as any)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      selectedPeriod === period.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">+</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Income</dt>
                        <dd className="text-lg font-medium text-green-600">
                          {formatCurrency(stats.totalIncomeAmount)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">-</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
                        <dd className="text-lg font-medium text-red-600">
                          {formatCurrency(stats.totalExpenseAmount)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        stats.netAmount >= 0 ? 'bg-blue-500' : 'bg-orange-500'
                      }`}>
                        <span className="text-white font-bold">
                          {stats.netAmount >= 0 ? '✓' : '⚠'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Net Balance</dt>
                        <dd className={`text-lg font-medium ${
                          stats.netAmount >= 0 ? 'text-blue-600' : 'text-orange-600'
                        }`}>
                          {formatCurrency(stats.netAmount)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">#</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Transactions</dt>
                        <dd className="text-lg font-medium text-purple-600">
                          {stats.totalExpenses}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Income vs Expense Trend */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Income vs Expense Trend</h3>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-500">Loading chart data...</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stackId="1"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                      name="Income"
                    />
                    <Area
                      type="monotone"
                      dataKey="expense"
                      stackId="2"
                      stroke="#EF4444"
                      fill="#EF4444"
                      fillOpacity={0.6}
                      name="Expense"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Net Balance Trend */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Net Balance Trend</h3>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-500">Loading chart data...</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="net"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      name="Net Balance"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income by Category */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Income by Category</h3>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-500">Loading chart data...</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getCategoryBreakdown().filter(item => item.type === 'INCOME')}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getCategoryBreakdown().filter(item => item.type === 'INCOME').map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Expenses by Category */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Expenses by Category</h3>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-500">Loading chart data...</div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getCategoryBreakdown().filter(item => item.type === 'EXPENSE')}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getCategoryBreakdown().filter(item => item.type === 'EXPENSE').map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Category Details Table */}
          <div className="bg-white shadow rounded-lg mt-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Category Breakdown Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transactions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getCategoryBreakdown().map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.type === 'INCOME' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(item.value)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
