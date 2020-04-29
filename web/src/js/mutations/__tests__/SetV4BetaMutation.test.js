/* eslint-env jest */

import environment from 'js/relay-env'
import commitMutation from 'relay-commit-mutation-promise'

jest.mock('js/relay-env')
jest.mock('relay-commit-mutation-promise')

const getMockInput = () => ({
  userId: 'user-id-123',
  enabled: true,
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SetV4BetaMutation', () => {
  it('calls commitMutation with expected values', async () => {
    expect.assertions(1)
    const SetV4BetaMutation = require('../SetV4BetaMutation').default
    const args = getMockInput()
    await SetV4BetaMutation(args)
    expect(commitMutation).toHaveBeenCalledWith(environment, {
      mutation: expect.any(Function),
      variables: {
        input: args,
      },
    })
  })
})
