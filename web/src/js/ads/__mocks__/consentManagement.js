/* eslint-env jest */

export const getConsentString = jest.fn(() => {
  return Promise.resolve('some-consent-string')
})
