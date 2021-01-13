import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## Help select a new charity partner'
const campaignDescription = `
#### Over the past 6 months, one of the consistent pieces of your feedback has been about filling a gap in the issues addressed by our partner charities: racial justice in the United States. As such, **we are adding a new nonprofit partner that will focus on supporting the Black community**, and we’d love your help in selecting it.
#### We recognize that financial support of one organization will not fix all of the problems at hand or the pain that has been inflicted on the Black community and other communities of color, but we hope to utilize our platform to make even a small impact.
#### Read about [how we selected](https://medium.com/for-a-cause/adding-a-new-charity-partner-509671872127) these 7 amazing organizations and [vote for the ones you would most like to see as our next charity partner](https://forms.gle/qAxTzBvrLyxfMTzE6).
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
  showCountdownTimer: false,
  showHeartsDonationButton: false,
  showProgressBar: false,
  showSocialSharing: false,
  // socialSharing: undefined,
  // theme: {
  //   color: {
  //     main: '#53AF4A',
  //     light: '#94989e',
  //   },
  // },
  time: {
    start: '2021-01-13T16:00:00.000Z',
    end: '2021-04-10T16:00:00.000Z',
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
