import { isNil } from 'lodash/lang'
import getCurrentCampaignConfig from './getCurrentCampaignConfig'

const createCampaignData = async (userContext, campaignConfig) => {
  const {
    campaignId,
    content,
    getCharityData,
    goal,
    incrementNewUserCount,
    incrementTabCount,
    isActive,
    isLive,
    showCountdownTimer,
    showHeartsDonationButton,
    showProgressBar,
    theme,
    time,
  } = campaignConfig

  // Fetch the charity.
  const charity = await getCharityData(userContext)

  // If there is a goal, fetch the current goal number.
  let goalWithData
  if (!isNil(goal)) {
    const {
      getCurrentNumber,
      impactUnitSingular,
      impactUnitPlural,
      impactVerbPastTense,
      limitProgressToTargetMax,
      targetNumber,
    } = goal
    const currentNumber = await getCurrentNumber(userContext)
    goalWithData = {
      currentNumber,
      impactUnitSingular,
      impactUnitPlural,
      impactVerbPastTense,
      limitProgressToTargetMax,
      targetNumber,
    }
  }

  return {
    campaignId,
    ...(charity && { charity }),
    content,
    ...(goalWithData && { goal: goalWithData }),
    incrementNewUserCount,
    incrementTabCount,
    isActive,
    isLive,
    showCountdownTimer,
    showHeartsDonationButton,
    showProgressBar,
    theme,
    time,
  }
}

// If the caller doesn't need dynamic data (e.g. the charity or goal data), it
// can use the CampaignConfiguration object from getCurrentCampaignConfig.js
// rather than using this CampaignData object. Doing so saves additional hits
// to the database.
/**
 * Return the CampaignData object for the current campaign.
 * @return {Promise<Object>} campaignData - see createCampaignConfiguration for
 *   structure.
 */
const getCampaign = async userContext => {
  return createCampaignData(userContext, getCurrentCampaignConfig())
}

export default getCampaign
