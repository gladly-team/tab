import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## Support Justice: NAACP Legal Defense Fund'
const campaignDescription = `
#### As much as ever, we need to demand justice and wellbeing for people of color.
#### Through litigation, advocacy, and public education, the [NAACP Legal Defense Fund](https://www.naacpldf.org/) seeks structural changes to expand democracy, eliminate disparities, and achieve racial justice.
#### Join us in supporting the NAACP LDF's efforts to fulfill the promise of equality for all Americans.
`
const campaignDescriptionTwo = `
##### Want to do more? [Learn how else you can help.](http://www.bit.ly/AllyGuideBLM)
`

const campaignEndTitle = '## Thanks for Supporting Racial Justice'
const campaignEndDescription = `
#### With your help, we raised thousands of dollars for the [NAACP Legal Defense Fund's](https://www.naacpldf.org/) fight for racial justice.

#### [Read more here](http://www.bit.ly/AllyGuideBLM) about other ways you can support people of color with donations, time, and your voice.
`
// const campaignEndDescriptionTwo =
//   '#### This is only part of [our relief efforts](https://tab.gladly.io/covid-19/) for this global health crisis—more to come soon.'

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'NAACPLDFJune2020',
  charityId: '3539509f-2c67-4dcc-b4e9-568606bd087e',
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
    whenGoalAchieved: true,
    whenTimeEnds: false,
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
    // transformNumberSourceValue: moneyRaised => {
    //   return Math.floor(moneyRaised / 0.1)
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
    showHeartsDonationButton: false,
    showSocialSharing: false,
    // socialSharing: {
    //   url: 'https://tab.gladly.io/covid-19/',
    //   FacebookShareButtonProps: {
    //     quote:
    //       'We just raised thousands of dollars for Doctors Without Borders. And all we did was open browser tabs.',
    //   },
    //   RedditShareButtonProps: {
    //     title: 'Tabs transformed into vital healthcare',
    //   },
    //   TumblrShareButtonProps: {
    //     title: 'Tabs transformed into healthcare',
    //     caption:
    //       'We just raised thousands of dollars for Doctors Without Borders. And all we did was open browser tabs',
    //   },
    //   TwitterShareButtonProps: {
    //     title:
    //       'On @TabForACause, We just raised thousands of dollars for Doctors Without Borders (@MSF_USA). And all we did was open browser tabs. #tabsTransformed',
    //     related: ['@TabForACause'],
    //   },
    // },
  },
  showCountdownTimer: false,
  showHeartsDonationButton: true,
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
    start: '2020-06-02T18:00:00.000Z',
    end: '2020-10-20T18:00:00.000Z',
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
