import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## Charity Spotlight: Trans Lifeline'
const campaignDescription = `
#### Happy Pride! Join us in celebrating LGBTQIA+ Pride Month by supporting Trans Lifeline, an organization committed to "offering direct emotional and financial support to trans people in crisis."
#### So far they have answered over 100,000 calls and dispersed over $1,000,000 to help create a future where trans people have the care everyone needs and deserves.
#### Already donated all your hearts? Invite your friends to make an impact by supporting this campaign!
`
// const campaignDescriptionTwo = ``

const campaignEndTitle = '## Thank you for your support!'
const campaignEndDescription = `
#### Thank you for supporting [Trans Lifeline](https://translifeline.org/), an incredible trans-led organization! The funds raised not only will impact their peer led hotline but also help with the distribution of microgrants.
`
// #### If you have a charitable cause that is close to your heart and want it featured as a Spotlight Charity, contact us or drop a comment through our Instagram [@tabforacause](https://www.instagram.com/tabforacause/) to tell us about it!

// const campaignEndDescriptionTwo =
//   '#### This is only part of [our relief efforts](https://tab.gladly.io/covid-19/) for this global health crisis—more to come soon.'

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'TransLifelineJune2021',
  charityId: 'fe395423-6ceb-493c-a1df-c88f98a53894',
  content: {
    titleMarkdown: campaignTitle,
    descriptionMarkdown: campaignDescription,
    // descriptionMarkdownTwo: campaignDescriptionTwo,
  },
  countMoneyRaised: false,
  countNewUsers: false,
  countTabsOpened: false,
  // Logic on when to end the campaign.
  endTriggers: {
    whenGoalAchieved: true,
    whenTimeEnds: true,
  },
  goal: {
    impactUnitSingular: 'heart',
    impactUnitPlural: 'hearts',
    impactVerbPastParticiple: 'donated',
    impactVerbPastTense: 'donated',
    limitProgressToTargetMax: true,
    numberSource: 'hearts', // One of: hearts, moneyRaised, newUsers, tabsOpened
    showProgressBarLabel: true,
    showProgressBarEndText: false,
    targetNumber: 5e6,
    // transformNumberSourceValue: num => {
    //   return 9e6
    // },
  },
  // Modifications to the campaign when the campaign has
  // ended.
  onEnd: {
    content: {
      titleMarkdown: campaignEndTitle,
      descriptionMarkdown: campaignEndDescription,
      // descriptionMarkdownTwo: campaignEndDescriptionTwo,
    },
    goal: {
      // Keep the progress bar label instead of the ending text.
      showProgressBarLabel: true,
      showProgressBarEndText: false,
    },
    showCountdownTimer: false,
    showHeartsDonationButton: false,
    showSocialSharing: false,
    // socialSharing: {
    //   url: 'https://tab.gladly.io',
    //   FacebookShareButtonProps: {
    //     quote:
    //       'I just helped raise money for CARE India to help provide access to PPE & temporary hospitals for those affected by COVID-19. With numbers rising every day, these resources are needed more than ever, & I was able to make a difference by just opening browser tabs!',
    //   },
    //   // RedditShareButtonProps: {
    //   //   title:
    //   //     'Browser tabs transformed into bailouts for low-income people through Tab for a Cause & The Bail Project',
    //   // },
    //   TumblrShareButtonProps: {
    //     title:
    //       'Browser tabs transformed into PPE & temporary hospitals in India',
    //     caption:
    //       'I just helped raise money for CARE India to help provide access to PPE & temporary hospitals for those affected by COVID-19. With numbers rising every day, these resources are needed more than ever, & I was able to make a difference by just opening browser tabs!',
    //   },
    //   TwitterShareButtonProps: {
    //     title:
    //       'I just helped raise money for CARE India to help provide access to PPE & temporary hospitals for those affected by COVID-19. With numbers rising every day, these resources are needed more than ever, & I was able to make a difference by just opening browser tabs! @TabForACause',
    //     related: ['@TabForACause'],
    //   },
    // },
  },
  showCountdownTimer: true,
  showHeartsDonationButton: true,
  showProgressBar: true,
  showSocialSharing: true,
  socialSharing: {
    url: 'https://tab.gladly.io',
    FacebookShareButtonProps: {
      quote:
        'This #PrideMonth, support Trans Lifeline on @TabForACause! It\'s an amazing organization committed to "offering direct emotional and financial support to trans people in crisis."',
    },
    // RedditShareButtonProps: {
    //   title:
    //     'Browser tabs transformed into bailouts for low-income people through Tab for a Cause & The Bail Project',
    // },
    TumblrShareButtonProps: {
      title: 'Support Trans Lifeline by opening browser tabs',
      caption:
        'This #PrideMonth, support Trans Lifeline on @TabForACause! It\'s an amazing organization committed to "offering direct emotional and financial support to trans people in crisis."',
    },
    TwitterShareButtonProps: {
      title:
        'This #PrideMonth, support Trans Lifeline on @TabForACause! It\'s an amazing organization committed to "offering direct emotional and financial support to trans people in crisis."',
      related: ['@TabForACause'],
    },
  },
  theme: {
    color: {
      main: '#887fff',
      light: '#94989e',
    },
  },
  time: {
    start: '2021-06-24T16:00:00.000Z',
    end: '2021-06-30T20:00:00.000Z',
  },
})

/**
 * Return the CampaignConfiguration object for the current campaign.
 * @return {Promise<Object>} campaignConfig- see createCampaignConfiguration
 *   for structure.
 */
const getCurrentCampaignConfig = () => CURRENT_CAMPAIGN

// Outside modules shouldn't use this config. Instead, they should
// call getCampaign.js to get the CampaignData object.
export default getCurrentCampaignConfig
