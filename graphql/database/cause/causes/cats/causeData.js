// Cause: cats
import claimImpactSubtitle from './impact.claimImpactSubtitle.md'
import confirmImpactSubtitle from './impact.confirmImpactSubtitle.md'
import impactCounterText from './impact.impactCounterText.md'
import impactWalkthroughText from './impact.impactWalkthroughText.md'
import newlyReferredImpactWalkthroughText from './impact.newlyReferredImpactWalkthroughText.md'
import referralRewardNotification from './impact.referralRewardNotification.md'
import referralRewardSubtitle from './impact.referralRewardSubtitle.md'
import referralRewardTitle from './impact.referralRewardTitle.md'
import onboardingSubtitle1 from './onboarding.step1.subtitle.md'
import onboardingSubtitle2 from './onboarding.step2.subtitle.md'
import onboardingSubtitle3 from './onboarding.step3.subtitle.md'
import onboardingTitle1 from './onboarding.step1.title.md'
import onboardingTitle2 from './onboarding.step2.title.md'
import onboardingTitle3 from './onboarding.step3.title.md'

const data = {
  id: 'CA6A5C2uj',
  charityId: '6ce5ad8e-7dd4-4de5-ba4f-13868e7d212z', // Greater Good
  impactVisits: 14,
  landingPagePath: '/cats/',
  slug: 'cats',

  // TODO: set all copy
  impact: {
    claimImpactSubtitle,
    confirmImpactSubtitle,
    impactCounterText,

    // TODO: update
    impactIcon: 'jellyfish',

    impactWalkthroughText,
    newlyReferredImpactWalkthroughText,
    referralRewardNotification,
    referralRewardSubtitle,

    // TODO: add template to include the # of people recruited.
    //   "You recruited X friend[s] to..."
    referralRewardTitle,

    // TODO: update
    walkMeGif: 'dolphin.gif',
  },
  onboarding: {
    firstTabIntroDescription: 'TODO',
    steps: [
      {
        title: onboardingTitle1,
        subtitle: onboardingSubtitle1,
        imgName: 'cattabs',
      },
      {
        title: onboardingTitle2,
        subtitle: onboardingSubtitle2,
        imgName: 'squadcat',
      },
      {
        title: onboardingTitle3,
        subtitle: onboardingSubtitle3,
        imgName: 'adcat',
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
