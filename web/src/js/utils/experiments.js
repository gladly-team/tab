
import {
  filter,
  find
} from 'lodash/collection'
import { isNil } from 'lodash/lang'
import localStorageMgr from 'js/utils/localstorage-mgr'
import {
  STORAGE_EXPERIMENT_PREFIX
} from 'js/constants'
import {
  excludeUsersWhoJoinedWithin,
  includeIfAnyIsTrue,
  onlyIncludeNewUsers
} from 'js/utils/experimentFilters'

const noneGroupKey = 'NONE'

// TODO: log group assignments to the server

export const createExperiment = ({ name, active = false, disabled = false, groups,
  filters = [], percentageOfExistingUsersInExperiment = 100.0,
  percentageOfNewUsersInExperiment = 100.0 }) => {
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
    // The likelihood we'll include an active existing user in the experiment,
    // *after* we filter them through the provided "filters".
    // If this is 100, we will include all users (after filtering) in
    // the experiment.
    percentageOfExistingUsersInExperiment: percentageOfExistingUsersInExperiment,
    // The likelihood we'll include a new user in the experiment,
    // *after* we filter them through the provided "filters".
    // If this is 100, we will include all new users (after filtering)
    // in the experiment.
    percentageOfNewUsersInExperiment: percentageOfNewUsersInExperiment,
    // An array of functions to call to determine whether a user should
    // be excluded from an experiment based on, e.g., the datetime they
    // joined. Each function will receive a user object with keys:
    //  joined {String}: the datetime the user joined
    //  isNewUser {Boolean}: true if this is a brand new user
    // If any filter function returns false, the user will not be
    // included in the experiment.
    filters: filters,
    // The different experiment groups the user could be assigned to.
    groups: Object.assign({}, groups, {
      [noneGroupKey]: NoneExperimentGroup
    }),
    _localStorageKey: `${STORAGE_EXPERIMENT_PREFIX}.${name}`,
    _saveTestGroupToLocalStorage: function (testGroupValue) {
      localStorageMgr.setItem(this._localStorageKey, testGroupValue)
    },
    // This is to track changes/increases in % users included in a test.
    _localStorageKeyForPercentage: `${STORAGE_EXPERIMENT_PREFIX}.${name}.percentageOfUsersLastAssigned`,
    _savePercentageUsersToLocalStorage: function () {
      localStorageMgr.setItem(this._localStorageKeyForPercentage,
        this.percentageOfExistingUsersInExperiment)
    },
    /**
     * Get the value for the percentage of users included in this
     * experiment the last time we assigned this user to a group.
     * @returns {Number} A float equal to a previous value of
     *   `this.percentageOfExistingUsersInExperiment`; or, if we have never
     *   tried to assign this user, return zero.
     */
    _getPercentageUsersFromLocalStorage: function () {
      const percentage = parseFloat(
        localStorageMgr.getItem(this._localStorageKeyForPercentage),
        10)
      return isNaN(percentage) ? 0.0 : percentage
    },
    /**
     * Get whether the user has previously been assigned to a group
     * for this experiment.
     * @returns {Boolean} Whether the user has previously been
     *   assigned to a group for this experiment.
     */
    _hasBeenAssignedToGroup: function () {
      return !isNil(localStorageMgr.getItem(this._localStorageKey))
    },
    /**
     * Save the assigned test group in local storage and to the
     * server.
     * @returns {String} The value of the experiment group.
     * @returns {undefined}
     */
    _saveTestGroup: function (testGroup) {
      this._saveTestGroupToLocalStorage(testGroup.value)

      // Update storage with the current % of users who are included in the
      // experiment.
      this._savePercentageUsersToLocalStorage()

      // TODO: save test group to server too
    },
    /**
     * Assign the user to an experiment group for this experiment.
     * @param {Object} userInfo
     * @param {String} userInfo.joined - The ISO string of when the
     *   user joined.
     * @param {Boolean} userInfo.isNewUser - Whether this user has just
     *   signed up.
     * @returns {undefined}
     */
    assignTestGroup: function (userInfo) {
      if (!this.active) {
        return
      }

      // This is the value of `this.percentageOfExistingUsersInExperiment`
      // the last time we assigned the user to a group in this experiment.
      const previousPercentage = this._getPercentageUsersFromLocalStorage()

      // If the filters exclude this user, don't assign them to an experiment
      // group.
      if (!this.filters.every(function (filterFunc) {
        return filterFunc.call(this, userInfo)
      })) {
        return
      }

      // If the user is already assigned to a group, don't assign a new one,
      // unless: the user is in a "none" group and the percentage of users
      // to assign to this experiment has increased.
      const currentGroup = this.getTestGroup()
      if (
        this._hasBeenAssignedToGroup() &&
        !(
          currentGroup.value === this.groups.NONE.value &&
          this.percentageOfExistingUsersInExperiment > previousPercentage
        )
      ) {
        return
      }

      // Exclude the "none" group.
      const experimentGroups = filter(this.groups, groupObj => groupObj.value !== NoneExperimentGroup.value)

      // If there aren't any test groups, just save the "none" value.
      if (!experimentGroups.length) {
        this._saveTestGroup(this.groups.NONE)
        return
      }

      // Calculate the % likelihood of assigning this user to a not-none
      // experiment group. If we previously assigned this user but the
      // % of users we're including in this experiment has increased,
      // we should use the difference in the percentages, which should
      // keep the value of `this.percentageOfExistingUsersInExperiment`
      // as a % of our active user base.
      const likelihoodOfInclusion = (
        userInfo.isNewUser
          ? this.percentageOfNewUsersInExperiment
          : (
            100.0 *
            (this.percentageOfExistingUsersInExperiment - previousPercentage) /
            (100 - previousPercentage)
          )
      )

      // Only assign the experiment to a percentage of random users.
      if ((100 * Math.random()) > likelihoodOfInclusion) {
        this._saveTestGroup(this.groups.NONE)
        return
      }

      // There's an equal chance of being assigned to any group,
      // excepting the "none" group.
      const group = experimentGroups[Math.floor(Math.random() * experimentGroups.length)]
      this._saveTestGroup(group)
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
      const groupVal = localStorageMgr.getItem(this._localStorageKey)
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

// Add experiment names here as constants.
export const EXPERIMENT_THIRD_AD = 'thirdAd'
export const EXPERIMENT_ONE_AD_FOR_NEW_USERS = 'oneAdForNewUsers'
export const EXPERIMENT_AD_EXPLANATION = 'adExplanation'

// Add ExperimentGroup objects here to enable new experiments.
// The "name" value of the experiment must be the same as the
// field name of the GraphQL ExperimentGroup field name for
// this test.
export const experiments = [
  // @experiment-third-ad
  createExperiment({
    name: EXPERIMENT_THIRD_AD,
    active: true,
    disabled: false,
    percentageOfExistingUsersInExperiment: 0,
    filters: [
      includeIfAnyIsTrue([
        onlyIncludeNewUsers,
        excludeUsersWhoJoinedWithin(30, 'days')
      ])
    ],
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
  }),
  // @experiment-one-ad-for-new-users
  createExperiment({
    name: EXPERIMENT_ONE_AD_FOR_NEW_USERS,
    active: true,
    disabled: false,
    filters: [
      onlyIncludeNewUsers
    ],
    groups: {
      DEFAULT: createExperimentGroup({
        value: 'default',
        schemaValue: 'DEFAULT'
      }),
      ONE_AD_AT_FIRST: createExperimentGroup({
        value: 'oneAd',
        schemaValue: 'ONE_AD_AT_FIRST'
      })
    }
  }),
  // @experiment-ad-explanation
  createExperiment({
    name: EXPERIMENT_AD_EXPLANATION,
    active: true,
    disabled: false,
    filters: [
      onlyIncludeNewUsers
    ],
    groups: {
      DEFAULT: createExperimentGroup({
        value: 'default',
        schemaValue: 'DEFAULT'
      }),
      SHOW_EXPLANATION: createExperimentGroup({
        value: 'explanation',
        schemaValue: 'SHOW_EXPLANATION'
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
 * @param {Object} userInfo
 * @param {String} userInfo.joined - The ISO string of when the
 *   user joined.
 * @param {Boolean} userInfo.isNewUser - Whether this user has just
 *   signed up.
 * @returns {undefined}
 */
export const assignUserToTestGroups = userInfo => {
  const exps = getExperiments()
  exps.forEach(experiment => {
    if (experiment.active) {
      experiment.assignTestGroup(userInfo)
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
