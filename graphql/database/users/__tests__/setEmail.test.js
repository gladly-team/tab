/* eslint-env jest */

import moment from 'moment'
import { getMockUserContext, mockDate } from '../../test-utils'

jest.mock('../../databaseClient')
const userContext = getMockUserContext()

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

beforeEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('setEmail', () => {
  it('works as expected and takes email from the userContext', async () => {
    const UserModel = require('../UserModel').default
    const updateQuery = jest.spyOn(UserModel, 'update')
    const setEmail = require('../setEmail').default
    await setEmail(userContext, userContext.id)
    expect(updateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      email: userContext.email,
      updated: moment.utc().toISOString(),
    })
  })
})
