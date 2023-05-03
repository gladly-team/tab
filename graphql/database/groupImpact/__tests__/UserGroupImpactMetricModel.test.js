/* eslint-env jest */
import UserGroupImpactMetric from '../UserGroupImpactMetricModel'
import { mockDate } from '../../test-utils'
import { permissionAuthorizers } from '../../../utils/authorization-helpers'

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('UserGroupImpactMetricModel', () => {
  it('implements the name property', () => {
    expect(UserGroupImpactMetric.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(UserGroupImpactMetric.hashKey).toBeDefined()
  })

  it('constructs as expected', () => {
    const item = Object.assign(
      {},
      new UserGroupImpactMetric({
        id: '123456789',
        userId: 'abcd',
        groupImpactMetricId: '12345',
        dollarContribution: 1000,
        tabDollarContribution: 333,
        searchDollarContribution: 333,
        shopDollarContribution: 334,
      })
    )
    expect(item).toEqual({
      id: '123456789',
      userId: 'abcd',
      groupImpactMetricId: '12345',
      dollarContribution: 1000,
      tabDollarContribution: 333,
      searchDollarContribution: 333,
      shopDollarContribution: 334,
    })
  })

  it('constructs as expected with defaults', () => {
    const item = Object.assign(
      {},
      new UserGroupImpactMetric({
        id: '123456789',
        userId: 'abcd',
        groupImpactMetricId: '12345',
        dollarContribution: 1000,
      })
    )
    expect(item).toEqual({
      id: '123456789',
      userId: 'abcd',
      groupImpactMetricId: '12345',
      dollarContribution: 1000,
      tabDollarContribution: 0,
      searchDollarContribution: 0,
      shopDollarContribution: 0,
    })
  })

  it('has the correct get permission', () => {
    expect(UserGroupImpactMetric.permissions.get).toEqual(
      permissionAuthorizers.allowAll
    )
  })
})
