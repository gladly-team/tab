import UserMissionModel from './UserMissionModel'
import MissionModel from './MissionModel'
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../utils/permissions-overrides'
import buildMissionReturnType from './utils'

const override = getPermissionsOverride(MISSIONS_OVERRIDE)
/**
 * Fetch current mission for user.
 * @return {Promise<Mission[]>}  A promise that resolves
 * into all past missions for a user.
 */

export default async ({ id: userId }) => {
  const pastUserMissions = await UserMissionModel.query(override, userId)
    // sort key on index ensures that missions are sorted by date
    .usingIndex('userMissionsByDate')
    .filter('acknowledgedMissionComplete')
    .eq(true)
    .execute()
  const missionDatabaseDocumentsByMission = await Promise.all(
    pastUserMissions.map(pastMission => {
      return Promise.all([
        UserMissionModel.query(override, pastMission.missionId).execute(),
        MissionModel.get(override, pastMission.missionId),
      ])
    })
  )
  return missionDatabaseDocumentsByMission.map(
    ([userMissionDocuments, missionDocument]) =>
      buildMissionReturnType(missionDocument, userMissionDocuments, userId)
  )
}
