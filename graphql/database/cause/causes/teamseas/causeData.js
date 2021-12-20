// Cause: teamseas
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

const data = {
  id: 'SGa6zohkY',
  about,
  name: '#TeamSeas',
  backgroundImageCategory: 'seas',
  charityId: 'f3c349d0-61ab-4301-b3dd-d56895dbbd4e',
  impactVisits: 10,
  landingPagePath: '/teamseas/',
  slug: 'teamseas',
  impact: {
    claimImpactSubtitle,
    confirmImpactSubtitle,
    impactCounterText,
    impactIcon: 'jellyfish',
    impactWalkthroughText,
    newlyReferredImpactWalkthroughText,
    referralRewardNotification,
    referralRewardSubtitle,
    referralRewardTitle,
    walkMeGif: 'seas/dolphin.gif',
  },
  onboarding: {
    steps: [
      {
        title: onboardingTitle1,
        subtitle: onboardingSubtitle1,
        imgName: 'seas/seas1.svg',
      },
      {
        title: onboardingTitle2,
        subtitle: onboardingSubtitle2,
        imgName: 'seas/seas2.svg',
      },
      {
        title: onboardingTitle3,
        subtitle: onboardingSubtitle3,
        imgName: 'seas/seas3.svg',
      },
    ],
  },
  sharing: {
    facebookButtonTitle:
      'I joined Tab for #TeamSeas, and now every tab I open helps clean up our rivers and oceans. Check it out - it’s free!',
    imgCategory: 'seas',
    shareImage: 'seas/seasEmailInvite.svg',
    sentImage: 'seas/seasEmailInvite.svg',
    redditButtonTitle:
      'Clean up our seas with every tab you open, for free, with Tab for #TeamSeas',
    email: {
      image:
        'https://prod-tab2017-media.gladly.io/img/cause/seas/seasEmailInvite.svg',
      title:
        "Life is better with friends... and a clean planet!  That's why {{name}} thinks you should join them on Tab for #TeamSeas.",
      about: emailAbout,
      sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
      faq:
        'We’ve partnered with #TeamSeas to ensure the money raised will support their goal of raising $30 million to remove 30 million pounds of trash to protect and clean up our planet’s oceans, rivers, and lakes.',
    },
    sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    subtitle: socialSubtitle,
    title: socialTitle,
    tumblrCaption:
      "I joined Tab for #TeamSeas, and now every tab I open helps clean up our rivers and oceans. Join in - it's free!",
    tumblrTitle: 'Save the planet while surfing the web on Tab for #TeamSeas!',
    twitterButtonTitle:
      'I joined Tab for #TeamSeas, and now every tab I open helps clean up our rivers and oceans. Check it out - it’s free:',
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
    squadInviteTemplateId: 'TODO',
  },
  theme: {
    primaryColor: '#5094FB', // blue
    secondaryColor: '#29BEBA',
  },
}

export default data
