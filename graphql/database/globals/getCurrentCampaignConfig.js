import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## Happy Hispanic Heritage Month!'
const campaignDescription = `
#### In celebration of Hispanic Heritage Month, Tab for a Cause is proud to support [United We Dream](https://unitedwedream.org/) through October 15.

#### United We Dream is a youth-led organization working to ensure all immigrants, regardless of documentation status or country of origin, are provided with resources to ensure they are supported and empowered.

#### To stay involved with this celebration follow us on Instagram and TikTok (@tabforacause)! We will be posting interesting information and personal stories all month long.
`

// const campaignDescriptionTwo = ``

const campaignEndTitle = '## Happy Hispanic Heritage Month!'
const campaignEndDescription = `
#### In celebration of Hispanic Heritage Month, Tab for a Cause is proud to support [United We Dream](https://unitedwedream.org/) through October 15.
`

// #### If you have a charitable cause that is close to your heart and want it featured as a Spotlight Charity, contact us or drop a comment through our Instagram [@tabforacause](https://www.instagram.com/tabforacause/) to tell us about it!

// const campaignEndDescriptionTwo =
//   '#### This is only part of [our relief efforts](https://tab.gladly.io/covid-19/) for this global health crisis—more to come soon.'

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'UWDSep2021',
  charityId: '910ed420-e479-4d77-b806-27dc9e3350c7',
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
    whenGoalAchieved: false,
    whenTimeEnds: false,
  },
  goal: {
    impactUnitSingular: 'heart',
    impactUnitPlural: 'hearts',
    impactVerbPastParticiple: 'donated',
    impactVerbPastTense: 'donated',
    limitProgressToTargetMax: false,
    numberSource: 'hearts', // One of: hearts, moneyRaised, newUsers, tabsOpened
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
    start: '2021-09-15T10:00:00.000Z',
    end: '2021-10-15T18:00:00.000Z',
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
