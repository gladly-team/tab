/* eslint-env jest */

import Cause from '../CauseModel'
import { mockDate } from '../../test-utils'

jest.mock('../../databaseClient')

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('CauseModel', () => {
  it('implements the name property', () => {
    expect(Cause.name).toBeDefined()
  })

  it('implements the hashKey property', () => {
    expect(Cause.hashKey).toBeDefined()
  })

  it('implements the tableName property', () => {
    expect(Cause.tableName).toBe('UNUSED_Causes')
  })

  it('constructs as expected with default values', () => {
    const item = Object.assign(
      {},
      new Cause({
        id: '123456789',
        about: '### Something something',
        charityId: 'abcdefghijklmnop',
        landingPagePath: '/test',
        impactVisits: 10,
        impact: {
          impactCounterText: 'impactCounterText',
          referralRewardTitle: 'referralRewardTitle',
          referralRewardSubtitle: 'referralRewardSubtitle',
          claimImpactTitle: 'claimImpactTitle',
          claimImpactSubtitle: 'claimImpactSubtitle',
          newlyReferredTitle: 'newlyReferredTitle',
          impactWalkthroughText: 'impactWalkthroughText',
          confirmImpactText: 'confirmImpactText',
        },
        theme: {
          primaryColor: '#5094FB',
          secondayColor: '#29BEBA',
        },
        squads: {
          squadCounterText: 'squadCounterText',
          currentMissionSummary: 'currentMissionSummary',
          currentMissionDetails: 'currentMissionDetails',
          currentMissionAlert: 'currentMissionAlert',
          currentMissionStep2: 'currentMissionStep2',
          currentMissionStep3: 'currentMissionStep3',
          missionCompleteAlert: 'missionCompleteAlert',
          missionCompleteDescription: 'missionCompleteDescription',
          missionCompleteSubtitle: 'missionCompleteSubtitle',
          impactCounterText: 'impactCounterText',
        },
        onboarding: {
          steps: [],
          firstTabIntroDescription: 'firstTabIntroDescription',
        },
      })
    )
    expect(item).toEqual({
      id: '123456789',
      about: '### Something something',
      charityId: 'abcdefghijklmnop',
      landingPagePath: '/test',
      impactVisits: 10,
      impact: {
        impactCounterText: 'impactCounterText',
        referralRewardTitle: 'referralRewardTitle',
        referralRewardSubtitle: 'referralRewardSubtitle',
        claimImpactTitle: 'claimImpactTitle',
        claimImpactSubtitle: 'claimImpactSubtitle',
        newlyReferredTitle: 'newlyReferredTitle',
        impactWalkthroughText: 'impactWalkthroughText',
        confirmImpactText: 'confirmImpactText',
      },
      theme: {
        primaryColor: '#5094FB',
        secondayColor: '#29BEBA',
      },
      squads: {
        squadCounterText: 'squadCounterText',
        currentMissionSummary: 'currentMissionSummary',
        currentMissionDetails: 'currentMissionDetails',
        currentMissionAlert: 'currentMissionAlert',
        currentMissionStep2: 'currentMissionStep2',
        currentMissionStep3: 'currentMissionStep3',
        missionCompleteAlert: 'missionCompleteAlert',
        missionCompleteDescription: 'missionCompleteDescription',
        missionCompleteSubtitle: 'missionCompleteSubtitle',
        impactCounterText: 'impactCounterText',
      },
      onboarding: {
        steps: [],
        firstTabIntroDescription: 'firstTabIntroDescription',
      },
    })
  })
})
