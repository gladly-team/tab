/* eslint-env jest */

jest.mock('raven')

beforeEach(() => {
  jest.resetModules()
})

describe('logger', () => {
  it('contains expected methods', () => {
    const loggerMethods = [
      'log',
      'debug',
      'info',
      'warn',
      'error',
      'fatal'
    ]
    const logger = require('../logger').default
    loggerMethods.forEach(method => {
      expect(logger[method]).not.toBeUndefined()
    })
  })

  it('logs the error with the ID', () => {
    jest.mock('../../config', () => {
      return {
        LOGGER: 'console',
        STAGE: 'test',
        LOG_LEVEL: 'debug'
      }
    })
    const logErrorWithId = require('../logger').logErrorWithId
    const consoleSpy = jest.spyOn(console, 'error')
      .mockImplementationOnce(() => {})
    const mockErr = new Error('Oops!')
    logErrorWithId(mockErr, 'abc-123')
    expect(consoleSpy).toHaveBeenCalled()
    const loggedErr = consoleSpy.mock.calls[0][0]
    expect(loggedErr.message).toBe('Oops!: Error ID abc-123')
  })

  test('shouldLog works as expected', () => {
    const shouldLog = require('../logger').shouldLog
    expect(shouldLog('debug', 'info')).toBe(false)
    expect(shouldLog('info', 'debug')).toBe(true)
    expect(shouldLog('error', 'debug')).toBe(true)
    expect(shouldLog('info', 'warn')).toBe(false)
  })

  test('loggerContextWrapper calls the passed function and returns its value', () => {
    jest.mock('../../config', () => {
      return {
        LOGGER: 'console',
        STAGE: 'test'
      }
    })
    const loggerContextWrapper = require('../logger').loggerContextWrapper
    const testFunc = jest.fn(() => 'hi')
    const fakeLambdaEvent = { foo: 'bar' }
    const response = loggerContextWrapper({}, fakeLambdaEvent, testFunc)
    expect(testFunc).toHaveBeenCalled()
    expect(response).toBe('hi')
  })

  test('loggerContextWrapper sets Raven context for Sentry logging', () => {
    jest.mock('../../config', () => {
      return {
        LOGGER: 'sentry',
        STAGE: 'test',
        SENTRY_PUBLIC_KEY: 'abcdef',
        SENTRY_PRIVATE_KEY: 'xyzxyz',
        SENTRY_PROJECT_ID: '123456'
      }
    })
    const loggerContextWrapper = require('../logger').loggerContextWrapper
    const Sentry = require('../sentry-logger').default
    const testFunc = jest.fn(() => 'hi')
    const userContext = {
      id: 'abc-123',
      username: 'Bob',
      email: 'bob@example.com',
      extraneous: 'blah'
    }
    const fakeLambdaEvent = { foo: 'bar' }
    const response = loggerContextWrapper(userContext, fakeLambdaEvent, testFunc)
    expect(Sentry.setContext).toHaveBeenCalledWith({
      user: {
        id: 'abc-123',
        username: 'Bob',
        email: 'bob@example.com'
      },
      req: fakeLambdaEvent,
      extra: {
        foo: 'bar'
      }
    })
    expect(response).toBe('hi')
  })

  test('logger calls console method as expected', () => {
    jest.mock('../../config', () => {
      return {
        LOGGER: 'console',
        STAGE: 'test',
        LOG_LEVEL: 'info'
      }
    })

    const consoleSpy = jest.spyOn(console, 'error')
      .mockImplementationOnce(() => {})
    const logger = require('../logger').default
    logger.error('blah')
    expect(consoleSpy).toHaveBeenCalledWith('blah')
  })

  test('logger does not log if message is less important than the LOG_LEVEL', () => {
    jest.mock('../../config', () => {
      return {
        LOGGER: 'console',
        STAGE: 'test',
        LOG_LEVEL: 'error'
      }
    })

    const consoleSpy = jest.spyOn(console, 'info')
      .mockImplementationOnce(() => {})
    const logger = require('../logger').default
    logger.info('blah')
    expect(consoleSpy).not.toHaveBeenCalled()
  })

  test('logger calls Sentry with an exception', () => {
    jest.mock('../../config', () => {
      return {
        LOGGER: 'sentry',
        STAGE: 'test',
        LOG_LEVEL: 'error',
        SENTRY_PUBLIC_KEY: 'abcdef',
        SENTRY_PRIVATE_KEY: 'xyzxyz',
        SENTRY_PROJECT_ID: '123456'
      }
    })
    const Sentry = require('../sentry-logger').default
    const logger = require('../logger').default
    const theErr = new Error('A big problem')
    logger.error(theErr)
    expect(Sentry.captureException).toHaveBeenCalledWith(theErr, {
      level: 'error'
    })
    expect(Sentry.captureMessage).not.toHaveBeenCalled()
  })

  test('logger calls Sentry with a message', () => {
    jest.mock('../../config', () => {
      return {
        LOGGER: 'sentry',
        STAGE: 'test',
        LOG_LEVEL: 'error',
        SENTRY_PUBLIC_KEY: 'abcdef',
        SENTRY_PRIVATE_KEY: 'xyzxyz',
        SENTRY_PROJECT_ID: '123456'
      }
    })
    const Sentry = require('../sentry-logger').default
    const logger = require('../logger').default
    const theMsg = 'A thing happened, FYI'
    logger.error(theMsg)
    expect(Sentry.captureMessage).toHaveBeenCalledWith(theMsg, {
      level: 'error'
    })
    expect(Sentry.captureException).not.toHaveBeenCalled()
  })

  test('logger calls Sentry with "warning" level', () => {
    jest.mock('../../config', () => {
      return {
        LOGGER: 'sentry',
        STAGE: 'test',
        LOG_LEVEL: 'debug',
        SENTRY_PUBLIC_KEY: 'abcdef',
        SENTRY_PRIVATE_KEY: 'xyzxyz',
        SENTRY_PROJECT_ID: '123456'
      }
    })
    const Sentry = require('../sentry-logger').default
    const logger = require('../logger').default
    const theMsg = 'A thing happened, FYI'
    logger.warn(theMsg)
    expect(Sentry.captureMessage).toHaveBeenCalledWith(theMsg, {
      level: 'warning'
    })
  })
})
