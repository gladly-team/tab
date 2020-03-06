/* eslint-env jest */
import * as Sentry from '@sentry/browser'

jest.mock('@sentry/browser')

afterEach(() => {
  jest.clearAllMocks()
})

describe('logger', () => {
  it('contains expected methods', () => {
    const loggerMethods = ['log', 'debug', 'info', 'warn', 'error']
    const logger = require('js/utils/logger').default
    loggerMethods.forEach(method => {
      expect(logger[method]).not.toBeUndefined()
    })
  })

  test('logger calls Sentry with an exception', () => {
    // Suppress expected console message.
    jest.spyOn(console, 'error').mockImplementationOnce(jest.fn())

    const logger = require('js/utils/logger').default
    const theErr = new Error('A big problem')
    logger.error(theErr)
    expect(Sentry.captureException).toHaveBeenCalledWith(theErr)
    expect(Sentry.captureMessage).not.toHaveBeenCalled()
  })

  test('logger.log calls Sentry with "info" level', () => {
    // Suppress expected console message.
    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn())

    const logger = require('js/utils/logger').default
    const theMsg = 'A thing happened, FYI'
    logger.log(theMsg)
    expect(Sentry.captureMessage).toHaveBeenCalledWith(theMsg, 'info')
  })

  test('logger.debug calls Sentry with "info" level', () => {
    // Suppress expected console message.
    jest.spyOn(console, 'debug').mockImplementationOnce(jest.fn())

    const logger = require('js/utils/logger').default
    const theMsg = 'A thing happened, FYI'
    logger.debug(theMsg)
    expect(Sentry.captureMessage).toHaveBeenCalledWith(theMsg, 'info')
  })

  test('logger.info calls Sentry with "info" level', () => {
    // Suppress expected console message.
    jest.spyOn(console, 'info').mockImplementationOnce(jest.fn())

    const logger = require('js/utils/logger').default
    const theMsg = 'A thing happened, FYI'
    logger.info(theMsg)
    expect(Sentry.captureMessage).toHaveBeenCalledWith(theMsg, 'info')
  })

  test('logger.warn calls Sentry with "warning" level', () => {
    // Suppress expected console message.
    jest.spyOn(console, 'warn').mockImplementationOnce(jest.fn())

    const logger = require('js/utils/logger').default
    const theMsg = 'A thing happened, FYI'
    logger.warn(theMsg)
    expect(Sentry.captureMessage).toHaveBeenCalledWith(theMsg, 'warning')
  })

  test('logger.error calls Sentry with "error" level', () => {
    // Suppress expected console message.
    jest.spyOn(console, 'error').mockImplementationOnce(jest.fn())

    const logger = require('js/utils/logger').default
    const theMsg = 'A thing happened, FYI'
    logger.error(theMsg)
    expect(Sentry.captureMessage).toHaveBeenCalledWith(theMsg, 'error')
    expect(Sentry.captureException).not.toHaveBeenCalled()
  })

  test('logger.log logs to console', () => {
    // Suppress expected console message.
    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn())

    const logger = require('js/utils/logger').default
    const theMsg = 'A thing happened, FYI'
    logger.log(theMsg)
    expect(console.log).toHaveBeenCalledWith(theMsg)
  })

  test('logger.debug logs to console', () => {
    // Suppress expected console message.
    jest.spyOn(console, 'debug').mockImplementationOnce(jest.fn())

    const logger = require('js/utils/logger').default
    const theMsg = 'A thing happened, FYI'
    logger.debug(theMsg)
    expect(console.debug).toHaveBeenCalledWith(theMsg)
  })

  test('logger.info logs to console', () => {
    // Suppress expected console message.
    jest.spyOn(console, 'info').mockImplementationOnce(jest.fn())

    const logger = require('js/utils/logger').default
    const theMsg = 'A thing happened, FYI'
    logger.info(theMsg)
    expect(console.info).toHaveBeenCalledWith(theMsg)
  })

  test('logger.warn logs to console', () => {
    // Suppress expected console message.
    jest.spyOn(console, 'warn').mockImplementationOnce(jest.fn())

    const logger = require('js/utils/logger').default
    const theMsg = 'A thing happened, FYI'
    logger.warn(theMsg)
    expect(console.warn).toHaveBeenCalledWith(theMsg)
  })

  test('logger.error calls Sentry with "error" level', () => {
    // Suppress expected console message.
    jest.spyOn(console, 'error').mockImplementationOnce(jest.fn())

    const logger = require('js/utils/logger').default
    const theMsg = 'A thing happened, FYI'
    logger.error(theMsg)
    expect(Sentry.captureMessage).toHaveBeenCalledWith(theMsg, 'error')
    expect(Sentry.captureException).not.toHaveBeenCalled()
  })
})
