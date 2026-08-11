import { describe, expect, it } from 'vitest'

import { calculate } from './calculation'

describe('calculate', () => {
  describe('add', () => {
    it('adds two positive integers', () => {
      expect(calculate(2, 'add', 3)).toBe(5)
    })

    it('adds negative operands', () => {
      expect(calculate(-2, 'add', -3)).toBe(-5)
    })
  })

  describe('subtract', () => {
    it('subtracts two positive integers', () => {
      expect(calculate(7, 'subtract', 3)).toBe(4)
    })

    it('returns a negative result', () => {
      expect(calculate(2, 'subtract', 5)).toBe(-3)
    })

    it('subtracts negative operands', () => {
      expect(calculate(-2, 'subtract', -3)).toBe(1)
    })
  })

  describe('multiply', () => {
    it('multiplies two positive integers', () => {
      expect(calculate(4, 'multiply', 3)).toBe(12)
    })

    it('multiplies negative operands', () => {
      expect(calculate(-4, 'multiply', 3)).toBe(-12)
    })
  })

  describe('divide', () => {
    it('divides two positive integers', () => {
      expect(calculate(6, 'divide', 3)).toBe(2)
    })

    it('returns a non-integer result', () => {
      expect(calculate(7, 'divide', 2)).toBe(3.5)
    })

    it('returns Infinity when dividing by zero', () => {
      expect(() => calculate(5, 'divide', 0)).not.toThrow()
      expect(calculate(5, 'divide', 0)).toBe(Infinity)
    })

    it('returns -Infinity when dividing a negative by zero', () => {
      expect(() => calculate(-5, 'divide', 0)).not.toThrow()
      expect(calculate(-5, 'divide', 0)).toBe(-Infinity)
    })

    it('returns NaN for zero divided by zero', () => {
      expect(() => calculate(0, 'divide', 0)).not.toThrow()
      expect(calculate(0, 'divide', 0)).toBeNaN()
    })
  })
})
