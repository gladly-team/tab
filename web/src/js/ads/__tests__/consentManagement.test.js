/* eslint-env jest */

import {
  STORAGE_NEW_CONSENT_DATA_EXISTS
} from '../../constants'

jest.mock('utils/localstorage-mgr')

beforeEach(() => {
  // Mock CMP
  window.__cmp = jest.fn((command, version, callback) => {
    // Documenting available commands for Quantcast CMP.
    // https://quantcast.zendesk.com/hc/en-us/articles/360003814853-Technical-Implementation-Guide
    // IAB standard docs:
    // https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/CMP%20JS%20API%20v1.1%20Final.md#what-api-will-need-to-be-provided-by-the-cmp-
    switch (command) {
      case 'displayConsentUi':
        break
      case 'getConfig':
        break
      case 'getCurrentVendorConsents':
        break
      case 'getConsentData':
        break
      case 'getPublisherConsents':
        break
      case 'getCurrentPublisherConsents':
        break
      case 'getVendorConsents':
        break
      case 'getVendorList':
        break
      case 'init':
        break
      case 'initConfig':
        break
      case 'runConsentUiCallback':
        break
      case 'saveConsents':
        break
      case 'setConsentUiCallback':
        break
      default:
        throw new Error('Invalid CMP command')
    }
  })
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
  const localStorageManager = require('utils/localstorage-mgr').default
  localStorageManager.clear()
})

afterAll(() => {
  delete window.__cmp
})

describe('consentManagement', () => {
  it('calls the CMP as expected to get the consent string', async () => {
    // Mock the CMP callback for getting consent data
    window.__cmp.mockImplementation((command, version, callback) => {
      if (command === 'getConsentData') {
        /* eslint-disable-next-line standard/no-callback-literal */
        callback({
          consentData: 'abcdefghijklm', // consent string
          gdprApplies: true,
          hasGlobalConsent: false
        })
      }
    })
    const getConsentString = require('../consentManagement').getConsentString
    const consentString = await getConsentString()
    expect(consentString).toEqual('abcdefghijklm')
  })

  it('returns null if the CMP throws an error while getting the consent string', async () => {
    window.__cmp.mockImplementation(() => {
      throw new Error('CMP made a mistake!')
    })

    // Mute expected console error
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    const getConsentString = require('../consentManagement').getConsentString
    const consentString = await getConsentString()
    expect(consentString).toBeNull()
  })

  it('calls to display CMP UI as expected', () => {
    const displayConsentUI = require('../consentManagement').displayConsentUI
    displayConsentUI()
    expect(window.__cmp).toHaveBeenCalledWith('displayConsentUi')
  })

  it('calls the CMP as expected to get "hasGlobalConsent"', async () => {
    expect.assertions(1)

    // Mock the CMP callback for getting consent data
    window.__cmp.mockImplementation((command, version, callback) => {
      if (command === 'getConsentData') {
        /* eslint-disable-next-line standard/no-callback-literal */
        callback({
          consentData: 'abcdefghijklm', // consent string
          gdprApplies: true,
          hasGlobalConsent: false
        })
      }
    })
    const hasGlobalConsent = require('../consentManagement').hasGlobalConsent
    const isGlobalConsent = await hasGlobalConsent()
    expect(isGlobalConsent).toBe(false)
  })

  it('returns null if the CMP throws an error while getting "hasGlobalConsent"', async () => {
    expect.assertions(1)

    window.__cmp.mockImplementation(() => {
      throw new Error('CMP made a mistake!')
    })

    // Mute expected console error
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    const hasGlobalConsent = require('../consentManagement').hasGlobalConsent
    const isGlobalConsent = await hasGlobalConsent()
    expect(isGlobalConsent).toBeNull()
  })

  it('registers a callback as expected', async () => {
    expect.assertions(2)

    // Mock the CMP callback for getting consent data
    var mockCMPConsentChange
    window.__cmp.mockImplementation((command, callback, getConsentDataCallback) => {
      if (command === 'setConsentUiCallback') {
        mockCMPConsentChange = callback
      }
      if (command === 'getConsentData') {
        /* eslint-disable-next-line standard/no-callback-literal */
        getConsentDataCallback({
          consentData: 'abcdefghijklm',
          gdprApplies: true,
          hasGlobalConsent: false
        })
      }
    })
    const registerConsentCallback = require('../consentManagement').registerConsentCallback
    const mockCallback = jest.fn()
    registerConsentCallback(mockCallback)

    // Mock that the CMP calls its callback on consent change
    await mockCMPConsentChange()

    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(mockCallback).toHaveBeenCalledWith('abcdefghijklm', false)
  })

  it('registers multiple callbacks as expected', async () => {
    expect.assertions(3)

    // Mock the CMP callback for getting consent data
    var mockCMPConsentChange
    window.__cmp.mockImplementation((command, callback, getConsentDataCallback) => {
      if (command === 'setConsentUiCallback') {
        mockCMPConsentChange = callback
      }
      if (command === 'getConsentData') {
        /* eslint-disable-next-line standard/no-callback-literal */
        getConsentDataCallback({
          consentData: 'abcdefghijklm',
          gdprApplies: true,
          hasGlobalConsent: false
        })
      }
    })
    const registerConsentCallback = require('../consentManagement').registerConsentCallback
    const mockCallbackA = jest.fn()
    registerConsentCallback(mockCallbackA)
    const mockCallbackB = jest.fn()
    registerConsentCallback(mockCallbackB)
    const mockCallbackC = jest.fn()
    registerConsentCallback(mockCallbackC)

    // Mock that the CMP calls its callback on consent change
    await mockCMPConsentChange()

    expect(mockCallbackA).toHaveBeenCalledTimes(1)
    expect(mockCallbackB).toHaveBeenCalledTimes(1)
    expect(mockCallbackC).toHaveBeenCalledTimes(1)
  })

  it('unregisters callbacks as expected', async () => {
    expect.assertions(6)

    // Mock the CMP callback for getting consent data
    var mockCMPConsentChange
    window.__cmp.mockImplementation((command, callback, getConsentDataCallback) => {
      if (command === 'setConsentUiCallback') {
        mockCMPConsentChange = callback
      }
      if (command === 'getConsentData') {
        /* eslint-disable-next-line standard/no-callback-literal */
        getConsentDataCallback({
          consentData: 'abcdefghijklm',
          gdprApplies: true,
          hasGlobalConsent: false
        })
      }
    })

    // Register some callbacks.
    const registerConsentCallback = require('../consentManagement').registerConsentCallback
    const mockCallbackA = jest.fn()
    registerConsentCallback(mockCallbackA)
    const mockCallbackB = jest.fn()
    registerConsentCallback(mockCallbackB)
    const mockCallbackC = jest.fn()
    registerConsentCallback(mockCallbackC)

    // Mock that the CMP calls its callback on consent change
    await mockCMPConsentChange()
    expect(mockCallbackA).toHaveBeenCalledTimes(1)
    expect(mockCallbackB).toHaveBeenCalledTimes(1)
    expect(mockCallbackC).toHaveBeenCalledTimes(1)

    // Unregister some callbacks.
    const unregisterConsentCallback = require('../consentManagement').unregisterConsentCallback
    unregisterConsentCallback(mockCallbackA)
    unregisterConsentCallback(mockCallbackC)

    // Mock that the CMP calls its callback on consent change
    await mockCMPConsentChange()

    // It should not have called the unregistered callbacks,
    // but it should have still called the registered one.
    expect(mockCallbackA).toHaveBeenCalledTimes(1)
    expect(mockCallbackB).toHaveBeenCalledTimes(2)
    expect(mockCallbackC).toHaveBeenCalledTimes(1)
  })

  it('saves a "consent data updated" flag to localStorage', () => {
    const localStorageManager = require('utils/localstorage-mgr').default
    const saveConsentUpdateEventToLocalStorage = require('../consentManagement')
      .saveConsentUpdateEventToLocalStorage
    saveConsentUpdateEventToLocalStorage()
    expect(localStorageManager.setItem).toHaveBeenCalledWith(STORAGE_NEW_CONSENT_DATA_EXISTS, 'true')
  })

  it('checking if new consent needs to be logged works as expected', () => {
    const localStorageManager = require('utils/localstorage-mgr').default
    const checkIfNewConsentNeedsToBeLogged = require('../consentManagement')
      .checkIfNewConsentNeedsToBeLogged

    localStorageManager.setItem(STORAGE_NEW_CONSENT_DATA_EXISTS, 'true')
    expect(checkIfNewConsentNeedsToBeLogged()).toBe(true)

    localStorageManager.removeItem(STORAGE_NEW_CONSENT_DATA_EXISTS)
    expect(checkIfNewConsentNeedsToBeLogged()).toBe(false)
  })

  it('marking consent data as logged works as expected', () => {
    const localStorageManager = require('utils/localstorage-mgr').default
    const markConsentDataAsLogged = require('../consentManagement')
      .markConsentDataAsLogged
    markConsentDataAsLogged()
    expect(localStorageManager.removeItem)
      .toHaveBeenCalledWith(STORAGE_NEW_CONSENT_DATA_EXISTS)
  })
})
