import { getCurrentCampaign } from './getCampaignData'

/**
 * Return data about any currently-live campaign.
 * @return {Promise<Object>} campaign - a Promise that resolves into a
 *   Campaign object.
 * @return {Boolean} campaign.isLive - whether we should show the campaign
 *   on the new tab page.
 * @return {String|undefined} campaign.id - the unique ID of the campaign.
 *   This may be undefined if the campaign is not live.
 */
const getCampaign = async () => {
  const campaign = getCurrentCampaign()
  if (!campaign || !campaign.isLive) {
    return {
      isLive: false,
    }
  }
  return {
    isLive: campaign.isLive,
    ...(campaign.isLive && {
      id: campaign.id,
    }),
  }
}

export default getCampaign
