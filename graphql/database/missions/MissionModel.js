import BaseModel from '../base/BaseModel'
import types from '../fieldTypes'
import tableNames from '../tables'
import { MISSION } from '../constants'

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
        .default(self.fieldDefaults.missionType)
        .description('the kind of mission ie cats mission'),
      acceptedSquadMembers: types
        .array(types.string())
        .default(self.fieldDefaults.acceptedSquadMembers)
        .description('users ids who have accepted and signed up for cats'),
      pendingSquadMembersExisting: types
        .array(types.string())
        .default(self.fieldDefaults.pendingSquadMembersExisting)
        .description('users ids who have pending invites'),
      pendingSquadMembersEmailInvite: types
        .array(types.string())
        .default(self.fieldDefaults.pendingSquadMembersEmailInvite)
        .description('users who have been invited via email'),
      rejectedSquadMembers: types
        .array(types.string())
        .default(self.fieldDefaults.rejectedSquadMembers)
        .description('users who declined to join the squad'),
      endOfMissionAwards: types
        .array(
          types.object({
            user: types.string().description('the user id'),
            awardType: types
              .string()
              .description('the string name of the particular award'),
            unit: types
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
