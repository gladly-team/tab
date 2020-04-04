import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## COVID-19 Food Bank Support'
const campaignDescription = `
#### Thanks to you, our community [raised thousands of dollars](https://tab.gladly.io/covid-19/) for the World Health Organization over the last few days.
#### In addition to health systems, COVID-19 has strained the ability of food banks to take care of people in need. The next phase of our support will help the [Food Bank for New York City](https://www.foodbanknyc.org/covid-19/) keep families fed during this crisis.
#### Right now, tabs you open are providing meals for our fellow humans in NYC. Together, we can feed thousands of people in need—so please open a few tabs and encourage your friends to do the same!
`
const campaignEndTitle = '## Thank You for Giving Food'
const campaignEndDescription = `
#### With your help, we gave thousands of meals to people in New York City who have been hurt by the COVID-19 crisis.
`

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'NYCFoodBank2020',
  // charityId: undefined,
  content: {
    titleMarkdown: campaignTitle,
    descriptionMarkdown: campaignDescription,
  },
  countMoneyRaised: true,
  countNewUsers: false,
  countTabsOpened: false,
  // Logic on when to end the campaign.
  endTriggers: {
    whenGoalAchieved: true,
    whenTimeEnds: false,
  },
  goal: {
    impactUnitSingular: 'meal',
    impactUnitPlural: 'meals',
    impactVerbPastParticiple: 'given',
    impactVerbPastTense: 'gave',
    limitProgressToTargetMax: true,
    numberSource: 'moneyRaised',
    showProgressBarLabel: true,
    showProgressBarEndText: false,
    targetNumber: 10000,
    transformNumberSourceValue: moneyRaised => {
      // The moneyRaised value is in $USD, and it costs $0.20 per meal.
      return Math.floor(moneyRaised * 5)
    },
  },
  // Modifications to the campaign when the campaign has
  // ended.
  onEnd: {
    content: {
      titleMarkdown: campaignEndTitle,
      descriptionMarkdown: campaignEndDescription,
    },
    goal: {
      // Replace the progress bar labels with the ending text.
      showProgressBarLabel: false,
      showProgressBarEndText: true,
    },
  },
  showCountdownTimer: false,
  showHeartsDonationButton: false,
  showProgressBar: true,
  theme: {
    color: {
      main: '#ff7314',
      light: '#f6924e',
    },
  },
  time: {
    start: '2020-03-31T16:00:00.000Z',
    end: '2020-04-14T18:00:00.000Z',
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
