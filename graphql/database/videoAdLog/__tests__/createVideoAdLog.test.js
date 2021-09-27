/* eslint-env jest */
import {
  getMockUserContext,
  getMockUserInfo,
  mockDate,
  DatabaseOperation,
  setMockDBResponse,
} from '../../test-utils'
import { UnauthorizedQueryException } from '../../../utils/exceptions'

jest.mock('../../databaseClient')
beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})
const userContext = getMockUserContext()
const user = getMockUserInfo()
const mockReturn = {
  userId: 'abcdefghijklmno',
  timestamp: '2017-07-18T20:45:53Z',
  completed: false,
  id: '1234567890asdfgh',
}
describe('createVideoAdLog tests', () => {
  it('creates a new log', async () => {
    expect.assertions(2)
    const createVideoAdLog = require('../createVideoAdLog').default
    // Mock creation query
    setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: mockReturn,
    })
    const result = await createVideoAdLog(userContext, user.id)
    expect(result).toEqual({
      completed: false,
      created: '2017-05-19T13:59:46.000Z',
      id: expect.any(String),
      timestamp: '2017-05-19T13:59:46.000Z',
      updated: '2017-05-19T13:59:46.000Z',
      userId: 'abcdefghijklmno',
    })

    // testing nanoid
    expect(result.id.length).toEqual(16)
  })

  it('throws if user id does not match user context', async () => {
    expect.assertions(1)
    const createVideoAdLog = require('../createVideoAdLog').default
    await expect(createVideoAdLog(userContext, 'wrongid')).rejects.toThrow(
      new UnauthorizedQueryException()
    )
  })
})
