// Cause: global health

// We have a little templating "engine" that replaces placeholders.
/* eslint no-template-curly-in-string: 0 */

const data = {
  id: 'sPFpWRT7q',
  about:
    '### About Tab for Global Health\n\n**Tab for Global Health** is proud to support [Partners In Health](https://www.pih.org/) and Dr. Paul Farmer’s legacy. With each tab opened, you are helping provide access to health care to those in need and strengthening public health systems all around the world. \n \nPartners In Health’s mission is to provide a preferential option for the poor in health care. By establishing long-term relationships with sister organizations based in settings of poverty, Partners In Health strives to achieve two overarching goals: to bring the benefits of modern medical science to those most in need of them and to serve as an antidote to despair.\n \nThey draw on the resources of the world’s leading medical and academic institutions and on the lived experience of the world’s most impoverished communities. At its root, their mission is both medical and moral. It is based on solidarity, rather than charity alone.\n \nWhen their patients are ill and have no access to care, their team of health professionals, scholars, and activists will do whatever it takes to make them well.\n \nPartners In Health has used a community-based model to provide health care and support for the last 30 years and now serves millions of patients across 12 countries.\n \n**Your tabs are making an impact**. The counter on your new tab page (with the medical bag icon) estimates how many in-home visits from a [community health worker](https://www.pih.org/programs/community-health-workers) your tabs have helped support.  Each counter increment represents raising ~1/50th of the money needed to support an in-home visit. Thank you for making a difference!',
  name: 'Global Health',
  isAvailableToSelect: true,
  icon: 'medical-bag',
  backgroundImageCategory: 'trees', // TODO: update with new collection
  charityId: 'cb7ab7e4-bda6-4fdf-825a-30db05911705',
  impactType: 'individual',
  impactVisits: 131,
  landingPagePath: '/global-health/',
  slug: 'global-health',
  impact: {
    impactCounterText:
      '##### **Your positive impact!**\n\nThis counter shows your progress toward helping provide an at-home medical visit. Every tab you open helps. Keep it up!\n\n',
    claimImpactSubtitle:
      '##### You did it! Your tabs are on their way to providing an at-home medical visit.',
    impactIcon: 'medical-bag',
    // @feature/generalize-referral-reward
    // Note: this is not used until we generalize referral incentives:
    // https://github.com/gladly-team/tab/blob/master/graphql/database/users/rewardReferringUser.js#L91
    referralRewardNotification:
      '##### Congrats! You recruited a friend to help provide access to health care around the world.\n\n',
    // Note: this is not used until we generalize referral incentives.
    // @feature/generalize-referral-reward
    referralRewardTitle: '#### You just moved global health forward!\n\n',
    referralRewardSubtitle:
      "##### Congratulations! You're making a huge impact to support the wellbeing of people around the world. Want to do more? Invite a few more friends!\n\n",
    impactWalkthroughText:
      "##### When you do, you’ll help provide at-home healthcare visits to people in need. We'll track your progress at the top of the page:\n\n",
    // @feature/generalize-referral-reward
    // Note: this is not used until we generalize referral incentives.
    newlyReferredImpactWalkthroughText:
      "##### Your friend has started you off with some impact! Open a new tab now to help provide at-home healthcare visits to people in need. We'll track your progress at the top of the page:\n\n",
    confirmImpactSubtitle:
      "##### Each time you open a tab, you'll be helping provide at-home healthcare visits through Partners In Health. Ready to get started?\n\n",
    // walkMeGif: undefined,
  },
  onboarding: {
    steps: [
      {
        title: '### Your tabs are doing great things',
        subtitle:
          'Now, every tab you open helps train and support community healthcare workers to provide at-home visits.\n\nTabbers like you are supporting critical nonprofit work all around the world. Thank you!\n\n',
        imgName: 'globalHealth/onboarding1.svg',
      },
      {
        title: '### Do more with your squad',
        subtitle:
          'With your squad, help even more people access safe health care!\n\nYou and your friends can team up to do more good.\n\n',
        imgName: 'globalHealth/onboarding2.svg',
      },
      {
        title: "### It doesn't cost you a thing",
        subtitle:
          "Ads on the new tab page raise money that we give to nonprofits. Most ads aren't good—but these ones are :)\n\n",
        imgName: 'globalHealth/onboarding3.svg',
      },
    ],
  },
  sharing: {
    title: '### **Get a friend on board**',
    subtitle:
      '##### Everyone can and _should_ make a difference: invite a friend to join in.\n\n',
    shareImage: 'globalHealth/sharing.svg',
    sentImage: 'globalHealth/sharing.svg',
    imgCategory: 'global-health',
    email: {
      image:
        'https://prod-tab2017-media.gladly.io/img/cause/globalHealth/emailInvite.jpg',
      title:
        'With Tab for Global Health, supporting healthcare access has never been easier.',
      about:
        '<div>Tab for Global Health turns your web browser into a force for good. With each tab opened, ad revenue supports community healthcare training through Partners In Health. This training helps ensure the people in need of care will receive it, long term.</div>\n\n',
      faq:
        'We’re partnered with Partners In Health to ensure the money raised will directly support their mission of providing high-quality health care globally to those who need it.',
      sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    },
    sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    facebookButtonTitle:
      'People around the world are struggling to access safe and reliable healthcare, but this is a problem we can all help solve. Now, with Tab for Global Health, every tab I open helps raise money for Partners In Health to train community healthcare workers. Check it out - it’s free!',
    twitterButtonTitle:
      'People around the world are struggling to access quality health care, but this is a problem we can solve. Now, with Tab for Global Health, every tab I open raises money for Partners In Health to train community healthcare workers. Check it out - it’s free!',
    redditButtonTitle: 'Help provide quality healthcare around the world',
    tumblrTitle: 'Help provide quality healthcare around the world ',
    tumblrCaption:
      'Every time I open a new tab with Tab for Global Health I am raising money to train healthcare workers through Partners In Health. Join today for free! ',
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
