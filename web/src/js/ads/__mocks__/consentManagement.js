/* eslint-env jest */

export const getConsentString = jest.fn(() => {
  return Promise.resolve('some-consent-string')
})

export const hasGlobalConsent = jest.fn()

export const displayConsentUI = jest.fn()

export const registerConsentCallback = jest.fn()
