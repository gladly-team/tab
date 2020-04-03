import { isNil } from 'lodash/lang'
import getCurrentCampaignConfig from './getCurrentCampaignConfig'

const createCampaignData = async (userContext, campaignConfig) => {
  const {
    addMoneyRaised,
    campaignId,
    content,
    getCharityData,
    goal,
    incrementNewUserCount,
    incrementTabCount,
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

  // TODO: if one of the "endTriggers" is satisfied, the campaign
  //   has ended. If that's the case:
  //   - merge the "onEnd" campaign settings with the top-level settings
  //   - use a no-op function for incrementNewUserCount,  incrementTabCount,
  //     and addMoneyRaiseds

  return {
    addMoneyRaised,
    campaignId,
    ...(charity && { charity }),
    content,
    ...(goalWithData && { goal: goalWithData }),
    incrementNewUserCount,
    incrementTabCount,
    isLive,
    showCountdownTimer,
    showHeartsDonationButton,
    showProgressBar,
    theme,
    time,
  }
}

/**
 * Return the CampaignData object for the current campaign.
 * @return {Promise<Object>} campaignData - see createCampaignConfiguration for
 *   structure.
 */
const getCampaign = async userContext => {
  return createCampaignData(userContext, getCurrentCampaignConfig())
}

export default getCampaign
