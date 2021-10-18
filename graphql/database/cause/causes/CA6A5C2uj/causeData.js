// Cause: cats

import { join } from 'path'
import { readFileSync } from 'fs'

const getFileContents = fileName =>
  readFileSync(join(__dirname, fileName), 'utf-8')

const data = {
  id: 'CA6A5C2uj',
  charityId: 'TODO',
  landingPagePath: '/cats',
  impactVisits: 14,
  impact: {
    impactCounterText: getFileContents('./impact.impactCounterText.md'),
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
}

export default data
