import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## Western Wildfire Response: DirectRelief'
const campaignDescription = `
#### Historic fires across the entire West Coast are forcing families to evacuate, destroying ecosystems, and sending smoke across the globe. As a result, [DirectRelief](https://www.directrelief.org/) is providing Wildfire Health Kits, KN95 & N95 masks, and medical resources to first responders in the affected areas.
#### Join us in supporting DirectRelief, and invite your friends to help us reach our goal of 8M hearts!
#### **Update:** Thanks to your support, we reached our heart goal in just a few days—so let's shoot for 10M hearts!
`
// const campaignDescriptionTwo = ``

const campaignEndTitle = '## Thank You for Supporting DirectRelief!'
const campaignEndDescription = `
#### Thank you! Every time you tab, you are aiding charitable causes like [DirectRelief](https://www.directrelief.org/). The funds raised will help provide resources to first responders and healthcare agencies in the wildfire affected areas.
#### If you have a charitable cause that is close to your heart and want it featured as a spotlight campaign, contact us or drop a comment through our Instagram [@tabforacause](https://www.instagram.com/tabforacause/) to tell us about it!
`
// const campaignEndDescriptionTwo =
//   '#### This is only part of [our relief efforts](https://tab.gladly.io/covid-19/) for this global health crisis—more to come soon.'

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'DirectReliefSep2020',
  charityId: '8cb56329-ea93-416b-b5ca-9e8d60554e5a',
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
      main: '#FE5000',
      light: '#94989e',
    },
  },
  time: {
    start: '2020-09-17T18:00:00.000Z',
    end: '2020-09-30T19:00:00.000Z',
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
