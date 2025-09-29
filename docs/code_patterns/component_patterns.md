# Component Patterns - React Frontend

## 🎯 Purpose

This document defines React component patterns used in the Expense Manager project. These patterns ensure consistency, reusability, and maintainability across the frontend codebase.

## 📋 Pattern Categories

### 1. **Page Component Pattern**

#### **Structure:**

```typescript
/**
 * @fileoverview [Component Name] - [Brief description]
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created [Date]
 * @modified [Date]
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { [TypeName] } from '../types/[type].types';

/**
 * [ComponentName] component handles [purpose]
 * [Detailed description of functionality]
 */
const [ComponentName]: React.FC = () => {
  // Hooks
  const navigate = useNavigate();
  const { [hookMethod], isLoading, error, [otherStates] } = useAuth();

  // State
  const [formData, setFormData] = useState<[TypeName]>({
    // Initial state
  });

  const [validationErrors, setValidationErrors] = useState<Partial<[TypeName]>>({});

  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // Event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error for this field
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation logic
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await [actionMethod](formData);
      // Success handling
    } catch (error) {
      // Error handling
    }
  };

  // Validation function
  const validateForm = (data: [TypeName]): Partial<[TypeName]> => {
    const errors: Partial<[TypeName]> = {};

    // Validation logic
    if (!data.field) {
      errors.field = 'Field is required';
    }

    return errors;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Component JSX */}
    </div>
  );
};

export default [ComponentName];
```

#### **When to Use:**

- Main page components (Login, Dashboard, etc.)
- Components with form handling
- Components with authentication logic
- Components with navigation

#### **Best Practices:**

- Always include JSDoc comments
- Use TypeScript interfaces for props and state
- Implement proper error handling
- Use consistent naming conventions
- Include accessibility attributes

### 2. **Form Component Pattern**

#### **Structure:**

```typescript
interface FormFieldProps {
  name: string;
  type: "text" | "email" | "password" | "number";
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
          error
            ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300"
        }`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p
          id={`${name}-error`}
          className="mt-2 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};
```

#### **When to Use:**

- Reusable form inputs
- Consistent form styling
- Form validation display
- Accessibility requirements

### 3. **Button Component Pattern**

#### **Structure:**

```typescript
interface ButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  children,
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";

  const variantClasses = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const disabledClasses =
    disabled || loading ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};
```

#### **When to Use:**

- Consistent button styling
- Loading states
- Different button variants
- Accessibility requirements

### 4. **List Component Pattern**

#### **Structure:**

```typescript
interface ListItem {
  id: string;
  [key: string]: any;
}

interface ListProps<T extends ListItem> {
  items: T[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  renderItem: (item: T) => React.ReactNode;
  onItemClick?: (item: T) => void;
  className?: string;
}

const List = <T extends ListItem>({
  items,
  loading = false,
  error,
  emptyMessage = "No items found",
  renderItem,
  onItemClick,
  className = "",
}: ListProps<T>) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onItemClick?.(item)}
          className={
            onItemClick
              ? "cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors"
              : ""
          }
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
};
```

#### **When to Use:**

- Displaying lists of data
- Consistent loading states
- Error handling
- Empty state management

## 🎨 Styling Patterns

### **Tailwind CSS Classes:**

- **Layout**: `min-h-screen`, `flex`, `justify-center`, `items-center`
- **Spacing**: `py-12`, `px-6`, `space-y-4`, `gap-4`
- **Colors**: `bg-gray-50`, `text-gray-700`, `border-gray-300`
- **States**: `hover:bg-indigo-700`, `focus:ring-indigo-500`
- **Responsive**: `sm:px-6`, `lg:px-8`, `md:max-w-md`

### **Component Styling:**

- Use consistent spacing scale
- Implement hover and focus states
- Include loading and error states
- Ensure accessibility compliance

## 🔧 Common Patterns

### **State Management:**

```typescript
// Form state pattern
const [formData, setFormData] = useState<FormType>(initialState);
const [validationErrors, setValidationErrors] = useState<Partial<FormType>>({});

// Loading state pattern
const [isLoading, setIsLoading] = useState(false);

// Error state pattern
const [error, setError] = useState<string | null>(null);
```

### **Event Handling:**

```typescript
// Input change handler
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

// Form submit handler
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Validation and submission logic
};
```

### **Effect Patterns:**

```typescript
// Authentication redirect
useEffect(() => {
  if (isAuthenticated) {
    navigate("/dashboard");
  }
}, [isAuthenticated, navigate]);

// Error clearing
useEffect(() => {
  clearError();
}, []);
```

## 🚀 Best Practices

### **Component Design:**

- Single responsibility principle
- Props interface definition
- Consistent naming conventions
- Proper TypeScript usage
- JSDoc documentation

### **Performance:**

- Use React.memo for expensive components
- Implement proper key props for lists
- Avoid unnecessary re-renders
- Use useCallback for event handlers

### **Accessibility:**

- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance

---

**Last Updated**: January 2024  
**Maintained By**: Vibe Coding Demo Team  
**Purpose**: React component patterns for AI training
