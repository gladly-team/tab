/* eslint-env jest */

import ImpactMetric from '../ImpactMetricModel'
import { mockDate } from '../../test-utils'

jest.mock('../../databaseClient')

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('ImpactMetricModel', () => {
  it('implements the name property', () => {
    expect(ImpactMetric.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(ImpactMetric.hashKey).toBeDefined()
  })

  it('implements the tableName property', () => {
    expect(ImpactMetric.tableName).toBe('UNUSED_ImpactMetrics')
  })

  it('constructs as expected with default values', () => {
    const item = Object.assign(
      {},
      new ImpactMetric({
        id: '123456789',
        charityId: 'abcdefghijklmnop',
        dollarAmount: 1000,
        description: 'testItem',
        name: 'testImpactMetric',
      })
    )
    expect(item).toEqual({
      id: '123456789',
      charityId: 'abcdefghijklmnop',
      dollarAmount: 1000,
      description: 'testItem',
      name: 'testImpactMetric',
      active: true,
    })
  })
})
