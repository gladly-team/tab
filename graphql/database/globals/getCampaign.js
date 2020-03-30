import { isNil } from 'lodash/lang'
import getCurrentCampaignConfig from './getCurrentCampaignConfig'

const createCampaignData = async (userContext, campaignConfig) => {
  const {
    campaignId,
    content,
    endContent,
    getCharityData,
    goal,
    incrementNewUserCount,
    incrementTabCount,
    isActive,
    isLive,
    showCountdownTimer,
    showHeartsDonationButton,
    showProgressBar,
    time,
  } = campaignConfig

  // TODO: we may not want to fetch this every time when
  //   the requester may not need the data.
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
      targetNumber,
    } = goal
    const currentNumber = await getCurrentNumber(userContext)
    goalWithData = {
      currentNumber,
      impactUnitSingular,
      impactUnitPlural,
      impactVerbPastTense,
      targetNumber,
    }
  }

  return {
    campaignId,
    ...(charity && { charity }),
    content,
    ...(endContent && { endContent }),
    ...(goalWithData && { goal: goalWithData }),
    incrementNewUserCount,
    incrementTabCount,
    isActive,
    isLive,
    showCountdownTimer,
    showHeartsDonationButton,
    showProgressBar,
    time,
  }
}

const getCampaign = async userContext => {
  return createCampaignData(userContext, getCurrentCampaignConfig())
}

export default getCampaign
