/* eslint-env jest */

import logger from '../logger'

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
})
