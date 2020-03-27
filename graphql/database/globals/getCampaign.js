import { isNil } from 'lodash/lang'
import { getCurrentCampaignHardcodedData } from './hardcodedCampaignData'

const createCampaignData = async campaignConfig => {
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

  // Fetch the charity.
  const charity = await getCharityData()

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
    const currentNumber = await getCurrentNumber()
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

const getCampaign = () => {
  return createCampaignData(getCurrentCampaignHardcodedData())
}

export default getCampaign
