import { YAHOO_SEARCH_EXISTING_USERS } from '../experiments/experimentConstants'
import getUserFeature from '../experiments/getUserFeature'

const getShouldShowYahooPrompt = async (userContext, user) => {
  const testFeature = await getUserFeature(
    userContext,
    user,
    YAHOO_SEARCH_EXISTING_USERS
  )
  const alreadyResponded =
    user.yahooSearchSwitchPrompt &&
    user.yahooSearchSwitchPrompt.hasRespondedToPrompt
  return (
    !alreadyResponded &&
    !user.yahooPaidSearchRewardOptIn &&
    testFeature.variation === true
  )
}

export default getShouldShowYahooPrompt
