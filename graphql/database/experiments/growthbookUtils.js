import { GrowthBook } from '@growthbook/growthbook'
import Feature from './FeatureModel'
import createUserExperiment from './createUserExperiment'
import { showInternalOnly } from '../../utils/authorization-helpers'
import features from './features'
import logger from '../../utils/logger'

const validateAttributesObject = (userId, attributes) => {
  // Could always use joi or similar if needed later.
  const requiredProperties = [
    'id',
    'env',
    'causeId',
    'v4BetaEnabled',
    'joined',
    'isTabTeamMember',
  ]
  requiredProperties.forEach(attribute => {
    if (attributes[attribute] === null || attributes[attribute] === undefined) {
      logger.warn(
        `Growthbook Attribute ${attribute} for userId ${userId} was ${
          attributes[attribute]
        }`
      )
    }
  })
}

export const getConfiguredGrowthbook = ({
  id: userId,
  causeId,
  v4BetaEnabled,
  joined,
  email,
  internalExperimentOverrides = {},
}) => {
  const growthbook = new GrowthBook()
  growthbook.setFeatures(features)
  const attributes = {
    id: userId,
    causeId,
    v4BetaEnabled,
    joined,
    email,
    internalExperimentOverrides,
    env: process.env.GROWTHBOOK_ENV,
    isTabTeamMember: showInternalOnly(email),
  }
  validateAttributesObject(userId, attributes)
  growthbook.setAttributes(attributes)
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
    let variationValueStr = ''
    try {
      variationValueStr = JSON.stringify(feature.value)
    } catch (e) {
      logger.error(e)
    }
    await createUserExperiment(userContext, userId, {
      experimentId: featureName,
      variationId: feature.experimentResult.variationId,
      variationValueStr,
    })
  }
  return new Feature({
    featureName,
    variation: feature.value,
  })
}
