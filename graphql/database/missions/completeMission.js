import moment from 'moment'
import getCurrentUserMission from './getCurrentUserMission'
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../utils/permissions-overrides'
import MissionModel from './MissionModel'

const override = getPermissionsOverride(MISSIONS_OVERRIDE)

/**
 * @param {string} missionId
 * @param {string} userId
 */

export default async (missionId, userId) => {
  // get the mission with users
  const mission = getCurrentUserMission(missionId, userId)
  if (mission == null) {
    return false
  }
  // verify that it is complete
  if (mission.tabCount < mission.tabGoal) {
    return false
  }

  // calculate end of mission awards
  const longestTabMember = mission.squadMembers.reduce((prev, current) =>
    prev.longestTabStreak > current.longestTabStreak ? prev : current
  )
  const mostDayTabsMember = mission.squadMembers.reduce((prev, current) =>
    prev.missionMaxTabsDay > current.missionMaxTabsDay ? prev : current
  )
  const mostTotalTabsMember = mission.squadMembers.reduce((prev, current) =>
    prev.tabs > current.tabs ? prev : current
  )

  const endOfMissionAwards = [
    {
      awardType: 'Consistent Kitty',
      user: longestTabMember.username,
      unit: longestTabMember.longestTabStreak,
    },
    {
      awardType: 'Hot Paws',
      user: mostDayTabsMember.username,
      unit: mostDayTabsMember.missionMaxTabsDay,
    },
    {
      awardType: 'All-Star Fur Ball',
      user: mostTotalTabsMember.username,
      unit: mostTotalTabsMember.tabs,
    },
  ]

  await MissionModel.update(override, {
    id: missionId,
    completed: moment.utc().toISOString(),
    endOfMissionAwards,
  })

  return true
}
