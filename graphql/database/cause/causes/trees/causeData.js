// Cause: trees

// We have a little templating "engine" that replaces placeholders.
/* eslint no-template-curly-in-string: 0 */

const data = {
  id: 'tdU_PsRIM',
  about:
    '### About Tab for Trees\n\nTab for Trees is proud to support **Eden Reforestation Projects**. With each tab opened, you are making a positive impact on our planet that will affect generations to come.\n\n[Eden Reforestation Projects](https://www.edenprojects.org/) works to combat deforestation and create job opportunities in local communities by planting trees. Deforestation can bring on flooding, erosion, and animal extinction, and Eden Reforestation Projects is able to enact change by planting trees in affected communities to help both the local ecosystem and economy.\n\n**Your tabs are making an impact**. The counter on your new tab page (with the tree icon) estimates how many trees you have helped plant. Eden Reforestation Projects plants trees and employs local communities to restore and protect their natural environment. Thank you for making a difference!',
  name: 'Trees',
  isAvailableToSelect: true,
  backgroundImageCategory: 'trees',
  charityId: '17099402-4e53-4b42-ad0b-6b89492b61cb',
  individualImpactEnabled: true,
  impactVisits: 140,
  landingPagePath: '/trees/',
  slug: 'trees',
  impact: {
    impactCounterText:
      '##### **Your tree tracker!**\n\nThis shows how many trees your tabs have planted. Every tab you open helps. Keep it up!\n\n',
    claimImpactSubtitle:
      '##### You did it! Your opened tabs have become a tree. Keep it up!',
    impactIcon: 'pine-tree',
    // @feature/generalize-referral-reward
    // Note: this is not used until we generalize referral incentives:
    // https://github.com/gladly-team/tab/blob/master/graphql/database/users/rewardReferringUser.js#L91
    referralRewardNotification:
      "##### Congrats! You recruited a friend to help fight climate change just by opening tabs. To celebrate, we'll have Eden Reforestation Projects plant ${pendingUserReferralImpact} extra tree${isPlural(pendingUserReferralImpact)} on your behalf.\n\n",
    // Note: this is not used until we generalize referral incentives.
    // @feature/generalize-referral-reward
    referralRewardTitle:
      '#### You just planted ${claimedReferralImpact} tree${isPlural(claimedReferralImpact)}!\n\n',
    referralRewardSubtitle:
      "##### Congratulations! You're making a huge impact to fight climate change. Want to help plant even more trees? Invite a few more friends!",
    impactWalkthroughText:
      "##### When you do, you'll plant a tree to fight climate change. We'll track how many trees you've planted on the top of the page:\n\n",
    // @feature/generalize-referral-reward
    // Note: this is not used until we generalize referral incentives.
    newlyReferredImpactWalkthroughText:
      "##### Your friend has started you off with a tree! Open a new tab now to plant your second tree. We'll track how many trees you've planted on the top of the page.\n\n",
    confirmImpactSubtitle:
      "##### Each time you open a tab, you'll be helping plant trees to combat climate change. Ready to get started?\n\n",
    // walkMeGif: undefined,
  },
  onboarding: {
    steps: [
      {
        title: '### Your tabs have a tree-mendous impact!',
        subtitle:
          'Now, every tab you open works to fight climate change by replanting forests around the world.\n\nTabbers like you are supporting critical nonprofit work to ensure our planet is happy and healthy for years to come. Thank you!\n\n',
        imgName: 'trees/onboarding1.svg',
      },
      {
        title: '### Do more with your squad',
        subtitle:
          'Plant trees even faster with a squad!\n\nYou and your friends can team up to plant a forest in no time.',
        imgName: 'trees/onboarding2.svg',
      },
      {
        title: "### It doesn't cost you a thing",
        subtitle:
          "Ads on the new tab page raise money that we give to nonprofits. Most ads aren't good—but these ones are :)\n\n",
        imgName: 'trees/onboarding3.svg',
      },
    ],
  },
  sharing: {
    title: '### **Get a friend on board**',
    subtitle:
      '##### Everyone can and _should_ make a difference to protect our planet: invite a friend to join in.\n\n',
    shareImage: 'trees/treesInvite.svg',
    sentImage: 'trees/treesInvite.svg',
    imgCategory: 'trees',
    email: {
      image:
        'https://prod-tab2017-media.gladly.io/img/cause/trees/emailInviteTrees.jpg',
      title:
        'We all have a part to play in protecting our planet from the harmful effects of climate change. That’s why {{name}} thinks you should join them on Tab for Trees.',
      about:
        '<div>Tab for Trees turns your web browser into a force for good. With each tab opened, ad revenue supports The Eden Reforestation Projects in fighting climate change through reforestation initiatives.</div>\n\n',
      faq:
        'We’re partnered with Eden Reforestation Projects to ensure the money raised will directly support their goals of creating jobs, protecting ecosystems, and helping mitigate climate change.',
      sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    },
    sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    facebookButtonTitle:
      'Looking to turn over a new leaf and start doing more for the environment? Well, then I have the browser extension for you! Tab for Trees helps plant new trees every time you open a new tab. Check it out - it’s free!',
    twitterButtonTitle:
      'I joined Tab for Trees and now every tab I open helps plant trees to combat climate change! Check it out - it’s free! 🌳🤍',
    redditButtonTitle: 'Combat climate change with your browser tabs',
    tumblrTitle: 'Combat climate change with your browser tabs',
    tumblrCaption:
      'Every time I open a new tab, I’m helping plant trees with The Eden Reforestation Projects. Join Tab for Trees for free and start making an impact today! 🌳🤍',
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
    primaryColor: '#0FAF7F',
    secondaryColor: '#29BEBA',
  },
}

export default data
