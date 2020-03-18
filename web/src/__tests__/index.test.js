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
})
