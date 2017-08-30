/* eslint-env jest */

// import { cloneDeep } from 'lodash/lang'
import {
  handleError,
  formatError
} from '../error-logging'
import logger from '../logger'

jest.mock('../logger', () => {
  return {
    error: jest.fn()
  }
})

class MockErr extends Error {
  constructor (message, locations, path) {
    super(message)
    // this.name = this.constructor.name
    this.message = message
    this.locations = locations
    this.path = path
  }
}

function getMockErr () {
  return new MockErr(
    'My bad error',
    [ { line: 14, column: 3 } ],
    [ 'user', 'widgets' ]
  )
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('error-logging', () => {
  it('handleError returns an error with a replaced message', () => {
    const mockErr = getMockErr()
    const returnedErr = handleError(mockErr)
    expect(returnedErr.message).toContain('Internal Error: ')
  })

  it('handleError logs the error', () => {
    const mockErr = getMockErr()
    handleError(mockErr)
    expect(logger.error).toHaveBeenCalled()
    const loggedErr = logger.error.mock.calls[0][0]
    expect(loggedErr.message).toContain('My bad error: Error ID ')
  })

  it('formatError returns the expected format', () => {
    const mockErr = getMockErr()
    mockErr.message = 'Internal Error: abcdef'
    const expectedFormattedErr = {
      message: mockErr.message,
      locations: mockErr.locations,
      path: mockErr.path
    }
    const formattedErr = formatError(mockErr)
    expect(formattedErr).toEqual(expectedFormattedErr)
  })
})
