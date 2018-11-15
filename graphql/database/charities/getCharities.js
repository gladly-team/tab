
import { filter } from 'lodash/collection'
import CharityModel from './CharityModel'

/**
 * Get all active charities.
 * @param {object} userContext - The user authorizer object.
 * @return {Promise<Charity[]>} Returns a promise that resolves into
 * an array of Charity objects.
 */
const getCharities = async (userContext, userId, widgetId) => {
  try {
    const allCharities = await CharityModel.getAll(userContext)

    // Filter out inactive charities.
    const activeCharities = filter(allCharities, charity => !charity.inactive)
    return activeCharities
  } catch (e) {
    throw e
  }
}

export default getCharities
