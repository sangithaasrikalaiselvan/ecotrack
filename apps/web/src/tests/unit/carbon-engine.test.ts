import { describe, it, expect } from 'vitest'
import {
  calculateTransport,
  calculateFood,
  calculateWaste,
  calculateGreenScore
} from '@/lib/carbon/calculator'

describe('calculateTransport', () => {
  it('returns 0 for cycling', () => {
    expect(calculateTransport('cycle', 10, 5)).toBe(0)
  })

  it('returns 0 for walking', () => {
    expect(calculateTransport('walking', 10, 5)).toBe(0)
  })

  it('calculates petrol car correctly', () => {
    expect(calculateTransport('petrol_car', 15, 5)).toBeCloseTo(62.4, 0)
  })

  it('returns 0 for unknown vehicle type', () => {
    expect(calculateTransport('hovercraft', 10, 5)).toBe(0)
  })

  it('handles 0 km per day', () => {
    expect(calculateTransport('petrol_car', 0, 5)).toBe(0)
  })
})

describe('calculateFood', () => {
  it('returns correct value for vegan', () => {
    expect(calculateFood('vegan')).toBe(30)
  })

  it('returns correct value for high_meat', () => {
    expect(calculateFood('high_meat')).toBe(150)
  })

  it('returns default 90 for unknown diet', () => {
    expect(calculateFood('unknown')).toBe(90)
  })
})

describe('calculateWaste', () => {
  it('returns 10 for recycle_always', () => {
    expect(calculateWaste('recycle_always')).toBe(10)
  })

  it('returns 40 for no_recycling', () => {
    expect(calculateWaste('no_recycling')).toBe(40)
  })

  it('returns default 20 for unknown habit', () => {
    expect(calculateWaste('unknown')).toBe(20)
  })
})

describe('calculateGreenScore', () => {
  it('returns 50 for exactly average footprint', () => {
    expect(calculateGreenScore(300, 300)).toBe(50)
  })

  it('returns above 50 for below-average footprint', () => {
    expect(calculateGreenScore(150, 300)).toBeGreaterThan(50)
  })

  it('never exceeds 100', () => {
    expect(calculateGreenScore(0, 300)).toBeLessThanOrEqual(100)
  })

  it('never goes below 0', () => {
    expect(calculateGreenScore(9999, 300)).toBeGreaterThanOrEqual(0)
  })
})
