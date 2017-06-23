/* global jest */

import relayTestUtils from 'relay-test-utils'
const relay = jest.genMockFromModule('react-relay')

export default relayTestUtils.relayMock(relay)
