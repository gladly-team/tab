/* eslint-env jest */
import moment from 'moment'
import { nanoid } from 'nanoid'
import {
  getMockCauseInstance,
  getMockUserContext,
  mockDate,
} from '../../test-utils'
import CauseImpactMetricCountModel from '../CauseImpactMetricCountModel'
import RedisModel from '../../base/RedisModel'
import {
  GROUP_IMPACT_OVERRIDE,
  getPermissionsOverride,
} from '../../../utils/permissions-overrides'
import incrementCauseImpactMetricCount from '../incrementCauseImpactMetricCount'

const groupImpactOverride = getPermissionsOverride(GROUP_IMPACT_OVERRIDE)

const mockTestNanoId = 'a23456789'
const impactMetricId = nanoid(9)

jest.mock('nanoid', () => {
  return { nanoid: () => mockTestNanoId }
})
jest.mock('../getNextImpactMetricForCause')
jest.mock('../../globals/globals')

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

const userContext = getMockUserContext()
const cause = getMockCauseInstance()
const causeId = cause.id

afterEach(async () => {
  const client = RedisModel.getClient()
  await client.del(
    CauseImpactMetricCountModel.getRedisKey(`${causeId}_${impactMetricId}`)
  )
})

describe('incrementCauseImpactMetricCount tests', () => {
  it('updates count if exists', async () => {
    await CauseImpactMetricCountModel.create(groupImpactOverride, {
      id: `${causeId}_${impactMetricId}`,
      causeId,
      impactMetricId,
      count: 5,
    })
    await incrementCauseImpactMetricCount(causeId, impactMetricId)
    const countEntity = await CauseImpactMetricCountModel.get(
      userContext,
      `${causeId}_${impactMetricId}`
    )
    expect(countEntity).toEqual({
      id: `${causeId}_${impactMetricId}`,
      causeId,
      impactMetricId,
      count: 6,
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
    })
  })

  it('creates impact metric count if it does exist', async () => {
    await incrementCauseImpactMetricCount(causeId, impactMetricId)
    const countEntity = await CauseImpactMetricCountModel.get(
      userContext,
      `${causeId}_${impactMetricId}`
    )
    expect(countEntity).toEqual({
      id: `${causeId}_${impactMetricId}`,
      causeId,
      impactMetricId,
      count: 1,
      created: moment.utc().toISOString(),
      updated: moment.utc().toISOString(),
    })
  })
})
