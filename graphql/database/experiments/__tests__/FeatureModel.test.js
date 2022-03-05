/* eslint-env jest */

import Feature from '../FeatureModel'

describe('FeatureModel', () => {
  it('implements the name property', () => {
    expect(Feature.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(Feature.hashKey).toBeDefined()
  })

  it('implements the tableName property', () => {
    expect(Feature.tableName).toBe('UNUSED_Features')
  })

  it('constructs as expected', () => {
    const item = Object.assign(
      {},
      new Feature({
        featureName: 'feature-name',
        variation: 'variation-id',
      })
    )
    expect(item).toEqual({
      featureName: 'feature-name',
      variation: 'variation-id',
    })
  })
})
