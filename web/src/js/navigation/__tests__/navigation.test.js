/* eslint-env jest */
/* globals process */

import { externalRedirect, isURLForDifferentApp } from 'js/navigation/utils'

const mockBrowserHistory = {
  push: jest.fn(),
  replace: jest.fn(),
}
jest.mock('history', () => ({
  createBrowserHistory: jest.fn(() => mockBrowserHistory),
}))
jest.mock('js/navigation/utils')

beforeAll(() => {
  process.env.REACT_APP_WEBSITE_PROTOCOL = 'https'
})

afterEach(() => {
  delete process.env.REACT_APP_WEBSITE_DOMAIN
  jest.clearAllMocks()
})

describe('goTo', () => {
  it('calls history.push as expected', () => {
    const { goTo } = require('js/navigation/navigation')
    goTo('/some/path/')
    expect(mockBrowserHistory.push).toHaveBeenCalledWith({
      pathname: '/some/path/',
      search: null,
    })
  })

  it('calls history.push with query parameters', () => {
    const { goTo } = require('js/navigation/navigation')
    goTo('/some/path/', { someParam: 'abc', foo: 'blah' })
    expect(mockBrowserHistory.push).toHaveBeenCalledWith({
      pathname: '/some/path/',
      search: '?someParam=abc&foo=blah',
    })
  })

  it('calls externalRedirect when the new URL is on a different app', () => {
    const { goTo } = require('js/navigation/navigation')
    isURLForDifferentApp.mockReturnValueOnce(true)
    goTo('/some/path/')
    expect(externalRedirect).toHaveBeenCalledWith('/some/path/')
  })

  it('calls externalRedirect with the correct querystring when the new URL is on a different app', () => {
    const { goTo } = require('js/navigation/navigation')
    isURLForDifferentApp.mockReturnValueOnce(true)
    goTo('/some/path/', { someParam: 'abc', foo: 'blah' })
    expect(externalRedirect).toHaveBeenCalledWith(
      '/some/path/?someParam=abc&foo=blah'
    )
  })
})

describe('replaceUrl', () => {
  it('calls history.replace as expected', () => {
    const { replaceUrl } = require('js/navigation/navigation')
    replaceUrl('/some/path/')
    expect(mockBrowserHistory.replace).toHaveBeenCalledWith({
      pathname: '/some/path/',
      search: null,
    })
  })

  it('calls history.replace with query parameters', () => {
    const { replaceUrl } = require('js/navigation/navigation')
    replaceUrl('/some/path/', { someParam: 'abc', foo: 'blah' })
    expect(mockBrowserHistory.replace).toHaveBeenCalledWith({
      pathname: '/some/path/',
      search: '?someParam=abc&foo=blah',
    })
  })

  it('calls externalRedirect when the new URL is on a different app', () => {
    const { replaceUrl } = require('js/navigation/navigation')
    isURLForDifferentApp.mockReturnValueOnce(true)
    replaceUrl('/some/path/')
    expect(externalRedirect).toHaveBeenCalledWith('/some/path/')
  })

  it('calls externalRedirect with the correct querystring when the new URL is on a different app', () => {
    const { replaceUrl } = require('js/navigation/navigation')
    isURLForDifferentApp.mockReturnValueOnce(true)
    replaceUrl('/some/path/', { greeting: 'hello', name: 'fred' })
    expect(externalRedirect).toHaveBeenCalledWith(
      '/some/path/?greeting=hello&name=fred'
    )
  })
})

describe('absoluteUrl', () => {
  it('works for a passed path', () => {
    // Set the domain env var
    process.env.REACT_APP_WEBSITE_DOMAIN = 'some.example.com'

    const absoluteUrl = require('js/navigation/navigation').absoluteUrl
    expect(absoluteUrl('/')).toBe('https://some.example.com/')
    expect(absoluteUrl('/blah/')).toBe('https://some.example.com/blah/')
  })

  it('does not modify a URL that is already absolute', () => {
    // Set the domain env var
    process.env.REACT_APP_WEBSITE_DOMAIN = 'some.example.com'

    const absoluteUrl = require('js/navigation/navigation').absoluteUrl
    expect(absoluteUrl('https://foo.com/blah/')).toBe('https://foo.com/blah/')
  })
})
