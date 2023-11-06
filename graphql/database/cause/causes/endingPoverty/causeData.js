// Cause: Tab for Ending Poverty

// We have a little templating "engine" that replaces placeholders.
/* eslint no-template-curly-in-string: 0 */

// referralRewardTitle

const data = {
  id: 'p7HGxRbQZ',
  about:
    '### About Tab for Ending Poverty **Tab for Ending Poverty** supports [GiveDirectly](https://www.givedirectly.org/?utm_source=tabforcause), a nonprofit that lets you send money directly to the world’s poorest, no strings attached. We believe people in poverty deserve the dignity to choose for themselves how best to improve their lives – cash enables that choice. [Research](http://GiveDirectly.org/research/?utm_source=tabforacause) shows people in poverty use cash to improve their health, education, income, self-reliance, and more. In the last decade, we’ve reached over 1.5 million people in poverty across 14 countries, largely via simple banking technology called mobile money. Historically, GiveDirectly delivered about 90 cents of every dollar directly to those in need. The remaining 10 cents cover the [costs of delivery](https://www.givedirectly.org/yes-we-have-costs/?utm_source=tabforacause), including foreign exchange fees, fraud prevention, and in-country staff that provide customer service to recipients. Today, most funds are sent to families in Kenya, Malawi, Liberia, and Rwanda.',
  name: 'Ending Poverty',
  nameForShop: 'Ending Poverty',
  isAvailableToSelect: true,
  icon: 'money',
  backgroundImageCategory: 'trees', // TODO: update with new collection
  charityId: '123e4567-e89b-12d3-a456-426655440000',
  individualImpactEnabled: true, // Deprecated. Use "impactType".
  impactType: 'group',
  impactVisits: 131,
  landingPagePath: '/endingpoverty/',
  landingPagePhrase: 'This tab supports the mission of Ending Poverty',
  slug: 'endingpoverty',
  impact: {
    impactCounterText:
      '##### GiveDirectly provides direct cash relief to those living in extreme poverty. This life-saving money allows families to improve their health, education, and income.',
    claimImpactSubtitle:
      '##### Provide 1 month of cash for a family in extreme poverty',
    impactIcon: 'money',
    // @feature/generalize-referral-reward
    // Note: this is not used until we generalize referral incentives:
    // https://github.com/gladly-team/tab/blob/master/graphql/database/users/rewardReferringUser.js#L91
    referralRewardNotification:
      '##### Congrats! You recruited a friend to help support the mission of Ending Poverty just by opening tabs. \n\n',
    // Note: this is not used until we generalize referral incentives.
    // @feature/generalize-referral-reward
    referralRewardTitle: 'Woot 1 ---\n\n',
    referralRewardSubtitle:
      "##### Congratulations! You're making a huge impact on the mission of Ending Poverty. Want to help raise even more? Invite a few more friends! \n\n",
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
          'Now, every tab you open works to support the Ending Poverty community. Tabbers like you are supporting critical nonprofit work all around the world. Thank you!\n\n',
        imgName: 'endingPoverty/onboarding1.svg',
      },
      {
        title: '### Do more with your squad',
        subtitle:
          'Support the Ending Poverty community even faster with a squad!\n\nYou and your friends can team up to do more good.\n\n',
        imgName: 'endingPoverty/onboarding2.svg',
      },
      {
        title: "### It doesn't cost you a thing",
        subtitle:
          "Ads on the new tab page raise money that we give to nonprofits. Most ads aren't good—but these ones are :)\n\n",
        imgName: 'endingPoverty/onboarding3.svg',
      },
    ],
  },
  sharing: {
    title: '### **Get a friend on board**',
    subtitle:
      '##### Everyone can and _should_ make a difference: invite a friend to join in.\n\n',
    shareImage: 'endingPoverty/invite.svg',
    sentImage: 'endingPoverty/invite.svg',
    imgCategory: 'lgbtq',
    email: {
      image:
        'https://prod-tab2017-media.gladly.io/img/cause/endingPoverty/invite.jpg',
      title:
        'We all have a part to play in supporting the Ending Poverty community. That’s why {{name}} thinks you should join them on Tab for Ending Poverty .',
      about:
        '<div>Tab for Ending Poverty turns your web browser into a force for good. With each tab opened, ad revenue supports all young people to reach their full potential as productive, caring, responsible citizens.</div>\n\n',
      faq: 'We’re supporting Ending Poverty to ensure the money raised will directly support their goals to make a positive impact on the Ending Poverty community.',
      sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    },
    sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    facebookButtonTitle:
      'I joined Tab for Ending Poverty, and now every tab I open helps raise money for the mission of Ending Poverty. Check it out - it’s free!',
    twitterButtonTitle:
      'I joined Tab for Ending Poverty, and now every tab I open helps raise money for the mission of Ending Poverty. Check it out - it’s free!',
    redditButtonTitle: 'Support the Ending Poverty community with each tab',
    tumblrTitle: 'Support the Ending Poverty community with each tab',
    tumblrCaption:
      'Every time I open a new tab I am raising money to support the mission Ending Poverty. Join for free and start making an impact today!',
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
  charityIds: ['123e4567-e89b-12d3-a456-426655440000'],
}

export default data
