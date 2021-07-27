/* eslint-env jest */
import moment from 'moment'
import UserMissionModel from '../UserMissionModel'
import updateMissionNotification from '../updateMissionNotification'
import {
  getMockUserContext,
  clearAllMockDBResponses,
  mockDate,
} from '../../test-utils'
import {
  getPermissionsOverride,
  MISSIONS_OVERRIDE,
} from '../../../utils/permissions-overrides'

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
  clearAllMockDBResponses()
})

describe('updateMissionNotification', () => {
  it('updates UserMission model', async () => {
    expect.assertions(1)

    const updateMethod = jest.spyOn(UserMissionModel, 'update')

    const defaultUserContext = getMockUserContext()
    const missionId = 'abc123'
    await updateMissionNotification(defaultUserContext.id, missionId)

    expect(updateMethod).toHaveBeenCalledWith(override, {
      userId: defaultUserContext.id,
      missionId,
      acknowledgedMissionComplete: true,
      updated: moment.utc().toISOString(),
    })
  })
})
