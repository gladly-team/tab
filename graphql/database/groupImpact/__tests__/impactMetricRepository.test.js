/* eslint-env jest */
import { DatabaseItemDoesNotExistException } from '../../../utils/exceptions'

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
    const { getImpactMetricById } = require('../impactMetricRepository')
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
})
