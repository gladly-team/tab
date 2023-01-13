/* eslint-env jest */
import moment from 'moment'
import { nanoid } from 'nanoid'
import {
  getMockCauseInstance,
  getMockUserContext,
  mockDate,
} from '../../test-utils'
import CauseGroupImpactMetricModel from '../CauseGroupImpactMetricModel'
import GroupImpactMetricModel from '../GroupImpactMetricModel'
import updateGroupImpactMetric from '../updateGroupImpactMetric'
import RedisModel from '../../base/RedisModel'
import {
  GROUP_IMPACT_OVERRIDE,
  getPermissionsOverride,
} from '../../../utils/permissions-overrides'
import getNextImpactMetricForCause from '../getNextImpactMetricForCause'
import { getEstimatedMoneyRaisedPerTab } from '../../globals/globals'

const groupImpactOverride = getPermissionsOverride(GROUP_IMPACT_OVERRIDE)

const mockTestNanoId = 'a23456789'
const mockImpactId = 'abcd'
const mockUSDsPerTab = 0.001

jest.mock('nanoid', () => {
  return { nanoid: () => mockTestNanoId }
})
jest.mock('../getNextImpactMetricForCause')
jest.mock('../../globals/globals')

beforeAll(() => {
  mockDate.on()
  getNextImpactMetricForCause.mockReturnValue({
    id: mockImpactId,
    charityId: 'orphan-impact-metric',
    dollarAmount: 25e6,
    description: 'This is a test impact metric.',
    metricTitle: '1 impact',
    impactTitle: 'Provide 1 impact',
    active: true,
  })
  getEstimatedMoneyRaisedPerTab.mockReturnValue(mockUSDsPerTab)
})

afterAll(() => {
  mockDate.off()
})

const userContext = getMockUserContext()
const cause = getMockCauseInstance()
const causeId = cause.id

afterEach(async () => {
  const client = RedisModel.getClient()
  await client.del(CauseGroupImpactMetricModel.getRedisKey(causeId))
  await client.del(GroupImpactMetricModel.getRedisKey(mockTestNanoId))
})

describe('updateGroupImpactMetric tests', () => {
  it('creates correct instances of CauseGroupImpactMetricModel, GroupImpactMetricModel if both do not exist', async () => {
    await updateGroupImpactMetric(userContext, causeId)
    const joinEntity = await CauseGroupImpactMetricModel.get(
      userContext,
      causeId
    )
    expect(joinEntity).toEqual({
      causeId,
      groupImpactMetricId: mockTestNanoId,
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
    })

    const groupImpactMetricModel = await GroupImpactMetricModel.get(
      userContext,
      mockTestNanoId
    )
    expect(groupImpactMetricModel).toEqual({
      id: mockTestNanoId,
      causeId,
      impactMetricId: mockImpactId,
      dollarProgress: 1000,
      dollarGoal: 25000000,
      dateStarted: moment.utc().toISOString(),
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
    })
  })

  it('creates correct GroupImpactMetricModel if does not exist', async () => {
    const groupImpactMetricId = nanoid(9)
    await CauseGroupImpactMetricModel.create(groupImpactOverride, {
      causeId,
      groupImpactMetricId,
    })
    await updateGroupImpactMetric(userContext, causeId)
    const joinEntity = await CauseGroupImpactMetricModel.get(
      userContext,
      causeId
    )
    expect(joinEntity).toEqual({
      causeId,
      groupImpactMetricId,
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
    })

    const groupImpactMetricModel = await GroupImpactMetricModel.get(
      userContext,
      mockTestNanoId
    )
    expect(groupImpactMetricModel).toEqual({
      id: groupImpactMetricId,
      causeId,
      impactMetricId: mockImpactId,
      dollarProgress: 1000,
      dollarGoal: 25000000,
      dateStarted: moment.utc().toISOString(),
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
    })
  })

  it('normally updates group impact metric', async () => {
    const { nanoid: realNanoId } = jest.requireActual('nanoid')
    const groupImpactMetricId = realNanoId(9)
    await CauseGroupImpactMetricModel.create(groupImpactOverride, {
      causeId,
      groupImpactMetricId,
    })
    await GroupImpactMetricModel.create(groupImpactOverride, {
      id: groupImpactMetricId,
      causeId,
      impactMetricId: mockImpactId,
      dollarProgress: 10,
      dollarGoal: 25000000,
      dateStarted: moment.utc().toISOString(),
    })

    await updateGroupImpactMetric(userContext, causeId)
    const joinEntity = await CauseGroupImpactMetricModel.get(
      userContext,
      causeId
    )
    expect(joinEntity).toEqual({
      causeId,
      groupImpactMetricId,
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
    })

    const groupImpactMetricModel = await GroupImpactMetricModel.get(
      userContext,
      groupImpactMetricId
    )
    expect(groupImpactMetricModel).toEqual({
      id: groupImpactMetricId,
      causeId,
      impactMetricId: mockImpactId,
      dollarProgress: 1010,
      dollarGoal: 25000000,
      dateStarted: moment.utc().toISOString(),
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
    })
  })

  it('correctly ends and starts new group impact metric when applicable', async () => {
    const { nanoid: realNanoId } = jest.requireActual('nanoid')
    const groupImpactMetricId = realNanoId(9)
    await CauseGroupImpactMetricModel.create(groupImpactOverride, {
      causeId,
      groupImpactMetricId,
    })
    await GroupImpactMetricModel.create(groupImpactOverride, {
      id: groupImpactMetricId,
      causeId,
      impactMetricId: mockImpactId,
      dollarProgress: 95,
      dollarGoal: 1000,
      dateStarted: moment.utc().toISOString(),
    })

    await updateGroupImpactMetric(userContext, causeId)
    const joinEntity = await CauseGroupImpactMetricModel.get(
      userContext,
      causeId
    )
    expect(joinEntity).toEqual({
      causeId,
      groupImpactMetricId: mockTestNanoId,
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
    })

    const groupImpactMetricModel = await GroupImpactMetricModel.get(
      userContext,
      groupImpactMetricId
    )
    expect(groupImpactMetricModel).toEqual({
      id: groupImpactMetricId,
      causeId,
      impactMetricId: mockImpactId,
      dollarProgress: 1095,
      dollarGoal: 1000,
      dateStarted: moment.utc().toISOString(),
      dateCompleted: moment.utc().toISOString(),
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
    })

    const newJoinEntity = await CauseGroupImpactMetricModel.get(
      userContext,
      causeId
    )
    expect(newJoinEntity).toEqual({
      causeId,
      groupImpactMetricId: mockTestNanoId,
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
    })

    const newGroupImpactMetricModel = await GroupImpactMetricModel.get(
      userContext,
      mockTestNanoId
    )
    expect(newGroupImpactMetricModel).toEqual({
      id: mockTestNanoId,
      causeId,
      impactMetricId: mockImpactId,
      dollarProgress: 0,
      dollarGoal: 25000000,
      dateStarted: moment.utc().toISOString(),
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
    })
  })
})
