/* eslint-env jest */

import initializeCMP from 'js/utils/initializeCMP'

jest.mock('tab-cmp')
jest.mock('js/assets/logos/favicon.ico', () => '/tab-favicon.png')

beforeEach(() => {
  process.env.REACT_APP_CMP_ENABLED = 'true'
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('initializeCMP', () => {
  it('calls tabCMP.initializeCMP with the expected configuration', async () => {
    expect.assertions(1)
    const tabCMP = require('tab-cmp').default
    await initializeCMP()
    expect(tabCMP.initializeCMP).toHaveBeenCalledWith({
      consent: {
        enabled: expect.any(Boolean),
        timeout: expect.any(Number),
      },
      debug: expect.any(Boolean),
      displayPersistentConsentLink: false,
      onError: expect.any(Function),
      primaryButtonColor: '#9d4ba3',
      publisherName: 'Tab for a Cause',
      publisherLogo: expect.any(String),
    })
  })

  it('does not call tabCMP.initializeCMP when process.env.REACT_APP_CMP_ENABLED is not "true"', async () => {
    expect.assertions(1)
    process.env.REACT_APP_CMP_ENABLED = 'false'
    const tabCMP = require('tab-cmp').default
    await initializeCMP()
    expect(tabCMP.initializeCMP).not.toHaveBeenCalled()
  })
})
