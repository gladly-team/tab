/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import { Helmet } from 'react-helmet'

jest.mock('react-helmet')

const getMockProps = () => ({
  query: 'tacos',
  classes: {}
})

beforeAll(() => {
  window.ypaAds = {
    insertMultiAd: jest.fn()
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SearchResults component', () => {
  it('renders without error', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    shallow(
      <SearchResults {...mockProps} />
    ).dive()
  })

  it('does not fetch search results on mount (because we need to wait until the search JS is loaded)', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    shallow(
      <SearchResults {...mockProps} />
    ).dive()
    expect(window.ypaAds.insertMultiAd).not.toHaveBeenCalled()
  })

  it('adds the search JS script to the head of the document', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <SearchResults {...mockProps} />
    ).dive()
    const script = wrapper.find(Helmet).find('script')
    expect(script.prop('src')).toBe('https://s.yimg.com/uv/dm/scripts/syndication.js')
  })

  it('adds an onload listener to fetch search results', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <SearchResults {...mockProps} />
    ).dive()

    // Mock that Helmet has added a script to the head.
    const helmet = wrapper.find(Helmet)
    const mockScriptTag = {
      addEventListener: jest.fn()
    }
    helmet.prop('onChangeClientState')(
      {
        baseTag: {},
        defer: [],
        encode: [],
        htmlAttributes: [],
        linkTags: [],
        metaTags: [],
        noscriptTags: [],
        scriptTags: [],
        styleTags: []
        // ... other values
      },
      {
        scriptTags: [
          mockScriptTag
        ]
      }
    )

    // Should not yet have fetched search results.
    expect(window.ypaAds.insertMultiAd).not.toHaveBeenCalled()

    // Mock the script's onload.
    const scriptOnloadHandler = mockScriptTag.addEventListener
      .mock.calls[0][1]
    scriptOnloadHandler()
    expect(window.ypaAds.insertMultiAd).toHaveBeenCalledTimes(1)
  })
})
