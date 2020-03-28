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
  countNewUsers: false,
  countTabsOpened: false,
  endContent: {
    titleMarkdown: campaignEndTitle,
    descriptionMarkdown: campaignEndDescription,
  },
  goal: {
    targetNumber: 10e6,
    impactUnitSingular: 'Heart',
    impactUnitPlural: 'Hearts',
    impactVerbPastTense: 'donated',
  },
  showCountdownTimer: false,
  showHeartsDonationButton: true,
  showProgressBar: true,
  time: {
    start: '2020-03-25T18:00:00.000Z',
    end: '2020-05-01T18:00:00.000Z',
  },
})

/**
 * Return the hardcoded campaign info for the current campaign.
 * @return {Promise<Object>} campaign
 * @return {String|undefined} campaign.campaignId - the unique ID of the
 *   campaign.
 * @return {Boolean} campaign.isLive - whether we should show the campaign
 *   on the new tab page.
 * @return {Function} campaign.getNewUsersRedisKey - a function that returns
 *   a string of the Redis key value. The Redis item stores the number of new
 *   users who joined during this campaign.
 */
// eslint-disable-next-line import/prefer-default-export
export const getCurrentCampaignHardcodedData = () => {
  const isLive = process.env.IS_GLOBAL_CAMPAIGN_LIVE === 'true' || false
  return {
    ...CURRENT_CAMPAIGN,
    isLive,
  }
}
