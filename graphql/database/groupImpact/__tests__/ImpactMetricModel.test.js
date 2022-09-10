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

  it('constructs as expected with default values', () => {
    const item = Object.assign(
      {},
      new ImpactMetric({
        id: '123456789',
        charityId: 'abcdefghijklmnop',
        dollarAmount: 1000,
        description:
          'This provides access to care for people who might not otherwise have it.',
        metricTitle: '1 home visit',
        impactTitle: 'Provide 1 visit from a community health worker',
      })
    )
    expect(item).toEqual({
      id: '123456789',
      charityId: 'abcdefghijklmnop',
      dollarAmount: 1000,
      description:
        'This provides access to care for people who might not otherwise have it.',
      metricTitle: '1 home visit',
      impactTitle: 'Provide 1 visit from a community health worker',
      active: true,
    })
  })
})
