/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import logger from 'js/utils/logger'
import fetchSearchResults from 'js/components/Search/fetchSearchResults'
import {
  addReactRootElementToDOM,
  getDefaultSearchGlobal,
  impersonateReactSnapClient,
  setUserAgentToTypicalTestUserAgent,
} from 'js/utils/test-utils'

jest.mock('react-helmet')
jest.mock('js/utils/logger')
jest.mock('js/components/Search/fetchSearchResults')

const getMockProps = () => ({
  query: 'tacos',
  classes: {},
})

beforeAll(() => {
  window.ypaAds = {
    insertMultiAd: jest.fn(),
  }
  addReactRootElementToDOM()
})

beforeEach(() => {
  window.searchforacause = getDefaultSearchGlobal()

  // To reset "ReactSnap" user agent.
  setUserAgentToTypicalTestUserAgent()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SearchResults component', () => {
  it('renders without error', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    shallow(<SearchResults {...mockProps} />).dive()
  })

  // TODO: should not fetch on mount if YPA is not defined; otherwise, it should
  // it('does not fetch search results on mount (because we need to wait until the search JS is loaded)', () => {
  //   const SearchResults = require('js/components/Search/SearchResults').default
  //   const mockProps = getMockProps()
  //   shallow(<SearchResults {...mockProps} />).dive()
  //   expect(fetchSearchResults).not.toHaveBeenCalled()
  // })

  it('applies style to the root element', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.style = {
      background: '#FF0000',
    }
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    expect(
      wrapper
        .find('div')
        .first()
        .prop('style')
    ).toMatchObject({
      background: '#FF0000',
    })
  })

  // TODO: this will only happen if YPA is not defined
  // it('adds an onload listener to fetch search results', () => {
  //   const SearchResults = require('js/components/Search/SearchResults').default
  //   const mockProps = getMockProps()
  //   const wrapper = shallow(<SearchResults {...mockProps} />).dive()

  //   // Mock that Helmet has added a script to the head.
  //   const helmet = wrapper.find(Helmet)
  //   const mockScriptTag = {
  //     addEventListener: jest.fn(),
  //   }
  //   helmet.prop('onChangeClientState')(
  //     {
  //       baseTag: {},
  //       defer: [],
  //       encode: [],
  //       htmlAttributes: [],
  //       linkTags: [],
  //       metaTags: [],
  //       noscriptTags: [],
  //       scriptTags: [],
  //       styleTags: [],
  //       // ... other values
  //     },
  //     {
  //       scriptTags: [mockScriptTag],
  //     }
  //   )

  //   // Should not yet have fetched search results.
  //   expect(fetchSearchResults).not.toHaveBeenCalled()

  //   // Mock the script's onload.
  //   const scriptOnloadHandler = mockScriptTag.addEventListener.mock.calls[0][1]
  //   scriptOnloadHandler()
  //   expect(fetchSearchResults).toHaveBeenCalledTimes(1)
  // })

  it('does not fetch search results the first time the search query prop changes when results were already fetched on page load', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = ''
    window.searchforacause.search.fetchedOnPageLoad = true
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    fetchSearchResults.mockClear()
    wrapper.setProps({
      query: 'cake',
    })
    expect(fetchSearchResults).not.toHaveBeenCalled()
    wrapper.setProps({
      query: 'pie',
    })
    expect(fetchSearchResults).toHaveBeenCalledTimes(1)
  })

  it('fetches search results when the search query prop changes', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'foo'
    window.searchforacause.search.fetchedOnPageLoad = false
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    fetchSearchResults.mockClear()
    wrapper.setProps({
      query: 'best coffee in alaska',
    })
    const fetchedQuery = fetchSearchResults.mock.calls[0][0]
    expect(fetchedQuery).toBe('best coffee in alaska')
    wrapper.setProps({
      query: 'pizza',
    })
    const newFetchedQuery = fetchSearchResults.mock.calls[1][0]
    expect(newFetchedQuery).toBe('pizza')
  })

  it('does not fetch search results when the search query prop changes to an empty string', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'pizza'
    window.searchforacause.search.fetchedOnPageLoad = false
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    fetchSearchResults.mockClear()
    wrapper.setProps({
      query: '',
    })
    expect(fetchSearchResults).not.toHaveBeenCalled()
  })

  it('fetches search results on mount when the search query exists and results were not fetched on page load', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'cake'
    window.searchforacause.search.fetchedOnPageLoad = false
    shallow(<SearchResults {...mockProps} />).dive()
    expect(fetchSearchResults).toHaveBeenCalledTimes(1)
  })

  it('does not fetch search results on mount when the search query exists but results were already fetched on page load', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = ''
    window.searchforacause.search.fetchedOnPageLoad = true
    shallow(<SearchResults {...mockProps} />).dive()
    expect(fetchSearchResults).not.toHaveBeenCalled()
  })

  it('does not fetch search results when the search query is an empty string on page load', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = ''
    shallow(<SearchResults {...mockProps} />).dive()
    expect(fetchSearchResults).not.toHaveBeenCalled()
  })

  it('shows "no results" when the search does not yield results', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'foo'
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    const query = 'this search will yield no results, sadly'
    wrapper.setProps({
      query: query,
    })
    const onNoAdCallback = fetchSearchResults.mock.calls[0][1]

    // Mock no ad results.
    onNoAdCallback({
      NO_COVERAGE: 1,
    })

    expect(
      wrapper
        .find(Typography)
        .filterWhere(n => n.render().text() === `No results found for ${query}`)
        .length
    ).toBe(1)
  })

  it('sets a min-height to the results container before fetching results', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    expect(wrapper.get(0).props.style.minHeight).toBe(1200)
  })

  it('removes the a min-height from the results container if there are no search results', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    const query = 'this search will yield no results, sadly'
    wrapper.setProps({
      query: query,
    })
    const onNoAdCallback = fetchSearchResults.mock.calls[0][1]

    // Mock no ad results.
    onNoAdCallback({
      NO_COVERAGE: 1,
    })

    expect(wrapper.get(0).props.style.minHeight).toBe(0)
  })

  it('shows an error message and logs an error when the search errors with "URL_UNREGISTERED"', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'foo'
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    const query = 'cookies'
    wrapper.setProps({
      query: query,
    })
    const onNoAdCallback = fetchSearchResults.mock.calls[0][1]

    // Mock no ad results.
    onNoAdCallback({
      URL_UNREGISTERED: 1,
    })

    expect(
      wrapper
        .find(Typography)
        .filterWhere(
          n => n.render().text() === 'Unable to search at this time.'
        ).length
    ).toBe(1)
    expect(logger.error).toHaveBeenCalledWith(
      new Error('Domain is not registered with our search partner.')
    )
  })

  it('shows an error message and logs an error when there is some unexpected error', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'foo'
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    const query = 'ice cream'
    wrapper.setProps({
      query: query,
    })
    const onNoAdCallback = fetchSearchResults.mock.calls[0][1]

    // Mock no ad results.
    onNoAdCallback({
      SOMETHING_WE_DID_NOT_SEE_COMING: 1,
    })

    expect(
      wrapper
        .find(Typography)
        .filterWhere(
          n => n.render().text() === 'Unable to search at this time.'
        ).length
    ).toBe(1)
    expect(logger.error).toHaveBeenCalledWith(
      new Error('Unexpected search error:', {
        SOMETHING_WE_DID_NOT_SEE_COMING: 1,
      })
    )
  })

  it('shows an error message and logs an error when the YPA JS throws', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'foo'
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    const query = 'apple pie'

    // Mock some error and then search.
    fetchSearchResults.mockImplementationOnce(() => {
      throw new Error('Oops.')
    })
    wrapper.setProps({
      query: query,
    })

    expect(
      wrapper
        .find(Typography)
        .filterWhere(
          n => n.render().text() === 'Unable to search at this time.'
        ).length
    ).toBe(1)
    expect(logger.error).toHaveBeenCalledWith(new Error('Oops.'))
  })

  it('adds an inline script to the document on mount when prerendering with react-snap', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = ''
    impersonateReactSnapClient()
    expect(
      document.querySelector('script[data-test-id="search-inline-script"]')
    ).toBeNull()
    shallow(<SearchResults {...mockProps} />).dive()
    expect(
      document.querySelector('script[data-test-id="search-inline-script"]')
    ).not.toBeNull()
  })
})
