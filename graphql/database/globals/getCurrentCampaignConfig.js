import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## Join us in supporting Coral Reef Alliance!'
const campaignDescription = `
#### Did you know that **25% of all marine life depends on coral**, yet **75% of coral reefs are currently under attack today**? We must work together to protect coral reefs around the world and create safer environments for them to thrive. This month, Tabbers voted to support Coral Reef Alliance in using science and community engagement to protect coral reefs as January's Spotlight charity.
`

const campaignDescriptionTwo = `
#### Already donated? Invite your friends to support this campaign! ❤️
`

const campaignEndTitle = '## Thanks for supporting Coral Reef Alliance'
const campaignEndDescription = `
#### With your help, we were able to support an incredible organization working to protect our planet through the conservation of coral reefs. Together, we can protect our planet for generations to come!

#### Have a charity suggestion for our next Spotlight Campaign? [Let us know!](https://docs.google.com/forms/d/e/1FAIpQLSfSev1tppuOPKNiZBPQNY1qBkdFdkhydz-0n05kqHMLYr-pqA/viewform)
`

// #### If you have a charitable cause that is close to your heart and want it featured as a Spotlight Charity, contact us or drop a comment through our Instagram [@tabforacause](https://www.instagram.com/tabforacause/) to tell us about it!

// const campaignEndDescriptionTwo =
//   '#### This is only part of [our relief efforts](https://tab.gladly.io/covid-19/) for this global health crisis—more to come soon.'

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'CRAJan2022',
  charityId: 'bfc0b825-5495-4aa3-89c6-05a38a0d2ecd',
  content: {
    titleMarkdown: campaignTitle,
    descriptionMarkdown: campaignDescription,
    descriptionMarkdownTwo: campaignDescriptionTwo,
  },
  countMoneyRaised: false,
  countNewUsers: false,
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
    limitProgressToTargetMax: false,
    numberSource: 'hearts', // One of: hearts, moneyRaised, newUsers, tabsOpened
    showProgressBarLabel: true,
    showProgressBarEndText: false,
    targetNumber: 8e6,
    // transformNumberSourceValue: num => {
    //   // return 9e6
    //   return Math.floor(num / 50)
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
    //   url: 'https://tab.gladly.io',
    //   FacebookShareButtonProps: {
    //     quote:
    //       'Our coral reefs are under attack, and we all need to do our part to help. Join me in supporting Coral Reef Alliance (for free!) on @tabforacause this week.',
    //   },
    //   RedditShareButtonProps: {
    //     title:
    //       'Browser tabs transformed into healthier coral reefs through Tab for a Cause & Coral Reef Alliance',
    //   },
    //   TumblrShareButtonProps: {
    //     title: 'Browser tabs transformed into healthier coral reefs',
    //     caption:
    //       'Our coral reefs are under attack, and we all need to do our part to help. Join me in supporting Coral Reef Alliance (for free!) on @tabforacause this week. 🌊🤍',
    //   },
    //   TwitterShareButtonProps: {
    //     title:
    //       'Our coral reefs are under attack, and we all need to do our part to help. Join me in supporting Coral Reef Alliance (for free!) on @tabforacause this week. 🌊🤍',
    //     related: ['@TabForACause'],
    //   },
    // },
  },
  showCountdownTimer: true,
  showHeartsDonationButton: true,
  showProgressBar: true,
  showSocialSharing: true,
  socialSharing: {
    url: 'https://tab.gladly.io',
    FacebookShareButtonProps: {
      quote:
        'Our coral reefs are under attack, and we all need to do our part to help. Join me in supporting Coral Reef Alliance (for free!) on @tabforacause this week.',
    },
    // RedditShareButtonProps: {
    //   title:
    //     'Browser tabs transformed into healthier coral reefs through Tab for a Cause & Coral Reef Alliance',
    // },
    TumblrShareButtonProps: {
      title: 'Browser tabs transformed into healthier coral reefs',
      caption:
        'Our coral reefs are under attack, and we all need to do our part to help. Join me in supporting Coral Reef Alliance (for free!) on @tabforacause this week. 🌊🤍',
    },
    TwitterShareButtonProps: {
      title:
        'Our coral reefs are under attack, and we all need to do our part to help. Join me in supporting Coral Reef Alliance (for free!) on @tabforacause this week. 🌊🤍',
      related: ['@TabForACause'],
    },
  },
  theme: {
    color: {
      main: '#0093d7',
      light: '#94989e',
    },
  },
  time: {
    start: '2022-01-12T10:00:00.000Z',
    end: '2022-01-20T21:00:00.000Z',
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
