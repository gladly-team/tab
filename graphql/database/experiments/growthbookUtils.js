import { GrowthBook } from '@growthbook/growthbook'
import Feature from './FeatureModel'
import createUserExperiment from './createUserExperiment'
import { showInternalOnly } from '../../utils/authorization-helpers'
import features from './features'

export const getConfiguredGrowthbook = ({
  id,
  causeId,
  v4BetaEnabled,
  joined,
  email,
}) => {
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
  return growthbook
}

export const getAndLogFeatureForUser = async (
  userContext,
  userId,
  growthbook,
  featureName
) => {
  const feature = growthbook.feature(featureName)
  if (feature.experimentResult && feature.experimentResult.inExperiment) {
    await createUserExperiment(userContext, userId, featureName, feature.value)
  }
  return new Feature({
    featureName,
    variation: feature.value,
  })
}
