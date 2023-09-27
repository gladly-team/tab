/* eslint-env jest */

import getGroupImpactMetricForCause from '../getGroupImpactMetricForCause'
import {
  DatabaseItemDoesNotExistException,
  UserDoesNotExistException,
} from '../../../utils/exceptions'
import CauseGroupImpactMetricModel from '../CauseGroupImpactMetricModel'
import GroupImpactMetricModel from '../GroupImpactMetricModel'
import { getMockUserContext, getMockCauseInstance } from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../CauseGroupImpactMetricModel')
jest.mock('../GroupImpactMetricModel')

const mockCause = getMockCauseInstance()
const userContext = getMockUserContext()
const mockCauseGroupImpactMetric = {
  causeId: mockCause.id,
  groupImpactMetricId: 'test-metric-id',
}

const mockGroupImpactMetric = {
  id: mockCauseGroupImpactMetric.id,
  causeId: mockCause.id,
  impactMetricId: '12345',
  dollarProgress: 1000,
  dollarGoal: 10000,
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('getGroupImpactMetricForCause', () => {
  it('throws if fetching CauseGroupImpactMetric has unexpected error', async () => {
    expect.assertions(1)
    CauseGroupImpactMetricModel.get.mockImplementation(() => {
      throw new UserDoesNotExistException()
    })
    expect(
      getGroupImpactMetricForCause(userContext, mockCause.id)
    ).rejects.toThrow(new UserDoesNotExistException())
  })

  it('returns null if CauseGroupImpactMetric does not exist', async () => {
    expect.assertions(1)
    CauseGroupImpactMetricModel.get.mockImplementation(() => {
      throw new DatabaseItemDoesNotExistException()
    })
    expect(
      await getGroupImpactMetricForCause(userContext, mockCause.id)
    ).toEqual(null)
  })

  it('returns null if GroupImpactMetricModel does not exist', async () => {
    expect.assertions(1)
    CauseGroupImpactMetricModel.get.mockResolvedValue(
      mockCauseGroupImpactMetric
    )
    GroupImpactMetricModel.get.mockImplementation(() => {
      throw new DatabaseItemDoesNotExistException()
    })
    expect(
      await getGroupImpactMetricForCause(userContext, mockCause.id)
    ).toEqual(null)
  })

  it('fetches GroupImpactMetric with key from CauseGroupImpactMetric', async () => {
    expect.assertions(2)
    CauseGroupImpactMetricModel.get.mockResolvedValue(
      mockCauseGroupImpactMetric
    )
    GroupImpactMetricModel.get.mockResolvedValue(mockGroupImpactMetric)
    expect(
      await getGroupImpactMetricForCause(userContext, mockCause.id)
    ).toEqual(mockGroupImpactMetric)
    expect(GroupImpactMetricModel.get).toHaveBeenCalledWith(
      userContext,
      mockCauseGroupImpactMetric.groupImpactMetricId
    )
  })
})
