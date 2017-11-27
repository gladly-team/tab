/* eslint-env jest */

// Note that this mock will be used unless we explicitly
// call `jest.unmock('firebase-admin')`:
// https://facebook.github.io/jest/docs/en/manual-mocks.html

const firebaseAdmin = jest.genMockFromModule('firebase-admin')

firebaseAdmin.auth = jest.fn(() => ({
  verifyIdToken: jest.fn(() => Promise.resolve(null))
}))

firebaseAdmin.apps = jest.fn(() => [])

module.exports = firebaseAdmin
