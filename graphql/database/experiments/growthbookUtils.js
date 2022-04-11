import { GrowthBook } from '@growthbook/growthbook'
import Feature from './FeatureModel'
import createUserExperiment from './createUserExperiment'
import { showInternalOnly } from '../../utils/authorization-helpers'
import features from './features'
import logger from '../../utils/logger'

const validateAttributesObject = (userId, attributes) => {
  Object.keys(attributes).forEach(attribute => {
    if (attributes[attribute] === null || attributes[attribute] === undefined) {
      logger.warn(
        `Growthbook Attribute ${attribute} for userId ${userId} was ${
          attributes[attribute]
        }`
      )
    }
  })
}

export const getConfiguredGrowthbook = attributes => {
  const growthbook = new GrowthBook()
  growthbook.setFeatures(features)
  const { id, causeId, v4BetaEnabled, joined, email } = attributes
  validateAttributesObject(id, attributes)

  growthbook.setAttributes({
    id,
    env: process.env.GROWTHBOOK_ENV,
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
    await createUserExperiment(userContext, userId, {
      experimentId: featureName,
      variationId: feature.experimentResult.variationId,
    })
  }
  return new Feature({
    featureName,
    variation: feature.value,
  })
}
