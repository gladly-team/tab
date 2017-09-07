/* eslint-env jest */

// Note that this mock will be used unless we explicitly
// call `jest.unmock('raven')`:
// https://facebook.github.io/jest/docs/en/manual-mocks.html

const raven = jest.genMockFromModule('raven')
raven.config = jest.fn(() => {
  return raven
})
raven.Client = jest.fn(() => {
  return raven
})

// Invoke the function like Raven would.
raven.context = jest.fn((func) => {
  return func()
})

export default raven
