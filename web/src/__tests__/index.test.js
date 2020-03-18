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

const getMockSentryEvent = () => ({
  mock: 'sentryEvent',
  stuff: 'here',
})

// https://docs.sentry.io/platforms/javascript/#hints-for-events
const getMockSentryHint = () => ({
  originalException: new TypeError('Foo'),
  synthenticException: {},
})

describe('Sentry beforeSend event filtering', () => {
  it('does not filter out some normal Error', () => {
    expect.assertions(1)
    const Sentry = require('@sentry/browser')
    require('../index.js')
    const beforeSendFunc = Sentry.init.mock.calls[0][0].beforeSend
    const sentryEvent = getMockSentryEvent()
    const sentryHint = {
      ...getMockSentryHint(),
      originalException: new Error(
        'You should not have passed that bad configuration.'
      ),
    }
    expect(beforeSendFunc(sentryEvent, sentryHint)).toEqual(sentryEvent)
  })

  it('does not filter out a TypeError', () => {
    expect.assertions(1)
    const Sentry = require('@sentry/browser')
    require('../index.js')
    const beforeSendFunc = Sentry.init.mock.calls[0][0].beforeSend
    const sentryEvent = getMockSentryEvent()
    const sentryHint = {
      ...getMockSentryHint(),
      originalException: new TypeError('Not my type'),
    }
    expect(beforeSendFunc(sentryEvent, sentryHint)).toEqual(sentryEvent)
  })

  it('filters out an AbortError', () => {
    expect.assertions(1)
    const Sentry = require('@sentry/browser')
    require('../index.js')
    const beforeSendFunc = Sentry.init.mock.calls[0][0].beforeSend
    const sentryEvent = getMockSentryEvent()
    const sentryHint = {
      ...getMockSentryHint(),
      originalException: new DOMException('Oops', 'AbortError'),
    }
    expect(beforeSendFunc(sentryEvent, sentryHint)).toBeNull()
  })

  it('filters out a SecurityError caused by Firefox localStorage', () => {
    expect.assertions(1)
    const Sentry = require('@sentry/browser')
    require('../index.js')
    const beforeSendFunc = Sentry.init.mock.calls[0][0].beforeSend
    const sentryEvent = getMockSentryEvent()
    const sentryHint = {
      ...getMockSentryHint(),
      originalException: new DOMException(
        'The operation is insecure.',
        'SecurityError'
      ),
    }
    expect(beforeSendFunc(sentryEvent, sentryHint)).toBeNull()
  })

  it('filters out failed fetch errors', () => {
    expect.assertions(1)
    const Sentry = require('@sentry/browser')
    require('../index.js')
    const beforeSendFunc = Sentry.init.mock.calls[0][0].beforeSend
    const sentryEvent = getMockSentryEvent()
    const sentryHint = {
      ...getMockSentryHint(),
      originalException: new Error('Failed to fetch'),
    }
    expect(beforeSendFunc(sentryEvent, sentryHint)).toBeNull()
  })

  it('filters out network errors on Chrome', () => {
    expect.assertions(1)
    const Sentry = require('@sentry/browser')
    require('../index.js')
    const beforeSendFunc = Sentry.init.mock.calls[0][0].beforeSend
    const sentryEvent = getMockSentryEvent()
    const sentryHint = {
      ...getMockSentryHint(),
      originalException: new Error('Network Error'),
    }
    expect(beforeSendFunc(sentryEvent, sentryHint)).toBeNull()
  })

  it('filters out network errors on Firefox', () => {
    expect.assertions(1)
    const Sentry = require('@sentry/browser')
    require('../index.js')
    const beforeSendFunc = Sentry.init.mock.calls[0][0].beforeSend
    const sentryEvent = getMockSentryEvent()
    const sentryHint = {
      ...getMockSentryHint(),
      originalException: new Error(
        'NetworkError when attempting to fetch resource.'
      ),
    }
    expect(beforeSendFunc(sentryEvent, sentryHint)).toBeNull()
  })

  it('filters out other network errors', () => {
    expect.assertions(1)
    const Sentry = require('@sentry/browser')
    require('../index.js')
    const beforeSendFunc = Sentry.init.mock.calls[0][0].beforeSend
    const sentryEvent = getMockSentryEvent()
    const sentryHint = {
      ...getMockSentryHint(),
      originalException: new Error(
        'A network error (such as timeout, interrupted connection or unreachable host) has occurred'
      ),
    }
    expect(beforeSendFunc(sentryEvent, sentryHint)).toBeNull()
  })

  it('filters out Webpack chunk loading errors', () => {
    expect.assertions(1)
    const Sentry = require('@sentry/browser')
    require('../index.js')
    const beforeSendFunc = Sentry.init.mock.calls[0][0].beforeSend
    const sentryEvent = getMockSentryEvent()
    const sentryHint = {
      ...getMockSentryHint(),
      originalException: new Error('Loading chunk 0.js failed'),
    }
    expect(beforeSendFunc(sentryEvent, sentryHint)).toBeNull()
  })

  it('filters out Webpack CSS chunk loading errors', () => {
    expect.assertions(1)
    const Sentry = require('@sentry/browser')
    require('../index.js')
    const beforeSendFunc = Sentry.init.mock.calls[0][0].beforeSend
    const sentryEvent = getMockSentryEvent()
    const sentryHint = {
      ...getMockSentryHint(),
      originalException: new Error('Loading CSS chunk 3.css failed'),
    }
    expect(beforeSendFunc(sentryEvent, sentryHint)).toBeNull()
  })
})
