// Cause: teamseas

import { fileGetter } from '../../utils'

const ID = 'SGa6zohkY'
const getContents = fileGetter(ID)

const data = {
  id: ID,
  charityId: 'TODO',
  landingPagePath: '/teamseas',
  impactVisits: 10,
  impact: {
    impactCounterText: getContents('./impact.impactCounterText.md'),
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
