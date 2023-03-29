/* eslint-env jest */

import getNextImpactMetricForCause from '../getNextImpactMetricForCause'
import dataGlobalHealth from '../../cause/causes/globalHealth/causeData'
import dataEndingHunger from '../../cause/causes/endingHunger/causeData'
import dataLgbtq from '../../cause/causes/lgbtq/causeData'

jest.mock('../impactMetricRepository')

const mockImpactMetric = {
  id: 'abcd',
}

beforeEach(() => {
  jest.useFakeTimers()
})

describe('getNextImpactMetricForCause', () => {
  it('throws if cause is not global health or ending hunger', async () => {
    expect(() => {
      getNextImpactMetricForCause('whatever')
    }).toThrow(new Error('No Impact Metric can be selected for this causeId'))
  })

  it('returns appropriate impact metric for global health', async () => {
    const { getImpactMetricById } = require('../impactMetricRepository')
    getImpactMetricById.mockReturnValue(mockImpactMetric)

    expect(getNextImpactMetricForCause(dataGlobalHealth.id)).toEqual(
      mockImpactMetric
    )
    expect(getImpactMetricById).toHaveBeenCalled()
  })

  it('returns appropriate impact metric for ending hunger', async () => {
    const { getImpactMetricById } = require('../impactMetricRepository')
    getImpactMetricById.mockReturnValue(mockImpactMetric)

    expect(getNextImpactMetricForCause(dataEndingHunger.id)).toEqual(
      mockImpactMetric
    )
    expect(getImpactMetricById).toHaveBeenCalled()
  })

  it('returns appropriate impact metric for lgbtq', async () => {
    const { getImpactMetricById } = require('../impactMetricRepository')
    getImpactMetricById.mockReturnValue(mockImpactMetric)

    expect(getNextImpactMetricForCause(dataLgbtq.id)).toEqual(mockImpactMetric)
    expect(getImpactMetricById).toHaveBeenCalled()
  })
})
