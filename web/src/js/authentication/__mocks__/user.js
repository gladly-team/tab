/* eslint-env jest */

const authUserMock = jest.genMockFromModule('../user')

authUserMock.logout = jest.fn(() => Promise.resolve(true))
authUserMock.getCurrentUser = jest.fn(() => Promise.resolve(null))

module.exports = authUserMock
