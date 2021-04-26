import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## Spotlight: The Uyghur Human Rights Project'
const campaignDescription = `
#### With another month comes another amazing organization to support!
#### [The Uyghur Human Rights Project](https://uhrp.org/) advocates for and works to protect the Uyghurs, ethnically and culturally Turkic people living in the areas of Central Asia, commonly known as East Turkistan.
#### Reports from East Turkistan document a pattern of abuse, including political imprisonment, torture, and disappearances. We ask you to join us in supporting an organization amplifying the voices affected by these conditions and advocating for positive change!

`
// const campaignDescriptionTwo = ``

const campaignEndTitle = '## Thanks for supporting the UHRP!'
const campaignEndDescription = `
#### Thank you! Every Heart donated towards charitable causes like [The Uyghur Human Rights Project](https://uhrp.org/) adds up, and the result is something to be proud of. These funds raised will aid in advocacy against the abuse of the Uyghur people in East Turkistan. 
#### If you have a charitable cause that is close to your heart and want it featured as a Spotlight Charity, contact us or drop a comment through our Instagram [@tabforacause](https://www.instagram.com/tabforacause/) to tell us about it!
`
// const campaignEndDescriptionTwo =
//   '#### This is only part of [our relief efforts](https://tab.gladly.io/covid-19/) for this global health crisis—more to come soon.'

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'UHRPApr2021',
  charityId: '839030b5-b0e2-43f7-8ce4-c2a50645cd54',
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
    targetNumber: 7e6,
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
      main: '#0d4c6b',
      light: '#94989e',
    },
  },
  time: {
    start: '2021-04-26T08:00:00.000Z',
    end: '2021-05-03T16:00:00.000Z',
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
