import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## October Spotlight: Trees for the Future'
const campaignDescription = `
#### Climate change has had devastating effects on communities around the world, but there is opportunity to protect our planet and future!
#### [Trees for the Future](https://trees.org/) is working to plant thousands of trees that provide crucial nutrients back to the soil. Beyond this, these trees provide farmers with food security and an opportunity to improve their income.
#### Open some tabs, tell a friend to join, and donate those hearts to support sustainable farming through Trees for the Future!
`
// const campaignDescriptionTwo = ``

const campaignEndTitle = '## Thanks for Supporting Trees for the Future!'
const campaignEndDescription = `
#### Every Heart donated towards charitable causes like [Trees for the Future](https://trees.org/) adds up, and the end result is something to be proud of. These funds raised will help plant trees providing financial security for farmers and a healthier planet. 
#### If you have a charitable cause that is close to your heart and want it featured as a spotlight campaign, contact us or drop a comment through our Instagram [@tabforacause](https://www.instagram.com/tabforacause/) to tell us about it!
`
// const campaignEndDescriptionTwo =
//   '#### This is only part of [our relief efforts](https://tab.gladly.io/covid-19/) for this global health crisis—more to come soon.'

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'TFTF2020',
  charityId: '67d1d576-4ab1-43dd-970c-3537cd13d476',
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
    targetNumber: 10e6,
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
    //   url: 'https://tab.gladly.io/covid-19/',
    //   FacebookShareButtonProps: {
    //     quote:
    //       'We just helped protect 100 families in rainforest communities via Cool Earth. And all we did was open browser tabs.',
    //   },
    //   RedditShareButtonProps: {
    //     title:
    //       'Tabs transformed into vital supplies for 100 families in rainforest communities',
    //   },
    //   TumblrShareButtonProps: {
    //     title:
    //       'Tabs transformed into vital supplies for 100 families in rainforest communities',
    //     caption:
    //       'We just helped protect 100 families in rainforest communities via Cool Earth. And all we did was open browser tabs.',
    //   },
    //   TwitterShareButtonProps: {
    //     title:
    //       'On @TabForACause, we just supplied 100 rainforest families via @coolearth just by opening tabs. #COVID19',
    //     related: ['@TabForACause'],
    //   },
    // },
  },
  showCountdownTimer: true,
  showHeartsDonationButton: true,
  showProgressBar: true,
  showSocialSharing: false,
  // socialSharing: undefined,
  theme: {
    color: {
      main: '#53AF4A',
      light: '#94989e',
    },
  },
  time: {
    start: '2020-10-19T17:00:00.000Z',
    end: '2020-10-26T18:00:00.000Z',
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
