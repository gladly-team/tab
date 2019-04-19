/* eslint-env jest */

export default () => {
  window.headertag = {
    retrieveDemand: jest.fn(),
  }
  return window.headertag
}
