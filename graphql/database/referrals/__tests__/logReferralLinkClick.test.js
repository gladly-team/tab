/* eslint-env jest */

import moment from 'moment'
import {
  addTimestampFieldsToItem,
  DatabaseOperation,
  getMockUserContext,
  mockDate,
  setMockDBResponse,
} from '../../test-utils'
import ReferralLinkClickLogModel from '../ReferralLinkClickLogModel'
import logReferralLinkClick from '../logReferralLinkClick'

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
})

describe('logReferralLinkClick', () => {
  test('it logs the search for analytics', async () => {
    expect.assertions(1)

    const userId = userContext.id
    const userSearchLogCreate = jest.spyOn(ReferralLinkClickLogModel, 'create')
    await logReferralLinkClick(userContext, userId)

    expect(userSearchLogCreate).toHaveBeenLastCalledWith(
      userContext,
      addTimestampFieldsToItem({
        userId,
        timestamp: moment.utc().toISOString(),
      })
    )
  })

  it('returns a "success" boolean', async () => {
    expect.assertions(1)

    // Mock DB response.
    const expectedReturnedData = Object.assign({
      userId: userContext.id,
      timestamp: moment.utc().toISOString(),
    })
    setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: expectedReturnedData,
    })

    const response = await logReferralLinkClick(userContext, userContext.id)
    expect(response).toEqual({
      success: true,
    })
  })

  it('throws an error if we fail to log the search', async () => {
    expect.assertions(1)
    jest
      .spyOn(ReferralLinkClickLogModel, 'create')
      .mockImplementation(() => Promise.reject(new Error('Some error.')))
    await expect(
      logReferralLinkClick(userContext, userContext.id)
    ).rejects.toThrow()
  })
})
