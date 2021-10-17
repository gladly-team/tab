/* eslint-env jest */
import getCause from '../getCause'
import {
  DatabaseOperation,
  getMockUserContext,
  mockDate,
  setMockDBResponse,
  getMockUserInstance,
  getMockCauseInstance,
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../../globals/globals')

const userContext = getMockUserContext()
const mockCurrentTime = '2017-06-22T01:13:28.000Z'

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true,
  })
})

const userId = userContext.id

describe('getUserImpact', () => {
  it('gets the user cause mapped to cause id on user', async () => {
    const mockUser = getMockUserInstance({ causeId: 'mock-cause-id' })
    const mockCause = getMockCauseInstance({
      id: 'mock-cause-id',
      charityId: 'mock-charity-id',
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockCause,
    })
    const cause = await getCause(userContext, userId)
    expect(cause).toEqual({
      charityId: 'mock-charity-id',
      id: 'mock-cause-id',
      impact: {
        claimImpactSubtitle: 'claimImpactSubtitle',
        claimImpactTitle: 'claimImpactTitle',
        confirmImpactText: 'confirmImpactText',
        impactCounterText: 'impactCounterText',
        impactWalkthroughText: 'impactWalkthroughText',
        newlyReferredTitle: 'newlyReferredTitle',
        referralRewardSubtitle: 'referralRewardSubtitle',
        referralRewardTitle: 'referralRewardTitle',
      },
      impactVisits: 10,
      landingPagePath: '/test',
      onboarding: {
        firstTabIntroDescription: 'firstTabIntroDescription',
        steps: [],
      },
      squads: {
        currentMissionAlert: 'currentMissionAlert',
        currentMissionDetails: 'currentMissionDetails',
        currentMissionStep2: 'currentMissionStep2',
        currentMissionStep3: 'currentMissionStep3',
        currentMissionSummary: 'currentMissionSummary',
        impactCounterText: 'impactCounterText',
        missionCompleteAlert: 'missionCompleteAlert',
        missionCompleteDescription: 'missionCompleteDescription',
        missionCompleteSubtitle: 'missionCompleteSubtitle',
        squadCounterText: 'squadCounterText',
      },
      theme: {
        primaryColor: '#5094FB',
        secondayColor: '#29BEBA',
      },
    })
  })
})
