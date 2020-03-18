/* eslint-env jest */
import React from 'react'

jest.mock('react-dom')
jest.mock('js/root', () => () => <div />)
jest.mock('js/authentication/user')
jest.mock('js/serviceWorker')

afterEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
})

describe('Sentry configuration', () => {
  it('initializes Sentry', () => {
    expect.assertions(1)
    const Sentry = require('@sentry/browser')
    require('../index.js')
    expect(Sentry.init).toHaveBeenCalledTimes(1)
  })
})
