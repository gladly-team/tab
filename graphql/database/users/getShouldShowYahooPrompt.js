import {
  YAHOO_SEARCH_EXISTING_USERS,
  YAHOO_SEARCH_NEW_USERS,
} from '../experiments/experimentConstants'
import getUserFeature from '../experiments/getUserFeature'

const getShouldShowYahooPrompt = async (userContext, user) => {
  const existingUsersTestFeature = await getUserFeature(
    userContext,
    user,
    YAHOO_SEARCH_EXISTING_USERS
  )
  const newUsersTestFeature = await getUserFeature(
    userContext,
    user,
    YAHOO_SEARCH_NEW_USERS
  )
  const alreadyResponded =
    user.yahooSearchSwitchPrompt &&
    user.yahooSearchSwitchPrompt.hasRespondedToPrompt
  return (
    !alreadyResponded &&
    !user.yahooPaidSearchRewardOptIn && // already opted in
    (existingUsersTestFeature.variation === true ||
      newUsersTestFeature.variation === 'SearchForACause')
  )
}

export default getShouldShowYahooPrompt
