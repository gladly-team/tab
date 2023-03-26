/* eslint-env jest */
import moment from 'moment'
import {
  getMockUserContext,
  getMockUserInstance,
  mockDate,
} from '../../test-utils'

import {
  getPermissionsOverride,
  WILDFIRE_BY_USER_ID_OVERRIDE,
} from '../../../utils/permissions-overrides'

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

beforeAll(() => {
  mockDate.on(null, { mockCurrentTimeOnly: true })
})

afterEach(() => {
  jest.resetModules()
})

describe('getCauseForWildfire', () => {
  it('gets the user cause mapped to cause id from wildfire', async () => {
    expect.assertions(2)
    const userContext = getMockUserContext()
    const userId = userContext.id
    const mockUser = getMockUserInstance({
      id: userId,
      causeId: 'mock-cause-id-2',
    })

    const UserModel = require('../../users/UserModel').default
    jest.spyOn(UserModel, 'get').mockResolvedValue(mockUser)

    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockResolvedValue(mockUser)

    const getCauseForWildfire = require('../getCauseForWildfire').default
    const cause = await getCauseForWildfire(userId)
    expect(cause).toEqual(MOCK_CAUSE_2)

    const getOverride = getPermissionsOverride(WILDFIRE_BY_USER_ID_OVERRIDE)

    expect(updateMethod).toHaveBeenCalledWith(getOverride, {
      id: userId,
      lastShopOpenTimestamp: moment.utc().toISOString(),
    })
  })

  it('throws if the user id does not exist from wildfire', async () => {
    expect.assertions(2)
    const userContext = getMockUserContext()
    const userId = userContext.id
    const mockUser = getMockUserInstance({
      id: userId,
      causeId: 'blah-blah', // does not exist
    })
    const UserModel = require('../../users/UserModel').default
    jest.spyOn(UserModel, 'get').mockResolvedValue(mockUser)

    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockResolvedValue(mockUser)

    const getCauseForWildfire = require('../getCauseForWildfire').default
    await expect(getCauseForWildfire('fake-id')).rejects.toThrow(
      'The database does not contain an item with these keys.'
    )

    expect(updateMethod).toHaveBeenCalled()
  })

  it('throws if the cause does not exist for wildfire', async () => {
    expect.assertions(2)
    const userContext = getMockUserContext()
    const userId = userContext.id
    const mockUser = getMockUserInstance({
      id: userId,
      causeId: 'blah-blah', // does not exist
    })
    const UserModel = require('../../users/UserModel').default
    jest.spyOn(UserModel, 'get').mockResolvedValue(mockUser)
    jest.spyOn(UserModel, 'update').mockResolvedValue(mockUser)

    const updateMethod = jest
      .spyOn(UserModel, 'update')
      .mockResolvedValue(mockUser)

    const getCauseForWildfire = require('../getCauseForWildfire').default
    await expect(getCauseForWildfire(userId)).rejects.toThrow(
      'The database does not contain an item with these keys.'
    )

    expect(updateMethod).toHaveBeenCalled()
  })
})
