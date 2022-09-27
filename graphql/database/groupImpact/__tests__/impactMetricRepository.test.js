/* eslint-env jest */
import { DatabaseItemDoesNotExistException } from '../../../utils/exceptions'
import getCause from '../../cause/getCause'
import {
  getMockCauseInstance,
} from '../../test-utils'

const mockImpactMetrics = [
  {
    id: 'nQUobFEFe',
    charityId: 'charity2',
    dollarAmount: 1000,
    description: 'This is a test impact metric.',
    metricTitle: '1 impact',
    impactTitle: 'Provide 1 impact',
    active: false,
  },
  {
    id: 'Tv3oKS10j',
    charityId: 'charity1',
    dollarAmount: 1000,
    description: 'This is a test impact metric.',
    metricTitle: '2 impact',
    impactTitle: 'Provide 2 impact',
    active: false,
  },
  {
    id: 'nyXGkP6vB',
    charityId: 'charity2',
    dollarAmount: 1000,
    description: 'This is a test impact metric.',
    metricTitle: '3 impact',
    impactTitle: 'Provide 3 impact',
    active: false,
  },
  {
    id: 'n2CoeDNMU',
    charityId: 'charity3',
    dollarAmount: 1000,
    description: 'This is a test impact metric.',
    metricTitle: '4 impact',
    impactTitle: 'Provide 4 impact',
    active: false,
  },
]

const MOCK_CAUSE_1 = {
  id: 'abc123',
  charityId: 'charity2',
  landingPagePath: '/foo',
}

jest.mock('../../cause/getCause')
jest.mock('../impactMetrics', () => {
  const module = {
    // Can spy on getters:
    // https://jestjs.io/docs/jest-object#jestspyonobject-methodname-accesstype
    __esModule: true,
    get default() {
      return mockImpactMetrics
    },
  }
  return module
})

describe('impactMetricRepository', () => {
  it('getImpactMetricById throws if impactMetric doesnt exist', () => {
    const { getImpactMetricById, getImpactMetricsByCauseId } = require('../impactMetricRepository')
    expect(() => getImpactMetricById('non-existent-id')).toThrow(
      new DatabaseItemDoesNotExistException()
    )
  })

  it('getImpactMetricById returns cause metric', () => {
    const { getImpactMetricById } = require('../impactMetricRepository')
    expect(getImpactMetricById('nyXGkP6vB')).toEqual(mockImpactMetrics[2])
  })

  it('getImpactMetricsByCharityId returns empty list if none applicable', () => {
    const { getImpactMetricsByCharityId } = require('../impactMetricRepository')
    expect(getImpactMetricsByCharityId('fake-charity-id')).toEqual([])
  })

  it('getImpactMetricsByCharityId fetches appropriate impact metrics', () => {
    const { getImpactMetricsByCharityId } = require('../impactMetricRepository')
    expect(getImpactMetricsByCharityId('charity2')).toEqual([
      mockImpactMetrics[0],
      mockImpactMetrics[2],
    ])
  })

  it('getImpactMetricsByCauseId throws if cause does not exist', async () => {
    expect.assertions(1)
    const { getImpactMetricsByCauseId } = require('../impactMetricRepository')
    const error = new Error("test error")
    getCause.mockRejectedValue(error)
    await expect(getImpactMetricsByCauseId('whatever')).rejects.toEqual(error)
  })

  it('getImpactMetricsByCauseId returns appropriate charityIds if cause does not exist', async () => {
    expect.assertions(1)
    const { getImpactMetricsByCauseId } = require('../impactMetricRepository')
    getCause.mockResolvedValue({
      ...getMockCauseInstance(),
      charityId: 'charity2'
    })
    expect(await getImpactMetricsByCauseId('whatever')).toEqual([
      mockImpactMetrics[0],
      mockImpactMetrics[2],
    ])
  })
})
