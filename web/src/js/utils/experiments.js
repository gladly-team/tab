
import { filter, find, map, some } from 'lodash/collection'
import localStorageMgr from 'js/utils/localstorage-mgr'
import {
  STORAGE_EXPERIMENT_PREFIX
} from 'js/constants'

const noneGroupKey = 'NONE'
const noneGroupValue = 'none'
const noneGroupSchemaValue = 'NONE'

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
      [noneGroupKey]: createExperimentGroup({
        value: noneGroupValue,
        schemaValue: noneGroupSchemaValue
      })
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
      const experimentGroups = filter(this.groups, groupObj => groupObj.value !== noneGroupValue)

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
    // Return the value of the user's assigned experiment group,
    // or 'none' if the user is not assigned to one.
    getTestGroup: function () {
      // If the test is disabled, return the "none" group value.
      if (this.disabled) {
        return this.groups.NONE.value
      }

      // Get the user's group from localStorage. If it's not one of
      // the valid group values, return the "none" group value.
      const groupVal = localStorageMgr.getItem(this.localStorageKey)
      const isValidGroup = some(this.groups, { value: groupVal })
      if (!isValidGroup) {
        return this.groups.NONE.value
      }
      return groupVal
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

export const experiments = []

// We do this to be able to modify the experiments
// variable during testing while keeping it in this file.
// https://github.com/facebook/jest/issues/936#issuecomment-214939935
const getExperiments = () => exports.experiments

/**
 * Get the user's assigned group value for an experiment.
 * If the experiment does not exist or is disabled, this
 * will return 'none'.
 * @returns {String} The value of the user's group for this
 *   experiment.
 */
export const getUserExperimentGroup = experimentName => {
  if (!experimentName) {
    throw new Error('Must provide an experiment name.')
  }
  const exps = getExperiments()
  const exp = find(exps, { name: experimentName })

  // If there's no experiment with this name, return 'none'.
  if (!exp) {
    return noneGroupValue
  }
  return exp.getTestGroup()
}

/**
 * Assigns the user to test groups for all active tests.
 * @returns {undefined}
 */
export const assignUserToTestGroups = () => {}

/**
 * Returns an object with a key for each active experiment. Each
 * key's value is an integer representing the test group to which
 * the user is assigned for that test. The object takes the shape
 * of our GraphQL schema's ExperimentGroupsType.
 * @returns {Object} The object of experiment group assignments
 *   for the user, taking the shape of our GraphQL schema's
 *   ExperimentGroupsType.
 */
export const getUserTestGroupsForMutation = () => {
  return {}
}
