import createCampaignConfiguration from './createCampaignConfiguration'

const campaignTitle = '## COVID-19 Solidarity.'
const campaignDescription = `
#### The spread of COVID-19 has been swift and destructive. We need a global response to support the health systems working to keep us all safe. As a free, simple, and at-home way to raise money for important causes, we will be running a special campaign for the foreseeable future to raise funds for the response efforts.
#### Donate your hearts to the COVID-19 solidarity fund and support the [World Health Organization](https://www.who.int/) and their partners in a massive effort to help countries prevent, detect, and manage the novel coronavirus—particularly where the needs are the greatest.
#### Please join us in supporting the [COVID-19 Solidarity Response Fund](https://www.who.int/emergencies/diseases/novel-coronavirus-2019/donate).
`
const campaignEndTitle = '## Thank You for Supporting the WHO'
const campaignEndDescription = `
#### With your help, the World Health Organization will continue to provide COVID-19 relief, prevention, and detection.
`

// Hardcode campaign data here.
const CURRENT_CAMPAIGN = createCampaignConfiguration({
  campaignId: 'covid19March2020',
  charityId: '6667eb86-ea37-4d3d-9259-910bea0b5e38',
  content: {
    titleMarkdown: campaignTitle,
    descriptionMarkdown: campaignDescription,
  },
  countMoneyRaised: false,
  countNewUsers: false,
  countTabsOpened: false,
  endContent: {
    titleMarkdown: campaignEndTitle,
    descriptionMarkdown: campaignEndDescription,
  },
  goal: {
    impactUnitSingular: 'Heart',
    impactUnitPlural: 'Hearts',
    impactVerbPastTense: 'donated',
    numberSource: 'hearts',
    targetNumber: 10e6,
  },
  showCountdownTimer: false,
  showHeartsDonationButton: true,
  showProgressBar: true,
  time: {
    start: '2020-03-25T18:00:00.000Z',
    end: '2020-05-01T18:00:00.000Z',
  },
})

// We can call methods on this, instead of using the CampaignData object,
// if we don't need dynamic data (e.g. the charity or goal data). This
// saves additional hits to the database.
/**
 * Return the CampaignConfiguration object for the current campaign.
 * @return {Promise<Object>} campaignConfig- see createCampaignConfiguration
 *   for structure.
 */
const getCurrentCampaignConfig = () => {
  const isLive = process.env.IS_GLOBAL_CAMPAIGN_LIVE === 'true' || false
  return {
    ...CURRENT_CAMPAIGN,
    isLive,
  }
}

export default getCurrentCampaignConfig
