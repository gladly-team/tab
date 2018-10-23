
import {
  filter,
  find,
  map
} from 'lodash/collection'
import localStorageMgr from 'js/utils/localstorage-mgr'
import {
  STORAGE_EXPERIMENT_PREFIX
} from 'js/constants'

const noneGroupKey = 'NONE'

export const createExperiment = ({ name, active = false, disabled = false, groups }) => {
  if (!name) {
    throw new Error('An experiment must have a unique "name" value.')
  }
  return {
    // A unique code (without spaces) for this experiment
    name,
    // If true, we will assign users a group in the experiment. If false,
    // we will not assign users to any group.
    active,
    // If true, we will always return the "none" test group when getting
    // the user's experiment group, even if the user is assigned to
    // another group. This should effectively disable the effects of the
    // experiment.
    disabled,
    // The different experiment groups the user could be assigned to.
    groups: Object.assign({}, groups, {
      [noneGroupKey]: NoneExperimentGroup
    }),
    localStorageKey: `${STORAGE_EXPERIMENT_PREFIX}.${name}`,
    saveTestGroupToLocalStorage: function (testGroupValue) {
      localStorageMgr.setItem(this.localStorageKey, testGroupValue)
    },
    // Assign the user to an experiment group.
    assignTestGroup: function () {
      if (!this.active) {
        return
      }

      // Filter out the "none" group.
      const experimentGroups = filter(this.groups, groupObj => groupObj.value !== NoneExperimentGroup.value)

      // If there aren't any test groups, just save the "none" value.
      if (!experimentGroups.length) {
        this.saveTestGroupToLocalStorage(this.groups.NONE.value)
      }

      // There's an equal chance of being assigned to any group,
      // excepting the "none" group.
      const groupValues = map(experimentGroups, groupObj => groupObj.value)
      const testGroup = groupValues[Math.floor(Math.random() * groupValues.length)]
      this.saveTestGroupToLocalStorage(testGroup)
    },
    // Return the the user's assigned experiment group, or the
    // NoneExperimentGroup if the user is not assigned to one.
    getTestGroup: function () {
      // If the test is disabled, return the "none" group value.
      if (this.disabled) {
        return this.groups.NONE
      }

      // Get the user's group from localStorage. If it's not one of
      // the valid group values, return the "none" group value.
      const groupVal = localStorageMgr.getItem(this.localStorageKey)
      const group = find(this.groups, { value: groupVal }) || this.groups.NONE
      return group
    }
  }
}

/**
 * Return an object representing an experiment group the user could be
 * assigned to.
 * @param {Object} experimentGroupConfig
 * @param {string} experimentGroupConfig.value - The string value we'll
 *   use when representing the user's group.
 * @param {string} experimentGroupConfig.schemaValue - The string value
 *   we'll send to the server-side. It should match the GraphQL enum
 *   value of the experiment group.
 *   use when representing the user's group.
 * @return {Object} An object representing the experiment group
 */
export const createExperimentGroup = ({ value, schemaValue }) => {
  if (!(value && schemaValue)) {
    throw new Error('An experiment group must have values for the "value" and "schemaValue" keys.')
  }
  return {
    value,
    schemaValue
  }
}

// The experiment group for when the user is not assigned to any
// experiment group (e.g., not included in the experiment).
const NoneExperimentGroup = createExperimentGroup({
  value: 'none',
  schemaValue: 'NONE'
})

// Add ExperimentGroup objects here to enable new experiments.
// The "name" value of the experiment must be the same as the
// field name of the GraphQL ExperimentGroup field name for
// this test.
export const experiments = [
  createExperiment({
    name: 'thirdAd',
    active: false,
    disabled: false,
    groups: {
      TWO_ADS: createExperimentGroup({
        value: 'twoAds',
        schemaValue: 'TWO_ADS'
      }),
      THREE_ADS: createExperimentGroup({
        value: 'threeAds',
        schemaValue: 'THREE_ADS'
      })
    }
  })
]

// We do this to be able to modify the experiments
// variable during testing while keeping it in this file.
// https://github.com/facebook/jest/issues/936#issuecomment-214939935
const getExperiments = () => exports.experiments

/**
 * Get the set of available group values for an experiment.
 * If the experiment does not exist, this returns only the
 * the NoneExperimentGroup.
 * @returns {Object} A map of ExperimentGroup values, keyed
 *   by their name.
 */
export const getExperimentGroups = experimentName => {
  if (!experimentName) {
    throw new Error('Must provide an experiment name.')
  }
  const exp = find(getExperiments(), { name: experimentName })

  // If there's no experiment with this name, return only the
  // NoneExperimentGroup.
  if (!exp) {
    return {
      [noneGroupKey]: NoneExperimentGroup.value
    }
  }

  // Return only the ExperimentGroup string value for ease
  // of comparing user group membership.
  const groups = exp.groups
  const groupNames = Object.keys(groups)
    .reduce((result, key) => {
      result[key] = groups[key].value
      return result
    }, {})
  return groupNames
}

/**
 * Get the user's assigned group value for an experiment.
 * If the experiment does not exist or is disabled, this
 * will return the NoneExperimentGroup value.
 * @returns {String} The value of the user's group for this
 *   experiment.
 */
export const getUserExperimentGroup = experimentName => {
  if (!experimentName) {
    throw new Error('Must provide an experiment name.')
  }
  const exp = find(getExperiments(), { name: experimentName })

  // If there's no experiment with this name, return the
  // NoneExperimentGroup value.
  if (!exp) {
    return NoneExperimentGroup.value
  }
  return exp.getTestGroup().value
}

/**
 * Assigns the user to test groups for all active tests.
 * @returns {undefined}
 */
export const assignUserToTestGroups = () => {
  const exps = getExperiments()
  exps.forEach(experiment => {
    if (experiment.active) {
      experiment.assignTestGroup()
    }
  })
}

/**
 * Returns an object with a key for each active experiment. Each
 * key's value is a string representing the test group to which
 * the user is assigned for that test. The object takes the shape
 * of our GraphQL schema's ExperimentGroupsType.
 * @returns {Object} The object of experiment group assignments
 *   for the user, taking the shape of our GraphQL schema's
 *   ExperimentGroupsType.
 */
export const getUserTestGroupsForMutation = () => {
  const exps = getExperiments()
  const userGroupsSchema = exps.reduce((result, experiment) => {
    result[experiment.name] = experiment.getTestGroup().schemaValue
    return result
  }, {})
  return userGroupsSchema
}
