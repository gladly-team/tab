/* eslint-env jest */

describe('web test-utils', () => {
  test('mockGoogleTagSlotRenderEndedData returns expected defaults', () => {
    const mockGoogleTagSlotRenderEndedData = require('../test-utils').mockGoogleTagSlotRenderEndedData
    const slotRenderEndedData = mockGoogleTagSlotRenderEndedData()
    expect(slotRenderEndedData).toMatchObject({
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
    expect(slotRenderEndedData).toHaveProperty('slot.getSlotElementId')
    expect(slotRenderEndedData.slot.getSlotElementId()).toBe('abc-123')
  })

  test('mockGoogleTagSlotRenderEndedData allows overriding slot ID and properties', () => {
    const mockGoogleTagSlotRenderEndedData = require('../test-utils').mockGoogleTagSlotRenderEndedData
    const slotRenderEndedData = mockGoogleTagSlotRenderEndedData('foobar', {
      advertiserId: null,
      campaignId: 1357,
      creativeId: 2468,
      lineItemId: 1001
    })
    expect(slotRenderEndedData).toMatchObject({
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
    expect(slotRenderEndedData).toHaveProperty('slot.getSlotElementId')
    expect(slotRenderEndedData.slot.getSlotElementId()).toBe('foobar')
  })
})
