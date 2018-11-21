/* eslint-env jest */

import Relay from 'react-relay'
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

afterEach(() => {
  jest.clearAllMocks()
})

describe('DonateVcMutation', () => {
  it('calls commitMutation with expected values', async () => {
    expect.assertions(1)
    const DonateVcMutation = require('../DonateVcMutation').default
    const args = getMockInput()
    await DonateVcMutation(args, getMockAdditionalVars())
    expect(commitMutation).toHaveBeenCalledWith(
      environment,
      {
        mutation: expect.any(Function),
        variables: {
          input: args
        },
        updater: expect.any(Function)
      }
    )
  })

  it('updates the charity\'s "vcReceived" after donating', async () => {
    expect.assertions(1)
    const DonateVcMutation = require('../DonateVcMutation').default
    const args = getMockInput()
    args.vc = 33
    await DonateVcMutation(args, getMockAdditionalVars())

    // Return a mock Charity RecordProxy object with a value for
    // the "vcReceived" field.
    const mockCharityRecord = Relay.__getMockRecordProxy()
    mockCharityRecord.getValue.mockReturnValueOnce(400)
    environment.store.get.mockReturnValueOnce(mockCharityRecord)

    // Call the updater.
    const mutationUpdater = commitMutation.mock.calls[0][1].updater
    mutationUpdater(environment.store)
    expect(mockCharityRecord.setValue)
      .toHaveBeenCalledWith(433, 'vcReceived', {
        startTime: '2018-11-09T19:00:00.000Z',
        endTime: '2018-11-30T19:00:00.000Z'
      })
  })
})
