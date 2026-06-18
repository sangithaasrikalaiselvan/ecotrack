import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('utils cn', () => {
  it('merges tailwind classes correctly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
  })

  it('handles conflicts correctly using tailwind-merge', () => {
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4')
  })

  it('ignores falsy values', () => {
    expect(cn('bg-red-500', false && 'text-white', undefined, null, 'p-4')).toBe('bg-red-500 p-4')
  })
})
