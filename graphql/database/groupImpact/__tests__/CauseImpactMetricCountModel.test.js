/* eslint-env jest */
import CauseImpactMetricCount from '../CauseImpactMetricCountModel'
import { permissionAuthorizers } from '../../../utils/authorization-helpers'

describe('CauseImpactMetricCountModel', () => {
  it('implements the name property', () => {
    expect(CauseImpactMetricCount.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(CauseImpactMetricCount.hashKey).toBeDefined()
  })

  it('constructs as expected with default values', () => {
    const item = Object.assign(
      {},
      new CauseImpactMetricCount({
        id: 'CA6A5C2uj_test',
        causeId: 'CA6A5C2uj',
        impactMetricId: 'test',
      })
    )
    expect(item).toEqual({
      id: 'CA6A5C2uj_test',
      causeId: 'CA6A5C2uj',
      impactMetricId: 'test',
      count: 0,
    })
  })

  it('has the correct get permission', () => {
    expect(CauseImpactMetricCount.permissions.get).toEqual(
      permissionAuthorizers.allowAll
    )
  })
})
