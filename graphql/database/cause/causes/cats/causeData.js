// Cause: cats
import about from './about.md'
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
import socialTitle from './social.title.md'
import socialSubtitle from './social.subtitle.md'

const data = {
  id: 'CA6A5C2uj',
  about,
  backgroundImageCategory: 'cats',
  charityId: '6ce5ad8e-7dd4-4de5-ba4f-13868e7d212z', // Greater Good
  impactVisits: 14,
  landingPagePath: '/cats/',
  slug: 'cats',
  impact: {
    claimImpactSubtitle,
    confirmImpactSubtitle,
    impactCounterText,
    impactIcon: 'paw',
    impactWalkthroughText,
    newlyReferredImpactWalkthroughText,
    referralRewardNotification,
    referralRewardSubtitle,
    referralRewardTitle,
    walkMeGif: 'cats.gif',
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
  sharing: {
    facebookButtonTitle:
      'I just found, purr-haps, the most claw-ver browser extension ever! With Tab for a Cause’s latest project, Tab for Cats, I can give a cat a treat to a shelter cat for positive reinforcement training everytime I open a new tab. Check it out:',
    imgCategory: 'cats',
    redditButtonTitle:
      'Looking for the purr-fect way to help shelter cats get adopted? Check out Tab for Cats!',
    sendgridEmailTemplateId: 'd-69707bd6c49a444fa68a99505930f801',
    subtitle: socialSubtitle,
    title: socialTitle,
    tumblrCaption:
      'Every time I open a new tab I am able to give a treat to a cat for positive reinforcement training with Tab for a Cause’s latest project, Tab for a Cats! Download it for free with my link and give 10 treats right away!',
    tumblrTitle:
      'Want to make a paw-sitive impact? Help give shelter cats a new chance for a forever home!',
    twitterButtonTitle:
      'I just found the purr-fect new way to help shelter cats get adopted! All I had to do was open a new browser tab (with super cute cat pictures!) on Tab for Cats! Check it out:',
  },
  squads: {
    // TODO
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
    squadInviteTemplateId: 'd-cc8834e9b4694194b575ea60f5ea8230',
  },
  theme: {
    primaryColor: '#9d4ba3', // purple
    secondaryColor: '#29BEBA',
  },
}

export default data
