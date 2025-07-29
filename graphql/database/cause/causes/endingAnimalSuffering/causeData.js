// Cause: Ending Animal Suffering
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
  id: 'a5f8d2c9e',
  about,
  name: 'Ending Animal Suffering',
  nameForShop: 'Ending Animal Suffering',
  isAvailableToSelect: true,
  icon: 'paw',
  backgroundImageCategory: 'animals',
  charityId: 'e4f8c2d5-5b9a-46f8-b7e3-9d2c7b6a1e4f',
  individualImpactEnabled: false, // Deprecated. Use "impactType".
  impactType: 'none',
  impactVisits: null,
  landingPagePath: '/animals/',
  landingPagePhrase: 'This tab supports Ending Animal Suffering',
  slug: 'ending-animal-suffering',
  onboarding: {
    steps: [
      {
        title: onboardingTitle1,
        subtitle: onboardingSubtitle1,
        imgName: 'animals/animals1.svg',
      },
      {
        title: onboardingTitle2,
        subtitle: onboardingSubtitle2,
        imgName: 'animals/animals2.svg',
      },
      {
        title: onboardingTitle3,
        subtitle: onboardingSubtitle3,
        imgName: 'animals/animals3.svg',
      },
    ],
  },
  sharing: {
    facebookButtonTitle:
      "I joined Tab for Ending Animal Suffering, and now every tab I open works to help end the cruelty of factory farming. Check it out - it's free!",
    imgCategory: 'animals',
    shareImage: 'animals/animalsEmailInvite.svg',
    sentImage: 'animals/animalsEmailInvite.svg',
    redditButtonTitle: 'Support Animals with each tab',
    email: {
      image:
        'https://prod-tab2017-media.gladly.io/img/cause/animals/emailInviteAnimals.jpg',
      title:
        "We all have a part to play in helping animals. That's why {{name}} thinks you should join them on Tab for Ending Animal Suffering",
      about: emailAbout,
      sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
      faq: "We're supporting an amazing organization: The Humane League, to ensure the money raised will directly support ending animal suffering.",
    },
    sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    subtitle: socialSubtitle,
    title: socialTitle,
    tumblrCaption:
      "I joined Tab for Ending Animal Suffering, and now every tab I open works to help end the cruelty of factory farming. Check it out - it's free!",
    tumblrTitle: 'Support Animals with each tab',
    twitterButtonTitle:
      "I joined Tab for Ending Animal Suffering, and now every tab I open works to help end the cruelty of factory farming. Check it out - it's free!",
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
    primaryColor: '#FF6A08', // orange
    secondaryColor: '#FF7616',
  },
}

export default data
