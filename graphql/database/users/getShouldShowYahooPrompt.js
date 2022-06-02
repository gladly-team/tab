import {
  YAHOO_SEARCH_EXISTING_USERS,
  YAHOO_SEARCH_NEW_USERS,
  YAHOO_SEARCH_NEW_USERS_V2,
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
  const newUsersTestFeatureV2 = await getUserFeature(
    userContext,
    user,
    YAHOO_SEARCH_NEW_USERS_V2
  )
  const alreadyResponded =
    user.yahooSearchSwitchPrompt &&
    user.yahooSearchSwitchPrompt.hasRespondedToPrompt
  const shouldShowYahooPromptNewUsers = newUsersTestFeatureV2.inExperiment
    ? newUsersTestFeatureV2.variation === 'Notification'
    : newUsersTestFeature.variation === 'SearchForACause'
  return (
    !alreadyResponded &&
    !user.yahooPaidSearchRewardOptIn && // already opted in
    (existingUsersTestFeature.variation === true ||
      shouldShowYahooPromptNewUsers)
  )
}

export default getShouldShowYahooPrompt
