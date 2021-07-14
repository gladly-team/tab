import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { USER_MISSION } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'

/*
 * @extends BaseModel
 */
class UserMissions extends BaseModel {
  static get name() {
    return USER_MISSION
  }

  static get hashKey() {
    return 'userId'
  }

  static get rangeKey() {
    return 'MissionId'
  }

  static get indexes() {
    return [
      {
        hashKey: 'userId',
        rangeKey: 'created',
        name: 'MissionsByUser',
        type: 'global',
      },
    ]
  }

  static get tableName() {
    return tableNames.userMissions
  }

  static get schema() {
    return {
      userId: types
        .string()
        .required()
        .description(
          `The unique user ID from our authentication service (Firebase)`
        ),
      missionId: types
        .string()
        .required()
        .description(`the mission id for specific mission`),
      longestTabStreak: types
        .number()
        .integer()
        .description(`count of longest tab streak in current mission`),
      currentTabStreak: types
        .number()
        .integer()
        .description(`count of the current tab streak in current mission`),
      missionMaxTabsDay: types
        .number()
        .integer()
        .description(`most tabs in a single day during mission`),
      acknowledgedMissionComplete: types
        .boolean()
        .description('user has aknowledged that the mission has completed'),
      acknowledgedMissionStarted: types
        .boolean()
        .description('user has aknowledged that the mission has started'),
    }
  }

  static get fieldDefaults() {
    return {}
  }

  static get permissions() {
    return {
      get: permissionAuthorizers.userIdMatchesHashKey,
      query: () => true,
      getAll: () => false,
      update: permissionAuthorizers.userIdMatchesHashKey,
      create: permissionAuthorizers.userIdMatchesHashKey,
      indexPermissions: {
        InvitesByInviter: { get: permissionAuthorizers.userIdMatchesHashKey },
      },
    }
  }
}

UserMissions.register()

export default UserMissions
