// Cause: cats
import fileContentsReader from '../../fileContentsReader'

const SLUG = 'cats'
const getContents = fileContentsReader(SLUG)

const data = {
  id: 'CA6A5C2uj',
  charityId: '6ce5ad8e-7dd4-4de5-ba4f-13868e7d212z', // Greater Good
  impactVisits: 14,
  landingPagePath: '/cats/',
  slug: SLUG,

  // TODO: set all copy
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

    // TODO: update
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

  // TODO
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
