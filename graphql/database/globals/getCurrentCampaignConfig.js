import createCampaignConfiguration from './createCampaignConfiguration'

// @tree-planting-campaign
const TREE_CAMPAIGN_START_TIME_ISO = '2020-11-30T17:00:00.000Z'
const TREE_CAMPAIGN_END_TIME_ISO = '2021-01-05T20:00:00.000Z'

// @tree-planting-campaign
// The tree planting campaign has hardcoded copy, so much of
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
// const campaignEndDescriptionTwo =
//   '#### This is only part of [our relief efforts](https://tab.gladly.io/covid-19/) for this global health crisis—more to come soon.'

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'TreePlantingDec2020',
  charityId: '67d1d576-4ab1-43dd-970c-3537cd13d476',
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
    whenTimeEnds: true,
  },
  goal: {
    impactUnitSingular: 'heart',
    impactUnitPlural: 'hearts',
    impactVerbPastParticiple: 'donated',
    impactVerbPastTense: 'donated',
    limitProgressToTargetMax: true,
    numberSource: 'newUsers', // One of: hearts, moneyRaised, newUsers, tabsOpened
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
    start: TREE_CAMPAIGN_START_TIME_ISO,
    end: TREE_CAMPAIGN_END_TIME_ISO,
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
