/* eslint-env jest */

jest.mock('../impactMetrics/reproductiveHealth', () => {
  const module = {
    // Can spy on getters:
    // https://jestjs.io/docs/jest-object#jestspyonobject-methodname-accesstype
    __esModule: true,
    get default() {
      return jest.requireActual('../impactMetrics/reproductiveHealth').default
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
    expect(impactMetrics).toBeInstanceOf(Object)
  })

  it('returns an object with the expected shape', () => {
    const impactMetrics = require('../impactMetrics').default
    const causeSubset = {
      id: expect.any(String),
      causeId: expect.any(String),
      charityId: expect.any(String),
      dollarAmount: expect.any(Number),
      // ... other fields here
    }
    expect(impactMetrics['4mC9rt2rb'][0]).toMatchObject(
      expect.objectContaining(causeSubset)
    )
  })

  it('throws if provided data fails CauseModel schema validation', () => {
    const dataModule = require('../impactMetrics/reproductiveHealth')
    jest.spyOn(dataModule, 'default', 'get').mockImplementation(() => {
      const realData = jest.requireActual('../impactMetrics/reproductiveHealth')
        .default
      const brokenData = {
        causeId: '4mC9rt2rb',
        impactMetrics: [
          {
            ...realData.impactMetrics[0],
            id: 123,
            charityId: null,
          },
        ],
      }
      return brokenData
    })
    expect(() => require('../impactMetrics').default).toThrow(
      'child "id" fails because ["id" must be a string]. child "charityId" fails because ["charityId" must be a string'
    )
  })
})
