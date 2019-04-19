/* eslint-env jest */

const mockCmd = []
mockCmd.push = f => f()

export default () => {
  window.headertag = window.headertag || {
    cmd: mockCmd,
    retrieveDemand: jest.fn(),
  }
  return window.headertag
}
