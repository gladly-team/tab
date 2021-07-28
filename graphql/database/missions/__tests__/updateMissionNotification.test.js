/* eslint-env jest */
import moment from 'moment'
import UserMissionModel from '../UserMissionModel'
import updateMissionNotification from '../updateMissionNotification'
import { getMockUserContext, mockDate } from '../../test-utils'
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../../utils/permissions-overrides'
import { MISSION_COMPLETE, MISSION_STARTED } from '../constants'

const override = getPermissionsOverride(MISSIONS_OVERRIDE)

jest.mock('../../databaseClient')

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('updateMissionNotification', () => {
  it('updates UserMission model for MISSION_COMPLETE', async () => {
    expect.assertions(1)

    const updateMethod = jest.spyOn(UserMissionModel, 'update')

    const defaultUserContext = getMockUserContext()
    const missionId = 'abc123'
    await updateMissionNotification(
      defaultUserContext.id,
      missionId,
      MISSION_COMPLETE
    )

    expect(updateMethod).toHaveBeenCalledWith(override, {
      userId: defaultUserContext.id,
      missionId,
      acknowledgedMissionComplete: true,
      updated: moment.utc().toISOString(),
    })
  })

  it('updates UserMission model for MISSION_STARTED', async () => {
    expect.assertions(2)

    const updateMethod = jest.spyOn(UserMissionModel, 'update')

    const defaultUserContext = getMockUserContext()
    const missionId = 'abc123'
    const result = await updateMissionNotification(
      defaultUserContext.id,
      missionId,
      MISSION_STARTED
    )

    expect(updateMethod).toHaveBeenCalledWith(override, {
      userId: defaultUserContext.id,
      missionId,
      acknowledgedMissionStarted: true,
      updated: moment.utc().toISOString(),
    })
    expect(result).toEqual({ success: true })
  })

  it('updates UserMission model for MISSION_STARTED', async () => {
    expect.assertions(2)

    const updateMethod = jest.spyOn(UserMissionModel, 'update')

    const defaultUserContext = getMockUserContext()
    const missionId = 'abc123'
    const result = await updateMissionNotification(
      defaultUserContext.id,
      missionId,
      MISSION_STARTED
    )

    expect(updateMethod).toHaveBeenCalledWith(override, {
      userId: defaultUserContext.id,
      missionId,
      acknowledgedMissionStarted: true,
      updated: moment.utc().toISOString(),
    })
    expect(result).toEqual({ success: true })
  })

  it('does not update UserMission model for other actions and returns false', async () => {
    expect.assertions(2)

    const updateMethod = jest.spyOn(UserMissionModel, 'update')

    const defaultUserContext = getMockUserContext()
    const missionId = 'abc123'
    const result = await updateMissionNotification(
      defaultUserContext.id,
      missionId,
      'not an action'
    )

    expect(updateMethod).not.toHaveBeenCalled()
    expect(result).toEqual({ success: false })
  })
})
