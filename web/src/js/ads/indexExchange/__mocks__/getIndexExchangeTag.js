/* eslint-env jest */

export default () => {
  window.headertag = {
    cmd: [],
    retrieveDemand: jest.fn(),
  }
  return window.headertag
}
