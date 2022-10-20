import {
  getFeatureWithoutUserFromGrowthbook,
  getConfiguredGrowthbookWithoutUser,
} from './growthbookUtils'

const getFeatureWithoutUser = async (properties, featureName) => {
  const configuredGrowthbook = getConfiguredGrowthbookWithoutUser(properties)
  const userFeature = await getFeatureWithoutUserFromGrowthbook(
    configuredGrowthbook,
    featureName
  )

  return userFeature
}

export default getFeatureWithoutUser
