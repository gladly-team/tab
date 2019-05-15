/* eslint-env jest */

// Used in package.json Jest configuration
// and run before tests

import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'babel-polyfill'
import { mockFetchResponse } from 'js/utils/test-utils'

// Initialize Enzyme
configure({ adapter: new Adapter() })

// Add a mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// https://material-ui.com/style/typography/#migration-to-typography-v2
if (global) {
  global.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true
}

global.fetch = jest.fn(() => new Promise.resolve(mockFetchResponse()))

// Force warnings to fail Jest tests.
// https://github.com/facebook/jest/issues/6121#issuecomment-444269677
let error = console.error
console.error = function(message) {
  error.apply(console, arguments) // keep default behaviour
  throw message instanceof Error ? message : new Error(message)
}
