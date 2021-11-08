import createCampaignConfiguration from './createCampaignConfiguration'

// @nov-2021-campaign
// TODO: update (dashboard view, dashboard component, server-side)
const NOV2021_CAMPAIGN_START_TIME_ISO = '2021-11-08T10:00:00.000Z'
const NOV2021_CAMPAIGN_END_TIME_ISO = '2021-12-06T16:00:00.000Z'

// @nov-2021-campaign
// The Nov2021 campaign has hardcoded copy, so much of
// this is currently unused.

const campaignTitle = '## X'
const campaignDescription = `
#### X
`

// const campaignDescriptionTwo = ``

const campaignEndTitle = '## X'
const campaignEndDescription = `
#### X
`

// #### If you have a charitable cause that is close to your heart and want it featured as a Spotlight Charity, contact us or drop a comment through our Instagram [@tabforacause](https://www.instagram.com/tabforacause/) to tell us about it!

// const campaignEndDescriptionTwo =
//   '#### This is only part of [our relief efforts](https://tab.gladly.io/covid-19/) for this global health crisis—more to come soon.'

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'Nov2021Custom',
  charityId: '910ed420-e479-4d77-b806-27dc9e3350c7', // nov-2021-campaign: TODO
  content: {
    titleMarkdown: campaignTitle,
    descriptionMarkdown: campaignDescription,
    // descriptionMarkdownTwo: campaignDescriptionTwo,
  },
  countMoneyRaised: false,
  countNewUsers: true,
  countTabsOpened: false,
  // Logic on when to end the campaign.
  endTriggers: {
    whenGoalAchieved: false,
    whenTimeEnds: false,
  },
  goal: {
    impactUnitSingular: 'heart',
    impactUnitPlural: 'hearts',
    impactVerbPastParticiple: 'donated',
    impactVerbPastTense: 'donated',
    limitProgressToTargetMax: false,
    numberSource: 'newUsers', // One of: hearts, moneyRaised, newUsers, tabsOpened
    showProgressBarLabel: true,
    showProgressBarEndText: false,
    targetNumber: 100,
    // transformNumberSourceValue: num => {
    //   // return 9e6
    //   return Math.floor(num / 50)
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
  showCountdownTimer: false,
  showHeartsDonationButton: true,
  showProgressBar: false,
  showSocialSharing: false,
  // socialSharing: {
  //   url: 'https://tab.gladly.io',
  //   FacebookShareButtonProps: {
  //     quote:
  //       'This week, I am helping 100 students learn to read through an amazing organization, Room to Read. The best part is I am doing it for free! Join Tab for a Cause to help us meet our goal by the end of the week. 📖❤️',
  //   },
  //   // RedditShareButtonProps: {
  //   //   title:
  //   //     'Browser tabs transformed into bailouts for low-income people through Tab for a Cause & The Bail Project',
  //   // },
  //   TumblrShareButtonProps: {
  //     title: 'Support Trans Lifeline by opening browser tabs',
  //     caption:
  //       'This week, I am helping 100 students learn to read through an amazing organization, Room to Read. The best part is I am doing it for free! Join Tab for a Cause to help us meet our goal by the end of the week. 📖❤️',
  //   },
  //   TwitterShareButtonProps: {
  //     title:
  //       'This week, I am helping 100 students learn to read through an amazing organization, Room to Read. The best part is I am doing it for free! Join Tab for a Cause to help us meet our goal by the end of the week. 📖❤️',
  //     related: ['@TabForACause'],
  //   },
  // },
  theme: {
    color: {
      main: '#f26122',
      light: '#94989e',
    },
  },
  time: {
    start: NOV2021_CAMPAIGN_START_TIME_ISO,
    end: NOV2021_CAMPAIGN_END_TIME_ISO,
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
