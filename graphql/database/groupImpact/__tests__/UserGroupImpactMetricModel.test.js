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
      })
    )
    expect(item).toEqual({
      id: '123456789',
      userId: 'abcd',
      groupImpactMetricId: '12345',
      dollarContribution: 1000,
    })
  })

  it('has the correct get permission', () => {
    expect(UserGroupImpactMetric.permissions.get).toEqual(
      permissionAuthorizers.allowAll
    )
  })
})
