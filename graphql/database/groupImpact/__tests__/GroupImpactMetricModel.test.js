/* eslint-env jest */
import moment from 'moment'

import GroupImpactMetric from '../GroupImpactMetricModel'
import { mockDate } from '../../test-utils'
import { GROUP_IMPACT_METRIC } from '../../constants'

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('GroupImpactMetricModel', () => {
  it('implements the name property', () => {
    expect(GroupImpactMetric.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(GroupImpactMetric.hashKey).toBeDefined()
  })

  it('implements the tableName property', () => {
    expect(GroupImpactMetric.tableName).toBe(GROUP_IMPACT_METRIC)
  })

  it('constructs as expected with default values', () => {
    const item = Object.assign(
      {},
      new GroupImpactMetric({
        id: '123456789',
        causeId: 'abcd',
        impactMetricId: '12345',
        dollarProgress: 1000,
        dollarGoal: 10000,
      })
    )
    expect(item).toEqual({
      id: '123456789',
      causeId: 'abcd',
      impactMetricId: '12345',
      dollarProgress: 1000,
      dollarGoal: 10000,
      dateStarted: moment.utc().toISOString(),
    })
  })
})
