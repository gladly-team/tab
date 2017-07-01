/* eslint-env jest */

beforeEach(() => {
  jest.resetModules()
  delete window.OX_dfp_options
  delete window.OX_dfp_ads
})

describe('OpenX config', function () {
  it('sets window.OX_dfp_options', () => {
    require('../openxConfig')
    expect(window.OX_dfp_options).toEqual({ prefetch: true })
  })

  it('sets window.OX_dfp_ads', () => {
    require('../openxConfig')
    expect(window.OX_dfp_ads.length).toBe(2)
  })

  it('does not define window vars before imported', () => {
    expect(window.OX_dfp_options).toBeUndefined()
  })
})
