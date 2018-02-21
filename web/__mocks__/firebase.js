/* eslint-env jest */

// Note that this mock will be used unless we explicitly
// call `jest.unmock('firebase')`

const firebase = jest.genMockFromModule('firebase')
export default firebase
