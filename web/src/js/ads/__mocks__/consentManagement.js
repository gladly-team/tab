/* eslint-env jest */

const consentMgmt = jest.genMockFromModule('../consentManagement')

consentMgmt.getConsentString = jest.fn(() => {
  return Promise.resolve('some-consent-string')
})

consentMgmt.hasGlobalConsent = jest.fn(() => {
  return Promise.resolve(true)
})

module.exports = consentMgmt
