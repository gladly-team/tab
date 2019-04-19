/* eslint-env jest */

const mockCmd = []
mockCmd.push = f => f()

export default jest.fn(() => {
  window.headertag = window.headertag || {
    cmd: mockCmd,
    retrieveDemand: jest.fn((config, callback) => callback()),
  }
  return window.headertag
})
