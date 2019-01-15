/* eslint-env jest */
import Raven from 'raven-js'

jest.mock('raven-js')

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

  test('logger calls Raven with an exception', () => {
    // Suppress expected console message.
    jest.spyOn(console, 'error').mockImplementationOnce(jest.fn())

    const logger = require('js/utils/logger').default
    const theErr = new Error('A big problem')
    logger.error(theErr)
    expect(Raven.captureException).toHaveBeenCalledWith(theErr, {
      level: 'error',
    })
    expect(Raven.captureMessage).not.toHaveBeenCalled()
  })

  test('logger.log calls Raven with "info" level', () => {
    // Suppress expected console message.
    jest.spyOn(console, 'log').mockImplementationOnce(jest.fn())

    const logger = require('js/utils/logger').default
    const theMsg = 'A thing happened, FYI'
    logger.log(theMsg)
    expect(Raven.captureMessage).toHaveBeenCalledWith(theMsg, {
      level: 'info',
    })
  })

  test('logger.debug calls Raven with "info" level', () => {
    // Suppress expected console message.
    jest.spyOn(console, 'debug').mockImplementationOnce(jest.fn())

    const logger = require('js/utils/logger').default
    const theMsg = 'A thing happened, FYI'
    logger.debug(theMsg)
    expect(Raven.captureMessage).toHaveBeenCalledWith(theMsg, {
      level: 'info',
    })
  })

  test('logger.info calls Raven with "info" level', () => {
    // Suppress expected console message.
    jest.spyOn(console, 'info').mockImplementationOnce(jest.fn())

    const logger = require('js/utils/logger').default
    const theMsg = 'A thing happened, FYI'
    logger.info(theMsg)
    expect(Raven.captureMessage).toHaveBeenCalledWith(theMsg, {
      level: 'info',
    })
  })

  test('logger.warn calls Raven with "warning" level', () => {
    // Suppress expected console message.
    jest.spyOn(console, 'warn').mockImplementationOnce(jest.fn())

    const logger = require('js/utils/logger').default
    const theMsg = 'A thing happened, FYI'
    logger.warn(theMsg)
    expect(Raven.captureMessage).toHaveBeenCalledWith(theMsg, {
      level: 'warning',
    })
  })

  test('logger.error calls Raven with "error" level', () => {
    // Suppress expected console message.
    jest.spyOn(console, 'error').mockImplementationOnce(jest.fn())

    const logger = require('js/utils/logger').default
    const theMsg = 'A thing happened, FYI'
    logger.error(theMsg)
    expect(Raven.captureMessage).toHaveBeenCalledWith(theMsg, {
      level: 'error',
    })
    expect(Raven.captureException).not.toHaveBeenCalled()
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

  test('logger.error calls Raven with "error" level', () => {
    // Suppress expected console message.
    jest.spyOn(console, 'error').mockImplementationOnce(jest.fn())

    const logger = require('js/utils/logger').default
    const theMsg = 'A thing happened, FYI'
    logger.error(theMsg)
    expect(Raven.captureMessage).toHaveBeenCalledWith(theMsg, {
      level: 'error',
    })
    expect(Raven.captureException).not.toHaveBeenCalled()
  })
})
