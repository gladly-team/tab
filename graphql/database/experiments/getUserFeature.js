import {
  getAndLogFeatureForUser,
  getConfiguredGrowthbook,
} from './growthbookUtils'

const getUserFeatures = async (userContext, user, featureName) => {
  const configuredGrowthbook = getConfiguredGrowthbook(user)
  const userFeature = await getAndLogFeatureForUser(
    userContext,
    user.id,
    configuredGrowthbook,
    featureName
  )

  return userFeature
}

export default getUserFeatures
