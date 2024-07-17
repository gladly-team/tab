// Cause: Democracy
import about from './about.md'
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
  id: 'n7XpTlKgY',
  about,
  name: 'Democracy',
  nameForShop: 'Democracy',
  isAvailableToSelect: true,
  icon: 'vote',
  backgroundImageCategory: 'black-photographers',
  charityId: 'c3f24359-5b91-4721-a938-41d9c8f4e5b0', // VoteAmerica charity id
  individualImpactEnabled: false, // Deprecated. Use "impactType".
  impactType: 'none',
  impactVisits: null,
  landingPagePath: '/democracy/',
  landingPagePhrase: 'This tab supports Democracy',
  slug: 'democracy',
  onboarding: {
    steps: [
      {
        title: onboardingTitle1,
        subtitle: onboardingSubtitle1,
        imgName: 'blackEquity/blackEquity1.svg',
      },
      {
        title: onboardingTitle2,
        subtitle: onboardingSubtitle2,
        imgName: 'blackEquity/blackEquity2.svg',
      },
      {
        title: onboardingTitle3,
        subtitle: onboardingSubtitle3,
        imgName: 'blackEquity/blackEquity3.svg',
      },
    ],
  },
  sharing: {
    facebookButtonTitle:
      'I joined Tab for Democracy, and now every tab I open helps raise money for VoteAmerica. Check it out - it’s free!',
    imgCategory: 'blackEquity',
    shareImage: 'blackEquity/blackEquityEmailInvite.svg',
    sentImage: 'blackEquity/blackEquityEmailInvite.svg',
    redditButtonTitle: 'Support VoteAmerica with each tab',
    email: {
      image:
        'https://prod-tab2017-media.gladly.io/img/cause/blackEquity/emailInviteBlackEquity.jpg',
      title:
        'We all have a part to play in keeping our democracy healthy. That’s why {{name}} thinks you should join them on Tab for Democracy',
      about: emailAbout,
      sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
      faq: 'We’re supporting VoteAmerica to ensure the money raised will directly support increasing voter turnout and diversifying the voices in our democracy.',
    },
    sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    subtitle: socialSubtitle,
    title: socialTitle,
    tumblrCaption:
      'I joined Tab for Democracy, and now every tab I open helps raise money for VoteAmerica. Check it out - it’s free!',
    tumblrTitle: 'Help support our democracy through VoteAmerica with each tab',
    twitterButtonTitle:
      'I joined Tab for Democracy, and now every tab I open helps raise money for VoteAmerica. Check it out - it’s free!',
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
    primaryColor: '#A27DF8', // purple
    secondaryColor: '#29BEBA',
  },
}

export default data
