// Cause: black equity
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
  id: 'q1FFsAhbV',
  about,
  name: 'Black Equity',
  nameForShop: 'Black Equity',
  isAvailableToSelect: true,
  icon: 'handshake',
  backgroundImageCategory: 'black-photographers',
  charityId: 'b7a78116-9a62-4208-b016-03aae6a3414a', // bail project charity id
  individualImpactEnabled: false, // Deprecated. Use "impactType".
  impactType: 'none',
  impactVisits: null,
  landingPagePath: '/black-equity/',
  landingPagePhrase: 'This tab supports Black empowerment',
  slug: 'black-equity',
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
      'I joined Tab for Black Equity, and now every tab I open helps raise money for Thurgood Marshall College Fund and the Bail Project. Check it out - it’s free!',
    imgCategory: 'blackEquity',
    shareImage: 'blackEquity/blackEquityEmailInvite.svg',
    sentImage: 'blackEquity/blackEquityEmailInvite.svg',
    redditButtonTitle: 'Promote Black equity with each tab',
    email: {
      image:
        'https://prod-tab2017-media.gladly.io/img/cause/blackEquity/emailInviteBlackEquity.jpg',
      title:
        'We all have a part to play in promoting racial equity. That’s why {{name}} thinks you should join them on Tab for Black Equity',
      about: emailAbout,
      sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
      faq: 'We’re supporting The Bail Project and Thurgood Marshall College Fund to ensure the money raised will directly support their goals to make a positive impact on the communities they serve.',
    },
    sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    subtitle: socialSubtitle,
    title: socialTitle,
    tumblrCaption:
      'Every time I open a new tab I am raising money to promote Black equity through Thurgood Marshall College Fund and the Bail Project. Join for free and start making an impact today!',
    tumblrTitle: 'Promote Black equity with each tab',
    twitterButtonTitle:
      'I joined Tab for Black Equity, and now every tab I open helps raise money for Thurgood Marshall College Fund and the Bail Project. Check it out - it’s free:',
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
