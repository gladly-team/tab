import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## COVID-19 Relief: Evidence Action'
const campaignDescription = `
#### Thanks to you, our community [provided 10,000 meals](https://tab.gladly.io/covid-19/) through the Food Bank for New York City to help keep families fed during this crisis.
#### In our next phase of relief, we will be providing access to clean water and sanitation through [Evidence Action](https://www.evidenceaction.org/responding-to-covid-19/). COVID-19's impact on low-income countries is likely to be devastating. Evidence Action has the supplies and network to provide these vital resources where they are most needed.
#### Open a few tabs, spread the word, and help us provide 2,000 people with access to clean water.
`
const campaignEndTitle = '## 2,000 People with Clean Water'
const campaignEndDescription = `
#### With your help, we just provided a year of clean water 2,000 people through [Evidence Action](https://www.evidenceaction.org/responding-to-covid-19/).
#### Share this milestone to spread the word:
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
    impactUnitSingular: 'year of clean water',
    impactUnitPlural: 'years of clean water',
    impactVerbPastParticiple: 'provided',
    impactVerbPastTense: 'provided',
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
      // EmailShareButtonProps: {
      //   subject: 'Opening tabs for COVID-19 relief',
      //   body:
      //     "Hey!\n\nI've been opening tabs for COVID-19 relief on Tab for a Cause (https://tab.gladly.io), and we just gave 10,000 meals to the Food Bank for NYC.\n\nIt's free (all you need to do is open tabs in your browser). Join in as we continue to fight this pandemic!",
      // },
      FacebookShareButtonProps: {
        quote:
          'Our community just gave 10,000 meals to the Food Bank for NYC for COVID-19 relief—just by opening browser tabs.',
      },
      RedditShareButtonProps: {
        title: 'Tabs transformed into 10,000 meals for the Food Bank for NYC',
      },
      TumblrShareButtonProps: {
        title: 'Tabs transformed into 10,000 meals COVID-19',
        caption:
          'Our community just gave 10,000 meals to the Food Bank for NYC for COVID-19 relief—just by opening browser tabs. Join in!',
      },
      TwitterShareButtonProps: {
        title:
          'Our community just gave 10,000 meals to the Food Bank for NYC for COVID-19 relief—just by opening browser tabs. Join in!',
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
