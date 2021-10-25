/* eslint-env jest */

import logger from '../../../utils/logger'
import { getMockUserContext, mockDate } from '../../test-utils'
import getCause from '../../cause/getCause'
import { DatabaseItemDoesNotExistException } from '../../../utils/exceptions'
import UserModel from '../UserModel'

jest.mock('../../../utils/logger')
jest.mock('../../cause/getCause')
jest.mock('../UserModel', () => ({ update: jest.fn() }))
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
    expect.assertions(1)

    UserModel.update.mockResolvedValue({})
    const causeId = 'abcd'
    const setUserCause = require('../setUserCause').default
    await setUserCause(userContext, userContext.id, causeId)
    expect(UserModel.update).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      causeId,
    })
  })

  it('throws if cause doesnt exist', async () => {
    expect.assertions(1)
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
    expect.assertions(1)
    const causeId = 'abcd'
    const mockErr = new Error('No good.')
    UserModel.update.mockRejectedValueOnce(mockErr)
    const setUserCause = require('../setUserCause').default
    await expect(
      setUserCause(userContext, userContext.id, causeId)
    ).rejects.toThrow(mockErr)
  })

  it('logs an error if calling the DB throws', async () => {
    expect.assertions(1)
    const causeId = 'abcd'
    const mockErr = new Error('No good.')
    UserModel.update.mockRejectedValueOnce(mockErr)
    const setUserCause = require('../setUserCause').default

    try {
      await setUserCause(userContext, userContext.id, causeId)
    } catch (e) {} // eslint-disable-line no-empty
    expect(logger.error).toHaveBeenCalledWith(mockErr)
  })
})
