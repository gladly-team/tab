import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = `## Spotlight: Asian Mental Health Collective`
const campaignDescription = `
#### This past year, we have seen a rise in violence and discrimination toward Asian and Pacific Islander communities. In response, we invite you to join us in supporting the [Asian Mental Health Collective](https://www.asianmhc.org/)!
#### AMHC is committed to normalizing/de-stigmatizing mental health and making mental health support easily available, approachable, and accessible to Asian communities worldwide.

`
// const campaignDescriptionTwo = ``

const campaignEndTitle = '## Thank you for supporting the AMHC!'
const campaignEndDescription = `
#### With your help, thousands of dollars were raised in support of the amazing programs run by the Asian Mental Health Collective.
#### Want to continue to donate to organizations supporting Asian communities? [Check out some suggested nonprofits and emergency funds here](https://nymag.com/strategist/article/where-to-donate-to-help-asian-communities-2021.html).
`
// const campaignEndDescriptionTwo =
//   '#### This is only part of [our relief efforts](https://tab.gladly.io/covid-19/) for this global health crisis—more to come soon.'

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'AMHCMar2021',
  charityId: '82027e98-ba56-4307-a3cb-a22f30114ca5',
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
    whenGoalAchieved: false, // run the full time
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
    targetNumber: 8e6,
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
    //   url: 'https://tab.gladly.io',
    //   FacebookShareButtonProps: {
    //     quote:
    //       'We are helping extend an immediate lifeline to people who are legally presumed innocent but cannot afford bail! And you can too, by supporting The Bail Project on Tab for a Cause.',
    //   },
    //   RedditShareButtonProps: {
    //     title:
    //       'Browser tabs transformed into bailouts for low-income people through Tab for a Cause & The Bail Project',
    //   },
    //   TumblrShareButtonProps: {
    //     title: 'Browser tabs transformed into bailouts for low-income people',
    //     caption:
    //       'We are helping extend an immediate lifeline to people who are legally presumed innocent but cannot afford bail! And you can too, by supporting The Bail Project on Tab for a Cause.',
    //   },
    //   TwitterShareButtonProps: {
    //     title:
    //       'On @TabForACause, we’re supporting people who are legally presumed innocent but cannot afford bail via @BailProject.  All we had to do? Open browser tabs!',
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
      main: '#116f62',
      light: '#94989e',
    },
  },
  time: {
    start: '2021-03-30T08:00:00.000Z',
    end: '2021-04-07T10:00:00.000Z',
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
