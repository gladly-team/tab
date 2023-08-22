/* eslint-env jest */
import moment from 'moment'
import UserGroupImpactMetricLog from '../UserGroupImpactMetricLogModel'
import { mockDate } from '../../test-utils'
import { permissionAuthorizers } from '../../../utils/authorization-helpers'
import tableNames from '../../tables'

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('UserGroupImpactMetricLogModel', () => {
  it('implements the name property', () => {
    expect(UserGroupImpactMetricLog.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(UserGroupImpactMetricLog.hashKey).toBe('id')
  })

  it('implements the rangeKey property', () => {
    expect(UserGroupImpactMetricLog.rangeKey).toBe('dateStarted')
  })

  it('implements the tableName property', () => {
    expect(UserGroupImpactMetricLog.tableName).toBe(
      tableNames.userGroupImpactMetricLog
    )
  })

  it('constructs as expected', () => {
    const item = Object.assign(
      {},
      new UserGroupImpactMetricLog({
        id: '123456789',
        userId: 'abcd',
        groupImpactMetricId: '12345',
        dollarContribution: 1000,
        tabDollarContribution: 333,
        searchDollarContribution: 333,
        shopDollarContribution: 334,
        dateStarted: moment.utc().toISOString(),
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
      dateStarted: moment.utc().toISOString(),
    })
  })

  it('constructs as expected with defaults', () => {
    const item = Object.assign(
      {},
      new UserGroupImpactMetricLog({
        id: '123456789',
        userId: 'abcd',
        groupImpactMetricId: '12345',
        dollarContribution: 1000,
        dateStarted: moment.utc().toISOString(),
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
      dateStarted: moment.utc().toISOString(),
    })
  })

  it('has the correct get permission', () => {
    expect(UserGroupImpactMetricLog.permissions.get).toEqual(
      permissionAuthorizers.allowAll
    )
  })
})
