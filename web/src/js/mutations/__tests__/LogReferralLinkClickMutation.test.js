/* eslint-env jest */

import environment from 'js/relay-env'
import commitMutation from 'relay-commit-mutation-promise'

jest.mock('js/relay-env')
jest.mock('js/components/General/QueryRendererWithUser')
jest.mock('relay-commit-mutation-promise')

const getMockInput = () => ({
  userId: 'abc-123',
})

const getMockAdditionalVars = () => ({})

afterEach(() => {
  jest.clearAllMocks()
})

describe('LogReferralLinkClickMutation', () => {
  it('calls commitMutation with expected values', async () => {
    expect.assertions(1)
    const LogReferralLinkClickMutation = require('../LogReferralLinkClickMutation')
      .default
    const args = getMockInput()
    await LogReferralLinkClickMutation(args, getMockAdditionalVars())
    expect(commitMutation).toHaveBeenCalledWith(environment, {
      mutation: expect.any(Function),
      variables: {
        input: args,
      },
    })
  })
})
