import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## COVID-19 Food Bank Support'
const campaignDescription = `
#### Thanks to you, we raised thousands of dollars for the [World Health Organization](https://www.who.int/) over the last few days. In addition to health systems, COVID-19 has strained the ability of food banks to take care of people in need. The next phase of our support will help the [Food Bank for New York City](https://www.foodbanknyc.org/covid-19/) keep families fed during this crisis.
#### During this campaign, tabs you open are providing meals for our compatriots in NYC. Together, we can feed thousands of people in need, so please open a few tabs and encourage your friends to do the same!
`
const campaignEndTitle = '## Thank You for Giving Food'
const campaignEndDescription = `
#### With your help, we gave thousands of meals to people in New York City who have been hurt by the COVID-19 crisis.
`

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'NYCFoodBank2020',
  charityId: null,
  content: {
    titleMarkdown: campaignTitle,
    descriptionMarkdown: campaignDescription,
  },
  countMoneyRaised: true,
  countNewUsers: false,
  countTabsOpened: false,
  endContent: {
    titleMarkdown: campaignEndTitle,
    descriptionMarkdown: campaignEndDescription,
  },
  goal: {
    impactUnitSingular: 'meal',
    impactUnitPlural: 'meals',
    impactVerbPastTense: 'given',
    numberSource: 'moneyRaised',
    targetNumber: 10000,
    transformNumberSourceValue: moneyRaised => {
      // The moneyRaised value is in $USD, and it costs $0.20 per meal.
      return Math.floor(moneyRaised * 5)
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

// We can call methods on this, instead of using the CampaignData object,
// if we don't need dynamic data (e.g. the charity or goal data). This
// saves additional hits to the database.
/**
 * Return the CampaignConfiguration object for the current campaign.
 * @return {Promise<Object>} campaignConfig- see createCampaignConfiguration
 *   for structure.
 */
const getCurrentCampaignConfig = () => {
  const isLive = process.env.IS_GLOBAL_CAMPAIGN_LIVE === 'true' || false
  return {
    ...CURRENT_CAMPAIGN,
    isLive,
  }
}

export default getCurrentCampaignConfig
