/* eslint-env jest */

// Note that this mock will be used unless we explicitly
// call `jest.unmock('firebase')`

const firebase = jest.genMockFromModule('firebase')
firebase.initializeApp = jest.fn()
module.exports = firebase
