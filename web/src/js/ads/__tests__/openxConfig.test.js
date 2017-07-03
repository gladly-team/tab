/* eslint-env jest */

import openxConfig from '../openxConfig'

beforeEach(() => {
  delete global.OX_dfp_options
  delete window.OX_dfp_options
  delete global.OX_dfp_ads
  delete window.OX_dfp_ads
})

describe('OpenX config', function () {
  it('sets window.OX_dfp_options', () => {
    expect(window.OX_dfp_options).toBeUndefined()
    openxConfig()
    expect(window.OX_dfp_options).toEqual({ prefetch: true })
  })

  it('sets window.OX_dfp_ads', () => {
    expect(window.OX_dfp_ads).toBeUndefined()
    openxConfig()
    expect(window.OX_dfp_ads.length).toBe(2)
  })
})
