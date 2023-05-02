// Cause: Ukraine

// We have a little templating "engine" that replaces placeholders.
/* eslint no-template-curly-in-string: 0 */

const data = {
  id: 'JmClR7bmy',
  about:
    '**Tab for Ukraine** is proud to support [Save the Children](https://ukraine.savethechildren.net/), an incredible organization working to save lives and provide ongoing humanitarian aid to Ukrainian families.\n\n**Save the Children** has been working to provide lifesaving interventions in Ukraine since 2014. They work to provide the basic needs of the most vulnerable families including food, shelter, clothing, cash grants, and medicine. They also provide children and their caregivers with psychosocial support as well as work with schools to increase awareness of the dangers of mines and other remnants of war.\n\nIf you would like to make an immediate monetary impact, donations to Save the Children can be made [here](https://support.savethechildren.org/site/Donation2?df_id=1620&1620.donation=form1).\n\n**Your tabs are making an impact**. The counter on your new tab page (with the water icon) estimates how many water-purifying aquatabs your tabs have funded. **This is a representation of just one small part of the humanitarian aid that Save the Children provides.** The money you raise for Save the Children will support whatever supplies and support are most needed.',
  name: 'Ukraine',
  nameForShop: 'Ukraine',
  isAvailableToSelect: true,
  icon: 'water',
  backgroundImageCategory: 'trees', // TODO: update with new collection
  charityId: '90bfe202-54a9-4eea-9003-5e91572387dd',
  individualImpactEnabled: true, // Deprecated. Use "impactType".
  impactType: 'individual_and_group',
  impactVisits: 13,
  landingPagePath: '/ukraine/',
  landingPagePhrase: 'This tab supports Ukrainian families',
  slug: 'ukraine',
  impact: {
    impactCounterText:
      '##### **Your positive impact!**\n\nThis shows how many water-purifying aquatabs your tabs can provide to families in Ukraine.\n\nThis is a representation of just one small part of the humanitarian aid that Save the Children provides. The money you raise for Save the Children will support whatever supplies and support they determine is most needed.\n\nEvery tab you open helps. Keep it up!\n\n',
    claimImpactSubtitle:
      '##### You did it! You just turned your tab into a water-purifying aquatab. Keep it up!\n\n##### This is a representation of just one small part of the humanitarian aid that Save the Children provides. The money you raise for Save the Children will support whatever supplies are most needed.\n\n',
    impactIcon: 'water',
    // @feature/generalize-referral-reward
    // Note: this is not used until we generalize referral incentives:
    // https://github.com/gladly-team/tab/blob/master/graphql/database/users/rewardReferringUser.js#L91
    referralRewardNotification:
      '##### Thank you! You recruited a friend to support ongoing humanitarian relief to families in Ukraine.\n\n',
    // Note: this is not used until we generalize referral incentives.
    // @feature/generalize-referral-reward
    referralRewardTitle: '#### You are doing good\n\n',
    referralRewardSubtitle:
      "##### Thank you! You're making a huge impact by supporting ongoing humanitarian relief to families in Ukraine. Want to help even more people for free? Invite a few more friends.\n\n",
    impactWalkthroughText:
      "##### When you do, you'll provide ongoing humanitarian relief to families in Ukraine.\n\n##### We've chosen water-purifying aquatabs as a representation of just one small part of the humanitarian aid that Save the Children provides. The money you raise for Save the Children will support whatever supplies and support are most needed.\n\n##### We'll track how many aquatabs you’ve provided on the top of the page:\n\n",
    // @feature/generalize-referral-reward
    // Note: this is not used until we generalize referral incentives.
    newlyReferredImpactWalkthroughText:
      "##### When you do, you'll provide ongoing humanitarian relief to families in Ukraine.\n\n##### We've chosen water-purifying aquatabs as a representation of just one small part of the humanitarian aid that Save the Children provides. The money you raise for Save the Children will support whatever supplies and support are most needed.\n\n##### We'll track how many aquatabs you’ve provided on the top of the page:\n\n",
    confirmImpactSubtitle:
      "##### Each time you open a tab, you'll be helping Save the Children provide ongoing humanitarian aid to Ukrainian families. Ready to get started?\n\n",
    // walkMeGif: undefined,
  },
  onboarding: {
    steps: [
      {
        title: '### Your tabs are doing great things',
        subtitle:
          'Now, every tab you open supports ongoing humanitarian aid to Ukrainian families. Tabbers like you are supporting critical nonprofit work. Thank you!\n\n',
        imgName: 'ukraine/onboarding1.svg',
      },
      {
        title: '### Do more with your squad',
        subtitle:
          'With a squad, you and your friends can team up to provide even more humanitarian aid.\n\n',
        imgName: 'ukraine/onboarding2.svg',
      },
      {
        title: "### It doesn't cost you a thing",
        subtitle:
          "Ads on the new tab page raise money that we give to nonprofits. Most ads aren't good—but these ones are :)\n\n",
        imgName: 'ukraine/onboarding3.svg',
      },
    ],
  },
  sharing: {
    title: '### **Get a friend on board**',
    subtitle:
      '##### Everyone can and _should_ make a difference: invite a friend to join in.\n\n',
    shareImage: 'ukraine/sharing.svg',
    sentImage: 'ukraine/sharing.svg',
    imgCategory: 'ukraine',
    email: {
      image:
        'https://prod-tab2017-media.gladly.io/img/cause/ukraine/emailInvite.jpg',
      title:
        'We all can and should support the people of Ukraine. Turn your internet browsing into ongoing support.',
      about:
        '<div>Tab for Ukraine turns your web browser into a force for good. With each tab opened, ad revenue supports Save the Children, which has been working to provide lifesaving interventions in Ukraine since 2014.</div>\n\n',
      faq: 'Save the Children ensures the money raised will directly support Ukrainian families affected by the war.',
      sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    },
    sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    facebookButtonTitle:
      'The people of Ukraine are under attack and need support. Now, with Tab for Ukraine, every tab I open helps raise money for Save the Children to provide ongoing humanitarian support to Ukrainian families. Check it out - it’s free!',
    twitterButtonTitle:
      'The people of Ukraine are under attack and need support. Now, with Tab for Ukraine, every tab I open helps raise money for Save the Children to provide ongoing humanitarian support to Ukrainian families. Check it out - it’s free!',
    redditButtonTitle: 'Help support Ukrainian families',
    tumblrTitle: 'Help support Ukrainian families',
    tumblrCaption:
      'Every time I open a new tab with Tab for Ukraine I am raising money for Save the Children to provide ongoing humanitarian support to Ukrainian families. Join today for free!',
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
