import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## COVID-19 Relief: Doctors Without Borders'
const campaignDescription = `
#### As COVID-19 continues to spread, it will stress health systems around the globe. In this phase of our [COVID-19 relief](https://tab.gladly.io/covid-19/), we're supporting [Doctors Without Borders](https://www.doctorswithoutborders.org/covid19) and their efforts to ensure access to quality healthcare around the world.
#### In response to COVID-19, Doctors Without Borders is fighting on multiple fronts—caring for patients, offering health education and mental health support, and providing training for vital infection control measures in health facilities around the world. Join us as we support their vital services by opening tabs and donating hearts.
`
const campaignEndTitle = '## Support for Doctors Without Borders'
const campaignEndDescription = `
#### With your help, we raised thousands of dollars to provide medical services through [Doctors Without Borders](https://www.doctorswithoutborders.org/covid19)! Thank you for helping health systems in their fight against COVID-19.
#### Share this achievement:
`
const campaignEndDescriptionTwo =
  '#### This is only part of [our relief efforts](https://tab.gladly.io/covid-19/) for this global health crisis—more to come soon.'

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'MSFApril2020',
  charityId: '8f92a859-057f-462f-bb99-ad68a7caf5de',
  content: {
    titleMarkdown: campaignTitle,
    descriptionMarkdown: campaignDescription,
  },
  countMoneyRaised: false,
  countNewUsers: false,
  countTabsOpened: false,
  // Logic on when to end the campaign.
  endTriggers: {
    whenGoalAchieved: true,
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
    targetNumber: 20e6,
    // transformNumberSourceValue: moneyRaised => {
    //   return Math.floor(moneyRaised / 0.1)
    // },
  },
  // Modifications to the campaign when the campaign has
  // ended.
  onEnd: {
    content: {
      titleMarkdown: campaignEndTitle,
      descriptionMarkdown: campaignEndDescription,
      descriptionMarkdownTwo: campaignEndDescriptionTwo,
    },
    goal: {
      // Keep the progress bar label instead of the ending text.
      showProgressBarLabel: true,
      showProgressBarEndText: false,
    },
    showHeartsDonationButton: false,
    showSocialSharing: true,
    socialSharing: {
      url: 'https://tab.gladly.io/covid-19/',
      FacebookShareButtonProps: {
        quote:
          'We just raised thousands of dollars for Doctors Without Borders. And all we did was open browser tabs.',
      },
      RedditShareButtonProps: {
        title: 'Tabs transformed into vital healthcare',
      },
      TumblrShareButtonProps: {
        title: 'Tabs transformed into healthcare',
        caption:
          'We just raised thousands of dollars for Doctors Without Borders. And all we did was open browser tabs',
      },
      TwitterShareButtonProps: {
        title:
          'On @TabForACause, We just raised thousands of dollars for Doctors Without Borders (@MSF_USA). And all we did was open browser tabs. #tabsTransformed',
        related: ['@TabForACause'],
      },
    },
  },
  showCountdownTimer: false,
  showHeartsDonationButton: true,
  showProgressBar: true,
  showSocialSharing: false,
  // socialSharing: undefined,
  theme: {
    color: {
      main: '#e00',
      light: '#94989e',
    },
  },
  time: {
    start: '2020-04-27T16:00:00.000Z',
    end: '2020-08-20T18:00:00.000Z',
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
