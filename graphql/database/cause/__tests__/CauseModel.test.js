/* eslint-env jest */

import tableNames from '../../tables'
import Cause from '../CauseModel'
import {
  DatabaseOperation,
  mockDate,
  setMockDBResponse,
} from '../../test-utils'
import {
  getPermissionsOverride,
  CAUSES_OVERRIDE,
} from '../../../utils/permissions-overrides'

const override = getPermissionsOverride(CAUSES_OVERRIDE)

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
    expect(Cause.tableName).toBe(tableNames.causes)
  })

  it('does not throw an error when a `get` returns an item', () => {
    const mockItemId = '123456789'
    // Set mock response from DB client. Just setting a dummy object.
    setMockDBResponse(DatabaseOperation.GET, {
      Item: {
        id: '123456789',
      },
    })

    return expect(Cause.get(override, mockItemId)).resolves.toBeDefined()
  })

  it('constructs as expected with default values', () => {
    const item = Object.assign(
      {},
      new Cause({
        id: '123456789',
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
