import { get, values } from 'lodash/object'
import { random } from 'lodash/number'

// The names of the different overrides.
export const REWARD_REFERRER_OVERRIDE = 'REWARD_REFERRER_OVERRIDE'
export const GET_REFERRER_BY_USERNAME_OVERRIDE =
  'GET_REFERRER_BY_USERNAME_OVERRIDE'
export const ADD_NUM_USERS_RECRUITED_OVERRIDE =
  'ADD_NUM_USERS_RECRUITED_OVERRIDE'
export const GET_RECRUITS_LAST_ACTIVE_OVERRIDE =
  'GET_RECRUITS_LAST_ACTIVE_OVERRIDE'
export const ADD_VC_DONATED_BY_CHARITY = 'ADD_VC_DONATED_BY_CHARITY'
export const ADMIN_MANAGEMENT = 'ADMIN_MANAGEMENT'
export const MISSIONS_OVERRIDE = 'MISSIONS_OVERRIDE'
export const USERS_OVERRIDE = 'USERS_OVERRIDE'
// TODO: remove after migration
export const MIGRATION_OVERRIDE = 'MIGRATION_OVERRIDE'
export const VIDEO_ADS_OVERRIDE = 'VIDEO_ADS_OVERRIDE'
export const CAUSES_OVERRIDE = 'CAUSES_OVERRIDE'
// Make it less likely for somebody to use the override
// string value directly.
const rand = random(10000, 99999)
const validOverridesAppendix = `_CONFIRMED_${rand}`

const validOverrides = {
  [REWARD_REFERRER_OVERRIDE]: `${REWARD_REFERRER_OVERRIDE}${validOverridesAppendix}`,
  [GET_REFERRER_BY_USERNAME_OVERRIDE]: `${GET_REFERRER_BY_USERNAME_OVERRIDE}${validOverridesAppendix}`,
  [ADD_NUM_USERS_RECRUITED_OVERRIDE]: `${ADD_NUM_USERS_RECRUITED_OVERRIDE}${validOverridesAppendix}`,
  [GET_RECRUITS_LAST_ACTIVE_OVERRIDE]: `${GET_RECRUITS_LAST_ACTIVE_OVERRIDE}${validOverridesAppendix}`,
  [ADD_VC_DONATED_BY_CHARITY]: `${ADD_VC_DONATED_BY_CHARITY}${validOverridesAppendix}`,
  [ADMIN_MANAGEMENT]: `${ADMIN_MANAGEMENT}${validOverridesAppendix}`,
  [MISSIONS_OVERRIDE]: `${MISSIONS_OVERRIDE}${validOverridesAppendix}`,
  [USERS_OVERRIDE]: `${USERS_OVERRIDE}${validOverridesAppendix}`,
  [VIDEO_ADS_OVERRIDE]: `${VIDEO_ADS_OVERRIDE}${validOverridesAppendix}`,
  [CAUSES_OVERRIDE]: `${CAUSES_OVERRIDE}${validOverridesAppendix}`,
  // TODO: remove after migration
  [MIGRATION_OVERRIDE]: `${MIGRATION_OVERRIDE}${validOverridesAppendix}`,
}

/**
 * Return a string that allows overriding model query
 * permissions checks.
 * We must use this *only* in logic that's protected from
 * manipulation from the client side; e.g., we might use
 * it to reward a referring user after a new user signs up
 * because one cannot easily fake a new user creation.
 * @param {string} overrideName - The name of the override
 * @return {string|boolean} An override string, or false
 *   if `overrideName` is not a valid override.
 */
export const getPermissionsOverride = overrideName =>
  get(validOverrides, overrideName, false)

export const isValidPermissionsOverride = override =>
  values(validOverrides).indexOf(override) !== -1
