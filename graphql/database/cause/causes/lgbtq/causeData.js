// Cause: lgbtq

// We have a little templating "engine" that replaces placeholders.
/* eslint no-template-curly-in-string: 0 */

const data = {
  id: 'qoP35Uli6',
  about:
    '**Tab for LGBTQ+** is proud to support Point of Pride and Outright International. With each tab opened, you are making a positive impact toward LGBTQ+ support and gender-affirming care.\n\n[Point of Pride](https://www.pointofpride.org/) is a 501(c)(3) organization that works to provide access to life-saving health and wellness services to the Trans community. They help members of the Trans community gain access to things such as hormone replacement therapy, chest binders and femme shapewear, and other gender-affirming procedures.\n\n[Outright International](https://outrightinternational.org/) is a 501(c)(3) organization that advocates for legal protection, representation, and emergency relief for “people along the spectrum of diverse sexual and gender identities.',
  name: 'LGBTQ+',
  isAvailableToSelect: true,
  icon: 'transgender',
  backgroundImageCategory: 'lgbtq', // TODO: update with new collection
  charityId: '76d50b8c-b611-46d9-8d9d-bab962c2cb41',
  individualImpactEnabled: true, // Deprecated. Use "impactType".
  impactType: 'group',
  impactVisits: 131,
  landingPagePath: '/lgbtq/',
  landingPagePhrase: 'This tab supports the LGBTQ+ community',
  slug: 'lgbtq',
  impact: {
    impactCounterText:
      '##### **Your positive impact!** This shows how many chest binders your tabs can provide and ship to trans youth and adults around the country. Every tab you open helps. Keep it up!',
    claimImpactSubtitle:
      '##### You did it! You just turned your tabs into 5 chest binders for trans youth and adults. Keep it up!',
    impactIcon: 'transgender',
    // @feature/generalize-referral-reward
    // Note: this is not used until we generalize referral incentives:
    // https://github.com/gladly-team/tab/blob/master/graphql/database/users/rewardReferringUser.js#L91
    referralRewardNotification:
      '##### Congrats! You recruited a friend to help support the LGBTQ+ community just by opening tabs.\n\n',
    // Note: this is not used until we generalize referral incentives.
    // @feature/generalize-referral-reward
    referralRewardTitle:
      '#### You’re providing even more support for the LGBTQ+ community!\n\n',
    referralRewardSubtitle:
      "##### Congratulations! You're making a huge impact for the LGBTQ+ community. Want to help even more? Invite a few more friends!\n\n",
    impactWalkthroughText:
      "##### When you do, you'll be supporting the LGBTQ+ community and providing gender-affirming care.\n\n",
    // @feature/generalize-referral-reward
    // Note: this is not used until we generalize referral incentives.
    newlyReferredImpactWalkthroughText:
      '##### You’ve joined your friend in supporting the LGBTQ+ community! Open a new tab now to continue making a difference.\n\n',
    confirmImpactSubtitle:
      "##### Each time you open a tab, you'll be helping to [support the LGBTQ+ community](https://outrightinternational.org/about-us/our-purpose) and [provide gender-affirming care](https://www.pointofpride.org/about). Ready to get started?\n\n",
    // walkMeGif: undefined,
  },
  onboarding: {
    steps: [
      {
        title: '### Your tabs are doing great things',
        subtitle:
          'Now, every tab you open works to support the LGBTQ+ community and provide access to gender-affirming care. Tabbers like you are supporting critical nonprofit work all around the world. Thank you!\n\n',
        imgName: 'lgbtq/onboarding1.svg',
      },
      {
        title: '### Do more with your squad',
        subtitle:
          'Support the LGBTQ+ community even faster with a squad!\n\nYou and your friends can team up to do more good.\n\n',
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
}

export default data
