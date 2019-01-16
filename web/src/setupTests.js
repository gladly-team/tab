/* eslint-env jest */

// Used in package.json Jest configuration
// and run before tests

import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'babel-polyfill'

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
