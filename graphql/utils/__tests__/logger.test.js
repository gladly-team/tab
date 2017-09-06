/* eslint-env jest */

import logger, {
  logErrorWithId,
  shouldLog
} from '../logger'

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
    const consoleSpy = jest.spyOn(console, 'log')
      .mockImplementationOnce(() => {})
    const mockErr = new Error('Oops!')
    logErrorWithId(mockErr, 'abc-123')
    expect(consoleSpy).toHaveBeenCalled()
    const loggedErr = consoleSpy.mock.calls[0][0]
    expect(loggedErr.message).toBe('Oops!: Error ID abc-123')
  })

  test('shouldLog works as expected', () => {
    expect(shouldLog('debug', 'info')).toBe(false)
    expect(shouldLog('info', 'debug')).toBe(true)
    expect(shouldLog('error', 'debug')).toBe(true)
    expect(shouldLog('info', 'warn')).toBe(false)
  })
})
