/* eslint-env jest */

import moment from 'moment'
import logger from '../../../utils/logger'
import { getMockUserContext, mockDate } from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../getUserByUsername')
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

describe('setHasViewedIntroFlow', () => {
  it('sets the value when enabled === true', async () => {
    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')
    const setHasViewedIntroFlow = require('../setHasViewedIntroFlow').default
    await setHasViewedIntroFlow(userContext, {
      userId: userContext.id,
      enabled: true,
    })
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      hasViewedIntroFlow: true,
      updated: moment.utc().toISOString(),
    })
  })

  it('sets the value when enabled === false', async () => {
    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')
    const setHasViewedIntroFlow = require('../setHasViewedIntroFlow').default
    await setHasViewedIntroFlow(userContext, {
      userId: userContext.id,
      enabled: false,
    })
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      hasViewedIntroFlow: false,
      updated: moment.utc().toISOString(),
    })
  })

  it('throws if calling the DB throws', async () => {
    const UserModel = require('../UserModel').default
    const mockErr = new Error('No good.')
    jest.spyOn(UserModel, 'update').mockImplementationOnce(() => {
      throw mockErr
    })
    const setHasViewedIntroFlow = require('../setHasViewedIntroFlow').default
    await expect(
      setHasViewedIntroFlow(userContext, {
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
    const setHasViewedIntroFlow = require('../setHasViewedIntroFlow').default

    try {
      await setHasViewedIntroFlow(userContext, {
        userId: userContext.id,
        enabled: false,
      })
    } catch (e) {} // eslint-disable-line no-empty
    expect(logger.error).toHaveBeenCalledWith(mockErr)
  })
})
