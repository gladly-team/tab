import features from './features'
import {
  getAndLogFeatureForUser,
  getConfiguredGrowthbook,
} from './growthbookUtils'

const getUserFeatures = async (userContext, user) => {
  const configuredGrowthbook = getConfiguredGrowthbook(user)
  const userFeatures = await Promise.all(
    Object.keys(features).map((featureName) =>
      getAndLogFeatureForUser(
        userContext,
        user.id,
        configuredGrowthbook,
        featureName
      )
    )
  )

  return userFeatures
}

export default getUserFeatures
