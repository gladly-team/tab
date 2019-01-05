/* eslint-env jest */
/* globals process */

beforeAll(() => {
  process.env.REACT_APP_WEBSITE_PROTOCOL = 'https'
})

afterEach(() => {
  delete process.env.REACT_APP_WEBSITE_DOMAIN
  jest.resetModules()
})

describe('navigation utils', () => {
  test('absoluteUrl works for a passed path', () => {
    // Set the domain env var
    process.env.REACT_APP_WEBSITE_DOMAIN = 'some.example.com'

    const absoluteUrl = require('../navigation').absoluteUrl
    expect(absoluteUrl('/')).toBe('https://some.example.com/')
    expect(absoluteUrl('/blah/')).toBe('https://some.example.com/blah/')
  })

  test('absoluteUrl does not modify a URL that is already absolute', () => {
    // Set the domain env var
    process.env.REACT_APP_WEBSITE_DOMAIN = 'some.example.com'

    const absoluteUrl = require('../navigation').absoluteUrl
    expect(absoluteUrl('https://foo.com/blah/')).toBe(
      'https://foo.com/blah/'
    )
  })
})
