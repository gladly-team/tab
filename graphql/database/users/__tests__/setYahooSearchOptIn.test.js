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

describe('setYahooSearchOptIn', () => {
  it('sets the value when enabled === true', async () => {
    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')
    const setYahooSearchOptIn = require('../setYahooSearchOptIn').default
    await setYahooSearchOptIn(userContext, userContext.id, true)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      yahooPaidSearchRewardOptIn: true,
      updated: moment.utc().toISOString(),
    })
  })

  it('sets the value when enabled === false', async () => {
    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')
    const setYahooSearchOptIn = require('../setYahooSearchOptIn').default
    await setYahooSearchOptIn(userContext, userContext.id, false)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      yahooPaidSearchRewardOptIn: false,
      updated: moment.utc().toISOString(),
    })
  })

  it('throws if calling the DB throws', async () => {
    const UserModel = require('../UserModel').default
    const mockErr = new Error('No good.')
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => {
      throw mockErr
    })
    const setYahooSearchOptIn = require('../setYahooSearchOptIn').default
    await expect(
      setYahooSearchOptIn(userContext, {
        userId: userContext.id,
        enabled: false,
      })
    ).rejects.toThrow(mockErr)
  })

  it('logs an error if calling the DB throws', async () => {
    const UserModel = require('../UserModel').default
    const mockErr = new Error('No good.')
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => {
      throw mockErr
    })
    const setYahooSearchOptIn = require('../setYahooSearchOptIn').default

    try {
      await setYahooSearchOptIn(userContext, {
        userId: userContext.id,
        enabled: false,
      })
    } catch (e) {} // eslint-disable-line no-empty
    expect(logger.error).toHaveBeenCalledWith(mockErr)
  })
})
