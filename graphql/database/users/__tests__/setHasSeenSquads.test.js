/* eslint-env jest */

import moment from 'moment'
import logger from '../../../utils/logger'
import { getMockUserContext, mockDate } from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../../../utils/logger')

const userContext = getMockUserContext()

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('setHasSeenSquads', () => {
  it('sets hasSeenSquads', async () => {
    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')
    const setHasSeenSquads = require('../setHasSeenSquads').default
    await setHasSeenSquads(userContext, userContext.id)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      hasSeenSquads: true,
      updated: moment.utc().toISOString(),
    })
  })

  it('throws if calling the DB throws', async () => {
    const UserModel = require('../UserModel').default
    const mockErr = new Error('No good.')
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => {
      throw mockErr
    })
    const setHasSeenSquads = require('../setHasSeenSquads').default
    await expect(setHasSeenSquads(userContext, userContext.id)).rejects.toThrow(
      mockErr
    )
  })

  it('logs an error if calling the DB throws', async () => {
    const UserModel = require('../UserModel').default
    const mockErr = new Error('No good.')
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => {
      throw mockErr
    })
    const setHasSeenSquads = require('../setHasSeenSquads').default

    try {
      await setHasSeenSquads(userContext, userContext.id)
    } catch (e) {} // eslint-disable-line no-empty
    expect(logger.error).toHaveBeenCalledWith(mockErr)
  })
})
