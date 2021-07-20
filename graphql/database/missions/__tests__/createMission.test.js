/* eslint-env jest */
import createMission from '../createMission'
import UserModel from '../../users/UserModel'
import {
  DatabaseOperation,
  setMockDBResponse,
  getMockUserInstance,
  getMockUserContext,
  clearAllMockDBResponses,
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../../globals/globals')

afterEach(() => {
  jest.clearAllMocks()
  clearAllMockDBResponses()
})

describe('createMission tests', () => {
  it('it throws an error if user is already in an ongoing mission', async () => {
    expect.assertions(1)
    const user = getMockUserInstance(
      Object.assign({}, { currentMissionId: '123456789' })
    )
    setMockDBResponse(DatabaseOperation.GET, {
      Item: user,
    })
    expect(() => {
      createMission(getMockUserContext(), 'abcdefghijklmno', 'someSquadName')
    }).toThrow()
  })
})
