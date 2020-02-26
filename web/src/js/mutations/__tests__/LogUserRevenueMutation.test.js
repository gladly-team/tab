/* eslint-env jest */

import environment from 'js/relay-env'
import commitMutation from 'relay-commit-mutation-promise'

jest.mock('js/relay-env')
jest.mock('relay-commit-mutation-promise')

const getMockInput = () => ({
  userId: 'user-id-123',
  revenue: 0.0123,
  encodedRevenue: 'encoded-abc-xyz',
  GAMAdvertiserId: 24681357,
  adSize: '300x250',
  aggregationOperation: 'MAX',
  tabId: 'fc63cb6a-c8c7-42a3-98e7-1cb20c79db7f',
  adUnitCode: null,
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('LogUserRevenueMutation', () => {
  it('calls commitMutation with expected values', async () => {
    expect.assertions(1)
    const LogUserRevenueMutation = require('../LogUserRevenueMutation').default
    const args = getMockInput()
    await LogUserRevenueMutation(args)
    expect(commitMutation).toHaveBeenCalledWith(environment, {
      mutation: expect.any(Function),
      variables: {
        input: args,
      },
    })
  })
})
