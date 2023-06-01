/* eslint-env jest */

import getCauseImpactMetricCount from '../getCauseImpactMetricCount'
import { getMockUserContext, getMockCauseInstance } from '../../test-utils'
import getGroupImpactMetricForCause from '../getGroupImpactMetricForCause'
import CauseImpactMetricCount from '../CauseImpactMetricCountModel'

jest.mock('../CauseImpactMetricCountModel')
jest.mock('../getGroupImpactMetricForCause')

const mockCause = getMockCauseInstance()
const userContext = getMockUserContext()
const mockGroupImpactMetric = {
  id: 'abc',
  causeId: mockCause.id,
  impactMetricId: '12345',
  dollarProgress: 1000,
  dollarGoal: 10000,
}
const mockCauseImpactCount = {
  count: 5,
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('getCauseImpactMetricCount', () => {
  it('returns null if fetching group impact metric returns null', async () => {
    expect.assertions(1)
    getGroupImpactMetricForCause.mockResolvedValue(null)

    expect(await getCauseImpactMetricCount(userContext, mockCause.id)).toEqual(
      null
    )
  })

  it('returns null if fetching count entity returns null', async () => {
    expect.assertions(1)
    getGroupImpactMetricForCause.mockResolvedValue(mockGroupImpactMetric)

    CauseImpactMetricCount.getOrNull.mockResolvedValue(null)
    expect(await getCauseImpactMetricCount(userContext, mockCause.id)).toEqual(
      null
    )
  })

  it('returns count value if proper entities are present', async () => {
    expect.assertions(1)
    getGroupImpactMetricForCause.mockResolvedValue(mockGroupImpactMetric)

    CauseImpactMetricCount.getOrNull.mockResolvedValue(mockCauseImpactCount)
    expect(await getCauseImpactMetricCount(userContext, mockCause.id)).toEqual(
      5
    )
  })
})
