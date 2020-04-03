import moment from 'moment'
import { get } from 'lodash/object'
import { isNil } from 'lodash/lang'
import getCurrentCampaignConfig from './getCurrentCampaignConfig'

const createCampaignData = async (userContext, campaignConfig) => {
  const {
    addMoneyRaised,
    campaignId,
    content,
    endTriggers,
    getCharityData,
    goal,
    incrementNewUserCount,
    incrementTabCount,
    isLive,
    onEnd,
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

  // Determine if the campaign has ended.
  let hasCampaignEnded = false
  if (get(endTriggers, 'whenGoalAchieved', false)) {
    if (goalWithData.currentNumber >= goalWithData.targetNumber) {
      hasCampaignEnded = true
    }
  }
  if (get(endTriggers, 'whenTimeEnds', false)) {
    const { end } = time
    if (moment().isAfter(end)) {
      hasCampaignEnded = true
    }
  }

  return {
    // Only update campaign stats if the campaign has not ended.
    addMoneyRaised: !hasCampaignEnded ? addMoneyRaised : async () => {},
    campaignId,
    ...(charity && { charity }),
    content,
    ...(goalWithData && { goal: goalWithData }),
    incrementNewUserCount: !hasCampaignEnded
      ? incrementNewUserCount
      : async () => {},
    incrementTabCount: !hasCampaignEnded ? incrementTabCount : async () => {},
    isLive,
    showCountdownTimer,
    showHeartsDonationButton,
    showProgressBar,
    theme,
    time,
    // If the campaign has ended, update the campaign data
    // with the "onEnd" configuration.
    ...(hasCampaignEnded && onEnd),
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
