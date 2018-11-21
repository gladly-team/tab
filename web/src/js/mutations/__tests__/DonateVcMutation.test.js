/* eslint-env jest */

import environment from 'js/relay-env'
import commitMutation from 'relay-commit-mutation-promise'

jest.mock('js/relay-env')
jest.mock('react-relay')
jest.mock('relay-commit-mutation-promise')

const getMockInput = () => ({
  userId: 'abc-123',
  charityId: 'some-charity-id',
  vc: 12
})

const getMockAdditionalVars = () => ({})

describe('DonateVcMutation', () => {
  it('calls commitMutation with expected values', async () => {
    expect.assertions(1)
    const DonateVcMutation = require('../DonateVcMutation').default
    const args = getMockInput()
    DonateVcMutation(args, getMockAdditionalVars())
    expect(commitMutation).toHaveBeenCalledWith(
      environment,
      {
        mutation: expect.any(Function),
        variables: {
          input: args
        }
      }
    )
  })
})
