import {
  getFeatureWithoutUser,
  getConfiguredGrowthbook,
} from './growthbookUtils'

const getFeature = (featureName) => {
  const configuredGrowthbook = getConfiguredGrowthbook({
    userSpecific: false,
  })
  const feature = getFeatureWithoutUser(configuredGrowthbook, featureName)
  return feature
}

export default getFeature
