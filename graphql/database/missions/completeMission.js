import moment from 'moment'
import getCurrentUserMission from './getCurrentUserMission'
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
  USERS_OVERRIDE,
} from '../../utils/permissions-overrides'
import MissionModel from './MissionModel'
import {
  LONGEST_TAB_STREAK_AWARD_NAME,
  MOST_TABS_IN_DAY_AWARD_NAME,
  MOST_TOTAL_TABS_AWARD_NAME,
} from './constants'
import UserModel from '../users/UserModel'

const missionsOverride = getPermissionsOverride(MISSIONS_OVERRIDE)
const usersOverride = getPermissionsOverride(USERS_OVERRIDE)

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
      awardType: LONGEST_TAB_STREAK_AWARD_NAME,
      user: longestTabMember.userId,
      unit: longestTabMember.longestTabStreak,
    },
    {
      awardType: MOST_TABS_IN_DAY_AWARD_NAME,
      user: mostDayTabsMember.userId,
      unit: mostDayTabsMember.missionMaxTabsDay,
    },
    {
      awardType: MOST_TOTAL_TABS_AWARD_NAME,
      user: mostTotalTabsMember.userId,
      unit: mostTotalTabsMember.tabs,
    },
  ]

  await Promise.all(
    mission.squadMembers.map(async member => {
      UserModel.update(usersOverride, {
        userId: member.userId,
        currentMissionId: null,
      })
    })
  )

  await MissionModel.update(missionsOverride, {
    id: missionId,
    completed: moment.utc().toISOString(),
    endOfMissionAwards,
  })

  return true
}
