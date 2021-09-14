import moment from 'moment'
import getCurrentUserMission from './getCurrentUserMission'
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../utils/permissions-overrides'
import MissionModel from './MissionModel'
import {
  LONGEST_TAB_STREAK_AWARD_NAME,
  MOST_TABS_IN_DAY_AWARD_NAME,
  MOST_TOTAL_TABS_AWARD_NAME,
} from './constants'

const missionsOverride = getPermissionsOverride(MISSIONS_OVERRIDE)

/**
 * @param {string} missionId
 * @param {string} userId
 */

export default async (userId, missionId) => {
  // get the mission with users
  const mission = await getCurrentUserMission({
    currentMissionId: missionId,
    id: userId,
  })
  if (mission == null) {
    return false
  }
  // verify that it is complete
  if (mission.tabCount < mission.tabGoal) {
    return false
  }
  // calculate end of mission awards
  const longestTabMember = mission.squadMembers.reduce((prev, current) =>
    prev.tabStreak.longestTabStreak > current.tabStreak.longestTabStreak
      ? prev
      : current
  )
  const mostDayTabsMember = mission.squadMembers.reduce((prev, current) =>
    prev.missionMaxTabsDay.maxDay.numTabs >
    current.missionMaxTabsDay.maxDay.numTabs
      ? prev
      : current
  )
  const mostTotalTabsMember = mission.squadMembers.reduce((prev, current) =>
    prev.tabs > current.tabs ? prev : current
  )

  const endOfMissionAwards = [
    {
      awardType: LONGEST_TAB_STREAK_AWARD_NAME,
      user: longestTabMember.userId,
      unit: longestTabMember.tabStreak.longestTabStreak,
    },
    {
      awardType: MOST_TABS_IN_DAY_AWARD_NAME,
      user: mostDayTabsMember.userId,
      unit: mostDayTabsMember.missionMaxTabsDay.maxDay.numTabs,
    },
    {
      awardType: MOST_TOTAL_TABS_AWARD_NAME,
      user: mostTotalTabsMember.userId,
      unit: mostTotalTabsMember.tabs,
    },
  ]

  await MissionModel.update(missionsOverride, {
    id: missionId,
    completed: moment.utc().toISOString(),
    endOfMissionAwards,
  })

  return true
}
