/* eslint-env jest */
import { DatabaseItemDoesNotExistException } from '../../../utils/exceptions'
import getFeature from '../../experiments/getFeature'

const mockImpactMetrics = [
  {
    id: 'nQUobFEFe',
    charityId: 'charity2',
    dollarAmount: 25e6,
    description: 'This is a test impact metric.',
    metricTitle: '1 impact',
    impactTitle: 'Provide 1 impact',
    active: false,
  },
  {
    id: 'Tv3oKS10j',
    charityId: 'charity1',
    dollarAmount: 25e6,
    description: 'This is a test impact metric.',
    metricTitle: '2 impact',
    impactTitle: 'Provide 2 impact',
    active: false,
  },
  {
    id: 'nyXGkP6vB',
    charityId: 'charity2',
    dollarAmount: 25e6,
    description: 'This is a test impact metric.',
    metricTitle: '3 impact',
    impactTitle: 'Provide 3 impact',
    active: false,
  },
  {
    id: 'n2CoeDNMU',
    charityId: 'charity3',
    dollarAmount: 25e6,
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

jest.mock('../../experiments/getFeature')

beforeEach(() => {
  getFeature.mockReturnValue({
    featureName: 'reduced-impact-cost',
    variation: false,
    inExperiment: false,
  })
})

describe('impactMetricRepository', () => {
  test('getImpactMetricById throws if impactMetric doesnt exist', () => {
    const { getImpactMetricById } = require('../impactMetricRepository')
    expect(() => getImpactMetricById('non-existent-id')).toThrow(
      new DatabaseItemDoesNotExistException()
    )
  })

  test('getImpactMetricById returns cause metric', () => {
    const { getImpactMetricById } = require('../impactMetricRepository')
    expect(getImpactMetricById('nyXGkP6vB')).toEqual(mockImpactMetrics[2])
  })

  test('getImpactMetricsByCharityId returns empty list if none applicable', () => {
    const { getImpactMetricsByCharityId } = require('../impactMetricRepository')
    expect(getImpactMetricsByCharityId('fake-charity-id')).toEqual([])
  })

  test('getImpactMetricsByCharityId fetches appropriate impact metrics', () => {
    const { getImpactMetricsByCharityId } = require('../impactMetricRepository')
    expect(getImpactMetricsByCharityId('charity2')).toEqual([
      mockImpactMetrics[0],
      mockImpactMetrics[2],
    ])
  })

  test('getImpactMetricById does not modify the dollarAmount by default', () => {
    const { getImpactMetricById } = require('../impactMetricRepository')
    expect(getImpactMetricById('nyXGkP6vB').dollarAmount).toEqual(25e6)
  })

  test('getImpactMetricById does modifies the dollarAmount if the feature is enabled', () => {
    getFeature.mockReturnValue({
      featureName: 'reduced-impact-cost',
      variation: true,
      inExperiment: false,
    })
    const { getImpactMetricById } = require('../impactMetricRepository')
    expect(getImpactMetricById('nyXGkP6vB').dollarAmount).toEqual(0.25e5)
  })

  test('getImpactMetricsByCharityId does not modify the dollarAmount by default', () => {
    const { getImpactMetricsByCharityId } = require('../impactMetricRepository')
    expect(getImpactMetricsByCharityId('charity2')[1].dollarAmount).toEqual(
      25e6
    )
  })

  test('getImpactMetricsByCharityId does modifies the dollarAmount if the feature is enabled', () => {
    getFeature.mockReturnValue({
      featureName: 'reduced-impact-cost',
      variation: true,
      inExperiment: false,
    })
    const { getImpactMetricsByCharityId } = require('../impactMetricRepository')
    expect(getImpactMetricsByCharityId('charity2')[1].dollarAmount).toEqual(
      0.25e5
    )
  })
})
