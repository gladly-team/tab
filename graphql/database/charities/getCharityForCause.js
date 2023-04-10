import CharityModel from './CharityModel'

/**
 * Get all active charities.
 * @param {object} userContext - The user authorizer object.
 * @param {object} charityIds - The charity IDs for the cause.
 * @param {object} charityId -The charity ID for the cause.
 * @return {Promise<Charity[]>} Returns a promise that resolves into
 * an array of Charity objects.
 */
const getCharitiesForCause = async (userContext, charityIds, charityId) => {
  try {
    if (charityIds) {
      return await Promise.all(
        charityIds.map((cId) => CharityModel.get(userContext, cId))
      )
    }
    return [await CharityModel.get(userContext, charityId)]
  } catch (e) {
    throw e
  }
}

export default getCharitiesForCause
