/* eslint-env jest */
/* globals process */

import { setWindowLocation } from 'js/utils/test-utils'

beforeAll(() => {
  process.env.REACT_APP_WEBSITE_PROTOCOL = 'https'
})

afterEach(() => {
  delete process.env.REACT_APP_WEBSITE_DOMAIN
  jest.resetModules()
})

describe('absoluteUrl', () => {
  it('works for a passed path', () => {
    // Set the domain env var
    process.env.REACT_APP_WEBSITE_DOMAIN = 'some.example.com'

    const absoluteUrl = require('../navigation').absoluteUrl
    expect(absoluteUrl('/')).toBe('https://some.example.com/')
    expect(absoluteUrl('/blah/')).toBe('https://some.example.com/blah/')
  })

  it('does not modify a URL that is already absolute', () => {
    // Set the domain env var
    process.env.REACT_APP_WEBSITE_DOMAIN = 'some.example.com'

    const absoluteUrl = require('../navigation').absoluteUrl
    expect(absoluteUrl('https://foo.com/blah/')).toBe('https://foo.com/blah/')
  })
})

describe('isURLForDifferentApp', () => {
  it('[absolute URL] considers the apps the same if the URL is exactly the same', () => {
    const { isURLForDifferentApp } = require('../navigation')
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
    expect(isURLForDifferentApp('https://example.com/blah/path/')).toBe(false)
  })

  it('[absolute URL] considers the apps the same if the URLs are pages on the same "homepage" app (not part of the "newtab" or "search" subpaths)', () => {
    const { isURLForDifferentApp } = require('../navigation')
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
    expect(isURLForDifferentApp('https://example.com/some/thing/')).toBe(false)
  })

  it('[absolute URL] considers the apps different if the hostname is different', () => {
    const { isURLForDifferentApp } = require('../navigation')
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
    expect(isURLForDifferentApp('https://foo.com/blah/path/')).toBe(true)
  })

  it('[absolute URL] considers the apps the same if the URLs are both on the "newtab" subpath', () => {
    const { isURLForDifferentApp } = require('../navigation')
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
    expect(isURLForDifferentApp('https://example.com/newtab/foobar/')).toBe(
      false
    )
  })

  it('[absolute URL] considers the apps the same if the URLs are both on the "search" subpath', () => {
    const { isURLForDifferentApp } = require('../navigation')
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
    expect(isURLForDifferentApp('https://example.com/search/foobar/')).toBe(
      false
    )
  })

  it('[absolute URL] considers the apps different if the current location is on the "search" subpath and the URL is for the "homepage" app', () => {
    const { isURLForDifferentApp } = require('../navigation')
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
    expect(isURLForDifferentApp('https://example.com/my-homepage/')).toBe(true)
  })

  it('[absolute URL] considers the apps different if the current location is on the "search" subpath and the URL is for the "newtab" app', () => {
    const { isURLForDifferentApp } = require('../navigation')
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
    expect(isURLForDifferentApp('https://example.com/newtab/foobar/')).toBe(
      true
    )
  })

  it('[absolute URL] considers the apps different if the current location is on the "newtab" subpath and the URL is for the "homepage" app', () => {
    const { isURLForDifferentApp } = require('../navigation')
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
    expect(isURLForDifferentApp('https://example.com/my-homepage/')).toBe(true)
  })

  it('[absolute URL] considers the apps different if the current location is on the "newtab" subpath and the URL is for the "search" app', () => {
    const { isURLForDifferentApp } = require('../navigation')
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
    expect(isURLForDifferentApp('https://example.com/search/foobar/')).toBe(
      true
    )
  })

  it('[relative URL] considers the apps the same if the URL is exactly the same', () => {
    const { isURLForDifferentApp } = require('../navigation')
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
    const { isURLForDifferentApp } = require('../navigation')
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
    const { isURLForDifferentApp } = require('../navigation')
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
    const { isURLForDifferentApp } = require('../navigation')
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
    const { isURLForDifferentApp } = require('../navigation')
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
    const { isURLForDifferentApp } = require('../navigation')
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
    const { isURLForDifferentApp } = require('../navigation')
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
    const { isURLForDifferentApp } = require('../navigation')
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
