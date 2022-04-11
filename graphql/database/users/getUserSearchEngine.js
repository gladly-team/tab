import { DEFAULT_SEARCH_ENGINE, WIDGET_TYPE_SEARCH } from '../constants'
import { YAHOO_SEARCH_NEW_USERS } from '../experiments/experimentConstants'
import getUserFeature from '../experiments/getUserFeature'
import getSearchEngine from '../search/getSearchEngine'
import { DatabaseItemDoesNotExistException } from '../../utils/exceptions'
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
  const widgets = await getWidgets(userContext, user.id, false)
  const maybeSearchWidget = widgets.filter(
    widget => widget.type === WIDGET_TYPE_SEARCH
  )
  if (maybeSearchWidget.length > 0) {
    const searchWidget = maybeSearchWidget[0]
    try {
      return getSearchEngine(JSON.parse(searchWidget.config).engine)
    } catch (e) {
      // Don't care if SearchEngine does not exist. This will happen if
      // the user has not explicitly set any search engine, or if a
      // previously-seleced search engine is no longer supported.
      if (!(e instanceof DatabaseItemDoesNotExistException)) {
        throw e
      }
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
