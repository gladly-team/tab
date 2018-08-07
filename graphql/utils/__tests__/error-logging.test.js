/* eslint-env jest */

import {
  handleError,
  formatError
} from '../error-logging'
import {
  UNAUTHORIZED_QUERY,
  UnauthorizedQueryException
} from '../exceptions'
import logger from '../logger'

jest.mock('../logger')

class MockGraphQLError extends Error {
  constructor (originalError) {
    super(originalError)
    this.message = originalError.message
    this.locations = [ { line: 14, column: 3 } ]
    this.path = [ 'user', 'widgets' ]
    this.originalError = originalError
  }
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('error-logging', () => {
  test('formatError returns the expected format for a normal error', () => {
    const mockGraphQLErr = new MockGraphQLError(new Error('Yikes!'))
    const expectedFormattedErr = {
      message: 'Yikes!',
      locations: mockGraphQLErr.locations,
      path: mockGraphQLErr.path,
      code: null
    }
    const formattedErr = formatError(mockGraphQLErr)
    expect(formattedErr).toEqual(expectedFormattedErr)
  })

  test('formatError returns the expected format for a custom error with a code', () => {
    const customErr = new UnauthorizedQueryException()
    const mockGraphQLErr = new MockGraphQLError(customErr)
    const expectedFormattedErr = {
      message: 'Query not authorized.',
      locations: mockGraphQLErr.locations,
      path: mockGraphQLErr.path,
      code: UNAUTHORIZED_QUERY
    }
    const formattedErr = formatError(mockGraphQLErr)
    expect(formattedErr).toEqual(expectedFormattedErr)
  })

  test('handleError returns the expected format', () => {
    const mockGraphQLErr = new MockGraphQLError(new Error('Yikes!'))
    const expectedFormattedErr = {
      message: 'Yikes!',
      locations: mockGraphQLErr.locations,
      path: mockGraphQLErr.path,
      code: null
    }
    const formattedErr = handleError(mockGraphQLErr)
    expect(formattedErr).toEqual(expectedFormattedErr)
  })

  test('handleError logs the error', () => {
    const mockGraphQLErr = new MockGraphQLError(new Error('Yikes!'))
    handleError(mockGraphQLErr)
    expect(logger.error).toHaveBeenCalledWith(mockGraphQLErr)
  })
})
