import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { USER_MISSION } from '../constants'
import { permissionAuthorizers } from '../../utils/authorization-helpers'

/*
 * @extends BaseModel
 */
class UserMission extends BaseModel {
  static get name() {
    return USER_MISSION
  }

  static get hashKey() {
    return 'missionId'
  }

  static get rangeKey() {
    return 'userId'
  }

  static get indexes() {
    return [
      {
        hashKey: 'userId',
        rangeKey: 'created',
        name: 'userMissionsByDate',
        type: 'global',
      },
    ]
  }

  static get tableName() {
    return tableNames.userMissions
  }

  static get schema() {
    const self = this
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
      tabs: types
        .number()
        .integer()
        .default(self.fieldDefaults.tabs)
        .description(`the number of tabs the user has contributed`),
      longestTabStreak: types
        .number()
        .integer()
        .default(self.fieldDefaults.longestTabStreak)
        .description(`count of longest tab streak in current mission`),
      currentTabStreak: types
        .number()
        .integer()
        .default(self.fieldDefaults.currentTabStreak)
        .description(`count of the current tab streak in current mission`),
      missionMaxTabsDay: types
        .object({
          // The count of tabs for the day on which the user opened
          // the most tabs.
          maxDay: types.object({
            date: types.string().isoDate(),
            numTabs: types.number().integer(),
          }),
          // The count of tabs for the current (or most recent) day
          // the user has opened a tab.
          recentDay: types.object({
            date: types.string().isoDate(),
            numTabs: types.number().integer(),
          }),
        })
        .default(
          self.fieldDefaults.missionMaxTabsDay,
          `Default is zero tabs for today.`
        )
        .description(`Most tabs in a single day during the mission.`),
      acknowledgedMissionComplete: types
        .boolean()
        .default(self.fieldDefaults.acknowledgedMissionComplete)
        .description('user has aknowledged that the mission has completed'),
      acknowledgedMissionStarted: types
        .boolean()
        .default(self.fieldDefaults.acknowledgedMissionStarted)
        .description('user has aknowledged that the mission has started'),
    }
  }

  static get fieldDefaults() {
    return {
      tabs: 0,
      longestTabStreak: 0,
      currentTabStreak: 0,
      missionMaxTabsDay: 0,
      acknowledgedMissionStarted: false,
      acknowledgedMissionComplete: false,
    }
  }

  static get permissions() {
    return {
      get: permissionAuthorizers.userIdMatchesHashKey,
      update: permissionAuthorizers.userIdMatchesHashKey,
      create: permissionAuthorizers.userIdMatchesHashKey,
      indexPermissions: {
        userMissionsByDate: {
          get: permissionAuthorizers.userIdMatchesHashKey,
          getAll: permissionAuthorizers.userIdMatchesHashKey,
        },
      },
    }
  }
}

UserMission.register()

export default UserMission
