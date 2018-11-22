/* eslint-env jest */

import Relay from 'react-relay'
import moment from 'moment'
import MockDate from 'mockdate'
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

const mockNow = '2017-05-19T13:59:58.000Z'

beforeEach(() => {
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  MockDate.reset()
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
    await DonateVcMutation(args)

    // Return a mock Charity RecordProxy object with a value for
    // the "vcReceived" field.
    const mockCharityRecord = Relay.__getMockRecordProxy()
    mockCharityRecord.getValue.mockReturnValue(400)
    environment.store.get.mockReturnValue(mockCharityRecord)

    // Call the updater.
    const mutationUpdater = commitMutation.mock.calls[0][1].updater
    mutationUpdater(environment.store)
    expect(mockCharityRecord.setValue)
      .toHaveBeenCalledWith(433, 'vcReceived')
  })

  it('does not update the charity\'s "vcReceived" if the field is not already set', async () => {
    expect.assertions(1)
    const DonateVcMutation = require('../DonateVcMutation').default
    const args = getMockInput()
    args.vc = 33
    await DonateVcMutation(args)

    const mockCharityRecord = Relay.__getMockRecordProxy()
    mockCharityRecord.getValue.mockReturnValue(undefined)
    environment.store.get.mockReturnValue(mockCharityRecord)

    // Call the updater.
    const mutationUpdater = commitMutation.mock.calls[0][1].updater
    mutationUpdater(environment.store)
    expect(mockCharityRecord.setValue)
      .not.toHaveBeenCalled()
  })

  it('updates the charity\'s "vcReceived" for a given time period after donating', async () => {
    expect.assertions(1)
    const DonateVcMutation = require('../DonateVcMutation').default
    const args = getMockInput()
    args.vc = 33
    const mockAdditionalVars = {
      vcReceivedArgs: {
        startTime: '2017-04-09T19:00:00.000Z',
        endTime: '2017-05-30T19:00:00.000Z'
      }
    }
    await DonateVcMutation(args, mockAdditionalVars)

    // Return a mock Charity RecordProxy object with a value for
    // the "vcReceived" field.
    const mockCharityRecord = Relay.__getMockRecordProxy()
    mockCharityRecord.getValue.mockReturnValue(400)
    environment.store.get.mockReturnValue(mockCharityRecord)

    // Call the updater.
    const mutationUpdater = commitMutation.mock.calls[0][1].updater
    mutationUpdater(environment.store)
    expect(mockCharityRecord.setValue)
      .toHaveBeenCalledWith(433, 'vcReceived', {
        startTime: '2017-04-09T19:00:00.000Z',
        endTime: '2017-05-30T19:00:00.000Z'
      })
  })

  it('does not update the charity\'s "vcReceived" for a given time period after donating if not currently in the time period', async () => {
    expect.assertions(2)
    const DonateVcMutation = require('../DonateVcMutation').default
    const args = getMockInput()
    args.vc = 33
    const mockAdditionalVars = {
      vcReceivedArgs: {
        startTime: '2017-05-30T19:00:00.000Z',
        endTime: '2017-06-10T19:00:00.000Z'
      }
    }
    await DonateVcMutation(args, mockAdditionalVars)

    // Return a mock Charity RecordProxy object with a value for
    // the "vcReceived" field.
    const mockCharityRecord = Relay.__getMockRecordProxy()
    mockCharityRecord.getValue.mockReturnValue(400)
    environment.store.get.mockReturnValue(mockCharityRecord)

    // Call the updater.
    const mutationUpdater = commitMutation.mock.calls[0][1].updater
    mutationUpdater(environment.store)

    // Should only call to update "vcReceived" without a time period.
    expect(mockCharityRecord.setValue)
      .toHaveBeenCalledTimes(1)
    // There should not be args for updating the Relay record (no startTime
    // or endTime).
    expect(mockCharityRecord.setValue.mock.calls[0][3])
      .toBeUndefined()
  })

  it('does nothing if the charity record is not in the store', async () => {
    expect.assertions(0)
    const DonateVcMutation = require('../DonateVcMutation').default
    const args = getMockInput()
    args.vc = 33
    await DonateVcMutation(args)

    environment.store.get.mockReturnValue(undefined)
    const mutationUpdater = commitMutation.mock.calls[0][1].updater
    mutationUpdater(environment.store)
  })
})
