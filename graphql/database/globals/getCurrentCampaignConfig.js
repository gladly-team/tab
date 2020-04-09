import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## COVID-19 Relief: Clean Water for 2,000'
const campaignDescription = `
#### The pandemic's impact on low-income countries will likely be devastating, especially where people do not have access to clean water, soap, or an adequate health system.
#### This phase of our relief efforts supports [Evidence Action](https://www.evidenceaction.org/responding-to-covid-19/) as they rapidly provide access to clean water and sanitation to people who need it most.
#### Spread the word and open a few tabs to help give **2,000 people access to clean water** for a year.
##### *COVID-19 relief continues: last week, we [gave 10,000 meals](https://tab.gladly.io/covid-19/) to families in NYC.*
`
const campaignEndTitle = '## Clean Water for 2,000 People'
const campaignEndDescription = `
#### With your help, we provided **clean water access to 2,000 people** for one year through [Evidence Action](https://www.evidenceaction.org/responding-to-covid-19/)! Thank you for providing critical resources to vulnerable communities to bolster their efforts against COVID-19.
#### Share this important milestone:
`
const campaignEndDescriptionTwo =
  '#### This is only part of [our relief efforts](https://tab.gladly.io/covid-19/) for this global health crisis—more to come soon.'

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'EvidenceActionApril2020',
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
    impactUnitSingular: 'person',
    impactUnitPlural: 'people',
    impactVerbPastParticiple: 'provided access to clean water',
    impactVerbPastTense: 'provided access to clean water',
    limitProgressToTargetMax: true,
    numberSource: 'moneyRaised',
    showProgressBarLabel: true,
    showProgressBarEndText: false,
    targetNumber: 2000,
    transformNumberSourceValue: moneyRaised => {
      // It costs $USD 1.28 for 1 year of clean water for one person.
      return Math.floor(moneyRaised / 1.28)
    },
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
    showSocialSharing: true,
    socialSharing: {
      url: 'https://tab.gladly.io/covid-19/',
      FacebookShareButtonProps: {
        quote:
          'Fighting COVID-19 is hard without clean water. On Tab for a Cause, we just gave 2,000 people access to a year of clean water—just by opening browser tabs.',
      },
      RedditShareButtonProps: {
        title: 'Tabs transformed into a year of clean water for 2,000 people',
      },
      TumblrShareButtonProps: {
        title: 'Tabs transformed into a year of clean water for 2,000 people',
        caption:
          'We just gave 2,000 people access to a year of clean water—just by opening browser tabs. Join in!',
      },
      TwitterShareButtonProps: {
        title:
          'Fighting #COVID19 is hard without clean water. On @TabForACause, we just gave 2,000 people access to a year of clean water via @EvidenceAction.',
        related: ['@TabForACause'],
      },
    },
  },
  showCountdownTimer: false,
  showHeartsDonationButton: false,
  showProgressBar: true,
  showSocialSharing: false,
  // socialSharing: undefined,
  theme: {
    color: {
      main: '#fe6f87',
      light: '#5e5f5f',
    },
  },
  time: {
    start: '2020-04-08T16:00:00.000Z',
    end: '2020-04-21T18:00:00.000Z',
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
