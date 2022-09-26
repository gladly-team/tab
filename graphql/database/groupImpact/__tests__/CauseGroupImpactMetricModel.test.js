/* eslint-env jest */
import CauseGroupImpactMetric from '../CauseGroupImpactMetricModel'
import { permissionAuthorizers } from '../../../utils/authorization-helpers'

describe('CauseGroupImpactMetricModel', () => {
  it('implements the name property', () => {
    expect(CauseGroupImpactMetric.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(CauseGroupImpactMetric.hashKey).toBeDefined()
  })

  it('constructs as expected with default values', () => {
    const item = Object.assign(
      {},
      new CauseGroupImpactMetric({
        causeId: 'CA6A5C2uj',
        groupImpactMetricId: 'test',
      })
    )
    expect(item).toEqual({
      causeId: 'CA6A5C2uj',
      groupImpactMetricId: 'test',
    })
  })

  it('has the correct get permission', () => {
    expect(CauseGroupImpactMetric.permissions.get).toEqual(
      permissionAuthorizers.allowAll
    )
  })
})
