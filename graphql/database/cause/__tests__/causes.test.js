/* eslint-env jest */

jest.mock('../causes/SGa6zohkY/causeData', () => {
  const module = {
    // Can spy on getters:
    // https://jestjs.io/docs/jest-object#jestspyonobject-methodname-accesstype
    __esModule: true,
    get default() {
      return jest.requireActual('../causes/SGa6zohkY/causeData').default
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
    const expectedShape = {
      id: expect.any(String),
      charityId: expect.any(String),
      landingPagePath: expect.any(String),
      impactVisits: expect.any(Number),
      impact: {
        impactCounterText: expect.any(String),
        referralRewardTitle: expect.any(String),
        referralRewardSubtitle: expect.any(String),
        claimImpactTitle: expect.any(String),
        claimImpactSubtitle: expect.any(String),
        newlyReferredTitle: expect.any(String),
        impactWalkthroughText: expect.any(String),
        confirmImpactText: expect.any(String),
      },
      theme: {
        primaryColor: expect.any(String),
        secondayColor: expect.any(String),
      },
      squads: {
        squadCounterText: expect.any(String),
        currentMissionSummary: expect.any(String),
        currentMissionDetails: expect.any(String),
        currentMissionAlert: expect.any(String),
        currentMissionStep2: expect.any(String),
        currentMissionStep3: expect.any(String),
        missionCompleteAlert: expect.any(String),
        missionCompleteDescription: expect.any(String),
        missionCompleteSubtitle: expect.any(String),
        impactCounterText: expect.any(String),
      },
      onboarding: {
        steps: [],
        firstTabIntroDescription: 'firstTabIntroDescription',
      },
    }
    expect(causes[0]).toEqual(expect.objectContaining(expectedShape))
  })

  it('throws if provided data fails CauseModel schema validation2', () => {
    const dataModule = require('../causes/SGa6zohkY/causeData')
    jest.spyOn(dataModule, 'default', 'get').mockImplementation(() => {
      const realData = jest.requireActual('../causes/SGa6zohkY/causeData')
        .default
      const brokenData = {
        ...realData,
        id: 123,
        impactVisits: null,
      }
      return brokenData
    })
    expect(() => require('../causes').default).toThrow(
      'child "id" fails because ["id" must be a string]. child "impactVisits" fails because ["impactVisits" is required]'
    )
  })
})
