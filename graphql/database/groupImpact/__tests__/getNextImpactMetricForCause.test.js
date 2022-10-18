/* eslint-env jest */

import getNextImpactMetricForCause from '../getNextImpactMetricForCause'
import dataGlobalHealth from '../../cause/causes/globalHealth/causeData'

jest.mock('../impactMetricRepository')

const mockImpactMetric = {
  id: 'abcd',
}

beforeEach(() => {
  jest.useFakeTimers()
})

describe('getNextImpactMetricForCause', () => {
  it('throws if cause is not global health', async () => {
    expect(() => {
      getNextImpactMetricForCause('whatever')
    }).toThrow(new Error('No Impact Metric can be selected for this causeId'))
  })

  it('returns appropriate if CauseGroupImpactMetric does not exist', async () => {
    const { getImpactMetricById } = require('../impactMetricRepository')
    getImpactMetricById.mockReturnValue(mockImpactMetric)

    expect(getNextImpactMetricForCause(dataGlobalHealth.id)).toEqual(
      mockImpactMetric
    )
    expect(getImpactMetricById).toHaveBeenCalled()
  })
})
