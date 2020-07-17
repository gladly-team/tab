import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## COVID-19 Relief: Cool Earth'
const campaignDescription = `
#### The COVID-19  pandemic has created new stresses on households and habitats in the rainforest.
#### As a long-term partner with many rainforest communities, [Cool Earth](https://www.coolearth.org/rainforest-resilience-fund/) is working to provide food and hygiene equipment to keep people safe and healthy, along with resources like seeds and tools to prepare for the coming months.
#### During this campaign, funds will automatically be directed toward supplying 100 families of 6. So please, open some tabs and encourage your friends to do the same!
`
// const campaignDescriptionTwo = ``

const campaignEndTitle = '## COVID-19 Relief: We Supported 100 families'
const campaignEndDescription = `
#### With your help, we gave supplies to **100 indigenous and isolated families** via [Cool Earth](https://www.coolearth.org/rainforest-resilience-fund/)! Thank you for helping protect rainforest communities.

#### Share this achievement:
`
const campaignEndDescriptionTwo =
  '#### This is only part of [our relief efforts](https://tab.gladly.io/covid-19/) for this global health crisis—more to come soon.'

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'CoolEarthJuly2020',
  // charityId: '',
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
    whenTimeEnds: false,
  },
  goal: {
    impactUnitSingular: 'family',
    impactUnitPlural: 'families',
    impactVerbPastParticiple: 'given vital supplies',
    impactVerbPastTense: 'given vital supplies',
    limitProgressToTargetMax: true,
    numberSource: 'moneyRaised', // One of: hearts, moneyRaised, newUsers, tabsOpened
    showProgressBarLabel: true,
    showProgressBarEndText: false,
    targetNumber: 100,
    transformNumberSourceValue: moneyRaised => {
      // $47.31 provides 1 family with supplies.
      return Math.floor(moneyRaised / 47.31)
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
    showHeartsDonationButton: false,
    showSocialSharing: true,
    socialSharing: {
      url: 'https://tab.gladly.io/covid-19/',
      FacebookShareButtonProps: {
        quote:
          'We just helped protect 100 families in rainforest communities via Cool Earth. And all we did was open browser tabs.',
      },
      RedditShareButtonProps: {
        title:
          'Tabs transformed into vital supplies for 100 families in rainforest communities',
      },
      TumblrShareButtonProps: {
        title:
          'Tabs transformed into vital supplies for 100 families in rainforest communities',
        caption:
          'We just helped protect 100 families in rainforest communities via Cool Earth. And all we did was open browser tabs.',
      },
      TwitterShareButtonProps: {
        title:
          'On @TabForACause, we just supplied 100 rainforest families via @coolearth just by opening tabs. #COVID19',
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
      main: '#003f4e',
      light: '#94989e',
    },
  },
  time: {
    start: '2020-07-17T10:00:00.000Z',
    end: '2020-12-01T18:00:00.000Z',
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
