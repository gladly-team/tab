/* eslint-env jest */

import environment from 'js/relay-env'
import commitMutation from 'relay-commit-mutation-promise'

jest.mock('js/relay-env')
jest.mock('react-relay')
jest.mock('relay-commit-mutation-promise')

const getMockInput = () => ({
  userId: 'abc-123',
  source: 'ff',
})

const getMockAdditionalVars = () => ({})

afterEach(() => {
  jest.clearAllMocks()
})

describe('LogSearchMutation', () => {
  it('calls commitMutation with expected values', async () => {
    expect.assertions(1)
    const LogSearchMutation = require('../LogSearchMutation').default
    const args = getMockInput()
    await LogSearchMutation(args, getMockAdditionalVars())
    expect(commitMutation).toHaveBeenCalledWith(environment, {
      mutation: expect.any(Function),
      variables: {
        input: args,
      },
    })
  })
})
