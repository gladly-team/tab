import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## Support Our Newest Partner: The Bail Project'
const campaignDescription = `
#### We are very excited to welcome [The Bail Project](https://bailproject.org/) as our 10th nonprofit partner! 
#### The Bail Project combats mass incarceration by restoring the presumption of innocence, reuniting families, and fighting the current bail system. Since January 2018, they have bailed out over 15,000 people and counting, and are committed to reforming a historically harmful and racist pre-trial system.
#### Join us in supporting The Bail Project’s efforts to fight for criminal and economic justice.

`
// const campaignDescriptionTwo = ``

const campaignEndTitle = '## Thank You for Supporting The Bail Project!'
const campaignEndDescription = `
#### Thank you! Every time you tab, you are aiding charitable causes like The Bail Project. These funds will help The Bail Project reform a broken pretrial system. In addition, because bail is returned at the end of a case, donations to The Bail Project National Revolving Bail Fund can be reused to pay bail two to three times per year, maximizing the impact of every dollar.
#### Excited about our newest addition to the Tabber family? Share the good news with your friends and invite them to start Tabbing!
`
// const campaignEndDescriptionTwo =
//   '#### This is only part of [our relief efforts](https://tab.gladly.io/covid-19/) for this global health crisis—more to come soon.'

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'BailProjectFeb2021',
  charityId: '6ce5ad8e-7dd4-4de5-ba4f-13868e7d830a',
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
    whenGoalAchieved: false,
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
      main: '#e63730',
      light: '#94989e',
    },
  },
  time: {
    // TODO: make charity item active before campaign launch
    // TODO: update start time before campaign launch
    start: '2021-02-10T10:00:00.000Z',
    end: '2021-03-03T16:00:00.000Z',
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
