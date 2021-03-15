import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = `## Spotlight: Black Women's Health Imperative`
const campaignDescription = `
#### This past year we have seen the incredible need to prioritize our health and wellness!
#### [Black Women's Health Imperative](https://bwhi.org/) is taking action through signature programs that focus on diabetes preemptive care, intimate partner violence, leadership in the community, HIV care, and the de-stigmatization of periods.
#### Join us this month in supporting Black women's health and invite your friends to do the same!

`
// const campaignDescriptionTwo = ``

const campaignEndTitle = '## Thank You for Supporting BWHI!'
const campaignEndDescription = `
#### Every Heart donated towards charitable causes like [Black Women's Health Imperative](https://bwhi.org/) adds up, and the result is something to be proud of. These funds raised will help support amazing programs working to promote leadership, prevent HIV, and much more!
#### If you have a charitable cause that is close to your heart and want it featured as a Spotlight Charity, contact us or drop a comment through our [Instagram](https://www.instagram.com/tabforacause/) @tabforacause to tell us about it!
`
// const campaignEndDescriptionTwo =
//   '#### This is only part of [our relief efforts](https://tab.gladly.io/covid-19/) for this global health crisis—more to come soon.'

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'BWHIMar2021',
  charityId: '6aec7956-7637-4547-80db-575db8beb277',
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
      main: '#e63730',
      light: '#94989e',
    },
  },
  time: {
    start: '2021-03-15T10:00:00.000Z',
    end: '2021-03-22T18:00:00.000Z',
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
