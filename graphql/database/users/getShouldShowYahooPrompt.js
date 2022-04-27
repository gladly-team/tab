import {
  YAHOO_SEARCH_EXISTING_USERS,
  YAHOO_SEARCH_NEW_USERS,
} from '../experiments/experimentConstants'
import getUserFeature from '../experiments/getUserFeature'

const charitableSearchEngineId = 'SearchForACause'

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
  const alreadyUsingSearchEngine =
    user.searchEngine === charitableSearchEngineId
  return (
    !alreadyResponded &&
    !alreadyUsingSearchEngine &&
    (existingUsersTestFeature.variation === true ||
      newUsersTestFeature.variation === 'SearchForACause')
  )
}

export default getShouldShowYahooPrompt
