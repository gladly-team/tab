import { WIDGET_TYPE_SEARCH } from '../constants'
import {
  YAHOO_SEARCH_NEW_USERS,
  YAHOO_SEARCH_NEW_USERS_V2,
} from '../experiments/experimentConstants'
import getUserFeature from '../experiments/getUserFeature'
import getSearchEngine from '../search/getSearchEngine'
import { DatabaseItemDoesNotExistException } from '../../utils/exceptions'
import getWidgets from '../widgets/getWidgets'
import ReferralDataModel from '../referrals/ReferralDataModel'
import logger from '../../utils/logger'

const searchEnginesToAddDimensions = ['SearchForACause', 'Yahoo']

/**
 * Customize the search engine data to the user, as needed.
 * @param {object} userContext - The user authorizer object.
 * @param {string} user - UserModel object.
 * @param {string} searchEngineId - The ID of the user's search engin
 * @return {SearchEngine}  A SearchEngineModel instance representing the engine displayed to the user.
 */
const generateSearchEngine = async (userContext, user, searchEngineId) => {
  const engineData = getSearchEngine(searchEngineId)
  const { searchUrl } = engineData

  let searchUrlPersonalized = searchUrl

  // For SFAC & Yahoo, modify the personalized search URL to include
  // dimensions used in aggregated analytics (e.g., search revenue by cause).
  try {
    if (searchEnginesToAddDimensions.indexOf(engineData.id) > -1) {
      const { causeId, v4BetaEnabled, id: userId } = user
      let referringChannel
      try {
        ;({ referringChannel } = await ReferralDataModel.get(
          userContext,
          userId
        ))
      } catch (e) {
        if (e.code !== DatabaseItemDoesNotExistException.code) {
          throw e
        }
      }
      const url = new URL(searchUrl)
      url.searchParams.set('src', 'tab')
      if (v4BetaEnabled && causeId) {
        url.searchParams.set('c', causeId)
      }
      if (referringChannel) {
        url.searchParams.set('r', referringChannel)
      }

      // Setting search params will encode the {searchTerms} template.
      // We want to keep it unencoded for the client.
      searchUrlPersonalized = url.href.replace(
        '%7BsearchTerms%7D',
        '{searchTerms}'
      )
    }
  } catch (e) {
    logger.error(e)
  }
  const personalizedSearchEngine = {
    ...engineData,
    searchUrlPersonalized,
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
    return generateSearchEngine(userContext, user, user.searchEngine)
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
      const searchEngine = await generateSearchEngine(
        userContext,
        user,
        JSON.parse(searchWidget.config).engine
      )
      return searchEngine
    } catch (e) {
      // Don't care if SearchEngine does not exist. This will happen if
      // the user has not explicitly set any search engine, or if a
      // previously-seleced search engine is no longer supported.
      if (e.code !== DatabaseItemDoesNotExistException.code) {
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
  const featureV2 = await getUserFeature(
    userContext,
    user,
    YAHOO_SEARCH_NEW_USERS_V2
  )
  let engine = feature.variation
  if (featureV2.inExperiment) {
    engine = featureV2.variation === 'Control' ? 'Google' : 'SearchForACause'
  }

  return generateSearchEngine(userContext, user, engine)
}

export default getUserSearchEngine
