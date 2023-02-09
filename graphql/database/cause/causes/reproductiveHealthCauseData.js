// Cause: Reproductive Health

// We have a little templating "engine" that replaces placeholders.
/* eslint no-template-curly-in-string: 0 */

const data = {
  id: '4mC9rt2rb',
  about:
    '### About Tab for Reproductive Health\n\n**Tab for Reproductive Health** is proud to support Planned Parenthood and Center for Reproductive Rights. With each tab opened, you are making a positive impact toward providing reproductive health services and protecting reproductive rights.\n\n[Planned Parenthood](https://www.plannedparenthood.org/) is a 501(c)(3) organization that works to provide reproductive and sexual health care and education for all people. In addition to providing a wide range of services including birth control, testing and treatment for sexually transmitted infections, and screenings for cervical and other cancers, Planned Parenthood provides [comprehensive sex education](https://www.plannedparenthood.org/learn) that is medically accurate, culturally responsive, equitable, and accessible. \n\n[Center for Reproductive Rights](https://reproductiverights.org/) is a 501(c)(3) organization of lawyers and advocates who ensure reproductive rights are protected in law as fundamental human rights. They have participated in every major U.S. Supreme Court abortion case since their founding in 1992 and have strengthened reproductive laws and policies in more than 60 countries.',
  name: 'Reproductive Health',
  isAvailableToSelect: true,
  icon: 'person-heart',
  backgroundImageCategory: 'trees', // TODO: update with new collection
  charityId: 'ba4c2888-1d89-4c68-a47d-4f15f1445b6a',
  individualImpactEnabled: false, // Deprecated. Use "impactType".
  impactType: 'none',
  impactVisits: null,
  landingPagePath: '/reproductive-health/',
  landingPagePhrase: 'This tab helps Reproductive Health',
  slug: 'reproductive-health',
  onboarding: {
    steps: [
      {
        title: '### Your tabs are doing great things',
        subtitle:
          'Now, every tab you open supports protecting and providing reproductive health access.\n\nTabbers like you are supporting critical nonprofit work in places where reproductive health care is under attack. Thank you!\n\n',
        imgName: 'reproductiveHealth/onboarding1.svg',
      },
      {
        title: '### Do more with your squad',
        subtitle:
          'Support reproductive health care with a squad!\n\nYou and your friends can team up to do more good.\n\n',
        imgName: 'reproductiveHealth/onboarding2.svg',
      },
      {
        title: "### It doesn't cost you a thing",
        subtitle:
          "Ads on the new tab page raise money that we give to nonprofits. Most ads aren't good—but these ones are :)\n\n",
        imgName: 'reproductiveHealth/onboarding3.svg',
      },
    ],
  },
  sharing: {
    title: '### **Get a friend on board**',
    subtitle:
      '##### Everyone can and _should_ make a difference: invite a friend to join in.\n\n',
    shareImage: 'sharing.svg',
    sentImage: 'sharing.svg',
    imgCategory: 'reproductive-health', // TODO: deprecate
    email: {
      image: 'https://prod-tab2017-media.gladly.io/img/cause/emailInvite.jpg',
      title:
        'Reproductive health care is under attack. Put your tabs into the fight.',
      about:
        '<div>Tab for Reproductive Health turns your browser into a force for good. With each tab you open, you can support nonprofits providing reproductive health services and advocating for policy change.</div>\n\n',
      faq: 'We’re supporting Planned Parenthood and Center for Reproductive Rights, ensuring the money raised will make a difference.',
      sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    },
    sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    facebookButtonTitle:
      'Reproductive health care is under attack. Now, every tab I open raises money for nonprofit organizations protecting and providing access to reproductive health care. Check it out - it’s free!',
    twitterButtonTitle:
      'Reproductive health care is under attack. Now, every tab I open raises money for nonprofit organizations protecting and providing access to reproductive health care. Check it out - it’s free!',
    redditButtonTitle: 'Protect access to safe reproductive health care',
    tumblrTitle: 'Protect access to safe reproductive health care',
    tumblrCaption:
      'Reproductive health care is under attack. Now, every tab I open raises money for nonprofit organizations protecting and providing access to reproductive health care. Check it out - it’s free!',
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
    primaryColor: '#FB5050',
    secondaryColor: '#29BEBA',
  },
}

export default data
