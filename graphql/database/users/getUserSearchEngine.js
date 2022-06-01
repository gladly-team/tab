import { DEFAULT_SEARCH_ENGINE, WIDGET_TYPE_SEARCH } from '../constants'
import { YAHOO_SEARCH_NEW_USERS } from '../experiments/experimentConstants'
import getUserFeature from '../experiments/getUserFeature'
import getSearchEngine from '../search/getSearchEngine'
import { DatabaseItemDoesNotExistException } from '../../utils/exceptions'
import getWidgets from '../widgets/getWidgets'

// TODO: document & remove eslint-disable
// eslint-disable-next-line no-unused-vars
const generateSearchEngine = (searchEngineId, user) => {
  const engineData = getSearchEngine(searchEngineId)
  const personalizedSearchEngine = {
    ...engineData,
    // TODO: replace user-aware search URL parameter values:
    //   &src={source}&c={causeId}&r={referrerId}
  }
  return personalizedSearchEngine
}

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
    return generateSearchEngine(user.searchEngine, user)
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
      return generateSearchEngine(JSON.parse(searchWidget.config).engine, user)
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
    return generateSearchEngine(feature.variation, user)
  }

  // 4. If still unset, return the default search engine
  return generateSearchEngine(DEFAULT_SEARCH_ENGINE, user)
}

export default getUserSearchEngine
