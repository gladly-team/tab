/* eslint-env jest */

import moment from 'moment'
import logger from '../../../utils/logger'
import { getMockUserContext, mockDate } from '../../test-utils'
import getCause from '../../cause/getCause'
import { DatabaseItemDoesNotExistException } from '../../../utils/exceptions'

jest.mock('../../../utils/logger')
jest.mock('../../cause/getCause')

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

describe('setUserCause', () => {
  it('sets users cause ID', async () => {
    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')
    const causeId = 'abcd'
    const setUserCause = require('../setUserCause').default
    await setUserCause(userContext, userContext.id, causeId)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      causeId,
      updated: moment.utc().toISOString(),
    })
  })

  it('throws if cause doesnt exist', async () => {
    const error = new DatabaseItemDoesNotExistException()
    getCause.mockImplementationOnce(() => {
      throw error
    })
    const setUserCause = require('../setUserCause').default
    await expect(
      setUserCause(userContext, userContext.id, 'abcd')
    ).rejects.toThrow(error)
  })

  it('throws if calling the DB throws', async () => {
    const UserModel = require('../UserModel').default
    const causeId = 'abcd'
    const mockErr = new Error('No good.')
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => {
      throw mockErr
    })
    const setUserCause = require('../setUserCause').default
    await expect(
      setUserCause(userContext, userContext.id, causeId)
    ).rejects.toThrow(mockErr)
  })

  it('logs an error if calling the DB throws', async () => {
    const UserModel = require('../UserModel').default
    const causeId = 'abcd'
    const mockErr = new Error('No good.')
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => {
      throw mockErr
    })
    const setUserCause = require('../setUserCause').default

    try {
      await setUserCause(userContext, userContext.id, causeId)
    } catch (e) {} // eslint-disable-line no-empty
    expect(logger.error).toHaveBeenCalledWith(mockErr)
  })
})
