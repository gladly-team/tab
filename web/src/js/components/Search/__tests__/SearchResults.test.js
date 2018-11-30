/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import { Helmet } from 'react-helmet'
import Typography from '@material-ui/core/Typography'
import logger from 'js/utils/logger'

jest.mock('react-helmet')
jest.mock('js/utils/logger')

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

  it('applies style to the root element', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.style = {
      background: '#FF0000'
    }
    const wrapper = shallow(
      <SearchResults {...mockProps} />
    ).dive()
    expect(wrapper.find('div').first().prop('style'))
      .toEqual({
        background: '#FF0000'
      })
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

  it('adds the search JS script to the head of the document even when there is no query', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    delete mockProps.query
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

  it('fetches search results when the search query prop changes', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'foo'
    const wrapper = shallow(
      <SearchResults {...mockProps} />
    ).dive()
    wrapper.setProps({
      query: 'best coffee in alaska'
    })
    const fetchedQuery = window.ypaAds.insertMultiAd
      .mock.calls[0][0]
      .ypaPubParams.query
    expect(fetchedQuery).toBe('best coffee in alaska')
    wrapper.setProps({
      query: 'pizza'
    })
    const newFetchedQuery = window.ypaAds.insertMultiAd
      .mock.calls[1][0]
      .ypaPubParams.query
    expect(newFetchedQuery).toBe('pizza')
  })

  it('does not fetch search results when the search query is an empty string on page load', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = ''
    const wrapper = shallow(
      <SearchResults {...mockProps} />
    ).dive()
    wrapper.instance().getSearchResults()
    expect(window.ypaAds.insertMultiAd).not.toHaveBeenCalled()
  })

  it('shows "no results" when the search does not yield results', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'foo'
    const wrapper = shallow(
      <SearchResults {...mockProps} />
    ).dive()
    const query = 'this search will yield no results, sadly'
    wrapper.setProps({
      query: query
    })
    const onNoAdCallback = window.ypaAds.insertMultiAd
      .mock.calls[0][0]
      .ypaAdSlotInfo[1]
      .ypaOnNoAd

    // Mock no ad results.
    onNoAdCallback({
      NO_COVERAGE: 1
    })

    expect(
      wrapper.find(Typography)
        .filterWhere(n => n.render().text() === `No results found for ${query}`)
        .length
    ).toBe(1)
  })

  it('shows an error message and logs an error when the search errors with "URL_UNREGISTERED"', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'foo'
    const wrapper = shallow(
      <SearchResults {...mockProps} />
    ).dive()
    const query = 'cookies'
    wrapper.setProps({
      query: query
    })
    const onNoAdCallback = window.ypaAds.insertMultiAd
      .mock.calls[0][0]
      .ypaAdSlotInfo[1]
      .ypaOnNoAd

    // Mock no ad results.
    onNoAdCallback({
      URL_UNREGISTERED: 1
    })

    expect(
      wrapper.find(Typography)
        .filterWhere(n => n.render().text() === 'Unable to search at this time.')
        .length
    ).toBe(1)
    expect(logger.error)
      .toHaveBeenCalledWith(new Error('Domain is not registered with our search partner.'))
  })

  it('shows an error message and logs an error when there is some unexpected error', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'foo'
    const wrapper = shallow(
      <SearchResults {...mockProps} />
    ).dive()
    const query = 'ice cream'
    wrapper.setProps({
      query: query
    })
    const onNoAdCallback = window.ypaAds.insertMultiAd
      .mock.calls[0][0]
      .ypaAdSlotInfo[1]
      .ypaOnNoAd

    // Mock no ad results.
    onNoAdCallback({
      SOMETHING_WE_DID_NOT_SEE_COMING: 1
    })

    expect(
      wrapper.find(Typography)
        .filterWhere(n => n.render().text() === 'Unable to search at this time.')
        .length
    ).toBe(1)
    expect(logger.error)
      .toHaveBeenCalledWith(new Error('Unexpected search error:', {
        SOMETHING_WE_DID_NOT_SEE_COMING: 1
      }))
  })

  it('shows an error message and logs an error when the YPA JS throws', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'foo'
    const wrapper = shallow(
      <SearchResults {...mockProps} />
    ).dive()
    const query = 'apple pie'

    // Mock some error and then search.
    window.ypaAds.insertMultiAd.mockImplementationOnce(() => {
      throw new Error('Oops.')
    })
    wrapper.setProps({
      query: query
    })

    expect(
      wrapper.find(Typography)
        .filterWhere(n => n.render().text() === 'Unable to search at this time.')
        .length
    ).toBe(1)
    expect(logger.error)
      .toHaveBeenCalledWith(new Error('Oops.'))
  })
})
