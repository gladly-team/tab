/* eslint-env jest */
import moment from 'moment'
import { v4 as uuid } from 'uuid'
import {
  getMockCauseInstance,
  getMockUserContext,
  getMockUserInstance,
  mockDate,
} from '../../test-utils'
import UserGroupImpactMetricModel from '../UserGroupImpactMetricModel'
import updateUserGroupImpactMetric from '../updateUserGroupImpactMetric'
import {
  GROUP_IMPACT_OVERRIDE,
  getPermissionsOverride,
} from '../../../utils/permissions-overrides'
import { getEstimatedMoneyRaisedPerTab } from '../../globals/globals'

const groupImpactOverride = getPermissionsOverride(GROUP_IMPACT_OVERRIDE)
const mockUSDsPerTab = 0.001

jest.mock('../getNextImpactMetricForCause')
jest.mock('../../globals/globals')
jest.mock('../incrementCauseImpactMetricCount')
jest.mock('../../databaseClient')

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

beforeEach(() => {
  getEstimatedMoneyRaisedPerTab.mockReturnValue(mockUSDsPerTab)
  jest.useFakeTimers()
})

afterEach(() => {
  jest.clearAllMocks()
})

const userContext = getMockUserContext()
const cause = getMockCauseInstance()
const causeId = cause.id

const getGroupImpactMetric = () => ({
  id: uuid(),
  causeId,
  impactMetricId: 'abcd',
  dollarProgress: 1000,
  dollarGoal: 25000000,
})

describe('updateUserGroupImpactMetric tests', () => {
  it('creates correct instances of UserGroupImpactMetricModel if both do not exist', async () => {
    const user = getMockUserInstance()
    const groupImpactMetric = getGroupImpactMetric()
    const UserModel = require('../../users/UserModel').default
    const UserGroupImpactModel =
      require('../UserGroupImpactMetricModel').default
    const updateMethod = jest.spyOn(UserModel, 'update')
    const deleteMethod = jest.spyOn(UserGroupImpactModel, 'delete')
    const result = await updateUserGroupImpactMetric(
      userContext,
      user,
      groupImpactMetric
    )

    const userGroupImpactMetric = await UserGroupImpactMetricModel.get(
      userContext,
      result.id
    )

    expect(userGroupImpactMetric).toEqual({
      id: result.id,
      userId: user.id,
      groupImpactMetricId: groupImpactMetric.id,
      dollarContribution: 1000,
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
    })
    expect(updateMethod).toHaveBeenCalledWith(userContext, {
      id: user.id,
      userGroupImpactMetricId: result.id,
      updated: moment.utc().toISOString(),
    })
    expect(deleteMethod).not.toHaveBeenCalled()
  })

  it('normally updates group impact metric', async () => {
    const userGroupImpactMetricId = uuid()
    const user = getMockUserInstance({
      userGroupImpactMetricId,
    })
    const groupImpactMetric = getGroupImpactMetric()
    await UserGroupImpactMetricModel.create(groupImpactOverride, {
      id: userGroupImpactMetricId,
      groupImpactMetricId: groupImpactMetric.id,
      userId: user.id,
      dollarContribution: 1000,
    })
    const UserModel = require('../../users/UserModel').default
    const UserGroupImpactModel =
      require('../UserGroupImpactMetricModel').default
    const updateMethod = jest.spyOn(UserModel, 'update')
    const deleteMethod = jest.spyOn(UserGroupImpactModel, 'delete')

    const result = await updateUserGroupImpactMetric(
      userContext,
      user,
      groupImpactMetric
    )
    const userGroupImpactMetric = await UserGroupImpactMetricModel.get(
      userContext,
      result.id
    )
    expect(userGroupImpactMetric).toEqual({
      id: result.id,
      userId: user.id,
      groupImpactMetricId: groupImpactMetric.id,
      dollarContribution: 2000,
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
    })
    expect(updateMethod).not.toHaveBeenCalled()
    expect(deleteMethod).not.toHaveBeenCalled()
  })

  it('correctly ends and starts new user group impact metric when applicable', async () => {
    const userGroupImpactMetricId = uuid()
    const user = getMockUserInstance({
      userGroupImpactMetricId,
    })
    const groupImpactMetric = getGroupImpactMetric()
    const oldUserGroupImpactMetricModel =
      await UserGroupImpactMetricModel.create(groupImpactOverride, {
        id: userGroupImpactMetricId,
        groupImpactMetricId: uuid(), // Other Group Impact Metric
        userId: user.id,
        dollarContribution: 1000,
      })
    const UserModel = require('../../users/UserModel').default
    const UserGroupImpactModel =
      require('../UserGroupImpactMetricModel').default
    const updateMethod = jest.spyOn(UserModel, 'update')
    const deleteMethod = jest.spyOn(UserGroupImpactModel, 'delete')

    const result = await updateUserGroupImpactMetric(
      userContext,
      user,
      groupImpactMetric
    )
    const userGroupImpactMetric = await UserGroupImpactMetricModel.get(
      userContext,
      result.id
    )
    expect(userGroupImpactMetric).toEqual({
      id: result.id,
      userId: user.id,
      groupImpactMetricId: groupImpactMetric.id,
      dollarContribution: 1000,
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
    })
    expect(updateMethod).toHaveBeenCalledWith(userContext, {
      id: user.id,
      userGroupImpactMetricId: result.id,
      updated: moment.utc().toISOString(),
    })
    expect(deleteMethod).toHaveBeenCalledWith(oldUserGroupImpactMetricModel.id)
  })
})
