/* eslint-env jest */

jest.mock('../impactMetricData', () => {
  const module = {
    // Can spy on getters:
    // https://jestjs.io/docs/jest-object#jestspyonobject-methodname-accesstype
    __esModule: true,
    get default() {
      return jest.requireActual('../impactMetricData').default
    },
  }
  return module
})

afterEach(() => {
  jest.resetAllMocks()
  jest.resetModules()
})

describe('impactMetrics', () => {
  it('returns an array', () => {
    const impactMetrics = require('../impactMetrics').default
    expect(impactMetrics).toBeInstanceOf(Array)
  })

  it('returns an object with the expected shape', () => {
    const impactMetrics = require('../impactMetrics').default
    const causeSubset = {
      id: expect.any(String),
      charityId: expect.any(String),
      dollarAmount: expect.any(Number),
      // ... other fields here
    }
    expect(impactMetrics[0]).toMatchObject(expect.objectContaining(causeSubset))
  })

  it('throws if provided data fails CauseModel schema validation', () => {
    const dataModule = require('../impactMetricData')
    jest.spyOn(dataModule, 'default', 'get').mockImplementation(() => {
      const realData = jest.requireActual('../impactMetricData').default
      const brokenData = [
        {
          ...realData[0],
          id: 123,
          charityId: null,
        },
      ]
      return brokenData
    })
    expect(() => require('../impactMetrics').default).toThrow(
      'child "id" fails because ["id" must be a string]. child "charityId" fails because ["charityId" must be a string'
    )
  })
})
