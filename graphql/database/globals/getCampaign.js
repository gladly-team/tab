import moment from 'moment'
import { getCurrentCampaignHardcodedData } from './hardcodedCampaignData'
import callRedis from '../../utils/redis'
import logger from '../../utils/logger'

const createCampaign = data => ({
  campaignId: data.campaignId,
  countNewUsers: data.countNewUsers,

  /**
   * Return the Redis key used to store the new user count during this
   * campaign.
   * @return {String} the Redis key
   */
  getNewUsersRedisKey() {
    return `campaign:${this.campaignId}:newUsers`
  },

  /**
   * Return whether the current time is between the campaign's start and
   * end times.
   * @return {Boolean}
   */
  isActive() {
    const timeInfo = data.time
    return moment().isAfter(timeInfo.start) && moment().isBefore(timeInfo.end)
  },

  isLive: data.isLive,
})

export const getCampaignObject = () => {
  return createCampaign(getCurrentCampaignHardcodedData())
}

/**
 * Return data about any currently-live campaign.
 * @return {Promise<Object>} campaign - a Promise that resolves into a
 *   Campaign object.
 * @return {String|undefined} campaign.campaignId - the unique ID of the campaign.
 *   This may be undefined if the campaign is not live.
 * @return {Boolean} campaign.isLive - whether we should show the campaign
 *   on the new tab page.
 */
const getCampaign = async () => {
  const campaign = getCampaignObject()

  if (!campaign || !campaign.isLive) {
    return {
      isLive: false,
    }
  }

  // Try to get the number of new users from this campaign.
  // Default to zero if the item doesn't exist or fails to
  // fetch.
  let numNewUsers = 0
  if (campaign.countNewUsers) {
    try {
      numNewUsers = await callRedis({
        operation: 'GET',
        key: campaign.getNewUsersRedisKey(),
      })
      if (!numNewUsers) {
        numNewUsers = 0
      }
    } catch (e) {
      logger.error(e)
    }
  }

  return {
    isLive: campaign.isLive,
    campaignId: campaign.campaignId,
    numNewUsers,
  }
}

const campaignTitle = '## COVID-19 Solidarity'

const campaignDescription = `
#### The spread of COVID-19 has been swift and destructive. We need a global response to support the health systems working to keep us all safe. As a free, simple, and at-home way to raise money for important causes, we will be running a special campaign for the foreseeable future to raise funds for the response efforts.

#### Donate your hearts to the COVID-19 solidarity fund and support the [World Health Organization](https://www.who.int/) and their partners in a massive effort to help countries prevent, detect, and manage the novel coronavirus—particularly where the needs are the greatest.

#### Join us in supporting the [COVID-19 Solidarity Response Fund](https://www.who.int/emergencies/diseases/novel-coronavirus-2019/donate).
`

const campaignEndTitle = '## Thank You for Supporting the WHO'

const campaignEndDescription = `
#### With your help, the World Health Organization will continue to provide COVID-19 relief, prevention, and detection.
`

const getCampaignTemporary = () => ({
  isLive: true,
  campaignId: 'covid19March2020',
  time: {
    start: '2020-03-25T18:00:00.000Z',
    end: '2020-05-01T18:00:00.000Z',
    // end: '2020-03-26T00:00:00.000Z',
  },
  content: {
    titleMarkdown: campaignTitle,
    descriptionMarkdown: campaignDescription,
  },
  endContent: {
    titleMarkdown: campaignEndTitle,
    descriptionMarkdown: campaignEndDescription,
  },
  goal: {
    targetNumber: 10e6,
    currentNumber: 16.6e6,
    impactUnitSingular: 'Heart',
    impactUnitPlural: 'Hearts',
    impactVerbPastTense: 'donated',
  },
  // numNewUsers: undefined, // probably want to roll into generic goal
  showCountdownTimer: false,
  showHeartsDonationButton: true,
  showProgressBar: true,
  charity: {
    id: '6667eb86-ea37-4d3d-9259-910bea0b5e38',
    image:
      'https://prod-tab2017-media.gladly.io/img/charities/charity-post-donation-images/covid-19-solidarity.jpg',
    imageCaption: null,
    impact:
      'With your help, the World Health Organization will continue to provide COVID-19 relief, prevention, and detection.',
    name: 'COVID-19 Solidarity Response Fund',
    vcReceived: 16474011,
    website:
      'https://www.who.int/emergencies/diseases/novel-coronavirus-2019/donate',
  },
})

export default getCampaignTemporary
