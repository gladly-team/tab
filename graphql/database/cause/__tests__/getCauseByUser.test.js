/* eslint-env jest */
import { getMockUserContext, getMockUserInstance } from '../../test-utils'

// We don't mock getCause.js.

const MOCK_CAUSE_1 = {
  id: 'CA6A5C2uj',
  charityId: 'some-id-1',
  landingPagePath: '/foo',
}
const MOCK_CAUSE_2 = {
  id: 'mock-cause-id-2',
  charityId: 'some-id-2',
  landingPagePath: '/bar',
}

jest.mock('../causes', () => {
  return [MOCK_CAUSE_1, MOCK_CAUSE_2]
})

afterEach(() => {
  jest.resetModules()
})

describe('getCauseByUser', () => {
  it('gets the user cause mapped to cause id on user', async () => {
    expect.assertions(1)
    const userContext = getMockUserContext()
    const userId = userContext.id
    const mockUser = getMockUserInstance({
      id: userId,
      causeId: 'mock-cause-id-2',
    })
    const UserModel = require('../../users/UserModel').default
    jest.spyOn(UserModel, 'get').mockResolvedValue(mockUser)
    const getCauseByUser = require('../getCauseByUser').default
    const cause = await getCauseByUser(userContext, userId)
    expect(cause).toEqual(MOCK_CAUSE_2)
  })

  it('replaces the User.causeId when using the deprecated cats cause ID', async () => {
    expect.assertions(1)
    const userContext = getMockUserContext()
    const userId = userContext.id
    const mockUser = getMockUserInstance({
      id: userId,
      causeId: '7f8476b9-f83f-47ac-8173-4a1c2ec3dc29',
    })
    const UserModel = require('../../users/UserModel').default
    jest.spyOn(UserModel, 'get').mockResolvedValue(mockUser)
    const userModelUpdate = jest.spyOn(UserModel, 'update').mockResolvedValue(
      getMockUserInstance({
        id: userId,
        causeId: 'CA6A5C2uj',
      })
    )

    const getCauseByUser = require('../getCauseByUser').default
    await getCauseByUser(userContext, userId)

    expect(userModelUpdate).toHaveBeenCalledWith(userContext, {
      causeId: 'CA6A5C2uj',
    })
  })

  it('does not update the user if the cause ID is not deprecated', async () => {
    expect.assertions(1)
    const userContext = getMockUserContext()
    const userId = userContext.id
    const mockUser = getMockUserInstance({
      id: userId,
      causeId: 'mock-cause-id-2',
    })
    const UserModel = require('../../users/UserModel').default
    jest.spyOn(UserModel, 'get').mockResolvedValue(mockUser)
    const userModelUpdate = jest
      .spyOn(UserModel, 'update')
      .mockResolvedValue({})

    const getCauseByUser = require('../getCauseByUser').default
    await getCauseByUser(userContext, userId)
    expect(userModelUpdate).not.toHaveBeenCalled()
  })

  it('throws if the cause does not exist', async () => {
    expect.assertions(1)
    const userContext = getMockUserContext()
    const userId = userContext.id
    const mockUser = getMockUserInstance({
      id: userId,
      causeId: 'blah-blah', // does not exist
    })
    const UserModel = require('../../users/UserModel').default
    jest.spyOn(UserModel, 'get').mockResolvedValue(mockUser)
    const getCauseByUser = require('../getCauseByUser').default
    await expect(getCauseByUser(userContext, userId)).rejects.toThrow(
      'The database does not contain an item with these keys.'
    )
  })
})
