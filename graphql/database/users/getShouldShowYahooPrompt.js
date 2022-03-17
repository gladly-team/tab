import { YAHOO_SEARCH_EXISTING_USERS } from '../experiments/experimentConstants'
import getUserFeature from '../experiments/getUserFeature'

const getShouldShowYahooPrompt = async (userContext, user) =>
  !user.yahooSwitchSearchPrompt &&
  (await getUserFeature(userContext, user, YAHOO_SEARCH_EXISTING_USERS))
    .variation === true

export default getShouldShowYahooPrompt
