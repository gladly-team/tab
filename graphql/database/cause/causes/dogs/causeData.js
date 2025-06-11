// Cause: Tab for Dogs

// We have a little templating "engine" that replaces placeholders.
/* eslint no-template-curly-in-string: 0 */

import about from './about.md'

const data = {
  id: 'FtiPvpU1p',
  about,
  name: 'Dogs',
  nameForShop: 'Shelter Dogs',
  isAvailableToSelect: true,
  icon: 'dog',
  backgroundImageCategory: 'dogs',
  charityId: '6f0e2d9a-8b3c-4d1e-a5f7-9c8b7a6e5d4f',
  individualImpactEnabled: false, // From the JSON data
  impactType: 'none', // Since group is false in the JSON
  impactVisits: 14, // Based on tabs_per_impact from JSON
  landingPagePath: '/dogs/',
  landingPagePhrase: 'This tab helps shelter dogs',
  slug: 'dogs',
  impact: {
    impactCounterText:
      '**Your positive impact!**\n\nThis shows how many shelter dogs your tabs are helping. Every tab you open provides food, medical care, and shelter for dogs waiting to find their forever homes. Keep it up!',
    claimImpactSubtitle:
      'You did it! You just turned your tabs into support for shelter dogs. Keep it up!',
    impactIcon: 'dog',
    referralRewardNotification:
      'Congrats! You recruited a friend to help shelter dogs just by opening tabs.',
    referralRewardTitle:
      "You're providing support for shelter dogs across the US!",
    referralRewardSubtitle:
      "Congratulations! You're making a huge impact on shelter dogs. Want to help raise even more? Invite a few more friends!",
    impactWalkthroughText:
      "Each time you open a tab, you'll be helping shelter dogs find a home",
    newlyReferredImpactWalkthroughText:
      "You've joined your friend in helping shelter dogs! Open a new tab now to continue making a difference.",
    confirmImpactSubtitle:
      "When you do, you'll be helping shelter dogs find a home",
    walkMeGif: 'dogs/tickle.gif',
  },
  onboarding: {
    steps: [
      {
        title: '### Your tabs are doing great things',
        subtitle:
          'Now, every tab you open works to support shelter dogs across America. Tabbers like you are helping save dogs and bring the nation closer to no-kill. Thank you!\n\n',
        imgName: 'dogs/cattabs.svg',
      },
      {
        title: '### Do more with your squad',
        subtitle:
          'Support shelter dogs even faster with a squad!\n\nYou and your friends can team up to do more good.\n\n',
        imgName: 'dogs/squadcat.svg',
      },
      {
        title: "### It doesn't cost you a thing",
        subtitle:
          "Ads on the new tab page raise money that we give to nonprofits. Most ads aren't good—but these ones are :)\n\n",
        imgName: 'dogs/adcat.svg',
      },
    ],
  },
  sharing: {
    title: '### **Get a friend on board**',
    subtitle:
      '##### Everyone can help shelter dogs: invite a friend to join in.\n\n',
    shareImage: 'dogs/shareDogs2.png',
    sentImage: 'dogs/shareDogs.png',
    imgCategory: 'dogs',
    email: {
      image:
        'https://prod-tab2017-media.gladly.io/img/cause/dogs/emailDogs.png',
      title:
        "We all have a part to play in helping shelter dogs. That's why {{name}} thinks you should join them on Tab for Dogs.",
      about:
        '<div>Tab for Dogs turns your web browser into a force for good. With each tab opened, ad revenue supports Best Friends Animal Society in their mission to save shelter dogs across America.</div>\n\n',
      faq: "We're supporting Best Friends Animal Society to ensure the money raised will directly support their goals to save shelter dogs and bring the nation to no-kill.",
      sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    },
    sendgridEmailTemplateId: 'd-c925270aca954ff3b4c05f436cb52b54',
    facebookButtonTitle:
      "I joined Tab for Dogs, and now every tab I open helps save shelter dogs. Check it out - it's free!",
    twitterButtonTitle:
      "I joined Tab for Dogs, and now every tab I open helps save shelter dogs. Check it out - it's free!",
    redditButtonTitle: 'Help shelter dogs with each tab',
    tumblrTitle: 'Help shelter dogs with each tab',
    tumblrCaption:
      'Every time I open a new tab I am raising money to help shelter dogs. Join for free and start making an impact today!',
  },
  squads: {
    currentMissionAlert: 'Your squad is on a mission to help shelter dogs!',
    currentMissionDetails:
      'Open tabs together to help more shelter dogs find homes.',
    currentMissionStep2: 'Keep opening tabs to support shelter dogs',
    currentMissionStep3: 'Share with friends to help even more dogs',
    currentMissionSummary: 'Help shelter dogs find forever homes',
    impactCounterText: 'Dogs helped by your squad',
    missionCompleteAlert: 'Mission complete! You helped shelter dogs!',
    missionCompleteDescription:
      'Your squad made a real difference for shelter dogs.',
    missionCompleteSubtitle: 'Thanks to you, more dogs will find loving homes',
    squadCounterText: 'Squad members helping dogs',
    squadInviteTemplateId: 'd-squad-dogs-template-placeholder', // Will need to be updated
  },
  theme: {
    primaryColor: '#FF6A08',
    secondaryColor: '#FF7616',
  },
  charityIds: ['d3f7b1e2-4c8a-45e9-b6d2-8f9c1a7e0b3d'],
}

export default data
