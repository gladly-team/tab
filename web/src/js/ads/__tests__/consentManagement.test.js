/* eslint-env jest */

import {
  STORAGE_NEW_CONSENT_DATA_EXISTS,
  STORAGE_CONSENT_DATA_LOG_IN_PROGRESS
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

  it('registers a callback on __cmp.setConsentUiCallback', async () => {
    expect.assertions(2)

    // Mock the CMP callback for getting consent data
    var storedCallback
    window.__cmp.mockImplementation((command, callback, getConsentDataCallback) => {
      if (command === 'setConsentUiCallback') {
        storedCallback = callback
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
    await registerConsentCallback(mockCallback)

    // Call the stored callback
    await storedCallback()

    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(mockCallback).toHaveBeenCalledWith('abcdefghijklm', false)
  })

  it('saves a "consent data updated" flag to localStorage if a log isn\'t in progress', () => {
    const localStorageManager = require('utils/localstorage-mgr').default
    const saveConsentUpdateEventToLocalStorage = require('../consentManagement')
      .saveConsentUpdateEventToLocalStorage
    saveConsentUpdateEventToLocalStorage()
    expect(localStorageManager.setItem).toHaveBeenCalledWith(STORAGE_NEW_CONSENT_DATA_EXISTS, 'true')
  })

  it('does not save a "consent data updated" flag to localStorage if a log is in progress', () => {
    const localStorageManager = require('utils/localstorage-mgr').default
    localStorageManager.setItem(STORAGE_CONSENT_DATA_LOG_IN_PROGRESS, 'true')
    jest.clearAllMocks()

    const saveConsentUpdateEventToLocalStorage = require('../consentManagement')
      .saveConsentUpdateEventToLocalStorage
    saveConsentUpdateEventToLocalStorage()
    expect(localStorageManager.setItem).not.toHaveBeenCalled()
  })

  it('checking if new consent needs to be logged works as expected', () => {
    const localStorageManager = require('utils/localstorage-mgr').default
    const checkIfNewConsentNeedsToBeLogged = require('../consentManagement')
      .checkIfNewConsentNeedsToBeLogged

    localStorageManager.setItem(STORAGE_NEW_CONSENT_DATA_EXISTS, 'true')
    localStorageManager.setItem(STORAGE_CONSENT_DATA_LOG_IN_PROGRESS, 'false')
    expect(checkIfNewConsentNeedsToBeLogged()).toBe(true)

    localStorageManager.setItem(STORAGE_NEW_CONSENT_DATA_EXISTS, 'true')
    localStorageManager.setItem(STORAGE_CONSENT_DATA_LOG_IN_PROGRESS, 'true')
    expect(checkIfNewConsentNeedsToBeLogged()).toBe(false)

    localStorageManager.removeItem(STORAGE_NEW_CONSENT_DATA_EXISTS)
    localStorageManager.removeItem(STORAGE_CONSENT_DATA_LOG_IN_PROGRESS)
    expect(checkIfNewConsentNeedsToBeLogged()).toBe(false)
  })

  it('marking consent data log in progress works as expected', () => {
    const localStorageManager = require('utils/localstorage-mgr').default
    const markConsentDataLogInProgress = require('../consentManagement')
      .markConsentDataLogInProgress
    markConsentDataLogInProgress()
    expect(localStorageManager.setItem)
      .toHaveBeenCalledWith(STORAGE_CONSENT_DATA_LOG_IN_PROGRESS, 'true')
  })

  it('marking consent data as logged works as expected', () => {
    const localStorageManager = require('utils/localstorage-mgr').default
    const markConsentDataAsLogged = require('../consentManagement')
      .markConsentDataAsLogged
    markConsentDataAsLogged()
    expect(localStorageManager.removeItem)
      .toHaveBeenCalledWith(STORAGE_NEW_CONSENT_DATA_EXISTS)
    expect(localStorageManager.removeItem)
      .toHaveBeenCalledWith(STORAGE_CONSENT_DATA_LOG_IN_PROGRESS)
  })
})
