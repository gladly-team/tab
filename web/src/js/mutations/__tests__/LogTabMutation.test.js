/* eslint-env jest */

import environment from 'js/relay-env'
import commitMutation from 'relay-commit-mutation-promise'

jest.mock('js/relay-env')
jest.mock('js/components/General/QueryRendererWithUser')
jest.mock('relay-commit-mutation-promise')

const getMockInput = () => ({
  userId: 'abc-123',
  tabId: 'some-tab-id',
})

const getMockAdditionalVars = () => ({})

afterEach(() => {
  jest.clearAllMocks()
})

describe('LogTabMutation', () => {
  it('calls commitMutation with expected values', async () => {
    expect.assertions(1)
    const LogTabMutation = require('../LogTabMutation').default
    const args = getMockInput()
    await LogTabMutation(args, getMockAdditionalVars())
    expect(commitMutation).toHaveBeenCalledWith(environment, {
      mutation: expect.any(Function),
      variables: {
        input: args,
      },
    })
  })
})
