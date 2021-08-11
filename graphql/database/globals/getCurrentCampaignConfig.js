import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## Back to School: Placeholder'
const campaignDescription = `
#### Cupcake ipsum dolor sit amet. Sesame snaps cake tiramisu candy lollipop tart donut macaroon. Pastry ice cream caramels apple pie biscuit jelly-o bonbon cheesecake. Ice cream jujubes macaroon jelly chocolate topping brownie toffee apple pie.
`
// const campaignDescriptionTwo = ``

const campaignEndTitle = '## Thank you for supporting Room to Read!'
const campaignEndDescription = `
#### Cupcake ipsum dolor sit amet. Sesame snaps cake tiramisu candy lollipop tart donut macaroon. Pastry ice cream caramels apple pie biscuit jelly-o bonbon cheesecake. Ice cream jujubes macaroon jelly chocolate topping brownie toffee apple pie.
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
    whenGoalAchieved: true,
    whenTimeEnds: true,
  },
  goal: {
    impactUnitSingular: 'year of reading support to a child',
    impactUnitPlural: 'yearss of reading support to a child',
    impactVerbPastParticiple: 'given',
    impactVerbPastTense: 'gave',
    limitProgressToTargetMax: true,
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
  showSocialSharing: false,
  // socialSharing: {
  //   url: 'https://tab.gladly.io',
  //   FacebookShareButtonProps: {
  //     quote:
  //       'This month, support RAINN on @TabForACause! It’s an amazing organization committed to offering support to survivors of sexual assault through its national hotline and local programs.',
  //   },
  //   // RedditShareButtonProps: {
  //   //   title:
  //   //     'Browser tabs transformed into bailouts for low-income people through Tab for a Cause & The Bail Project',
  //   // },
  //   TumblrShareButtonProps: {
  //     title: 'Support Trans Lifeline by opening browser tabs',
  //     caption:
  //       'This month, support RAINN on @TabForACause! It’s an amazing organization committed to offering support to survivors of sexual assault through its national hotline and local programs.',
  //   },
  //   TwitterShareButtonProps: {
  //     title:
  //       'This month, support RAINN on @TabForACause! It’s an amazing organization committed to offering support to survivors of sexual assault through its national hotline and local programs.',
  //     related: ['@TabForACause'],
  //   },
  // },
  theme: {
    color: {
      main: '#49b6cf',
      light: '#94989e',
    },
  },
  time: {
    start: '2021-08-25T16:00:00.000Z',
    end: '2021-09-01T20:00:00.000Z',
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
