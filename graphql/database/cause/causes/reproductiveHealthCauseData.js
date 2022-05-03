// Cause: Reproductive Health

// We have a little templating "engine" that replaces placeholders.
/* eslint no-template-curly-in-string: 0 */

const data = {
  id: '4mC9rt2rb',
  about:
    '### About Tab for Global Health\n\n**Tab for Global Health** is proud to support [Partners In Health](https://www.pih.org/) and Dr. Paul Farmer’s legacy. With each tab opened, you are helping provide access to health care to those in need and strengthening public health systems all around the world. \n \nPartners In Health’s mission is to provide a preferential option for the poor in health care. By establishing long-term relationships with sister organizations based in settings of poverty, Partners In Health strives to achieve two overarching goals: to bring the benefits of modern medical science to those most in need of them and to serve as an antidote to despair.\n \nThey draw on the resources of the world’s leading medical and academic institutions and on the lived experience of the world’s most impoverished communities. At its root, their mission is both medical and moral. It is based on solidarity, rather than charity alone.\n \nWhen their patients are ill and have no access to care, their team of health professionals, scholars, and activists will do whatever it takes to make them well.\n \nPartners In Health has used a community-based model to provide health care and support for the last 30 years and now serves millions of patients across 12 countries.\n \n**Your tabs are making an impact**. The counter on your new tab page (with the medical bag icon) estimates how many in-home visits from a [community health worker](https://www.pih.org/programs/community-health-workers) your tabs have helped support.  Each counter increment represents raising ~1/50th of the money needed to support an in-home visit. Thank you for making a difference!',
  name: 'Reproductive Health',
  isAvailableToSelect: true,
  icon: 'person-heart',
  backgroundImageCategory: 'trees', // TODO: update with new collection
  charityId: 'ba4c2888-1d89-4c68-a47d-4f15f1445b6a',
  individualImpactEnabled: false,
  impactVisits: null,
  landingPagePath: '/reproductive-health/',
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
      faq:
        'We’re supporting Planned Parenthood and Center for Reproductive Rights, ensuring the money raised will make a difference.',
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
