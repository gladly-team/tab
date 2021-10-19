// Cause: teamseas

import fileContentsReader from '../../fileContentsReader'

const SLUG = 'teamseas'
const getContents = fileContentsReader(SLUG)

const data = {
  id: 'SGa6zohkY',
  charityId: 'TODO',
  impactVisits: 10,
  landingPagePath: '/teamseas/',
  slug: SLUG,
  impact: {
    claimImpactSubtitle: getContents('./impact.claimImpactSubtitle.md'),
    confirmImpactSubtitle: getContents('./impact.confirmImpactSubtitle.md'),
    impactCounterText: getContents('./impact.impactCounterText.md'),
    impactIcon: 'jellyfish',
    impactWalkthroughText: getContents('./impact.impactWalkthroughText.md'),
    newlyReferredImpactWalkthroughText: getContents(
      './impact.newlyReferredImpactWalkthroughText.md'
    ),
    referralRewardNotification: getContents(
      './impact.referralRewardNotification.md'
    ),
    referralRewardSubtitle: getContents('./impact.referralRewardSubtitle.md'),

    // TODO: add template to include the # of people recruited.
    //   "You recruited X friend[s] to..."
    referralRewardTitle: getContents('./impact.referralRewardTitle.md'),
    walkMeGif: 'dolphin.gif',
  },
  onboarding: {
    firstTabIntroDescription: 'TODO',
    steps: [
      {
        title: 'TODO',
        subtitle: 'TODO',
        imgName: 'TODO',
      },
    ],
  },
  sharing: {
    facebookButtonTitle: 'TODO',
    imgCategory: 'TODO',
    redditButtonTitle: 'TODO',
    sendgridEmailTemplateId: 'TODO',
    subtitle: 'TODO',
    title: 'TODO',
    tumblrCaption: 'TODO',
    tumblrTitle: 'TODO',
    twitterButtonTitle: 'TODO',
  },
  squads: {
    currentMissionAlert: 'TODO',
    currentMissionDetails: 'TODO',
    currentMissionStep2: 'TODO',
    currentMissionStep3: 'TODO',
    currentMissionSummary: 'TODO',
    impactCounterText: 'TODO',
    missionCompleteAlert: 'TODO',
    missionCompleteDescription: 'TODO',
    missionCompleteSubtitle: 'TODO',
    squadCounterText: 'TODO',
  },
  theme: {
    primaryColor: '#9d4ba3', // purple
    secondaryColor: '#29BEBA',
  },
}

export default data
