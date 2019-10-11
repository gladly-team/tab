/* eslint-env jest */

import environment from 'js/relay-env'
import commitMutation from 'relay-commit-mutation-promise'

jest.mock('js/relay-env')
jest.mock('js/components/General/QueryRendererWithUser')
jest.mock('relay-commit-mutation-promise')

const getMockInput = () => ({
  userId: 'abc-123',
  experimentActions: {
    searchIntro: 'DISMISS',
  },
})

const getMockAdditionalVars = () => ({})

afterEach(() => {
  jest.clearAllMocks()
})

describe('LogUserExperimentActionsMutation', () => {
  it('calls commitMutation with expected values', async () => {
    expect.assertions(1)
    const LogUserExperimentActionsMutation = require('../LogUserExperimentActionsMutation')
      .default
    const args = getMockInput()
    await LogUserExperimentActionsMutation(args, getMockAdditionalVars())
    expect(commitMutation).toHaveBeenCalledWith(environment, {
      mutation: expect.any(Function),
      variables: {
        input: args,
      },
    })
  })
})
