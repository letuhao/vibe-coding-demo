/**
 * @fileoverview API helper utility tests
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { describe, it, expect } from 'vitest'

// API helper functions
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  
  return searchParams.toString()
}

export const formatApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  
  if (error.message) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}

export const isApiError = (error: any): boolean => {
  return !!(error && (error.response || error.message))
}

export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error
  }
  
  if (error?.message) {
    return error.message
  }
  
  return 'Unknown error'
}

describe('API Helper Utilities', () => {
  describe('buildQueryString', () => {
    it('should build query string from object', () => {
      const params = { page: 1, limit: 10, search: 'test' }
      const result = buildQueryString(params)
      expect(result).toBe('page=1&limit=10&search=test')
    })

    it('should handle empty object', () => {
      const result = buildQueryString({})
      expect(result).toBe('')
    })

    it('should filter out undefined values', () => {
      const params = { page: 1, limit: undefined, search: 'test' }
      const result = buildQueryString(params)
      expect(result).toBe('page=1&search=test')
    })

    it('should filter out null values', () => {
      const params = { page: 1, limit: null, search: 'test' }
      const result = buildQueryString(params)
      expect(result).toBe('page=1&search=test')
    })

    it('should filter out empty strings', () => {
      const params = { page: 1, limit: '', search: 'test' }
      const result = buildQueryString(params)
      expect(result).toBe('page=1&search=test')
    })
  })

  describe('formatApiError', () => {
    it('should format API error with response data', () => {
      const error = {
        response: {
          data: {
            message: 'User not found'
          }
        }
      }
      const result = formatApiError(error)
      expect(result).toBe('User not found')
    })

    it('should format error with message', () => {
      const error = { message: 'Network error' }
      const result = formatApiError(error)
      expect(result).toBe('Network error')
    })

    it('should return default message for unknown error', () => {
      const error = {}
      const result = formatApiError(error)
      expect(result).toBe('An unexpected error occurred')
    })
  })

  describe('isApiError', () => {
    it('should identify API errors with response', () => {
      const error = { response: { status: 404 } }
      expect(isApiError(error)).toBe(true)
    })

    it('should identify API errors with message', () => {
      const error = { message: 'Error occurred' }
      expect(isApiError(error)).toBe(true)
    })

    it('should reject non-API errors', () => {
      expect(isApiError(null)).toBe(false)
      expect(isApiError(undefined)).toBe(false)
      expect(isApiError({})).toBe(false)
    })
  })

  describe('getErrorMessage', () => {
    it('should return string error as is', () => {
      expect(getErrorMessage('Simple error')).toBe('Simple error')
    })

    it('should extract message from error object', () => {
      const error = { message: 'Object error' }
      expect(getErrorMessage(error)).toBe('Object error')
    })

    it('should return default message for unknown error', () => {
      expect(getErrorMessage({})).toBe('Unknown error')
      expect(getErrorMessage(null)).toBe('Unknown error')
    })
  })
})
