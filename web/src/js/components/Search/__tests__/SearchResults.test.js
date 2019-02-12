/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import logger from 'js/utils/logger'
import fetchSearchResults from 'js/components/Search/fetchSearchResults'
import {
  addReactRootElementToDOM,
  getDefaultSearchGlobal,
  impersonateReactSnapClient,
  setUserAgentToTypicalTestUserAgent,
} from 'js/utils/test-utils'
import { modifyURLParams } from 'js/navigation/navigation'

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
})

beforeEach(() => {
  window.searchforacause = getDefaultSearchGlobal()

  // To reset "ReactSnap" user agent.
  setUserAgentToTypicalTestUserAgent()

  // Reset the DOM between tests.
  document.getElementsByTagName('html')[0].innerHTML = ''
  addReactRootElementToDOM()
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

  it('does not add an inline script to the document when the render is not from react-snap', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = ''
    setUserAgentToTypicalTestUserAgent() // not ReactSnap user agent
    shallow(<SearchResults {...mockProps} />).dive()
    expect(
      document.querySelector('script[data-test-id="search-inline-script"]')
    ).toBeNull()
  })

  it('calls window.ypaAds.insertMultiAd via inline script when a "q" location parameter exists', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = '' // the inline script does not rely on this prop
    modifyURLParams({ q: 'foo' })
    impersonateReactSnapClient()
    shallow(<SearchResults {...mockProps} />).dive()
    expect(window.ypaAds.insertMultiAd).toHaveBeenCalledTimes(1)

    // It should use our YPA configuration.
    expect(window.ypaAds.insertMultiAd.mock.calls[0][0]).toMatchObject({
      ypaAdTagOptions: {
        adultFilter: false,
      },
      ypaAdConfig: '00000129a',
    })
  })

  it('does not call window.ypaAds.insertMultiAd via inline script when a "q" location parameter does not exist', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = '' // the inline script does not rely on this prop
    modifyURLParams({ q: null })
    impersonateReactSnapClient()
    shallow(<SearchResults {...mockProps} />).dive()
    expect(window.ypaAds.insertMultiAd).not.toHaveBeenCalled()
  })

  it('sets "fetchedOnPageLoad" to true via inline script when a "q" location parameter exists', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = '' // the inline script does not rely on this prop
    window.searchforacause.search.fetchedOnPageLoad = false
    modifyURLParams({ q: 'foo' })
    impersonateReactSnapClient()
    shallow(<SearchResults {...mockProps} />).dive()
    expect(window.searchforacause.search.fetchedOnPageLoad).toBe(true)
  })

  it('does not set "fetchedOnPageLoad" to true via inline script when a "q" location parameter does not exist', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = '' // the inline script does not rely on this prop
    window.searchforacause.search.fetchedOnPageLoad = false
    modifyURLParams({ q: null })
    impersonateReactSnapClient()
    shallow(<SearchResults {...mockProps} />).dive()
    expect(window.searchforacause.search.fetchedOnPageLoad).toBe(false)
  })

  it('catches thrown errors from window.ypaAds.insertMultiAd via inline script', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = '' // the inline script does not rely on this prop
    modifyURLParams({ q: 'foo' })
    impersonateReactSnapClient()

    //  Mock an error.
    window.ypaAds.insertMultiAd.mockImplementationOnce(() => {
      throw new Error('Search prob!')
    })

    // Suppress expected console log.
    jest.spyOn(console, 'error').mockReturnValueOnce()

    shallow(<SearchResults {...mockProps} />).dive()
    expect(console.error).toHaveBeenCalledWith(Error('Search prob!'))
  })

  it('catches thrown errors if we fail to add the inline script during prerendering', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    impersonateReactSnapClient()

    //  Mock an error.
    jest.spyOn(document, 'createElement').mockImplementationOnce(() => {
      throw new Error('Rendering prob!')
    })

    // Suppress expected console log.
    jest.spyOn(console, 'error').mockReturnValueOnce()

    shallow(<SearchResults {...mockProps} />).dive()
    expect(console.error).toHaveBeenCalledWith(
      'Could not prerender the inline script to fetch search results.'
    )
  })
})
