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
import emailAbout from './social.email.about.md'
import emailFAQ from './social.email.faq.md'

const data = {
  id: 'CA6A5C2uj',
  about,
  name: 'Cats',
  isAvailableToSelect: true,
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
    walkMeGif: 'cats/tickle.gif',
  },
  onboarding: {
    steps: [
      {
        title: onboardingTitle1,
        subtitle: onboardingSubtitle1,
        imgName: 'cats/cattabs.svg',
      },
      {
        title: onboardingTitle2,
        subtitle: onboardingSubtitle2,
        imgName: 'cats/squadcat.svg',
      },
      {
        title: onboardingTitle3,
        subtitle: onboardingSubtitle3,
        imgName: 'cats/adcat.svg',
      },
    ],
  },
  sharing: {
    facebookButtonTitle:
      "I just found, purr-haps, the most claw-ver browser extension ever! With Tab for Cats, I'm helping shelter cats get adopted every time I open a new tab. Check it out - it's free!",
    imgCategory: 'cats',
    shareImage: 'cats/shareCats.png',
    sentImage: 'cats/catsSent.png',
    redditButtonTitle:
      'The purr-fect way to help shelter cats get adopted, for free',
    email: {
      image:
        'https://prod-tab2017-media.gladly.io/img/cause/cats/emailCats.png',
      title:
        "Life is better with friends... and cats!  That's why {{name}} thinks you should join them on Tab for Cats.",
      about: emailAbout,
      sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
      faq: emailFAQ,
    },
    sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    subtitle: socialSubtitle,
    title: socialTitle,
    tumblrCaption:
      "The purr-fect new way to help shelter cats get adopted: open a new browser tab (with super cute cat pictures!) and raise money to support shelter cats. Check it out - it's free!",
    tumblrTitle:
      'Want to make a paw-sitive impact? Help give shelter cats a new chance for a forever home!',
    twitterButtonTitle:
      "The purr-fect new way to help shelter cats get adopted: open a new browser tab (with super cute cat pictures!) and raise money to support shelter cats. Check it out - it's free!",
  },
  // TODO
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
    squadInviteTemplateId: 'd-cc8834e9b4694194b575ea60f5ea8230',
  },
  theme: {
    primaryColor: '#9d4ba3', // purple
    secondaryColor: '#29BEBA',
  },
}

export default data
