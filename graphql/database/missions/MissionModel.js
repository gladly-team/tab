import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { MISSION, TAB_GOAL_FOR_TRAINING_SESSION } from '../constants'

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
    const self = this
    return {
      id: types
        .string()
        .length(9)
        .required()
        .description(`The unique mission id`),
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
        .default(self.fieldDefaults.tabGoal)
        .description(`number of tabs for goal`),
      missionType: types
        .string()
        .default(self.fieldDefaults.missionType)
        .description('the kind of mission ie cats mission'),
      acceptedSquadMembers: types
        .array()
        .items(types.string())
        .default(self.fieldDefaults.acceptedSquadMembers)
        .description('user IDs of people who have joined the mission'),
      pendingSquadMembersExisting: types
        .array()
        .items(types.string())
        .default(self.fieldDefaults.pendingSquadMembersExisting)
        .description('users ids who have pending invites'),
      pendingSquadMembersEmailInvite: types
        .array()
        .items(types.string())
        .default(self.fieldDefaults.pendingSquadMembersEmailInvite)
        .description('users who have been invited via email'),
      rejectedSquadMembers: types
        .array()
        .items(types.string())
        .default(self.fieldDefaults.rejectedSquadMembers)
        .description('User IDs of users who declined to join the squad'),
      endOfMissionAwards: types
        .array()
        .items(
          types.object({
            user: types.string().description('the user id'),
            awardType: types
              .string()
              .description('the string name of the particular award'),
            unit: types
              .number()
              .integer()
              .description('the unit for the award IE tab count'),
          })
        )
        .default(self.fieldDefaults.endOfMissionAwards),
    }
  }

  static get fieldDefaults() {
    return {
      missionType: 'cats',
      tabGoal: TAB_GOAL_FOR_TRAINING_SESSION,
      acceptedSquadMembers: [],
      pendingSquadMembersExisting: [],
      pendingSquadMembersEmailInvite: [],
      rejectedSquadMembers: [],
      endOfMissionAwards: [],
    }
  }
}

Mission.register()

export default Mission
