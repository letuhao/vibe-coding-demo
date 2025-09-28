/**
 * @fileoverview Formatter utility tests
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { describe, it, expect } from 'vitest'

// Utility functions for testing
export const formatCurrency = (amount: number, currency = 'VND'): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj)
}

export const formatNumber = (num: number, decimals = 2): string => {
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

describe('Formatter Utilities', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1000)).toContain('1.000')
      expect(formatCurrency(1000000)).toContain('1.000.000')
      expect(formatCurrency(1234.56)).toContain('1.235')
    })

    it('should format currency with different currency', () => {
      expect(formatCurrency(1000, 'USD')).toContain('1.000')
      expect(formatCurrency(1000, 'EUR')).toContain('1.000')
    })

    it('should handle zero amount', () => {
      expect(formatCurrency(0)).toContain('0')
    })

    it('should handle negative amount', () => {
      expect(formatCurrency(-1000)).toContain('-1.000')
    })
  })

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      expect(formatDate('2024-01-15')).toBe('15/01/2024')
      expect(formatDate('2024-12-31')).toBe('31/12/2024')
    })

    it('should format Date object correctly', () => {
      const date = new Date('2024-01-15')
      expect(formatDate(date)).toBe('15/01/2024')
    })

    it('should handle different date formats', () => {
      expect(formatDate('2024-01-01T00:00:00.000Z')).toBe('01/01/2024')
    })
  })

  describe('formatNumber', () => {
    it('should format number with default decimals', () => {
      expect(formatNumber(1234.567)).toBe('1.234,57')
      expect(formatNumber(1000)).toBe('1.000,00')
    })

    it('should format number with custom decimals', () => {
      expect(formatNumber(1234.567, 0)).toBe('1.235')
      expect(formatNumber(1234.567, 3)).toBe('1.234,567')
    })

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0,00')
    })

    it('should handle negative numbers', () => {
      expect(formatNumber(-1234.567)).toBe('-1.234,57')
    })
  })
})
