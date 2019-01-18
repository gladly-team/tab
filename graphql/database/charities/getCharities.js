import { filter } from 'lodash/collection'
import { isBoolean } from 'lodash/lang'
import CharityModel from './CharityModel'

/**
 * Get all active charities.
 * @param {object} userContext - The user authorizer object.
 * @return {Promise<Charity[]>} Returns a promise that resolves into
 * an array of Charity objects.
 */
const getCharities = async (userContext, filters = {}) => {
  const { isPermanentPartner } = filters
  try {
    const allCharities = await CharityModel.getAll(userContext)

    // Filter out inactive charities.
    const filteredCharities = filter(allCharities, {
      inactive: false,
      ...(isBoolean(isPermanentPartner) && { isPermanentPartner }),
    })

    return filteredCharities
  } catch (e) {
    throw e
  }
}

export default getCharities
