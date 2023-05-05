/* eslint-env jest */
import moment from 'moment'

import GroupImpactMetric from '../GroupImpactMetricModel'
import { mockDate } from '../../test-utils'
import { permissionAuthorizers } from '../../../utils/authorization-helpers'

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

  it('constructs as expected with default values', () => {
    const item = Object.assign(
      {},
      new GroupImpactMetric({
        id: '123456789',
        causeId: 'abcd',
        impactMetricId: '12345',
        dollarProgress: 1000,
        dollarGoal: 10000,
        dollarProgressFromSearch: 100,
        dollarProgressFromTab: 200,
      })
    )
    expect(item).toEqual({
      id: '123456789',
      causeId: 'abcd',
      impactMetricId: '12345',
      dollarProgress: 1000,
      dollarGoal: 10000,
      dollarProgressFromSearch: 100,
      dollarProgressFromTab: 200,
      dateStarted: moment.utc().toISOString(),
    })
  })

  it('has the correct get permission', () => {
    expect(GroupImpactMetric.permissions.get).toEqual(
      permissionAuthorizers.allowAll
    )
  })
})
