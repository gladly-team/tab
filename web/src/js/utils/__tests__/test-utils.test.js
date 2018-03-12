/* eslint-env jest */

describe('web test-utils', () => {
  test('mockGoogleTagSlotOnloadData returns expected defaults', () => {
    const mockGoogleTagSlotOnloadData = require('../test-utils').mockGoogleTagSlotOnloadData
    const slotOnloadData = mockGoogleTagSlotOnloadData()
    expect(slotOnloadData).toMatchObject({
      advertiserId: 1234,
      campaignId: 99887766,
      creativeId: 111222333444555,
      isEmpty: false,
      lineItemId: 123456,
      serviceName: 'something',
      size: '728x90',
      sourceAgnosticCreativeId: null,
      sourceAgnosticLineItemId: null
    })
    expect(slotOnloadData).toHaveProperty('slot.getSlotElementId')
    expect(slotOnloadData.slot.getSlotElementId()).toBe('abc-123')
  })

  test('mockGoogleTagSlotOnloadData allows overriding slot ID and properties', () => {
    const mockGoogleTagSlotOnloadData = require('../test-utils').mockGoogleTagSlotOnloadData
    const slotOnloadData = mockGoogleTagSlotOnloadData('foobar', {
      advertiserId: null,
      campaignId: 1357,
      creativeId: 2468,
      lineItemId: 1001
    })
    expect(slotOnloadData).toMatchObject({
      advertiserId: null,
      campaignId: 1357,
      creativeId: 2468,
      isEmpty: false,
      lineItemId: 1001,
      serviceName: 'something',
      size: '728x90',
      sourceAgnosticCreativeId: null,
      sourceAgnosticLineItemId: null
    })
    expect(slotOnloadData).toHaveProperty('slot.getSlotElementId')
    expect(slotOnloadData.slot.getSlotElementId()).toBe('foobar')
  })
})
