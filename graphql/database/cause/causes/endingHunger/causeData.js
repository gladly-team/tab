// Cause: ending hunger

// We have a little templating "engine" that replaces placeholders.
/* eslint no-template-curly-in-string: 0 */

const data = {
  id: '1HCq9sFTp',
  about:
    '**Tab for Ending Hunger** is proud to support Action Against Hunger. With each tab opened, you are providing life-saving nutrition to people currently facing hunger. \n \n[Action Against Hunger](https://www.actionagainsthunger.org/) works to prevent and treat severe malnutrition around the world. It provides long-term results by gathering, analyzing, and sharing data, treating people in need, addressing both direct and underlying causes, and strengthening local capacity to combat this issue. \n \n**Your tabs are making an impact**. The counter on your new tab page (with the apple icon) estimates how many ready-to-use therapeutic food packs you’ve helped provide. Action Against Hunger helps provide this formula and other nutritional resources to ensure communities can thrive for years to come. Thank you for making a difference.',
  name: 'Ending Hunger',
  isAvailableToSelect: true,
  icon: 'food-apple',
  backgroundImageCategory: 'trees', // TODO: update with new collection
  charityId: 'ea019270-1cda-411f-b41e-90406fbe15ee',
  individualImpactEnabled: true, // Deprecated. Use "impactType".
  impactType: 'individual',
  impactVisits: 366,
  landingPagePath: '/ending-hunger/',
  landingPagePhrase: 'This tab feeds the hungry',
  slug: 'ending-hunger',
  impact: {
    impactCounterText:
      '##### **Your positive impact!**\n\nThis shows how many ready-to-use therapeutic food packets your tabs can provide to help people experiencing severe hunger. Every tab you open helps. Keep it up!\n\n',
    claimImpactSubtitle:
      '##### You did it! You just turned your tabs into ready-to-use therapeutic food for someone facing hunger. Keep it up!',
    impactIcon: 'food-apple',
    // @feature/generalize-referral-reward
    // Note: this is not used until we generalize referral incentives:
    // https://github.com/gladly-team/tab/blob/master/graphql/database/users/rewardReferringUser.js#L91
    referralRewardNotification:
      '##### Congrats! You recruited a friend to help fight world hunger just by opening tabs.\n\n',
    // Note: this is not used until we generalize referral incentives.
    // @feature/generalize-referral-reward
    referralRewardTitle: '#### You advanced the fight against hunger\n\n',
    referralRewardSubtitle:
      "##### Congratulations! You're making a huge difference for people experiencing severe hunger. Want to help even more people? Invite a few more friends!\n\n",
    impactWalkthroughText:
      "##### When you do, you'll provide a ready-to-use therapeutic food packet to someone experiencing severe hunger. We'll track how many packs you've provided at the top of the page:\n\n",
    // @feature/generalize-referral-reward
    // Note: this is not used until we generalize referral incentives.
    newlyReferredImpactWalkthroughText:
      "##### Open a new tab now to provide life-saving nutrition. We'll track how many ready-to-use therapeutic food packets you’ve provided at the top of the page:\n\n",
    confirmImpactSubtitle:
      "##### Each time you open a tab, you'll be helping provide lifesaving nutrition to people experiencing severe hunger. Ready to get started?\n\n",
    // walkMeGif: undefined,
  },
  onboarding: {
    steps: [
      {
        title: '### Your tabs are doing great things',
        subtitle:
          'Now, every tab you open supports initiatives to help end world hunger.\n\nTabbers like you are supporting critical nonprofit work and saving lives. Thank you!\n\n',
        imgName: 'endingHunger/onboarding1.svg',
      },
      {
        title: '### Do more with your squad',
        subtitle:
          'Provide emergency nutrition even faster with a squad.\n\nYou and your friends can team up to do more good, together.\n\n',
        imgName: 'endingHunger/onboarding2.svg',
      },
      {
        title: "### It doesn't cost you a thing",
        subtitle:
          "Ads on the new tab page raise money that we give to nonprofits. Most ads aren't good—but these ones are :)\n\n",
        imgName: 'endingHunger/onboarding3.svg',
      },
    ],
  },
  sharing: {
    title: '#### **Get a friend on board to do more good**',
    subtitle:
      '##### Everyone can and _should_ make a difference: invite a friend to join in.\n\n',
    shareImage: 'endingHunger/sharing.svg',
    sentImage: 'endingHunger/sharing.svg',
    imgCategory: 'ending-hunger',
    email: {
      image:
        'https://prod-tab2017-media.gladly.io/img/cause/endingHunger/emailInvite.jpg',
      title:
        'With Tab for Ending Hunger, treating & preventing malnutrition can be part of our daily lives.',
      about:
        '<div>Tab for Ending Hunger turns your web browser into a force for good. With each tab opened, ad revenue supports communities in need of life-saving nutrition. These resources help ensure people facing hunger can be treated and prevent health issues, long-term.</div>\n\n',
      faq: 'We’re partnered with Action Against Hunger to save lives by eliminating hunger through the prevention, detection and treatment of malnutrition.',
      sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    },
    sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    facebookButtonTitle:
      'Severe hunger is an issue being felt around the world, but it is a problem we can all help solve. Now, with Tab for Ending Hunger every tab I open helps raise money for Action Against Hunger to provide emergency nutrition to those in need. Check it out - it’s free!',
    twitterButtonTitle:
      'Severe hunger is an issue being felt around the world, but it is a problem we can solve. Now, with Tab for Ending Hunger, every tab I open helps raise money for Action Against Hunger to provide emergency nutrition to those in need. Check it out - it’s free!',
    redditButtonTitle: 'Help end hunger around the world',
    tumblrTitle: 'Help end hunger around the world',
    tumblrCaption:
      'Every time I open a new tab with Tab for Ending Hunger I am raising money to distribute life-saving nutrition to those in need through Action Against Hunger. Join today for free!',
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
