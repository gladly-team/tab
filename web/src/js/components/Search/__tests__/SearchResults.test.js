/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import { range } from 'lodash/util'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
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

jest.mock('react-helmet', () => ({
  Helmet: jest.fn(() => null),
}))
jest.mock('js/utils/logger')
jest.mock('js/components/Search/fetchSearchResults')

const getMockProps = () => ({
  classes: {},
  page: 1,
  onPageChange: jest.fn(),
  query: 'tacos',
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

  modifyURLParams({
    q: null,
    page: null,
  })
})

describe('SearchResults component', () => {
  it('renders without error', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    shallow(<SearchResults {...mockProps} />).dive()
  })

  it('contains the expected element for search ad results', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()

    // Important: don't change this div ID without updating the YPA
    // configuration
    const searchAdDivs = wrapper.find('[id="search-ads"]')
    expect(searchAdDivs.length).toEqual(1)
    const searchAdDiv = searchAdDivs.first()

    // Note: we need these props for YPA to work correctly.
    // Using dangerouslySetInnerHTML and suppressHydrationWarning
    // prevents rerendering this element during hydration:
    // https://github.com/reactjs/rfcs/pull/46#issuecomment-385182716
    // Related: https://github.com/facebook/react/issues/6622
    expect(searchAdDiv.prop('suppressHydrationWarning')).toBe(true)
    expect(searchAdDiv.prop('dangerouslySetInnerHTML')).toEqual({
      __html: '',
    })
  })

  it('contains the expected element for search (algo) results', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()

    // Important: don't change this div ID without updating the YPA
    // configuration
    const searchAdDivs = wrapper.find('[id="search-results"]')
    expect(searchAdDivs.length).toEqual(1)
    const searchAdDiv = searchAdDivs.first()

    // Note: we need these props for YPA to work correctly.
    // Using dangerouslySetInnerHTML and suppressHydrationWarning
    // prevents rerendering this element during hydration:
    // https://github.com/reactjs/rfcs/pull/46#issuecomment-385182716
    // Related: https://github.com/facebook/react/issues/6622
    expect(searchAdDiv.prop('suppressHydrationWarning')).toBe(true)
    expect(searchAdDiv.prop('dangerouslySetInnerHTML')).toEqual({
      __html: '',
    })
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

  it('fetches search results when the page changes', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.page = 2
    window.searchforacause.search.fetchedOnPageLoad = false
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    fetchSearchResults.mockClear()
    wrapper.setProps({
      page: 4,
    })
    const fetchedPage = fetchSearchResults.mock.calls[0][2]
    expect(fetchedPage).toBe(4)
    wrapper.setProps({
      page: 211,
    })

    const newFetchedPage = fetchSearchResults.mock.calls[1][2]
    expect(newFetchedPage).toBe(211)
  })

  it('does not fetch search results when the page stays the same', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.page = 2
    window.searchforacause.search.fetchedOnPageLoad = false
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    fetchSearchResults.mockClear()
    wrapper.setProps({
      page: 2,
    })
    expect(fetchSearchResults).not.toHaveBeenCalled()
  })

  it('only fetches search results once when both the page and query values change', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'foo'
    mockProps.page = 2
    window.searchforacause.search.fetchedOnPageLoad = false
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    fetchSearchResults.mockClear()
    wrapper.setProps({
      query: 'blah',
      page: 4,
    })
    expect(fetchSearchResults).toHaveBeenCalledTimes(1)
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

  it('[inline-script] adds an inline script to the document on mount when prerendering with react-snap', () => {
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

  it('[inline-script] does not add an inline script to the document when the render is not from react-snap', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = ''
    setUserAgentToTypicalTestUserAgent() // not ReactSnap user agent
    shallow(<SearchResults {...mockProps} />).dive()
    expect(
      document.querySelector('script[data-test-id="search-inline-script"]')
    ).toBeNull()
  })

  it('[inline-script] calls window.ypaAds.insertMultiAd via inline script when a "q" location parameter exists', () => {
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

  it('[inline-script] does not call window.ypaAds.insertMultiAd via inline script when a "q" location parameter does not exist', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = '' // the inline script does not rely on this prop
    modifyURLParams({ q: null })
    impersonateReactSnapClient()
    shallow(<SearchResults {...mockProps} />).dive()
    expect(window.ypaAds.insertMultiAd).not.toHaveBeenCalled()
  })

  it('[inline-script] calls window.ypaAds.insertMultiAd with a page number when a "p" URL parameter exists', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = '' // the inline script does not rely on this prop
    modifyURLParams({
      q: 'foo',
      page: 17,
    })
    impersonateReactSnapClient()
    shallow(<SearchResults {...mockProps} />).dive()
    expect(window.ypaAds.insertMultiAd.mock.calls[0][0]).toHaveProperty(
      'ypaPageCount',
      '17'
    )
  })

  it('[inline-script] calls window.ypaAds.insertMultiAd WITHOUT a page number when a "p" URL parameter does not exist', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = '' // the inline script does not rely on this prop
    modifyURLParams({
      q: 'foo',
      page: null,
    })
    impersonateReactSnapClient()
    shallow(<SearchResults {...mockProps} />).dive()
    expect(window.ypaAds.insertMultiAd.mock.calls[0][0]).not.toHaveProperty(
      'ypaPageCount'
    )
  })

  it('[inline-script] sets "fetchedOnPageLoad" to true via inline script when a "q" location parameter exists', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = '' // the inline script does not rely on this prop
    window.searchforacause.search.fetchedOnPageLoad = false
    modifyURLParams({ q: 'foo' })
    impersonateReactSnapClient()
    shallow(<SearchResults {...mockProps} />).dive()
    expect(window.searchforacause.search.fetchedOnPageLoad).toBe(true)
  })

  it('[inline-script] does not set "fetchedOnPageLoad" to true via inline script when a "q" location parameter does not exist', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = '' // the inline script does not rely on this prop
    window.searchforacause.search.fetchedOnPageLoad = false
    modifyURLParams({ q: null })
    impersonateReactSnapClient()
    shallow(<SearchResults {...mockProps} />).dive()
    expect(window.searchforacause.search.fetchedOnPageLoad).toBe(false)
  })

  it('[inline-script] shows a "no results" message when fetching search results via inline script returns no results', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'nonexistent stuff' // the inline script does not rely on this prop
    modifyURLParams({ q: 'foo' })
    impersonateReactSnapClient()
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    expect(window.ypaAds.insertMultiAd).toHaveBeenCalledTimes(1)
    const errCallback =
      window.ypaAds.insertMultiAd.mock.calls[0][0].ypaAdSlotInfo[1].ypaOnNoAd
    errCallback({ NO_COVERAGE: true })
    expect(
      wrapper
        .find(Typography)
        .filterWhere(
          n => n.render().text() === `No results found for nonexistent stuff`
        ).length
    ).toBe(1)
  })

  it('[inline-script] shows an error message when fetching search results via inline script fails', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = '' // the inline script does not rely on this prop
    modifyURLParams({ q: 'foo' })
    impersonateReactSnapClient()
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    expect(window.ypaAds.insertMultiAd).toHaveBeenCalledTimes(1)
    const errCallback =
      window.ypaAds.insertMultiAd.mock.calls[0][0].ypaAdSlotInfo[1].ypaOnNoAd
    errCallback({ SOMETHING_WE_DID_NOT_SEE_COMING: true })
    expect(
      wrapper
        .find(Typography)
        .filterWhere(
          n => n.render().text() === 'Unable to search at this time.'
        ).length
    ).toBe(1)
  })

  it('[inline-script] catches thrown errors from window.ypaAds.insertMultiAd via inline script', () => {
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

  it('[inline-script] catches thrown errors if we fail to add the inline script during prerendering', () => {
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

  it('registers a listener to the "searchresulterror" event on mount', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    const evtListener = jest.spyOn(window, 'addEventListener')
    shallow(<SearchResults {...mockProps} />).dive()
    expect(evtListener).toHaveBeenCalledTimes(1)
    expect(evtListener.mock.calls[0][0]).toEqual('searchresulterror')
  })

  it('registers a listener to the "searchresulterror" event before unmount', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    const evtListenerRemove = jest.spyOn(window, 'removeEventListener')
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    expect(evtListenerRemove).not.toHaveBeenCalled()
    wrapper.unmount()
    expect(evtListenerRemove).toHaveBeenCalledTimes(1)
    expect(evtListenerRemove.mock.calls[0][0]).toEqual('searchresulterror')
  })

  it('does not render the "previous page" pagination button when on the first page', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.page = 1
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    expect(wrapper.find('[data-test-id="pagination-previous"]').exists()).toBe(
      false
    )
  })

  it('renders the "previous page" pagination button when on the second page', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.page = 2
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    expect(wrapper.find('[data-test-id="pagination-previous"]').exists()).toBe(
      true
    )
  })

  it('renders the "previous page" pagination button when on the eleventh page', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.page = 11
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    expect(wrapper.find('[data-test-id="pagination-previous"]').exists()).toBe(
      true
    )
  })

  it('does render the 9999th pagination button when on the final page (page 9999)', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.page = 9999
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    expect(wrapper.find('[data-test-id="pagination-9999"]').exists()).toBe(true)
  })

  it('does not render the "next page" pagination button when on the final page (page 9999)', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.page = 9999
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    expect(wrapper.find('[data-test-id="pagination-next"]').exists()).toBe(
      false
    )
  })

  it('renders the "next page" pagination button when on the first page', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.page = 1
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    expect(wrapper.find('[data-test-id="pagination-next"]').exists()).toBe(true)
  })

  it('renders the "next page" pagination button when on the eleventh page', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.page = 11
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    expect(wrapper.find('[data-test-id="pagination-next"]').exists()).toBe(true)
  })

  it('renders the expected pagination buttons when on the first page', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.page = 1
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    const expectedPages = range(1, 9)
    expectedPages.forEach(pageNum => {
      expect(
        wrapper.find(`[data-test-id="pagination-${pageNum}"]`).exists()
      ).toBe(true)
    })

    // Page 9 should not exist.
    expect(wrapper.find(`[data-test-id="pagination-9"]`).exists()).toBe(false)
  })

  it('renders the expected pagination buttons when on the eleventh page', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.page = 11
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    const expectedPages = range(7, 15)
    expectedPages.forEach(pageNum => {
      expect(
        wrapper.find(`[data-test-id="pagination-${pageNum}"]`).exists()
      ).toBe(true)
    })

    // Page 6 should not exist.
    expect(wrapper.find(`[data-test-id="pagination-6"]`).exists()).toBe(false)

    // Page 15 should not exist.
    expect(wrapper.find(`[data-test-id="pagination-15"]`).exists()).toBe(false)
  })

  it('renders the expected pagination buttons when on the 9998th page', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.page = 9998
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    const expectedPages = range(9991, 9999)
    expectedPages.forEach(pageNum => {
      expect(
        wrapper.find(`[data-test-id="pagination-${pageNum}"]`).exists()
      ).toBe(true)
    })

    // Page 10000 should not exist.
    expect(wrapper.find(`[data-test-id="pagination-10000"]`).exists()).toBe(
      false
    )
  })

  it('calls the onPageChange prop when clicking to a new results page', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'ice cream'
    mockProps.page = 1
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    wrapper.find('[data-test-id="pagination-2"]').simulate('click')
    expect(mockProps.onPageChange).toHaveBeenCalledWith(2)
    wrapper.find('[data-test-id="pagination-7"]').simulate('click')
    expect(mockProps.onPageChange).toHaveBeenCalledWith(7)
  })

  it('calls the onPageChange prop when clicking the "next page" button', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'ice cream'
    mockProps.page = 3
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    wrapper.find('[data-test-id="pagination-next"]').simulate('click')
    expect(mockProps.onPageChange).toHaveBeenCalledWith(4)
  })

  it('calls the onPageChange prop when clicking the "previous page" button', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'ice cream'
    mockProps.page = 7
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    wrapper.find('[data-test-id="pagination-previous"]').simulate('click')
    expect(mockProps.onPageChange).toHaveBeenCalledWith(6)
  })

  it('does not call the onPageChange prop when clicking the current results page', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'ice cream'
    mockProps.page = 3
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    wrapper.find('[data-test-id="pagination-3"]').simulate('click')
    expect(mockProps.onPageChange).not.toHaveBeenCalled()
  })

  it('disables the button of the current results page', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'ice cream'
    mockProps.page = 3
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    expect(wrapper.find('[data-test-id="pagination-3"]').prop('disabled')).toBe(
      true
    )
  })

  it('does not disable buttons for other results pages besides the one we are on', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'ice cream'
    mockProps.page = 3
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    expect(
      wrapper.find('[data-test-id="pagination-4"]').prop('disabled')
    ).toBeUndefined()
  })

  it('uses our secondary color as the color of the button text of the current results page', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.query = 'ice cream'
    mockProps.page = 3
    const ourTheme = createMuiTheme({
      palette: {
        primary: {
          main: '#dedede',
        },
        secondary: {
          main: '#b94f4f',
        },
      },
    })
    const wrapper = mount(
      <MuiThemeProvider theme={ourTheme}>
        <SearchResults {...mockProps} />
      </MuiThemeProvider>
    )
    expect(
      wrapper
        .find('[data-test-id="pagination-3"]')
        .first()
        .prop('style')
    ).toHaveProperty('color', '#b94f4f')
  })

  it('scrolls to the top of the page when clicking to a new results page', () => {
    const SearchResults = require('js/components/Search/SearchResults').default
    const mockProps = getMockProps()
    mockProps.page = 1
    const wrapper = shallow(<SearchResults {...mockProps} />).dive()
    window.document.body.scrollTop = 829
    expect(window.document.body.scrollTop).toBe(829)
    wrapper.find('[data-test-id="pagination-7"]').simulate('click')
    expect(window.document.body.scrollTop).toBe(0)
  })
})
