import { GrowthBook } from '@growthbook/growthbook'
import features from './features'
import createUserExperiment from './createUserExperiment'
import { showInternalOnly } from '../../utils/authorization-helpers'
import Feature from './FeatureModel'

const getUserFeatures = async (
  userContext,
  { id, causeId, v4BetaEnabled, joined, email }
) => {
  const growthbook = new GrowthBook()
  growthbook.setFeatures(features)
  growthbook.setAttributes({
    id,
    env: process.env.NEXT_PUBLIC_GROWTHBOOK_ENV,
    causeId,
    v4BetaEnabled,
    joined,
    isTabTeamMember: showInternalOnly(email),
  })
  const userFeatures = await Promise.all(
    Object.keys(features).map(async featureName => {
      const feature = growthbook.feature(featureName)
      if (feature.experimentResult && feature.experimentResult.inExperiment) {
        await createUserExperiment(userContext, id, featureName, feature.value)
      }
      return new Feature({
        featureName,
        variation: feature.value,
      })
    })
  )

  return userFeatures
}

export default getUserFeatures
