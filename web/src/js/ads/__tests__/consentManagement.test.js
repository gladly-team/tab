/* eslint-env jest */

beforeEach(() => {
  // Mock CMP
  window.__cmp = jest.fn()
})

afterEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  delete window.__cmp
})

describe('consentManagement', () => {
  it('calls the CMP as expected to get the consent string', async () => {
    // Mock the CMP callback for getting vendor consents
    window.__cmp.mockImplementation((command, version, callback) => {
      if (command === 'getVendorConsents') {
        /* eslint-disable-next-line standard/no-callback-literal */
        callback({
          gdprApplies: true,
          hasGlobalConsent: false,
          metadata: 'abcdefghijklm', // consent string
          purposeConsents: { 1: true, 2: false, 3: true },
          vendorConsents: { 1: true, 2: false, 3: true }
        })
      }
    })
    const getConsentString = require('../consentManagement').getConsentString
    const consentString = await getConsentString()
    expect(consentString).toEqual('abcdefghijklm')
  })

  it('returns null if the CMP throws an error', async () => {
    window.__cmp.mockImplementation(() => {
      throw new Error('CMP made a mistake!')
    })

    // Mute expected console error
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    const getConsentString = require('../consentManagement').getConsentString
    const consentString = await getConsentString()
    expect(consentString).toBeNull()
  })
})
