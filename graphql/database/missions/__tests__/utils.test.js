/* eslint-env jest */
import buildMissionReturnType from '../utils'
import UserModel from '../../users/UserModel'
import {
  DatabaseOperation,
  setMockDBResponse,
  clearAllMockDBResponses,
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../../globals/globals')

afterEach(() => {
  jest.clearAllMocks()
  clearAllMockDBResponses()
})
const mockUserMissions = [
  {
    userId: 'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
    missionId: '123456789',
    created: '2017-07-19T03:05:12Z',
    tabs: 234,
    longestTabStreak: 4,
    currentTabStreak: 2,
    missionMaxTabsDay: 10,
    acknowledgedMissionStarted: true,
    acknowledgedMissionComplete: false,
  },
  {
    userId: 'abcdefghijklmno',
    missionId: '123456789',
    created: '2017-07-19T03:05:12Z',
    tabs: 24,
    longestTabStreak: 4,
    currentTabStreak: 2,
    missionMaxTabsDay: 10,
    acknowledgedMissionStarted: true,
    acknowledgedMissionComplete: false,
  },
]
const mockMissionDocument = {
  id: '123456789',
  squadName: 'TestSquad',
  created: '2017-07-19T03:05:12Z',
  started: '2017-07-19T03:05:12Z',
  tabGoal: 1000,
  acceptedSquadMembers: ['cL5KcFKHd9fEU5C9Vstj3g4JAc73', 'abcdefghijklmno'],
  pendingSquadMembersExisting: [],
  pendingSquadMembersEmailInvite: [],
  rejectedSquadMembers: [],
  endOfMissionAwards: [],
  missionType: 'cats',
}

const mockUsers = [
  {
    id: 'abcdefghijklmno',
    email: 'kevin@example.com',
    username: 'kevin',
    joined: '2017-07-18T20:45:53Z',
    vcCurrent: 0,
    vcAllTime: 0,
    level: 1,
    tabs: 1,
    validTabs: 0,
    maxTabsDay: {
      maxDay: {
        date: '2017-07-18T20:45:53Z',
        numTabs: 1,
      },
      recentDay: {
        date: '2017-07-18T20:45:53Z',
        numTabs: 1,
      },
    },
    heartsUntilNextLevel: 5,
    vcDonatedAllTime: 0,
    numUsersRecruited: 3,
    backgroundImage: {
      id: 'fb5082cc-151a-4a9a-9289-06906670fd4e',
      timestamp: '2019-02-22T20:09:19.543Z',
      image: 'lake.jpg',
      thumbnail: 'lake.jpg',
    },
    backgroundOption: 'photo',
    backgroundColor: null,
    customImage: null,
    lastTabTimestamp: '2017-07-18T20:45:53Z',
    created: '2017-07-18T20:45:53Z',
    updated: '2017-07-18T20:45:53Z',
  },
  {
    id: 'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
    email: 'alec+01@tabforacause.org',
    username: 'alec',
    v4BetaEnabled: true,
    currentMissionId: '123456789',
    joined: '2017-07-19T03:05:12Z',
    vcCurrent: 50,
    vcAllTime: 100,
    level: 4,
    tabs: 130,
    validTabs: 100,
    maxTabsDay: {
      maxDay: {
        date: '2017-07-19T03:05:12Z',
        numTabs: 130,
      },
      recentDay: {
        date: '2017-07-19T03:05:12Z',
        numTabs: 130,
      },
    },
    heartsUntilNextLevel: 25,
    vcDonatedAllTime: 50,
    numUsersRecruited: 0,
    backgroundImage: {
      id: '9308b921-44c7-4b4e-845d-3b01fa73fa2b',
      image: '94bbd29b17fe4fa3b45777281a392f21.jpg',
      thumbnail: '5d4dfd0b34134879903f0480720bd746.jpg',
      timestamp: '2017-07-19T03:05:12Z',
    },
    backgroundOption: 'photo',
    backgroundColor: null,
    customImage: null,
    lastTabTimestamp: '2017-07-19T16:22:59Z',
    created: '2017-07-19T03:05:12Z',
    updated: '2017-07-19T16:22:59Z',
  },
  {
    id: 'efghijklmnopqrs',
    email: 'sandra@example.com',
    username: 'sandra',
  },
]
const mockDefaultMissionReturn = {
  missionId: '123456789',
  status: 'started',
  squadName: 'TestSquad',
  tabGoal: 1000,
  endOfMissionAwards: [],
  created: '2017-07-19T03:05:12Z',
  tabCount: 258,
  squadMembers: [
    {
      username: 'alec',
      status: 'accepted',
      longestTabStreak: 4,
      currentTabStreak: 2,
      missionMaxTabsDay: 10,
      tabs: 234,
    },
    {
      username: 'kevin',
      status: 'accepted',
      longestTabStreak: 4,
      currentTabStreak: 2,
      missionMaxTabsDay: 10,
      tabs: 24,
    },
  ],
}

describe('buildMissionReturnType tests', () => {
  it('it successfully returns the mission type', async () => {
    expect.assertions(1)
    setMockDBResponse(DatabaseOperation.GET_BATCH, {
      Responses: {
        [UserModel.tableName]: mockUsers,
      },
    })
    const missionReturn = await buildMissionReturnType(
      mockMissionDocument,
      mockUserMissions,
      '123'
    )
    expect(missionReturn).toEqual(mockDefaultMissionReturn)
  })

  it('it successfully generates user details with default values for pending email invite users ', async () => {
    expect.assertions(1)
    setMockDBResponse(DatabaseOperation.GET_BATCH, {
      Responses: {
        [UserModel.tableName]: mockUsers,
      },
    })
    const mockMissionWithPendingEmailInvite = {
      ...mockMissionDocument,
      pendingSquadMembersEmailInvite: ['test1@gmail.com', 'test2@gmail.com'],
    }
    const missionReturn = await buildMissionReturnType(
      mockMissionWithPendingEmailInvite,
      mockUserMissions,
      '123'
    )
    const { squadMembers } = missionReturn
    const pendingEmailUser = squadMembers.filter(member => member.invitedEmail)
    expect(pendingEmailUser).toEqual([
      {
        invitedEmail: 'test1@gmail.com',
        status: 'pending',
        longestTabStreak: 0,
        currentTabStreak: 0,
        missionMaxTabsDay: 0,
        tabs: 0,
      },
      {
        currentTabStreak: 0,
        invitedEmail: 'test2@gmail.com',
        longestTabStreak: 0,
        missionMaxTabsDay: 0,
        status: 'pending',
        tabs: 0,
      },
    ])
  })

  it('it successfully generates user details with default values for pending existing invite users ', async () => {
    expect.assertions(1)
    setMockDBResponse(DatabaseOperation.GET_BATCH, {
      Responses: {
        [UserModel.tableName]: mockUsers,
      },
    })
    const mockMissionWithPendingEmailInvite = {
      ...mockMissionDocument,
      pendingSquadMembersExisting: ['efghijklmnopqrs'],
    }
    const missionReturn = await buildMissionReturnType(
      mockMissionWithPendingEmailInvite,
      mockUserMissions,
      '123'
    )
    const { squadMembers } = missionReturn
    const pendingInviteUser = squadMembers.filter(
      member => member.status === 'pending'
    )
    expect(pendingInviteUser).toEqual([
      {
        username: 'sandra',
        status: 'pending',
        longestTabStreak: 0,
        currentTabStreak: 0,
        missionMaxTabsDay: 0,
        tabs: 0,
      },
    ])
  })

  it('it successfully generates user details with default values for rejected existing invite users ', async () => {
    expect.assertions(1)
    setMockDBResponse(DatabaseOperation.GET_BATCH, {
      Responses: {
        [UserModel.tableName]: mockUsers,
      },
    })
    const mockMissionWithPendingEmailInvite = {
      ...mockMissionDocument,
      rejectedSquadMembers: ['efghijklmnopqrs'],
    }
    const missionReturn = await buildMissionReturnType(
      mockMissionWithPendingEmailInvite,
      mockUserMissions,
      '123'
    )
    const { squadMembers } = missionReturn
    const rejectedUsers = squadMembers.filter(
      member => member.status === 'rejected'
    )
    expect(rejectedUsers).toEqual([
      {
        username: 'sandra',
        status: 'rejected',
        longestTabStreak: 0,
        currentTabStreak: 0,
        missionMaxTabsDay: 0,
        tabs: 0,
      },
    ])
  })

  it('it correctly accumulates top level tab count based on userMission docs', async () => {
    expect.assertions(1)
    setMockDBResponse(DatabaseOperation.GET_BATCH, {
      Responses: {
        [UserModel.tableName]: mockUsers,
      },
    })
    const mockMissionWithAdditionalUser = {
      ...mockMissionDocument,
      acceptedSquadMembers: [
        ...mockMissionDocument.acceptedSquadMembers,
        'efghijklmnopqrs',
      ],
    }
    const mockAdditionalUserMissionsDoc = [
      ...mockUserMissions,
      {
        userId: 'efghijklmnopqrs',
        missionId: '123456789',
        created: '2017-07-19T03:05:12Z',
        tabs: 523,
        longestTabStreak: 4,
        currentTabStreak: 2,
        missionMaxTabsDay: 10,
        acknowledgedMissionStarted: true,
        acknowledgedMissionComplete: false,
      },
    ]
    const missionReturn = await buildMissionReturnType(
      mockMissionWithAdditionalUser,
      mockAdditionalUserMissionsDoc,
      '123'
    )
    const { tabCount } = missionReturn
    expect(tabCount).toEqual(781)
  })
})
