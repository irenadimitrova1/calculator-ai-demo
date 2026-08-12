import { describe, expect, it } from 'vitest'

import {
  evaluateExpression,
  type AngleUnit,
  type ExpressionErrorCode,
} from '@/lib/expression'

type SuccessScenario = {
  name: string
  expression: string
  angleUnit: AngleUnit
  expected: number
  precision?: number
}

type FailureScenario = {
  name: string
  expression: string
  angleUnit: AngleUnit
  errorCode: ExpressionErrorCode
}

const pemdasScenarios: SuccessScenario[] = [
  {
    name: 'parentheses override multiplication',
    expression: '(2 + 3) × 4',
    angleUnit: 'deg',
    expected: 20,
  },
  {
    name: 'multiplication before addition',
    expression: '2 + 3 × 4',
    angleUnit: 'deg',
    expected: 14,
  },
  {
    name: 'division before subtraction',
    expression: '10 − 8 ÷ 2',
    angleUnit: 'deg',
    expected: 6,
  },
  {
    name: 'nested parentheses',
    expression: '((2 + 3) × 4) − 1',
    angleUnit: 'deg',
    expected: 19,
  },
  {
    name: 'unary minus on parenthesized expression',
    expression: '−(2 + 3)',
    angleUnit: 'deg',
    expected: -5,
  },
]

const powerScenarios: SuccessScenario[] = [
  {
    name: 'right-associative power',
    expression: '2^3^2',
    angleUnit: 'deg',
    expected: 512,
  },
  {
    name: 'explicit right-associative grouping',
    expression: '2^(3^2)',
    angleUnit: 'deg',
    expected: 512,
  },
  {
    name: 'left grouping differs from right-associative default',
    expression: '(2^3)^2',
    angleUnit: 'deg',
    expected: 64,
  },
]

const constantScenarios: SuccessScenario[] = [
  {
    name: 'pi times two',
    expression: 'π × 2',
    angleUnit: 'deg',
    expected: Math.PI * 2,
    precision: 10,
  },
  {
    name: 'e to the first power',
    expression: 'e^1',
    angleUnit: 'deg',
    expected: Math.E,
    precision: 10,
  },
]

const trigDegScenarios: SuccessScenario[] = [
  {
    name: 'sin 30 degrees',
    expression: 'sin(30)',
    angleUnit: 'deg',
    expected: 0.5,
    precision: 10,
  },
  {
    name: 'cos 0 degrees',
    expression: 'cos(0)',
    angleUnit: 'deg',
    expected: 1,
  },
  {
    name: 'tan 45 degrees',
    expression: 'tan(45)',
    angleUnit: 'deg',
    expected: 1,
    precision: 10,
  },
]

const trigRadScenarios: SuccessScenario[] = [
  {
    name: 'sin pi/2 radians',
    expression: 'sin(1.5707963267948966)',
    angleUnit: 'rad',
    expected: 1,
    precision: 10,
  },
  {
    name: 'cos pi radians',
    expression: 'cos(3.141592653589793)',
    angleUnit: 'rad',
    expected: -1,
    precision: 10,
  },
]

const inverseTrigScenarios: SuccessScenario[] = [
  {
    name: 'asin 0.5 in degrees',
    expression: 'asin(0.5)',
    angleUnit: 'deg',
    expected: 30,
    precision: 10,
  },
  {
    name: 'sin inverse unicode alias',
    expression: 'sin⁻¹(0.5)',
    angleUnit: 'deg',
    expected: 30,
    precision: 10,
  },
  {
    name: 'acos 1 in degrees',
    expression: 'acos(1)',
    angleUnit: 'deg',
    expected: 0,
  },
  {
    name: 'atan 1 in degrees',
    expression: 'atan(1)',
    angleUnit: 'deg',
    expected: 45,
  },
]

const logScenarios: SuccessScenario[] = [
  {
    name: 'natural log of e',
    expression: 'ln(e)',
    angleUnit: 'deg',
    expected: 1,
    precision: 10,
  },
  {
    name: 'base-10 log of 100',
    expression: 'log(100)',
    angleUnit: 'deg',
    expected: 2,
  },
]

const domainErrorScenarios: FailureScenario[] = [
  {
    name: 'divide by zero',
    expression: '5 ÷ 0',
    angleUnit: 'deg',
    errorCode: 'divide-by-zero',
  },
  {
    name: 'ln of zero',
    expression: 'ln(0)',
    angleUnit: 'deg',
    errorCode: 'log-domain',
  },
  {
    name: 'log of zero',
    expression: 'log(0)',
    angleUnit: 'deg',
    errorCode: 'log-domain',
  },
  {
    name: 'ln of negative',
    expression: 'ln(−1)',
    angleUnit: 'deg',
    errorCode: 'log-domain',
  },
  {
    name: 'asin out of domain',
    expression: 'asin(2)',
    angleUnit: 'deg',
    errorCode: 'inverse-trig-domain',
  },
]

const syntaxErrorScenarios: FailureScenario[] = [
  {
    name: 'empty expression',
    expression: '',
    angleUnit: 'deg',
    errorCode: 'syntax',
  },
  {
    name: 'unbalanced parentheses',
    expression: '((2 + 3)',
    angleUnit: 'deg',
    errorCode: 'syntax',
  },
  {
    name: 'missing function parentheses',
    expression: 'sin 30',
    angleUnit: 'deg',
    errorCode: 'syntax',
  },
  {
    name: 'implicit multiplication rejected',
    expression: '2π',
    angleUnit: 'deg',
    errorCode: 'syntax',
  },
]

function expectSuccess(scenario: SuccessScenario) {
  const result = evaluateExpression(scenario.expression, scenario.angleUnit)
  expect(result.ok).toBe(true)
  if (!result.ok) {
    return
  }
  if (scenario.precision !== undefined) {
    expect(result.value).toBeCloseTo(scenario.expected, scenario.precision)
  } else {
    expect(result.value).toBe(scenario.expected)
  }
}

function expectFailure(scenario: FailureScenario) {
  expect(() =>
    evaluateExpression(scenario.expression, scenario.angleUnit),
  ).not.toThrow()
  const result = evaluateExpression(scenario.expression, scenario.angleUnit)
  expect(result.ok).toBe(false)
  if (result.ok) {
    return
  }
  expect(result.error.code).toBe(scenario.errorCode)
}

describe('evaluateExpression', () => {
  describe.each(pemdasScenarios)('PEMDAS: $name', (scenario) => {
    it('evaluates correctly', () => {
      expectSuccess(scenario)
    })
  })

  describe.each(powerScenarios)('powers: $name', (scenario) => {
    it('evaluates correctly', () => {
      expectSuccess(scenario)
    })
  })

  describe.each(constantScenarios)('constants: $name', (scenario) => {
    it('evaluates correctly', () => {
      expectSuccess(scenario)
    })
  })

  describe.each(trigDegScenarios)('trig degrees: $name', (scenario) => {
    it('evaluates correctly', () => {
      expectSuccess(scenario)
    })
  })

  describe.each(trigRadScenarios)('trig radians: $name', (scenario) => {
    it('evaluates correctly', () => {
      expectSuccess(scenario)
    })
  })

  describe.each(inverseTrigScenarios)('inverse trig: $name', (scenario) => {
    it('evaluates correctly', () => {
      expectSuccess(scenario)
    })
  })

  describe.each(logScenarios)('logs: $name', (scenario) => {
    it('evaluates correctly', () => {
      expectSuccess(scenario)
    })
  })

  describe.each(domainErrorScenarios)('domain errors: $name', (scenario) => {
    it('returns typed failure without throwing', () => {
      expectFailure(scenario)
    })
  })

  describe.each(syntaxErrorScenarios)('syntax errors: $name', (scenario) => {
    it('returns typed failure without throwing', () => {
      expectFailure(scenario)
    })
  })
})
