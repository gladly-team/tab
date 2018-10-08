/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import toJson from 'enzyme-to-json'

jest.mock('js/utils/client-location')
jest.mock('js/ads/consentManagement')
jest.mock('js/mutations/LogUserDataConsentMutation')

afterEach(() => {
  jest.clearAllMocks()
})

describe('LogConsentDataComponent', function () {
  it('renders without error and does not have any DOM elements', () => {
    const LogConsentDataComponent = require('../LogConsentDataComponent').default
    const wrapper = shallow(
      <LogConsentDataComponent
        user={{ id: 'abcdefghijklmno' }}
        relay={{ environment: {} }}
      />
    )
    expect(toJson(wrapper)).toEqual('')
  })

  it('registers callback with the CMP for data consent update (when in the EU)', async () => {
    expect.assertions(1)

    // Mock that the client is in the EU
    const isInEuropeanUnion = require('js/utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(true)

    const LogConsentDataComponent = require('../LogConsentDataComponent').default
    const wrapper = shallow(
      <LogConsentDataComponent
        user={{ id: 'abcdefghijklmno' }}
        relay={{ environment: {} }}
      />
    )
    await wrapper.instance().componentDidMount()
    wrapper.update()
    const registerConsentCallback = require('js/ads/consentManagement').registerConsentCallback
    expect(registerConsentCallback).toHaveBeenCalled()
  })

  it('does not register callback with the CMP for data consent update (when not in the EU)', async () => {
    // Mock that the client is not in the EU
    const isInEuropeanUnion = require('js/utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(false)

    const LogConsentDataComponent = require('../LogConsentDataComponent').default
    const wrapper = shallow(
      <LogConsentDataComponent
        user={{ id: 'abcdefghijklmno' }}
        relay={{ environment: {} }}
      />
    )
    await wrapper.instance().componentDidMount()
    wrapper.update()
    const registerConsentCallback = require('js/ads/consentManagement').registerConsentCallback
    expect(registerConsentCallback).not.toHaveBeenCalled()
  })

  it('logs the consent data when the CMP calls the callback', async () => {
    expect.assertions(8)

    // Mock the callback registration so we can trigger it ourselves
    var cmpCallback
    const registerConsentCallback = require('js/ads/consentManagement').registerConsentCallback
    registerConsentCallback.mockImplementationOnce(cb => {
      cmpCallback = cb
    })

    // Mock that the client is in the EU
    const isInEuropeanUnion = require('js/utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(true)

    const LogConsentDataComponent = require('../LogConsentDataComponent').default
    const wrapper = shallow(
      <LogConsentDataComponent
        user={{ id: 'abcdefghijklmno' }}
        relay={{ environment: {} }}
      />
    )
    await wrapper.instance().componentDidMount()
    await cmpCallback('some-consent-string', true)

    // Check that it calls the mutation.
    const LogUserDataConsentMutation = require('js/mutations/LogUserDataConsentMutation').default
    expect(LogUserDataConsentMutation).toHaveBeenCalledTimes(1)
    expect(LogUserDataConsentMutation.mock.calls[0][0]).toEqual({})
    expect(LogUserDataConsentMutation.mock.calls[0][1]).toEqual('abcdefghijklmno')
    expect(LogUserDataConsentMutation.mock.calls[0][2]).toEqual('some-consent-string')
    expect(LogUserDataConsentMutation.mock.calls[0][3]).toBe(true)
    expect(typeof (LogUserDataConsentMutation.mock.calls[0][4])).toBe('function')

    // Call the success callback on the mutation to confirm it
    // marks the data as logged.
    const markConsentDataAsLogged = require('js/ads/consentManagement')
      .markConsentDataAsLogged
    expect(markConsentDataAsLogged).not.toHaveBeenCalled()
    const __runOnCompleted = require('js/mutations/LogUserDataConsentMutation').__runOnCompleted
    __runOnCompleted()
    expect(markConsentDataAsLogged).toHaveBeenCalled()
  })

  it('logs the consent data when localStorage says we have new consent data to log', async () => {
    expect.assertions(4)
    const LogUserDataConsentMutation = require('js/mutations/LogUserDataConsentMutation').default

    // Mock that localStorage says we need to log new consentData
    const checkIfNewConsentNeedsToBeLogged = require('js/ads/consentManagement')
      .checkIfNewConsentNeedsToBeLogged
    checkIfNewConsentNeedsToBeLogged.mockReturnValueOnce(true)

    // Mock CMP values
    const getConsentString = require('js/ads/consentManagement').getConsentString
    getConsentString.mockResolvedValue('this-is-my-string')
    const hasGlobalConsent = require('js/ads/consentManagement').hasGlobalConsent
    hasGlobalConsent.mockResolvedValue(true)

    // Mock that the client is in the EU
    const isInEuropeanUnion = require('js/utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(true)

    const LogConsentDataComponent = require('../LogConsentDataComponent').default
    const wrapper = shallow(
      <LogConsentDataComponent
        user={{ id: 'xyz123' }}
        relay={{ environment: {} }}
      />
    )
    await wrapper.instance().componentDidMount()

    // Flush all promises
    await new Promise(resolve => setImmediate(resolve))

    // Check that it calls the mutation.
    expect(LogUserDataConsentMutation).toHaveBeenCalledTimes(1)
    expect(LogUserDataConsentMutation.mock.calls[0][0]).toEqual({})
    expect(LogUserDataConsentMutation.mock.calls[0][1]).toEqual('xyz123')
    expect(LogUserDataConsentMutation.mock.calls[0][2]).toEqual('this-is-my-string')
  })

  it('unregisters its callback when unmounting', async () => {
    expect.assertions(2)

    // Mock that the client is in the EU
    const isInEuropeanUnion = require('js/utils/client-location').isInEuropeanUnion
    isInEuropeanUnion.mockResolvedValue(true)

    const LogConsentDataComponent = require('../LogConsentDataComponent').default
    const wrapper = shallow(
      <LogConsentDataComponent
        user={{ id: 'abcdefghijklmno' }}
        relay={{ environment: {} }}
      />
    )
    await wrapper.instance().componentDidMount()

    const unregisterConsentCallback = require('js/ads/consentManagement').unregisterConsentCallback
    expect(unregisterConsentCallback).not.toHaveBeenCalled()
    wrapper.unmount()
    expect(unregisterConsentCallback).toHaveBeenCalled()
  })
})
