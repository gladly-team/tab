/* eslint-env jest */

import googleTagManager from '../googleTagManager'

beforeEach(() => {
  document.documentElement.innerHTML = '<!doctype html><html><head></head><body></body></html>'
  delete window.googletag
})

afterAll(() => {
  delete window.googletag
})

describe('Google Tag Manager', function () {
  it('creates the Google tag services script', () => {
    googleTagManager()
    expect(document.documentElement.innerHTML).toEqual('<head><script type="text/javascript" src="http://www.googletagservices.com/tag/js/gpt.js"></script></head><body></body>')
    delete window.googletag
  })
})
