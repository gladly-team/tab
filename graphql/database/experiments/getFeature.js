import {
  getFeatureWithoutUser,
  getConfiguredGrowthbook,
} from './growthbookUtils'

const getFeature = async (featureName) => {
  const configuredGrowthbook = getConfiguredGrowthbook({
    noUserAttributes: true,
  })
  const feature = await getFeatureWithoutUser(configuredGrowthbook, featureName)
  return feature
}

export default getFeature
