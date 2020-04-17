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
    showSocialSharing,
    socialSharing,
    theme,
    time,
  } = campaignConfig

  // Fetch the charity.
  const charity = await getCharityData(userContext)

  // If there is a goal, fetch the current goal number.
  let currentGoalNumber
  let targetGoalNumber
  if (!isNil(goal)) {
    const { getCurrentNumber, targetNumber } = goal
    targetGoalNumber = targetNumber
    currentGoalNumber = await getCurrentNumber(userContext)
  }

  // Determine if the campaign has ended.
  let hasCampaignEnded = false
  if (
    get(endTriggers, 'whenGoalAchieved', false) &&
    currentGoalNumber &&
    targetGoalNumber
  ) {
    if (currentGoalNumber >= targetGoalNumber) {
      hasCampaignEnded = true
    }
  }
  if (get(endTriggers, 'whenTimeEnds', false)) {
    const { end } = time
    if (moment().isAfter(end)) {
      hasCampaignEnded = true
    }
  }
  // Useful for reviewing the end of the campaign in our
  // staging environment.
  if (process.env.CAMPAIGN_END_OVERRIDE === 'true') {
    hasCampaignEnded = true
  }

  // Construct the goal data.
  let goalWithData
  if (!isNil(goal)) {
    const {
      impactUnitSingular,
      impactUnitPlural,
      impactVerbPastParticiple,
      impactVerbPastTense,
      showProgressBarLabel,
      showProgressBarEndText,
      limitProgressToTargetMax,
      targetNumber,
    } = goal
    goalWithData = {
      currentNumber: currentGoalNumber,
      impactUnitSingular,
      impactUnitPlural,
      impactVerbPastParticiple,
      impactVerbPastTense,
      limitProgressToTargetMax,
      showProgressBarLabel,
      showProgressBarEndText,
      targetNumber,
      // If the campaign has ended, merge in the "onEnd"
      // goal settings.
      ...(hasCampaignEnded && get(onEnd, 'goal', {})),
    }
  }

  // We manually merge goal data, so don't override the
  // goal value on campaign end.
  const { goal: goalRemovedFromOnEnd, ...onEndToMerge } = onEnd

  return {
    // Only update campaign stats if the campaign has not ended.
    addMoneyRaised: !hasCampaignEnded ? addMoneyRaised : async () => {},
    campaignId,
    ...(charity && { charity }),
    content,
    goal: goalWithData,
    incrementNewUserCount: !hasCampaignEnded
      ? incrementNewUserCount
      : async () => {},
    incrementTabCount: !hasCampaignEnded ? incrementTabCount : async () => {},
    isLive,
    showCountdownTimer,
    showHeartsDonationButton,
    showProgressBar,
    showSocialSharing,
    socialSharing,
    theme,
    time,
    // If the campaign has ended, update the campaign data
    // with the "onEnd" configuration.
    ...((hasCampaignEnded && onEndToMerge) || {}),
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
