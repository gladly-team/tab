import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## COVID-19 Relief: CARE India'
const campaignDescription = `
#### As COVID-19 continues to spread throughout India, communities are desperate for frontline workers and PPE. Please join us in supporting [CARE India](https://www.careindia.org/) to help this community during an incredibly difficult time.
#### CARE India has supplied frontline workers with more than 39,000 PPE kits, along with masks and other supplies so far. They will continue to supply these necessary materials as well as set up temporary COVID-19 hospitals and Care Centres.
#### Already donated all your hearts? Invite your friends to make an impact as well:
`
// const campaignDescriptionTwo = ``

const campaignEndTitle = '## COVID-19 Relief: CARE India'
const campaignEndDescription = `
#### With your help, we raised thousands of dollars to provide PPE and access to frontline workers to those affected by COVID-19 in India. We thank you for helping support [CARE India](https://www.careindia.org/) and for continuing to make a positive impact.
`
// #### If you have a charitable cause that is close to your heart and want it featured as a Spotlight Charity, contact us or drop a comment through our Instagram [@tabforacause](https://www.instagram.com/tabforacause/) to tell us about it!

// const campaignEndDescriptionTwo =
//   '#### This is only part of [our relief efforts](https://tab.gladly.io/covid-19/) for this global health crisis—more to come soon.'

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'CAREIndiaMay2021',
  charityId: 'b95be5b4-2812-4529-bb13-9c9d981bfe2c',
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
    targetNumber: 8e6,
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
        'I just helped raise money for CARE India to help provide access to PPE & temporary hospitals for those affected by COVID-19. With numbers rising every day, these resources are needed more than ever, & I was able to make a difference by just opening browser tabs!',
    },
    // RedditShareButtonProps: {
    //   title:
    //     'Browser tabs transformed into bailouts for low-income people through Tab for a Cause & The Bail Project',
    // },
    TumblrShareButtonProps: {
      title: 'Browser tabs transformed into PPE & temporary hospitals in India',
      caption:
        'I just helped raise money for CARE India to help provide access to PPE & temporary hospitals for those affected by COVID-19. With numbers rising every day, these resources are needed more than ever, & I was able to make a difference by just opening browser tabs!',
    },
    TwitterShareButtonProps: {
      title:
        'I just helped raise money for CARE India to help provide access to PPE & temporary hospitals for those affected by COVID-19. Tthese resources are needed more than ever, & I was able to make a difference by just opening browser tabs! @TabForACause',
      related: ['@TabForACause'],
    },
  },
  theme: {
    color: {
      main: '#0d4c6b',
      light: '#94989e',
    },
  },
  time: {
    start: '2021-05-04T08:00:00.000Z',
    end: '2021-05-11T16:00:00.000Z',
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
