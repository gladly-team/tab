import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## July Spotlight: RAINN'
const campaignDescription = `
#### *Content Warning: Sexual Violence*
#### Join us in supporting [RAINN](https://www.rainn.org/) (Rape, Abuse & Incest National Network), an organization committed to helping “improve the lives of hundreds of thousands of people affected by sexual violence annually”.
#### On average, RAINN supports 844 survivors each day through their victim services programs and “educates more than 130 million people per year on prevention and recovery.”
`
// const campaignDescriptionTwo = ``

const campaignEndTitle =
  '## Thank you for supporting [RAINN](https://www.rainn.org/)!'
const campaignEndDescription = `
#### *Content Warning: Sexual Violence*
#### With your help, we were able to support an incredible organization, supporting survivors of sexual assault. The funds raised not only will benefit their 24/7 national hotline but also help with local programming and lead to changes in legislation.
`

// #### If you have a charitable cause that is close to your heart and want it featured as a Spotlight Charity, contact us or drop a comment through our Instagram [@tabforacause](https://www.instagram.com/tabforacause/) to tell us about it!

// const campaignEndDescriptionTwo =
//   '#### This is only part of [our relief efforts](https://tab.gladly.io/covid-19/) for this global health crisis—more to come soon.'

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'RAINNJuly2021',
  charityId: '0550618f-9ed6-477e-a1a4-21f607c7536f',
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
    whenTimeEnds: true,
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
    targetNumber: 6e6,
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
        'This month, support RAINN on @TabForACause! It’s an amazing organization committed to offering support to survivors of sexual assault through its national hotline and local programs.',
    },
    // RedditShareButtonProps: {
    //   title:
    //     'Browser tabs transformed into bailouts for low-income people through Tab for a Cause & The Bail Project',
    // },
    TumblrShareButtonProps: {
      title: 'Support Trans Lifeline by opening browser tabs',
      caption:
        'This month, support RAINN on @TabForACause! It’s an amazing organization committed to offering support to survivors of sexual assault through its national hotline and local programs.',
    },
    TwitterShareButtonProps: {
      title:
        'This month, support RAINN on @TabForACause! It’s an amazing organization committed to offering support to survivors of sexual assault through its national hotline and local programs.',
      related: ['@TabForACause'],
    },
  },
  theme: {
    color: {
      main: '#11497c',
      light: '#94989e',
    },
  },
  time: {
    start: '2021-07-15T16:00:00.000Z',
    end: '2021-07-20T20:00:00.000Z',
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
