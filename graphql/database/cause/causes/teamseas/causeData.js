// Cause: teamseas
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
  id: 'SGa6zohkY',
  charityId: 'TODO', // TODO
  impactVisits: 10,
  backgroundImageCategory: 'seas',
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

    // TODO: add template to include the # of people recruited.
    //   "You recruited X friend[s] to..."
    referralRewardTitle,
    walkMeGif: 'dolphin.gif',
  },
  onboarding: {
    firstTabIntroDescription: 'TODO',
    steps: [
      {
        title: onboardingTitle1,
        subtitle: onboardingSubtitle1,
        imgName: 'seas1',
      },
      {
        title: onboardingTitle2,
        subtitle: onboardingSubtitle2,
        imgName: 'seas2',
      },
      {
        title: onboardingTitle3,
        subtitle: onboardingSubtitle3,
        imgName: 'seas3',
      },
    ],
  },

  // TODO Extra, change facebookButtonTitle if revised
  sharing: {
    facebookButtonTitle:
      'Changing the world for the better is a team effort, that is why I downloaded Tab for #TeamSeas. Every time I open a new tab, I raise money to help clean up trash from the water around the world. Check it out - it’s free!',
    imgCategory: 'seas',
    redditButtonTitle:
      'Surf the web and clean up our ocean, rivers, and lakes with Tab for #TeamSeas',
    sendgridEmailTemplateId: 'd-ff97cd972da342a6a208f09235671479',
    subtitle: socialSubtitle,
    title: socialTitle,
    tumblrCaption:
      'Every time I open a new tab I am helping clean up our planet through Tab for #TeamSeas. Download it for free with my link and automatically help remove 5 plastic bottles worth of trash from oceans, rivers, and lakes around the world.',
    tumblrTitle: 'Save the planet while surfing the web on Tab for #TeamSeas!',
    twitterButtonTitle:
      'Making a positive change is a group effort. That is exactly why I am doing my part with Tab for #TeamSeas. Every time I open a new tab, I raise money to help clean up trash from the water around the world. Check it out - it’s free!',
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
    squadInviteTemplateId: 'TODO',
  },
  theme: {
    primaryColor: '#5094FB', // blue
    secondaryColor: '#29BEBA',
  },
}

export default data
