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
import {
  getEstimatedMoneyRaisedPerSearch,
  getEstimatedMoneyRaisedPerTab,
} from '../../globals/globals'
import GroupImpactLeaderboard from '../GroupImpactLeaderboard'

const groupImpactOverride = getPermissionsOverride(GROUP_IMPACT_OVERRIDE)
const mockUSDsPerTab = 0.001
const mockUSDsPerSearch = 0.002

jest.mock('../getNextImpactMetricForCause')
jest.mock('../../globals/globals')
jest.mock('../incrementCauseImpactMetricCount')
jest.mock('../../databaseClient')
jest.mock('../GroupImpactLeaderboard')

beforeAll(() => {
  mockDate.on(null, { mockCurrentTimeOnly: true })
})

afterAll(() => {
  mockDate.off()
})

beforeEach(() => {
  getEstimatedMoneyRaisedPerTab.mockReturnValue(mockUSDsPerTab)
  getEstimatedMoneyRaisedPerSearch.mockReturnValue(mockUSDsPerSearch)
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
  dateStarted: moment.utc().toISOString(),
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
      groupImpactMetric,
      'tab'
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
      searchDollarContribution: 0,
      shopDollarContribution: 0,
      tabDollarContribution: 1000,
    })
    expect(updateMethod).toHaveBeenCalledWith(userContext, {
      id: user.id,
      userGroupImpactMetricId: result.id,
      updated: moment.utc().toISOString(),
    })
    expect(deleteMethod).not.toHaveBeenCalled()
    expect(GroupImpactLeaderboard.add).toHaveBeenCalledWith(
      groupImpactMetric.id,
      user.id,
      1000
    )
  })

  it('creates correct instances of UserGroupImpactMetricModel if both do not exist for search', async () => {
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
      groupImpactMetric,
      'search'
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
      searchDollarContribution: 2000,
      shopDollarContribution: 0,
      tabDollarContribution: 0,
    })
    expect(updateMethod).toHaveBeenCalledWith(userContext, {
      id: user.id,
      userGroupImpactMetricId: result.id,
      updated: moment.utc().toISOString(),
    })
    expect(deleteMethod).not.toHaveBeenCalled()
    expect(GroupImpactLeaderboard.add).toHaveBeenCalledWith(
      groupImpactMetric.id,
      user.id,
      2000
    )
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
      groupImpactMetric,
      'tab'
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
      searchDollarContribution: 0,
      shopDollarContribution: 0,
      tabDollarContribution: 1000,
    })
    expect(updateMethod).not.toHaveBeenCalled()
    expect(deleteMethod).not.toHaveBeenCalled()
    expect(GroupImpactLeaderboard.add).toHaveBeenCalledWith(
      groupImpactMetric.id,
      user.id,
      2000
    )
  })

  it('normally updates group impact metric with search', async () => {
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
      groupImpactMetric,
      'search'
    )
    const userGroupImpactMetric = await UserGroupImpactMetricModel.get(
      userContext,
      result.id
    )
    expect(userGroupImpactMetric).toEqual({
      id: result.id,
      userId: user.id,
      groupImpactMetricId: groupImpactMetric.id,
      dollarContribution: 3000,
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
      searchDollarContribution: 2000,
      shopDollarContribution: 0,
      tabDollarContribution: 0,
    })
    expect(updateMethod).not.toHaveBeenCalled()
    expect(deleteMethod).not.toHaveBeenCalled()
    expect(GroupImpactLeaderboard.add).toHaveBeenCalledWith(
      groupImpactMetric.id,
      user.id,
      3000
    )
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
    const UserGroupImpactMetricLogModel =
      require('../UserGroupImpactMetricLogModel').default
    const updateMethod = jest.spyOn(UserModel, 'update')
    const deleteMethod = jest.spyOn(UserGroupImpactModel, 'delete')
    const createMethod = jest.spyOn(UserGroupImpactMetricLogModel, 'create')

    const result = await updateUserGroupImpactMetric(
      userContext,
      user,
      groupImpactMetric,
      'tab'
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
      searchDollarContribution: 0,
      shopDollarContribution: 0,
      tabDollarContribution: 1000,
    })
    expect(updateMethod).toHaveBeenCalledWith(userContext, {
      id: user.id,
      userGroupImpactMetricId: result.id,
      updated: moment.utc().toISOString(),
    })
    expect(deleteMethod).toHaveBeenCalledWith(oldUserGroupImpactMetricModel.id)
    expect(GroupImpactLeaderboard.add).toHaveBeenCalledWith(
      groupImpactMetric.id,
      user.id,
      1000
    )
    expect(createMethod).not.toHaveBeenCalled()
  })

  it('correctly ends and starts new user group impact metric when applicable for search', async () => {
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
    const UserGroupImpactMetricLogModel =
      require('../UserGroupImpactMetricLogModel').default
    const updateMethod = jest.spyOn(UserModel, 'update')
    const deleteMethod = jest.spyOn(UserGroupImpactModel, 'delete')
    const createMethod = jest.spyOn(UserGroupImpactMetricLogModel, 'create')

    const result = await updateUserGroupImpactMetric(
      userContext,
      user,
      groupImpactMetric,
      'search'
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
      searchDollarContribution: 2000,
      shopDollarContribution: 0,
      tabDollarContribution: 0,
    })
    expect(updateMethod).toHaveBeenCalledWith(userContext, {
      id: user.id,
      userGroupImpactMetricId: result.id,
      updated: moment.utc().toISOString(),
    })
    expect(deleteMethod).toHaveBeenCalledWith(oldUserGroupImpactMetricModel.id)
    expect(GroupImpactLeaderboard.add).toHaveBeenCalledWith(
      groupImpactMetric.id,
      user.id,
      2000
    )
    expect(createMethod).not.toHaveBeenCalled()
  })

  it('correctly ends and starts new user group impact metric when applicable - timeboxed', async () => {
    const userGroupImpactMetricId = uuid()
    const user = getMockUserInstance({
      userGroupImpactMetricId,
    })
    const groupImpactMetric = {
      ...getGroupImpactMetric(),
      dateExpires: moment.utc().add(1, 'day').toISOString(),
    }
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
    const UserGroupImpactMetricLogModel =
      require('../UserGroupImpactMetricLogModel').default
    const updateMethod = jest.spyOn(UserModel, 'update')
    const deleteMethod = jest.spyOn(UserGroupImpactModel, 'delete')
    const createMethod = jest.spyOn(UserGroupImpactMetricLogModel, 'create')

    const result = await updateUserGroupImpactMetric(
      userContext,
      user,
      groupImpactMetric,
      'tab'
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
      searchDollarContribution: 0,
      shopDollarContribution: 0,
      tabDollarContribution: 1000,
    })
    expect(updateMethod).toHaveBeenCalledWith(userContext, {
      id: user.id,
      userGroupImpactMetricId: result.id,
      updated: moment.utc().toISOString(),
    })
    expect(deleteMethod).toHaveBeenCalledWith(oldUserGroupImpactMetricModel.id)
    expect(GroupImpactLeaderboard.add).toHaveBeenCalledWith(
      groupImpactMetric.id,
      user.id,
      1000
    )
    expect(createMethod).toHaveBeenCalledWith(groupImpactOverride, {
      ...oldUserGroupImpactMetricModel,
      dateStarted: groupImpactMetric.dateStarted,
    })
  })

  it('correctly ends and starts new user group impact metric when applicable for search - timeboxed', async () => {
    const userGroupImpactMetricId = uuid()
    const user = getMockUserInstance({
      userGroupImpactMetricId,
    })
    const groupImpactMetric = {
      ...getGroupImpactMetric(),
      dateExpires: moment.utc().add(1, 'day').toISOString(),
    }
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
    const UserGroupImpactMetricLogModel =
      require('../UserGroupImpactMetricLogModel').default
    const updateMethod = jest.spyOn(UserModel, 'update')
    const deleteMethod = jest.spyOn(UserGroupImpactModel, 'delete')
    const createMethod = jest.spyOn(UserGroupImpactMetricLogModel, 'create')

    const result = await updateUserGroupImpactMetric(
      userContext,
      user,
      groupImpactMetric,
      'search'
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
      searchDollarContribution: 2000,
      shopDollarContribution: 0,
      tabDollarContribution: 0,
    })
    expect(updateMethod).toHaveBeenCalledWith(userContext, {
      id: user.id,
      userGroupImpactMetricId: result.id,
      updated: moment.utc().toISOString(),
    })
    expect(deleteMethod).toHaveBeenCalledWith(oldUserGroupImpactMetricModel.id)
    expect(GroupImpactLeaderboard.add).toHaveBeenCalledWith(
      groupImpactMetric.id,
      user.id,
      2000
    )
    expect(createMethod).toHaveBeenCalledWith(groupImpactOverride, {
      ...oldUserGroupImpactMetricModel,
      dateStarted: groupImpactMetric.dateStarted,
    })
  })

  it('throws if no source provided', async () => {
    const user = getMockUserInstance()
    const groupImpactMetric = getGroupImpactMetric()

    expect(
      updateUserGroupImpactMetric(userContext, user, groupImpactMetric)
    ).rejects.toEqual(new Error('Update Source Required'))
  })
})
