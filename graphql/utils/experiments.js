import { get } from 'lodash/object'

// Experiments with valid experiment group values.
const experimentConfig = {
  // @experiment-anon-sign-in
  anonSignIn: {
    NONE: 0,
    AUTHED_USER_ONLY: 1,
    ANONYMOUS_ALLOWED: 2,
  },
  // @experiment-various-ad-sizes
  variousAdSizes: {
    NONE: 0,
    STANDARD: 1,
    VARIOUS: 2,
  },
  // @experiment-third-ad
  thirdAd: {
    NONE: 0,
    TWO_ADS: 1,
    THREE_ADS: 2,
  },
  // @experiment-one-ad-for-new-users
  oneAdForNewUsers: {
    NONE: 0,
    DEFAULT: 1,
    ONE_AD_AT_FIRST: 2,
  },
  // @experiment-ad-explanation
  adExplanation: {
    NONE: 0,
    DEFAULT: 1,
    SHOW_EXPLANATION: 2,
  },
  // @experiment-search-intro
  searchIntro: {
    NONE: 0,
    NO_INTRO: 1,
    INTRO_A: 2,
  },
  // @experiment-referral-notification
  referralNotification: {
    NONE: 0,
    NO_NOTIFICATION: 1,
    COPY_A: 2,
    COPY_B: 3,
    COPY_C: 4,
    COPY_D: 5,
    COPY_E: 6,
  },
}

/**
 * Return an object of the configured experiments.
 * @return {Object} An object with a key for each experiment name.
 */
const getExperiments = () =>
  // Calling exports to be able to modify the experimentGroups
  // variable during testing while keeping it in this file.
  exports.experimentConfig

/**
 * Return an array of the names of configured experiments.
 * @return {String[]} An array of the names of all experiments.
 */
const getAllExperiments = () => Object.keys(getExperiments())

/**
 * Return whether an experiment group value is valid for the given
 * experiment.
 * @param {String} experimentName - The name of the experiment
 * @param {Number} groupVal - The value of the assigned group
 * @return {Boolean} Whether the groupVal is a valid group option
 *   for the given experiment with name experimentName.
 */
const isValidExperimentGroup = (experimentName, groupVal) => {
  const validGroupValues = Object.values(getExperiments()[experimentName])
  return validGroupValues.indexOf(groupVal) > -1
}

/**
 * Validate an object of experiments with assigned group values,
 * returning group values that are guaranteed to be valid or null.
 * Provided experiment group values that are undefined or invalid
 * are returned as null.
 * @param {Object} clientExperimentGroups - Any experimental test
 *   groups to which the user has been assigned. This will take
 *   the shape of the ExperimentGroupsType object in our GraphQL
 *   schema.
 * @return {Object} The validated experiment groups. This will take
 *   the shape of the ExperimentGroupsType object in our GraphQL
 *   schema.
 */
const getValidatedExperimentGroups = clientExperimentGroups =>
  getAllExperiments().reduce((map, experimentName) => {
    const clientGroupVal = get(clientExperimentGroups, experimentName)
    const validatedGroupVal = isValidExperimentGroup(
      experimentName,
      clientGroupVal
    )
      ? clientGroupVal
      : null
    return Object.assign({}, map, {
      [experimentName]: validatedGroupVal,
    })
  }, {})

export { experimentConfig, getValidatedExperimentGroups }
