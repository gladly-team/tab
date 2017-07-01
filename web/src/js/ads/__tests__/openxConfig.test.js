/* eslint-env jest */

import openxConfig from '../openxConfig'

beforeEach(() => {
  delete window.OX_dfp_options
  delete window.OX_dfp_ads
})

describe('OpenX config', function () {
  it('sets window.OX_dfp_options', () => {
    openxConfig()
    expect(window.OX_dfp_options).toEqual({ prefetch: true })
  })

  it('sets window.OX_dfp_ads', () => {
    openxConfig()
    expect(window.OX_dfp_ads.length).toBe(2)
  })

  it('does not define window vars before code execution', () => {
    expect(window.OX_dfp_options).toBeUndefined()
  })
})
