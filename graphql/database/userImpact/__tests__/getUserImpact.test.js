/* eslint-env jest */

import UserImpactModel from '../UserImpactModel'
import getUserImpact from '../getUserImpact'
import {
  DatabaseOperation,
  getMockUserContext,
  mockDate,
  setMockDBResponse,
  getMockUserInstance,
  getMockCauseInstance,
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../../globals/globals')

const userContext = getMockUserContext()
const mockCurrentTime = '2017-06-22T01:13:28.000Z'

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true,
  })
})

const userId = userContext.id

describe('getUserImpact', () => {
  it('gets the user impact mapped to cause id on user', async () => {
    const mockUser = getMockUserInstance({ causeId: 'mock-cause-id' })
    const mockCause = getMockCauseInstance({
      id: 'mock-cause-id',
      charityId: 'mock-charity-id',
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockUser,
    })
    setMockDBResponse(DatabaseOperation.GET, {
      Item: mockCause,
    })
    const getOrCreate = jest.spyOn(UserImpactModel, 'getOrCreate')
    await getUserImpact(userContext, userId)
    expect(getOrCreate).toHaveBeenCalledWith(userContext, {
      userId: 'abcdefghijklmno',
      charityId: 'mock-charity-id',
      created: '2017-06-22T01:13:28.000Z',
      updated: '2017-06-22T01:13:28.000Z',
    })
  })
})
