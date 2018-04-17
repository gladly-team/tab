/* eslint-env jest */

var mockStorage = {}

export const __mockClear = () => {
  mockStorage = {}
}

export default {
  getItem: jest.fn((key) => {
    return mockStorage[key]
  }),
  setItem: jest.fn((key, val) => {
    mockStorage[key] = val
  }),
  removeItem: jest.fn((key, val) => {
    delete (mockStorage[key])
  })
}
