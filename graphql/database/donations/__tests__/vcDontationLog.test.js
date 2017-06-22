/* global jest expect test */

import tablesNames from '../../tables'
import { VcDonationLog } from '../vcDonationLog'

jest.mock('../../database')

test('getTable name to be implemented', () => {
  expect(VcDonationLog.getTableName()).toBe(tablesNames.vcDonationLog)
})

test('getFields to be implemented', () => {
  const expected = [
    'charityId',
    'vcDonated',
    'timestamp'
  ]

  expect(VcDonationLog.getFields().length).toBe(expected.length)
  expect(VcDonationLog.getFields()).toEqual(expect.arrayContaining(expected))
})

test('auto create id', () => {
  const donationLog = new VcDonationLog(null)
  expect(donationLog.id).not.toBe(null)
})

test('create with existing id', () => {
  const donationLog = new VcDonationLog('some_bad_id')
  expect(donationLog.id).toBe('some_bad_id')
})

test('deserialize to be implemented', () => {
  const donationLog = VcDonationLog.deserialize({
    id: 'someid',
    charityId: 'some_charity_id',
    vcDonated: 40,
    timestamp: '2017-04-10T18:35:24+00:00'
  })

  expect(donationLog instanceof VcDonationLog).toBe(true)
  expect(donationLog.id).toBe('someid')
  expect(donationLog.charityId).toBe('some_charity_id')
  expect(donationLog.vcDonated).toBe(40)
  expect(donationLog.timestamp).toBe('2017-04-10T18:35:24+00:00')
})
