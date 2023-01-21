import { GrowthBook } from '@growthbook/growthbook'
import moment from 'moment'
import Feature from './FeatureModel'
import createUserExperiment from './createUserExperiment'
import { showInternalOnly } from '../../utils/authorization-helpers'
import features from './features'
import logger from '../../utils/logger'
import { GROWTHBOOK_ENV } from '../../config'

const validateAttributesObject = (userId, attributes, { userSpecific }) => {
  const alwaysRequiredProperties = []
  const userRequiredProperties = [
    'id',
    'env',
    'causeId',
    'v4BetaEnabled',
    'joined',
    'isTabTeamMember',
    'tabs',
  ]
  const requiredProperties = userSpecific
    ? [...alwaysRequiredProperties, ...userRequiredProperties]
    : alwaysRequiredProperties
  requiredProperties.forEach((attribute) => {
    if (attributes[attribute] === null || attributes[attribute] === undefined) {
      logger.warn(
        `Growthbook attribute "${attribute}" for userId ${userId} is ${attributes[attribute]}`
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
  userSpecific = true,
}) => {
  const growthbook = new GrowthBook()
  growthbook.setFeatures(features)
  const joinedTime = joined && new Date(joined).getTime()
  const attributes = {
    id: userId,
    causeId,
    v4BetaEnabled,
    joined: joinedTime,
    internalExperimentOverrides,
    env: GROWTHBOOK_ENV,
    isTabTeamMember: showInternalOnly(email),
    tabs,
    timeSinceJoined: joinedTime && moment.utc().valueOf() - joinedTime,
  }
  validateAttributesObject(userId, attributes, { userSpecific })
  growthbook.setAttributes(attributes)
  return growthbook
}

// Use this only to retrieve features that do not rely on user attributes.
export const getFeatureWithoutUser = (growthbook, featureName) => {
  const feature = growthbook.feature(featureName)
  if (feature.experimentResult) {
    throw new Error(
      'Running an experiment requires passing user attributes to Growthbook.'
    )
  }
  return new Feature({
    featureName,
    variation: feature.value,
    inExperiment: false,
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
