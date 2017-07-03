/* eslint-env jest */

import googleTagManager from '../googleTagManager'

beforeEach(() => {
  document.documentElement.innerHTML = '<!doctype html><html><head></head><body></body></html>'
})

afterEach(() => {
  delete window.googletag
})

describe('Google Tag Managers', function () {
  it('does not define window vars before imported', () => {
    expect(window.googletag).toBeUndefined()
  })

  it('sets window.googletag', () => {
    expect(window.googletag).toBeUndefined()
    googleTagManager()
    expect(window.googletag).not.toBeNull()
  })

  it('creates the Google tag services script', () => {
    googleTagManager()
    expect(document.documentElement.innerHTML).toEqual('<head><script type="text/javascript" src="http://www.googletagservices.com/tag/js/gpt.js"></script></head><body></body>')
  })
})
