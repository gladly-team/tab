import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## COVID-19 Relief: No Kid Hungry'
const campaignDescription = `
#### Nearly 22 million low-income kids rely on the free and reduced-price meals they receive at school. With schools closed, children may be left without that critical lifeline to healthy meals.
#### In this phase of our [COVID-19 relief](https://tab.gladly.io/covid-19/), we're supporting [No Kid Hungry](https://www.nokidhungry.org/coronavirus) to make sure all children have access to nutritious meals throughout the crisis.
#### During this campaign, funds will be automatically directed toward this cause. Open some tabs, encourage your friends to do the same, and help us provide 25,000 meals to kids in need.
`
const campaignEndTitle = '## COVID-19 Relief: We Gave 25,000 Meals'
const campaignEndDescription = `
#### With your help, we gave **25,000 meals** to hungry children via [No Kid Hungry](https://www.nokidhungry.org/coronavirus)! Thank you for helping vulnerable kids access food in this crisis.
#### Share this achievement:
`
const campaignEndDescriptionTwo =
  '#### This is only part of [our relief efforts](https://tab.gladly.io/covid-19/) for this global health crisis—more to come soon.'

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'NoKidHungryApril2020',
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
    impactVerbPastTense: 'given',
    limitProgressToTargetMax: true,
    numberSource: 'moneyRaised',
    showProgressBarLabel: true,
    showProgressBarEndText: false,
    targetNumber: 25000,
    transformNumberSourceValue: moneyRaised => {
      // It costs $USD 1 for 10 meals.
      return Math.floor(moneyRaised / 10)
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
      main: '#f26e2b',
      light: '#94989e',
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
