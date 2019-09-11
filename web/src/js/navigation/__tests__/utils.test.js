/* eslint-env jest */
/* globals process */

import { setWindowLocation } from 'js/utils/test-utils'

beforeAll(() => {
  process.env.REACT_APP_WEBSITE_PROTOCOL = 'https'
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('isURLForDifferentApp', () => {
  it('[absolute URL] considers the apps different if the URL is absolute, even if the URL is exactly the same', () => {
    const { isURLForDifferentApp } = require('js/navigation/utils')
    setWindowLocation({
      host: 'example.com',
      hostname: 'example.com',
      href: 'https://example.com/blah/path/',
      origin: 'https://example.com',
      pathname: '/blah/path/',
      port: '',
      protocol: 'https:',
      search: '',
    })
    expect(isURLForDifferentApp('https://example.com/blah/path/')).toBe(true)
  })

  it('[absolute URL] considers the apps different if the URL is absolute and the URL is on a different app subpath', () => {
    const { isURLForDifferentApp } = require('js/navigation/utils')
    setWindowLocation({
      host: 'example.com',
      hostname: 'example.com',
      href: 'https://example.com/newtab/path/',
      origin: 'https://example.com',
      pathname: '/newtab/path/',
      port: '',
      protocol: 'https:',
      search: '',
    })
    expect(isURLForDifferentApp('https://example.com/search/path/')).toBe(true)
  })

  it('[relative URL] considers the apps the same if the URL is exactly the same', () => {
    const { isURLForDifferentApp } = require('js/navigation/utils')
    setWindowLocation({
      host: 'example.com',
      hostname: 'example.com',
      href: 'https://example.com/blah/path/',
      origin: 'https://example.com',
      pathname: '/blah/path/',
      port: '',
      protocol: 'https:',
      search: '',
    })
    expect(isURLForDifferentApp('/blah/path/')).toBe(false)
  })

  it('[relative URL] considers the apps the same if the URLs are pages on the same "homepage" app (not part of the "newtab" or "search" subpaths)', () => {
    const { isURLForDifferentApp } = require('js/navigation/utils')
    setWindowLocation({
      host: 'example.com',
      hostname: 'example.com',
      href: 'https://example.com/blah/path/',
      origin: 'https://example.com',
      pathname: '/blah/path/',
      port: '',
      protocol: 'https:',
      search: '',
    })
    expect(isURLForDifferentApp('/some/thing/')).toBe(false)
  })

  it('[relative URL] considers the apps the same if the URLs are both on the "newtab" subpath', () => {
    const { isURLForDifferentApp } = require('js/navigation/utils')
    setWindowLocation({
      host: 'example.com',
      hostname: 'example.com',
      href: 'https://example.com/newtab/thing/',
      origin: 'https://example.com',
      pathname: '/newtab/thing/',
      port: '',
      protocol: 'https:',
      search: '',
    })
    expect(isURLForDifferentApp('/newtab/foobar/')).toBe(false)
  })

  it('[relative URL] considers the apps the same if the URLs are both on the "search" subpath', () => {
    const { isURLForDifferentApp } = require('js/navigation/utils')
    setWindowLocation({
      host: 'example.com',
      hostname: 'example.com',
      href: 'https://example.com/search/thing/',
      origin: 'https://example.com',
      pathname: '/search/thing/',
      port: '',
      protocol: 'https:',
      search: '',
    })
    expect(isURLForDifferentApp('/search/foobar/')).toBe(false)
  })

  it('[relative URL] considers the apps different if the current location is on the "search" subpath and the URL is for the "homepage" app', () => {
    const { isURLForDifferentApp } = require('js/navigation/utils')
    setWindowLocation({
      host: 'example.com',
      hostname: 'example.com',
      href: 'https://example.com/search/thing/',
      origin: 'https://example.com',
      pathname: '/search/thing/',
      port: '',
      protocol: 'https:',
      search: '',
    })
    expect(isURLForDifferentApp('/my-homepage/')).toBe(true)
  })

  it('[relative URL] considers the apps different if the current location is on the "search" subpath and the URL is for the "newtab" app', () => {
    const { isURLForDifferentApp } = require('js/navigation/utils')
    setWindowLocation({
      host: 'example.com',
      hostname: 'example.com',
      href: 'https://example.com/search/thing/',
      origin: 'https://example.com',
      pathname: '/search/thing/',
      port: '',
      protocol: 'https:',
      search: '',
    })
    expect(isURLForDifferentApp('/newtab/foobar/')).toBe(true)
  })

  it('[relative URL] considers the apps different if the current location is on the "newtab" subpath and the URL is for the "homepage" app', () => {
    const { isURLForDifferentApp } = require('js/navigation/utils')
    setWindowLocation({
      host: 'example.com',
      hostname: 'example.com',
      href: 'https://example.com/newtab/thing/',
      origin: 'https://example.com',
      pathname: '/newtab/thing/',
      port: '',
      protocol: 'https:',
      newtab: '',
    })
    expect(isURLForDifferentApp('/my-homepage/')).toBe(true)
  })

  it('[relative URL] considers the apps different if the current location is on the "newtab" subpath and the URL is for the "search" app', () => {
    const { isURLForDifferentApp } = require('js/navigation/utils')
    setWindowLocation({
      host: 'example.com',
      hostname: 'example.com',
      href: 'https://example.com/newtab/thing/',
      origin: 'https://example.com',
      pathname: '/newtab/thing/',
      port: '',
      protocol: 'https:',
      search: '',
    })
    expect(isURLForDifferentApp('/search/foobar/')).toBe(true)
  })
})

describe('isAbsoluteURL', () => {
  it('works as expected', () => {
    const { isAbsoluteURL } = require('js/navigation/utils')

    // Relative URLs
    expect(isAbsoluteURL('')).toBe(false)
    expect(isAbsoluteURL('/')).toBe(false)
    expect(isAbsoluteURL('/some/path')).toBe(false)
    expect(isAbsoluteURL('localhost:3000')).toBe(false)

    // Absolute URLs
    expect(isAbsoluteURL('https://example.com/blah/path/')).toBe(true)
    expect(isAbsoluteURL('http://example.com/blah/path/')).toBe(true)
    expect(isAbsoluteURL('https://example.com')).toBe(true)
    expect(isAbsoluteURL('http://localhost:3000')).toBe(true)
  })
})
