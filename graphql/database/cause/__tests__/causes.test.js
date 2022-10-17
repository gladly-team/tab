/* eslint-env jest */
import dataGlobalHealth from '../causes/globalHealth/causeData'

jest.mock('../../../utils/feature-flags')
jest.mock('../causes/teamseas/causeData', () => {
  const module = {
    // Can spy on getters:
    // https://jestjs.io/docs/jest-object#jestspyonobject-methodname-accesstype
    __esModule: true,
    get default() {
      return jest.requireActual('../causes/teamseas/causeData').default
    },
  }
  return module
})

afterEach(() => {
  jest.resetAllMocks()
  jest.resetModules()
})

describe('causes', () => {
  it('returns an array', () => {
    const causes = require('../causes').default
    expect(causes).toBeInstanceOf(Array)
  })

  it('returns an item with the expected Cause shape', () => {
    const causes = require('../causes').default
    const causeSubset = {
      id: expect.any(String),
      charityId: expect.any(String),
      landingPagePath: expect.any(String),
      impactType: expect.any(String),
      // ... other fields here
    }
    expect(causes[0]).toMatchObject(expect.objectContaining(causeSubset))
  })

  it('throws if provided data fails CauseModel schema validation', () => {
    const dataModule = require('../causes/teamseas/causeData')
    jest.spyOn(dataModule, 'default', 'get').mockImplementation(() => {
      const realData = jest.requireActual('../causes/teamseas/causeData')
        .default
      const brokenData = {
        ...realData,
        id: 123,
        impactType: null,
      }
      return brokenData
    })
    expect(() => require('../causes').default).toThrow(
      'child "id" fails because ["id" must be a string]. child "impactType" fails because ["impactType" is required]'
    )
  })

  // Todo, genericize if we have more custom per-cause logic
  it('overrides the impactType for the global health cause', () => {
    const {
      isGlobalHealthGroupImpactEnabled,
    } = require('../../../utils/feature-flags')
    isGlobalHealthGroupImpactEnabled.mockReturnValue(true)
    const causes = require('../causes').default
    const globalHealthCause = causes.find(
      cause => cause.id === dataGlobalHealth.id
    )
    expect(isGlobalHealthGroupImpactEnabled).toHaveBeenCalled()
    expect(globalHealthCause.impactType).toEqual('group')
  })
})
