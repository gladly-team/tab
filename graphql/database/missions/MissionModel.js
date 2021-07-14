import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { MISSION } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'

/*
 * @extends BaseModel
 */
class Mission extends BaseModel {
  static get name() {
    return MISSION
  }

  static get hashKey() {
    return 'id'
  }

  static get tableName() {
    return tableNames.missions
  }

  static get schema() {
    return {
      id: types
        .string()
        .required()
        .description(`The unique mission id`), // not sure how to nanoid this value
      squadName: types
        .string()
        .required()
        .description(`user entered squad type`),
      created: types
        .string()
        .isoDate()
        .required(),
      started: types
        .string()
        .isoDate()
        .description('timestamp from when mission is active'),
      completed: types
        .string()
        .isoDate()
        .description('timestamp from when mission is completed'),
      tabGoal: types
        .number()
        .integer()
        .description(`number of tabs for goal`),
      missionType: types
        .string()
        .description('the kind of mission ie cats mission'),
      acceptedSquadMembers: types
        .array(types.string())
        .description('users ids who have accepted and signed up for cats'),
      pendingSquadMembersExisting: types
        .array(types.string())
        .description('users ids who have pending invites'),
      pendingSquadMembersEmailInvite: types
        .array(types.string())
        .description('users who have been invited via email'),
      rejectedSquadMembers: types
        .array(types.string())
        .description('users who declined to join the squad'),
      endOfMissionAwards: types.object({
        // The count of tabs for the day on which the user opened
        // the most tabs.
        maxTabsDay: types.object({
          user: types.string().description('user id'),
          count: types.number().integer(),
        }),

        longestStreak: types.object({
          user: types.string().description('user id'),
          count: types.number().integer(),
        }),
        mostTabs: types.object({
          user: types.string().description('user id'),
          count: types.number().integer(),
        }),
      }),
    }
  }

  static get permissions() {
    return {
      // no call should update this document directly, we will rely on overrides
      get: permissionAuthorizers.userIdMatchesHashKey,
      getAll: () => false,
      update: permissionAuthorizers.userIdMatchesHashKey,
      // To create a new user, the created item must have the same
      // email and user ID as the authorized user.
    }
  }
}

Mission.register()

export default Mission
