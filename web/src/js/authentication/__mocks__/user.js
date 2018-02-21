/* eslint-env jest */

const authUserMock = jest.genMockFromModule('../user')

authUserMock.logout = jest.fn(() => Promise.resolve(true))

module.exports = authUserMock
