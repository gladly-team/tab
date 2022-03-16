import { WIDGET_TYPE_SEARCH } from '../../../web/src/js/constants'
import { DEFAULT_SEARCH_ENGINE } from '../constants'
import { YAHOO_SEARCH_NEW_USERS } from '../experiments/experimentConstants'
import getUserFeature from '../experiments/getUserFeature'
import getSearchEngine from '../search/getSearchEngine'

import getWidgets from '../widgets/getWidgets'

/**
 * Fetch the user's search engine by the following procedure:
 * 1. If set on the UserModel, return the value
 * 2. If unset, see if a search widget value is set and migrate it, then return that value
 * 3. If still unset, see if the user should be part of a test group to have a particular search engine and return that
 * 4. If still unset, return the default search engine
 * use exported logic for default search engine
 * @param {object} userContext - The user authorizer object.
 * @param {string} user - UserModel object.
 * @return {SearchEngine}  A SearchEngineModel instance representing the engine displayed to the user.
 */
const getUserSearchEngine = async (userContext, user) => {
  // 1. If set on the UserModel, return the value
  if (user.searchEngine) {
    return getSearchEngine(user.searchEngine)
  }

  // 2. If unset, see if a search widget value is set and migrate it, then return that value
  // Query Search Widgets and Find
  const widgets = await getWidgets(userContext.user, user.id, false)
  const maybeSearchWidget = widgets.filter(
    widget => widget.type === WIDGET_TYPE_SEARCH
  )
  if (maybeSearchWidget.length > 0) {
    const searchWidget = maybeSearchWidget[0]
    const maybeSearchEngine = getSearchEngine(
      JSON.parse(searchWidget.config).engine,
      true
    )
    if (maybeSearchEngine) {
      return maybeSearchEngine
    }
  }

  // 3. If still unset, see if the user should be part of a test group to have a particular search engine and return that
  const feature = await getUserFeature(
    userContext,
    user,
    YAHOO_SEARCH_NEW_USERS
  )
  if (feature) {
    return getSearchEngine(feature.variation)
  }

  // 4. If still unset, return the default search engine
  return getSearchEngine(DEFAULT_SEARCH_ENGINE)
}

export default getUserSearchEngine
