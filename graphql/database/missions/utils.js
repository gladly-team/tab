import UserModel from '../users/UserModel'
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../utils/permissions-overrides'

const PENDING = 'pending'
const ACCEPTED = 'accepted'
const REJECTED = 'rejected'
const COMPLETED = 'completed'
const STARTED = 'started'
const override = getPermissionsOverride(MISSIONS_OVERRIDE)
const buildSquadMemberDataFromMissionDoc = missionDoc => {
  const {
    acceptedSquadMembers,
    pendingSquadMembersExisting,
    rejectedSquadMembers,
    pendingSquadMembersEmailInvite,
  } = missionDoc
  const squadMemberDataFromMissionDocAsDictionary = {}
  acceptedSquadMembers.forEach(acceptedUserId => {
    squadMemberDataFromMissionDocAsDictionary[acceptedUserId] = {
      userId: acceptedUserId,
      status: ACCEPTED,
    }
  })
  pendingSquadMembersExisting.forEach(pendingUserId => {
    squadMemberDataFromMissionDocAsDictionary[pendingUserId] = {
      status: PENDING,
      userId: pendingUserId,
    }
  })
  rejectedSquadMembers.forEach(rejectedUserId => {
    squadMemberDataFromMissionDocAsDictionary[rejectedUserId] = {
      status: REJECTED,
      userId: rejectedUserId,
    }
  })
  pendingSquadMembersEmailInvite.forEach(email => {
    squadMemberDataFromMissionDocAsDictionary[email] = {
      status: PENDING,
      invitedEmail: email,
    }
  })
  return squadMemberDataFromMissionDocAsDictionary
}
const buildTopLevelFieldsFromUserMissionDocs = (userMissionDocuments, userId) =>
  userMissionDocuments.reduce(
    (acum, item) => {
      if (item.userId === userId) {
        // eslint-disable-next-line no-param-reassign
        acum.acknowledgedMissionComplete = item.acknowledgedMissionComplete
        // eslint-disable-next-line no-param-reassign
        acum.acknowledgedMissionStarted = item.acknowledgedMissionStarted
      }
      // eslint-disable-next-line no-param-reassign
      acum.tabCount += item.tabs
      return acum
    },
    {
      tabCount: 0,
    }
  )

const buildTopLevelFieldsFromMissionDocument = missionDocument => {
  const {
    id,
    squadName,
    created,
    started,
    completed,
    tabGoal,
    endOfMissionAwards,
  } = missionDocument
  let status
  if (completed) {
    status = COMPLETED
  } else if (started) {
    status = STARTED
  } else {
    status = PENDING
  }
  return {
    missionId: id,
    status,
    squadName,
    tabGoal,
    endOfMissionAwards,
    created,
  }
}

const buildSquadMembersDetailedStats = async (
  squadMemberDataFromMissionDocAsMap,
  userMissionDocuments
) => {
  const userIdUsernameMap = (await UserModel.getBatch(
    override,
    userMissionDocuments.map(user => user.userId),
    { ProjectionExpression: 'id, username' }
  )).reduce((acum, item) => {
    // eslint-disable-next-line no-param-reassign
    acum[item.id] = item.username
    return acum
  }, {})
  const squadMembersExisting = userMissionDocuments.reduce((acum, item) => {
    const { userId, tabStreak, missionMaxTabsDay, tabs } = item
    const { longestTabStreak, currentTabStreak } = tabStreak
    const squadMember = {
      userId,
      username: userIdUsernameMap[userId],
      status: squadMemberDataFromMissionDocAsMap[userId].status,
      longestTabStreak,
      currentTabStreak,
      missionMaxTabsDay: missionMaxTabsDay.maxDay.numTabs,
      tabs,
    }
    acum.push(squadMember)
    return acum
  }, [])

  const emailInviteSquadMembers = Object.values(
    squadMemberDataFromMissionDocAsMap
  )
    .filter(user => user.invitedEmail !== undefined)
    .map(emailInviteUser => ({
      invitedEmail: emailInviteUser.invitedEmail,
      status: 'pending',
      longestTabStreak: 0,
      currentTabStreak: 0,
      missionMaxTabsDay: 0,
      tabs: 0,
    }))
  const nonAcceptedExistingUsers = Object.values(
    squadMemberDataFromMissionDocAsMap
  )
    .filter(
      user => user.invitedEmail === undefined && user.status !== 'accepted'
    )
    .map(existingUser => ({
      username: userIdUsernameMap[existingUser.userId],
      status: existingUser.status,
      longestTabStreak: 0,
      currentTabStreak: 0,
      missionMaxTabsDay: 0,
      tabs: 0,
    }))
  return [
    ...squadMembersExisting,
    ...emailInviteSquadMembers,
    ...nonAcceptedExistingUsers,
  ]
}

const buildMissionReturnType = async (
  missionDocument,
  userMissionDocuments,
  userId
) => {
  const topLevelFieldsFromMissionDocument = buildTopLevelFieldsFromMissionDocument(
    missionDocument
  )
  const topLevelFieldsFromUserMissionDocuments = buildTopLevelFieldsFromUserMissionDocs(
    userMissionDocuments,
    userId
  )
  const squadMemberDataFromMissionDocAsDictionary = buildSquadMemberDataFromMissionDoc(
    missionDocument
  )
  const squadMembers = await buildSquadMembersDetailedStats(
    squadMemberDataFromMissionDocAsDictionary,
    userMissionDocuments
  )
  return {
    ...topLevelFieldsFromMissionDocument,
    ...topLevelFieldsFromUserMissionDocuments,
    squadMembers,
  }
}
export default buildMissionReturnType
