/**
 * @fileoverview Validation utility tests
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { describe, it, expect } from 'vitest'

// Validation utility functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateAmount = (amount: number): boolean => {
  return amount > 0 && !isNaN(amount) && isFinite(amount)
}

export const validateDate = (date: string): boolean => {
  const dateObj = new Date(date)
  return !isNaN(dateObj.getTime()) && dateObj <= new Date()
}

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('user+tag@example.org')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('Password123')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject weak passwords', () => {
      const result = validatePassword('weak')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must be at least 8 characters long')
      expect(result.errors).toContain('Password must contain at least one uppercase letter')
      expect(result.errors).toContain('Password must contain at least one number')
    })

    it('should reject passwords without uppercase', () => {
      const result = validatePassword('password123')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one uppercase letter')
    })

    it('should reject passwords without lowercase', () => {
      const result = validatePassword('PASSWORD123')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one lowercase letter')
    })

    it('should reject passwords without numbers', () => {
      const result = validatePassword('Password')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one number')
    })
  })

  describe('validateAmount', () => {
    it('should validate positive amounts', () => {
      expect(validateAmount(100)).toBe(true)
      expect(validateAmount(0.01)).toBe(true)
      expect(validateAmount(999.99)).toBe(true)
    })

    it('should reject invalid amounts', () => {
      expect(validateAmount(0)).toBe(false)
      expect(validateAmount(-100)).toBe(false)
      expect(validateAmount(NaN)).toBe(false)
      expect(validateAmount(Infinity)).toBe(false)
    })
  })

  describe('validateDate', () => {
    it('should validate correct dates', () => {
      expect(validateDate('2024-01-15')).toBe(true)
      expect(validateDate('2023-12-31')).toBe(true)
      expect(validateDate(new Date().toISOString().split('T')[0])).toBe(true)
    })

    it('should reject invalid dates', () => {
      expect(validateDate('invalid-date')).toBe(false)
      expect(validateDate('2025-12-31')).toBe(false) // Future date
      expect(validateDate('')).toBe(false)
    })
  })
})
