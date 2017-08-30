/* eslint-env jest */

import logger, { logErrorWithId } from '../logger'

const loggerMethods = [
  'log',
  'debug',
  'info',
  'warn',
  'error',
  'fatal'
]

describe('logger', () => {
  it('contains expected methods', () => {
    loggerMethods.forEach(method => {
      expect(logger[method]).not.toBeUndefined()
    })
  })

  it('logs the error with the ID', () => {
    const consoleSpy = jest.spyOn(console, 'error')
      .mockImplementationOnce(() => {})
    const mockErr = new Error('Oops!')
    logErrorWithId(mockErr, 'abc-123')
    expect(consoleSpy).toHaveBeenCalled()
    const loggedErr = consoleSpy.mock.calls[0][0]
    expect(loggedErr.message).toBe('Oops!: Error ID abc-123')
  })
})
