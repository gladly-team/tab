/* eslint-env jest */

import UserImpactModel from '../UserImpactModel'
import updateImpact from '../updateImpact'
import { USER_VISIT_IMPACT_VALUE } from '../../constants'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserImpact,
  mockDate,
  setMockDBResponse,
} from '../../test-utils'

jest.mock('lodash/number')
jest.mock('../../databaseClient')
jest.mock('../../globals/globals')

const userContext = getMockUserContext()
const mockCurrentTime = '2017-06-22T01:13:28.000Z'

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true,
  })
})

const userId = userContext.id
const defaultResponse = getMockUserImpact()

describe('updateImpact', () => {
  it('when a user has confirmed and logs impact, it decrements the visitsUntilNextImpact', async () => {
    const mockUserImpact = new UserImpactModel({
      userId,
      charityId: 'mock-charity',
      confirmedImpact: true,
      userImpactMetric: 1,
      visitsUntilNextImpact: USER_VISIT_IMPACT_VALUE,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUserImpact,
    })
    const updateMethod = jest.spyOn(UserImpactModel, 'update')
    await updateImpact(userContext, userId, 'mock-charity', { logImpact: true })
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      ...defaultResponse,
      userImpactMetric: 1,
      visitsUntilNextImpact: USER_VISIT_IMPACT_VALUE - 1,
    })
  })

  it('when a user logs their first visit after confirming, they should get a full impact metric and hasClaimedLatestReward should be set to false', async () => {
    const mockUserImpact = new UserImpactModel({
      userId,
      charityId: 'mock-charity',
      confirmedImpact: true,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUserImpact,
    })
    const updateMethod = jest.spyOn(UserImpactModel, 'update')
    await updateImpact(userContext, userId, 'mock-charity', { logImpact: true })
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      ...defaultResponse,
      userImpactMetric: 1,
      hasClaimedLatestReward: false,
    })
  })

  it('when a user has not confirmed, log impact should not decrements the visitsUntilNextImpact', async () => {
    const mockUserImpact = new UserImpactModel({
      userId,
      charityId: 'mock-charity',
      confirmedImpact: false,
      visitsUntilNextImpact: USER_VISIT_IMPACT_VALUE,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUserImpact,
    })
    const updateMethod = jest.spyOn(UserImpactModel, 'update')
    await updateImpact(userContext, userId, 'mock-charity', { logImpact: true })
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      ...defaultResponse,
      confirmedImpact: false,
      visitsUntilNextImpact: USER_VISIT_IMPACT_VALUE,
    })
  })

  it('if the visitsUntilNextImpact hits 0, it should increment userImpactMetric and reset visitsUntilNextImpact and set hasClaimedLatestReward to false', async () => {
    const mockUserImpact = new UserImpactModel({
      userId,
      charityId: 'mock-charity',
      visitsUntilNextImpact: 1,
      confirmedImpact: true,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUserImpact,
    })
    const updateMethod = jest.spyOn(UserImpactModel, 'update')
    await updateImpact(userContext, userId, 'mock-charity', { logImpact: true })
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      ...defaultResponse,
      visitsUntilNextImpact: USER_VISIT_IMPACT_VALUE,
      userImpactMetric: 1,
      hasClaimedLatestReward: false,
    })
  })

  it('it should show claim reward at 1 impact', async () => {
    const mockUserImpact = new UserImpactModel({
      userId,
      charityId: 'mock-charity',
      visitsUntilNextImpact: 1,
      confirmedImpact: true,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUserImpact,
    })
    const updateMethod = jest.spyOn(UserImpactModel, 'update')
    await updateImpact(userContext, userId, 'mock-charity', { logImpact: true })
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      ...defaultResponse,
      visitsUntilNextImpact: USER_VISIT_IMPACT_VALUE,
      userImpactMetric: 1,
      hasClaimedLatestReward: false,
    })
  })

  it('it should not show claim reward at 2 impact', async () => {
    const mockUserImpact = new UserImpactModel({
      userId,
      charityId: 'mock-charity',
      visitsUntilNextImpact: 1,
      confirmedImpact: true,
      userImpactMetric: 1,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUserImpact,
    })
    const updateMethod = jest.spyOn(UserImpactModel, 'update')
    await updateImpact(userContext, userId, 'mock-charity', { logImpact: true })
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      ...defaultResponse,
      visitsUntilNextImpact: USER_VISIT_IMPACT_VALUE,
      userImpactMetric: 2,
      hasClaimedLatestReward: true,
    })
  })

  it('it should show claim reward at 3 impact', async () => {
    const mockUserImpact = new UserImpactModel({
      userId,
      charityId: 'mock-charity',
      visitsUntilNextImpact: 1,
      confirmedImpact: true,
      userImpactMetric: 2,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUserImpact,
    })
    const updateMethod = jest.spyOn(UserImpactModel, 'update')
    await updateImpact(userContext, userId, 'mock-charity', { logImpact: true })
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      ...defaultResponse,
      visitsUntilNextImpact: USER_VISIT_IMPACT_VALUE,
      userImpactMetric: 3,
      hasClaimedLatestReward: false,
    })
  })

  it('it should not show claim reward at 4 impact', async () => {
    const mockUserImpact = new UserImpactModel({
      userId,
      charityId: 'mock-charity',
      visitsUntilNextImpact: 1,
      confirmedImpact: true,
      userImpactMetric: 3,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUserImpact,
    })
    const updateMethod = jest.spyOn(UserImpactModel, 'update')
    await updateImpact(userContext, userId, 'mock-charity', { logImpact: true })
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      ...defaultResponse,
      visitsUntilNextImpact: USER_VISIT_IMPACT_VALUE,
      userImpactMetric: 4,
      hasClaimedLatestReward: true,
    })
  })

  it('it should show claim reward at 20 impact', async () => {
    const mockUserImpact = new UserImpactModel({
      userId,
      charityId: 'mock-charity',
      visitsUntilNextImpact: 1,
      confirmedImpact: true,
      userImpactMetric: 19,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUserImpact,
    })
    const updateMethod = jest.spyOn(UserImpactModel, 'update')
    await updateImpact(userContext, userId, 'mock-charity', { logImpact: true })
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      ...defaultResponse,
      visitsUntilNextImpact: USER_VISIT_IMPACT_VALUE,
      userImpactMetric: 20,
      hasClaimedLatestReward: false,
    })
  })

  it('if the user claims pending referral it should increase userImpact and reset pending referral and count', async () => {
    const mockUserImpact = new UserImpactModel({
      userId,
      charityId: 'mock-charity',
      pendingUserReferralImpact: 10,
      pendingUserReferralCount: 1,
      confirmedImpact: true,
      visitsUntilNextImpact: USER_VISIT_IMPACT_VALUE,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUserImpact,
    })
    const updateMethod = jest.spyOn(UserImpactModel, 'update')
    await updateImpact(userContext, userId, 'mock-charity', {
      claimPendingUserReferralImpact: true,
    })
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      ...defaultResponse,
      userImpactMetric: 10,
      pendingUserReferralImpact: 0,
      pendingUserReferralCount: 0,
    })
  })

  it('if the user confirms, it should set confirmedImpact to true', async () => {
    const mockUserImpact = new UserImpactModel({
      userId,
      charityId: 'mock-charity',
      confirmedImpact: true,
      visitsUntilNextImpact: USER_VISIT_IMPACT_VALUE,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUserImpact,
    })
    const updateMethod = jest.spyOn(UserImpactModel, 'update')
    await updateImpact(userContext, userId, 'mock-charity', {
      confirmImpact: true,
    })
    expect(updateMethod).toHaveBeenLastCalledWith(userContext, {
      ...defaultResponse,
      confirmedImpact: true,
    })
  })
})
