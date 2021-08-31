import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## Back to School: Lift Up 100 Students'
const campaignDescription = `
#### While many of you may be preparing for school by picking out a new backpack or color-coordinating your notebooks for each class, many kids around the world will not be returning to school. This year, we ask you to join us in supporting 100 students learning to read through an amazing organization, Room to Read.

#### This week, all tabs will go toward this goal, and you can help us reach it even faster by inviting your friends to join Tab for a Cause! 
`
// const campaignDescriptionTwo = ``

const campaignEndTitle = '## Thanks supporting Room to Read!'
const campaignEndDescription = `
#### Wow! Thank you, Tabbers, for helping us reach our goal of supporting 100 kids learning to read. You can continue to make a difference for children with limited access to education by [donating hearts](https://tab.gladly.io/newtab/profile/donate/) to Room to Read.
`

// #### If you have a charitable cause that is close to your heart and want it featured as a Spotlight Charity, contact us or drop a comment through our Instagram [@tabforacause](https://www.instagram.com/tabforacause/) to tell us about it!

// const campaignEndDescriptionTwo =
//   '#### This is only part of [our relief efforts](https://tab.gladly.io/covid-19/) for this global health crisis—more to come soon.'

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'RoomToReadAug2021',
  charityId: '3caf69b6-9803-4495-9a5c-5ae0316bf367',
  content: {
    titleMarkdown: campaignTitle,
    descriptionMarkdown: campaignDescription,
    // descriptionMarkdownTwo: campaignDescriptionTwo,
  },
  countMoneyRaised: true,
  countNewUsers: false,
  countTabsOpened: false,
  // Logic on when to end the campaign.
  endTriggers: {
    whenGoalAchieved: false,
    whenTimeEnds: true,
  },
  goal: {
    impactUnitSingular: 'child',
    impactUnitPlural: 'children',
    impactVerbPastParticiple: 'provided with a year of reading instruction',
    impactVerbPastTense: 'provided with a year of reading instruction',
    limitProgressToTargetMax: false,
    numberSource: 'moneyRaised', // One of: hearts, moneyRaised, newUsers, tabsOpened
    showProgressBarLabel: true,
    showProgressBarEndText: false,
    targetNumber: 100,
    transformNumberSourceValue: num => {
      // return 9e6
      return Math.floor(num / 50)
    },
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
  showHeartsDonationButton: false,
  showProgressBar: true,
  showSocialSharing: true,
  socialSharing: {
    url: 'https://tab.gladly.io',
    FacebookShareButtonProps: {
      quote:
        'This week, I am helping 100 students learn to read through an amazing organization, Room to Read. The best part is I am doing it for free! Join Tab for a Cause to help us meet our goal by the end of the week. 📖❤️',
    },
    // RedditShareButtonProps: {
    //   title:
    //     'Browser tabs transformed into bailouts for low-income people through Tab for a Cause & The Bail Project',
    // },
    TumblrShareButtonProps: {
      title: 'Support Trans Lifeline by opening browser tabs',
      caption:
        'This week, I am helping 100 students learn to read through an amazing organization, Room to Read. The best part is I am doing it for free! Join Tab for a Cause to help us meet our goal by the end of the week. 📖❤️',
    },
    TwitterShareButtonProps: {
      title:
        'This week, I am helping 100 students learn to read through an amazing organization, Room to Read. The best part is I am doing it for free! Join Tab for a Cause to help us meet our goal by the end of the week. 📖❤️',
      related: ['@TabForACause'],
    },
  },
  theme: {
    color: {
      main: '#4f6571',
      light: '#94989e',
    },
  },
  time: {
    start: '2021-08-25T14:00:00.000Z',
    end: '2021-09-03T18:00:00.000Z',
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
