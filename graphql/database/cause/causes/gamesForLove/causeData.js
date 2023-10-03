// Cause: Games for Love

// We have a little templating "engine" that replaces placeholders.
/* eslint no-template-curly-in-string: 0 */

// referralRewardTitle

const data = {
  id: 'WerUli7',
  about:
    '### About Tab for Games for Love Games For Love is a 501(c)(3) organization dedicated to easing suffering, saving lives, and creating sustainable futures for children. Their six core programs work in tandem to meet the needs of kids as they grow and provide an ever-present community of support. Kids everywhere combat illness, isolation, and opportunity ceilings. They need access to healthcare, education, and hope. [Games For Love](https://gamesforlove.org/) mobilizes gaming communities to help kids around the world — for life.',
  name: 'Games for Love',
  nameForShop: 'the Games for Love community',
  isAvailableToSelect: true,
  icon: '---',
  backgroundImageCategory: 'lgbtq', // TODO: update with new collection
  charityId: 'a3f8c9a8-9c4a-4b1e-82ca-25e9b9d99962',
  individualImpactEnabled: false, // Deprecated. Use "impactType".
  impactType: 'none',
  impactVisits: 131,
  landingPagePath: '/gamesforlove/',
  landingPagePhrase: 'This tab supports the Games for Love community',
  slug: 'gamesforlove',
  impact: {
    impactCounterText: '---',
    claimImpactSubtitle: '---',
    impactIcon: '---',
    // @feature/generalize-referral-reward
    // Note: this is not used until we generalize referral incentives:
    // https://github.com/gladly-team/tab/blob/master/graphql/database/users/rewardReferringUser.js#L91
    referralRewardNotification:
      '##### Congrats! You recruited a friend to help support Games for Love just by opening tabs. \n\n',
    // Note: this is not used until we generalize referral incentives.
    // @feature/generalize-referral-reward
    referralRewardTitle: 'Woot 1 ---\n\n',
    referralRewardSubtitle:
      "##### Congratulations! You're making a huge impact on Games for Love. Want to help raise even more? Invite a few more friends! \n\n",
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
          'Now, every tab you open works to support the Games for Love community. Tabbers like you are supporting critical nonprofit work all around the world. Thank you!\n\n',
        imgName: 'lgbtq/onboarding1.svg',
      },
      {
        title: '### Do more with your squad',
        subtitle:
          'Support the Games for Love community even faster with a squad!\n\nYou and your friends can team up to do more good.\n\n',
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
        'We all have a part to play in supporting the LGBTQ+ community. That’s why {{name}} thinks you should join them on Tab for LGBTQ+.',
      about:
        '<div>Tab for LGBTQ+ turns your web browser into a force for good. With each tab opened, ad revenue supports Point of Pride and Outright International, uplifting the LGBTQ+ community through empowerment, advocacy, and life-changing access to gender-affirming care.</div>\n\n',
      faq: 'We’re supporting Point of Pride and Outright International to ensure the money raised will directly support their goals to make a positive impact on the LGBTQ+ community.',
      sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    },
    sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    facebookButtonTitle:
      'I joined Tab for LGBTQ+, and now every tab I open helps raise money for Point of Pride and Outright International. Check it out - it’s free!',
    twitterButtonTitle:
      'I joined Tab for LGBTQ+, and now every tab I open helps raise money for Point of Pride and Outright International. Check it out - it’s free!',
    redditButtonTitle: 'Support the LGBTQ+ community with each tab',
    tumblrTitle: 'Support the LGBTQ+ community with each tab',
    tumblrCaption:
      'Every time I open a new tab I am raising money to support the LGBTQ+ community through Point of Pride and Outright International. Join for free and start making an impact today!',
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
  charityIds: ['a3f8c9a8-9c4a-4b1e-82ca-25e9b9d99962'],
}

export default data
