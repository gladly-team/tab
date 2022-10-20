import { GrowthBook } from '@growthbook/growthbook'
import Feature from './FeatureModel'
import createUserExperiment from './createUserExperiment'
import { showInternalOnly } from '../../utils/authorization-helpers'
import features from './features'
import logger from '../../utils/logger'
import { GROWTHBOOK_ENV } from '../../config'

const validateAttributesObject = (userId, attributes) => {
  // Could always use joi or similar if needed later.
  const requiredProperties = [
    'id',
    'env',
    'causeId',
    'v4BetaEnabled',
    'joined',
    'isTabTeamMember',
    'tabs',
  ]
  requiredProperties.forEach(attribute => {
    if (attributes[attribute] === null || attributes[attribute] === undefined) {
      logger.warn(
        `Growthbook attribute "${attribute}" for userId ${userId} is ${
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
  tabs,
}) => {
  const growthbook = new GrowthBook()
  growthbook.setFeatures(features)
  const attributes = {
    id: userId,
    causeId,
    v4BetaEnabled,
    joined: joined && new Date(joined).getTime(),
    internalExperimentOverrides,
    env: GROWTHBOOK_ENV,
    isTabTeamMember: showInternalOnly(email),
    tabs,
  }
  validateAttributesObject(userId, attributes)
  growthbook.setAttributes(attributes)
  return growthbook
}

export const getConfiguredGrowthbookWithoutUser = ({
  causeId,
  v4BetaEnabled,
}) => {
  const growthbook = new GrowthBook()
  growthbook.setFeatures(features)
  const attributes = {
    causeId,
    v4BetaEnabled,
    env: GROWTHBOOK_ENV,
  }
  // Note that we don't verify attributes here because we don't necessarily
  // need all attributes when evaluating a feature.
  growthbook.setAttributes(attributes)
  return growthbook
}

export const getFeatureWithoutUserFromGrowthbook = async (
  growthbook,
  featureName
) => {
  const feature = growthbook.feature(featureName)
  return new Feature({
    featureName,
    variation: feature.value,
    inExperiment:
      feature.experimentResult !== undefined &&
      feature.experimentResult.inExperiment,
  })
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
    inExperiment:
      feature.experimentResult !== undefined &&
      feature.experimentResult.inExperiment,
  })
}
