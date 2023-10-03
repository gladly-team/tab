// Cause: Boys & Girls Clubs of America

// We have a little templating "engine" that replaces placeholders.
/* eslint no-template-curly-in-string: 0 */

// referralRewardTitle

const data = {
  id: 'dYr9lq7',
  about:
    '### The [Boys & Girls Clubs of America](https://www.bgca.org/) is a 501(c)(3) organization that works to enable all young people to reach their full potential as productive, caring, responsible citizens. Boys & Girls Clubs vision is to provide a world-class Club Experience that assures success is within reach of every young person who enters our doors, with all members on track to graduate from high school with a plan for the future, demonstrating good character and citizenship, and living a healthy lifestyle. The mission and core beliefs of Boys & Girls Clubs fuel our commitment to promoting safe, positive and inclusive environments for all. Boys & Girls Clubs of America supports all youth and teens – of every race, ethnicity, gender, gender expression, sexual orientation, ability, socio-economic status, and religion – in reaching their full potential.',
  name: 'Boys & Girls Clubs of America',
  nameForShop: 'the Boys & Girls Clubs of America community',
  isAvailableToSelect: false,
  icon: '---',
  backgroundImageCategory: 'trees', // TODO: update with new collection
  charityId: '28919dc7-220f-43ac-a6ae-3880f7b7ebed',
  individualImpactEnabled: false, // Deprecated. Use "impactType".
  impactType: 'none',
  impactVisits: 131,
  landingPagePath: '/boysandgirlsclub/',
  landingPagePhrase:
    'This tab supports the Boys & Girls Clubs of America community',
  slug: 'boysandgirlsclub',
  impact: {
    impactCounterText: '---',
    claimImpactSubtitle: '---',
    impactIcon: '---',
    // @feature/generalize-referral-reward
    // Note: this is not used until we generalize referral incentives:
    // https://github.com/gladly-team/tab/blob/master/graphql/database/users/rewardReferringUser.js#L91
    referralRewardNotification:
      '##### Congrats! You recruited a friend to help support Boys & Girls Clubs of America just by opening tabs. \n\n',
    // Note: this is not used until we generalize referral incentives.
    // @feature/generalize-referral-reward
    referralRewardTitle: 'Woot 1 ---\n\n',
    referralRewardSubtitle:
      "##### Congratulations! You're making a huge impact on Boys & Girls Clubs of America. Want to help raise even more? Invite a few more friends! \n\n",
    impactWalkthroughText: 'Woot 2 ---\n\n',
    // @feature/generalize-referral-reward
    // Note: this is not used until we generalize referral incentives.
    newlyReferredImpactWalkthroughText: 'Woot 3 ---\n\n',
    confirmImpactSubtitle: 'Woot 4 ---\n\n',
    // walkMeGif: undefined,
  },
  onboarding: {
    steps: [
      {
        title: '### Your tabs are doing great things',
        subtitle:
          'Now, every tab you open works to support the Boys & Girls Clubs of America community. Tabbers like you are supporting critical nonprofit work all around the world. Thank you!\n\n',
        imgName: 'lgbtq/onboarding1.svg',
      },
      {
        title: '### Do more with your squad',
        subtitle:
          'Support the Boys & Girls Clubs of America community even faster with a squad!\n\nYou and your friends can team up to do more good.\n\n',
        imgName: 'lgbtq/onboarding2.svg',
      },
      {
        title: "### It doesn't cost you a thing",
        subtitle:
          "Ads on the new tab page raise money that we give to nonprofits. Most ads aren't good—but these ones are :)\n\n",
        imgName: 'lgbtq/onboarding3.svg',
      },
    ],
  },
  sharing: {
    title: '### **Get a friend on board**',
    subtitle:
      '##### Everyone can and _should_ make a difference: invite a friend to join in.\n\n',
    shareImage: 'lgbtq/invitelgbtq.svg',
    sentImage: 'lgbtq/invitelgbtq.svg',
    imgCategory: 'lgbtq',
    email: {
      image:
        'https://prod-tab2017-media.gladly.io/img/cause/lgbtq/invitelgbtq.jpg',
      title:
        'We all have a part to play in supporting the Boys & Girls Clubs of America community. That’s why {{name}} thinks you should join them on Tab for Boys & Girls Clubs of America .',
      about:
        '<div>Tab for Boys & Girls Clubs of America turns your web browser into a force for good. With each tab opened, ad revenue supports all young people to reach their full potential as productive, caring, responsible citizens.</div>\n\n',
      faq: 'We’re supporting Boys & Girls Clubs of America to ensure the money raised will directly support their goals to make a positive impact on the Boys & Girls Clubs of America community.',
      sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    },
    sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    facebookButtonTitle:
      'I joined Tab for Boys & Girls Clubs of America, and now every tab I open helps raise money for the Boys & Girls Clubs of America. Check it out - it’s free!',
    twitterButtonTitle:
      'I joined Tab for Boys & Girls Clubs of America, and now every tab I open helps raise money for the Boys & Girls Clubs of America. Check it out - it’s free!',
    redditButtonTitle:
      'Support the Boys & Girls Clubs of America community with each tab',
    tumblrTitle:
      'Support the Boys & Girls Clubs of America community with each tab',
    tumblrCaption:
      'Every time I open a new tab I am raising money to support the Boys & Girls Clubs of America community. Join for free and start making an impact today!',
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
    primaryColor: '#A27DF8',
    secondaryColor: '#29BEBA',
  },
  charityIds: ['28919dc7-220f-43ac-a6ae-3880f7b7ebed'],
}

export default data
