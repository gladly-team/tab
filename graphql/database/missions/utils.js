/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import UserModel from '../users/UserModel'
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../utils/permissions-overrides'

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
      status: 'accepted',
    }
  })
  pendingSquadMembersExisting.forEach(pendingUserId => {
    squadMemberDataFromMissionDocAsDictionary[pendingUserId] = {
      status: 'pending',
      userId: pendingUserId,
    }
  })
  rejectedSquadMembers.forEach(rejectedUserId => {
    squadMemberDataFromMissionDocAsDictionary[rejectedUserId] = {
      status: 'rejected',
      userId: rejectedUserId,
    }
  })
  pendingSquadMembersEmailInvite.forEach(email => {
    squadMemberDataFromMissionDocAsDictionary[email] = {
      status: 'pending',
      invitedEmail: email,
    }
  })
  console.log(squadMemberDataFromMissionDocAsDictionary)
  return squadMemberDataFromMissionDocAsDictionary
}
const buildTopLevelFieldsFromUserMissionDocs = (userMissionDocuments, userId) =>
  userMissionDocuments.reduce(
    (acum, item) => {
      if (item.userId === userId) {
        acum.acknowledgedMissionComplete = item.acknowledgedMissionComplete
        acum.acknowledgedMissionStarted = item.acknowledgedMissionStarted
      }
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
  return {
    missionId: id,
    status: completed ? 'completed' : started ? 'started' : 'pending',
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
    acum[item.id] = item.username
    return acum
  }, {})
  console.log(userIdUsernameMap, 'did i get anything')
  const squadMembersExisting = userMissionDocuments.reduce((acum, item) => {
    const {
      userId,
      longestTabStreak,
      currentTabStreak,
      missionMaxTabsDay,
      tabs,
    } = item
    const squadMember = {
      username: userIdUsernameMap[userId],
      status: squadMemberDataFromMissionDocAsMap[userId].status,
      longestTabStreak,
      currentTabStreak,
      missionMaxTabsDay,
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
