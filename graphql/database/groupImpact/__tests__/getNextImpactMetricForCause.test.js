/* eslint-env jest */

import getNextImpactMetricForCause from '../getNextImpactMetricForCause'
import dataGlobalHealth from '../../cause/causes/globalHealth/causeData'
import dataEndingHunger from '../../cause/causes/endingHunger/causeData'
import dataLgbtq from '../../cause/causes/lgbtq/causeData'
import dataReproductiveHealth from '../../cause/causes/reproductiveHealthCauseData'
import dataSeas from '../../cause/causes/teamseas/causeData'
import dataTrees from '../../cause/causes/trees/causeData'
import dataUkraine from '../../cause/causes/ukraine/causeData'
import dataCats from '../../cause/causes/cats/causeData'

jest.mock('../impactMetricRepository')

const mockImpactMetric = {
  id: 'abcd',
}

beforeEach(() => {
  jest.useFakeTimers()
})

describe('getNextImpactMetricForCause', () => {
  it('throws if cause is not a group impact cause', async () => {
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

  it('returns appropriate impact metric for reproductive health', async () => {
    const { getImpactMetricById } = require('../impactMetricRepository')
    getImpactMetricById.mockReturnValue(mockImpactMetric)

    expect(getNextImpactMetricForCause(dataReproductiveHealth.id)).toEqual(
      mockImpactMetric
    )
    expect(getImpactMetricById).toHaveBeenCalled()
  })

  it('returns appropriate impact metric for teamseas', async () => {
    const { getImpactMetricById } = require('../impactMetricRepository')
    getImpactMetricById.mockReturnValue(mockImpactMetric)

    expect(getNextImpactMetricForCause(dataSeas.id)).toEqual(mockImpactMetric)
    expect(getImpactMetricById).toHaveBeenCalled()
  })

  it('returns appropriate impact metric for trees', async () => {
    const { getImpactMetricById } = require('../impactMetricRepository')
    getImpactMetricById.mockReturnValue(mockImpactMetric)

    expect(getNextImpactMetricForCause(dataTrees.id)).toEqual(mockImpactMetric)
    expect(getImpactMetricById).toHaveBeenCalled()
  })

  it('returns appropriate impact metric for ukraine', async () => {
    const { getImpactMetricById } = require('../impactMetricRepository')
    getImpactMetricById.mockReturnValue(mockImpactMetric)

    expect(getNextImpactMetricForCause(dataUkraine.id)).toEqual(
      mockImpactMetric
    )
    expect(getImpactMetricById).toHaveBeenCalled()
  })

  it('returns appropriate impact metric for ukraine', async () => {
    const { getImpactMetricById } = require('../impactMetricRepository')
    getImpactMetricById.mockReturnValue(mockImpactMetric)

    expect(getNextImpactMetricForCause(dataCats.id)).toEqual(mockImpactMetric)
    expect(getImpactMetricById).toHaveBeenCalled()
  })
})
