/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Input from '@material-ui/core/Input'
import SearchIcon from '@material-ui/icons/Search'
import Typography from '@material-ui/core/Typography'
import Link from 'js/components/General/Link'
import Button from '@material-ui/core/Button'
import {
  isSearchPageEnabled,
  shouldRedirectSearchToThirdParty,
} from 'js/utils/feature-flags'
import {
  adblockerWhitelistingForSearchURL,
  dashboardURL,
  modifyURLParams,
  searchBetaFeedback,
} from 'js/navigation/navigation'
import { externalRedirect } from 'js/navigation/utils'
import SearchResults from 'js/components/Search/SearchResults'
import SearchResultsQueryBing from 'js/components/Search/SearchResultsQueryBing'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import detectAdblocker from 'js/utils/detectAdblocker'
import { flushAllPromises } from 'js/utils/test-utils'
import {
  hasUserDismissedSearchIntro,
  setUserDismissedSearchIntro,
} from 'js/utils/local-user-data-mgr'
import Logo from 'js/components/Logo/Logo'
import WikipediaQuery from 'js/components/Search/WikipediaQuery'
import ErrorBoundary from 'js/components/General/ErrorBoundary'
import ErrorBoundarySearchResults from 'js/components/Search/ErrorBoundarySearchResults'
import { getSearchProvider, isReactSnapClient } from 'js/utils/search-utils'

jest.mock('js/utils/feature-flags')
jest.mock('js/navigation/navigation')
jest.mock('js/navigation/utils')
jest.mock('js/components/Search/SearchResults')
jest.mock('js/components/Search/SearchResultsQueryBing')
jest.mock('js/utils/detectAdblocker')
jest.mock('js/utils/local-user-data-mgr')
jest.mock('js/components/Logo/Logo')
jest.mock('js/components/General/Link')
jest.mock('js/components/Search/WikipediaQuery')
jest.mock('js/utils/search-utils')

// Enzyme does not yet support React.lazy and React.Suspense,
// so let's just not render lazy-loaded children for now.
// https://github.com/airbnb/enzyme/issues/1917
jest.mock('react', () => {
  const React = jest.requireActual('react')
  React.Suspense = () => null
  React.lazy = jest.fn(() => () => null)
  return React
})

const getMockProps = () => ({
  user: {
    id: 'some-user-id-here',
  },
  app: {},
  location: {
    search: '',
  },
})

beforeEach(() => {
  isSearchPageEnabled.mockReturnValue(true)
  shouldRedirectSearchToThirdParty.mockReturnValue(false)
  getSearchProvider.mockReturnValue('bing')
})

afterEach(() => {
  detectAdblocker.mockResolvedValue(false)
  isReactSnapClient.mockReturnValue(false)
  jest.clearAllMocks()
})

describe('Search page component', () => {
  it('renders without error', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    shallow(<SearchPageComponent {...mockProps} />).dive()
  })

  it('renders without error when user and app props are not defined', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    delete mockProps.app
    delete mockProps.user
    shallow(<SearchPageComponent {...mockProps} />).dive()
  })

  it('renders no DOM elements when the search page feature is not enabled', () => {
    isSearchPageEnabled.mockReturnValue(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(toJson(wrapper)).toEqual('')
  })

  it('renders no DOM elements when the third-party redirect is enabled', () => {
    shouldRedirectSearchToThirdParty.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(toJson(wrapper)).toEqual('')
  })

  it('redirects to the dashboard when the search page feature is not enabled', () => {
    isSearchPageEnabled.mockReturnValue(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(externalRedirect).toHaveBeenCalledWith(dashboardURL)
  })

  it('redirects to Google when the third-party redirect is enabled', () => {
    shouldRedirectSearchToThirdParty.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location = {
      search: '?q=yumtacos',
    }
    shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(externalRedirect).toHaveBeenCalledWith(
      'https://www.google.com/search?q=yumtacos'
    )
  })

  it('renders DOM elements when the search page feature is enabled', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(toJson(wrapper)).not.toEqual('')
  })

  it('does not redirect to the dashboard when the search page feature is enabled', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(externalRedirect).not.toHaveBeenCalled()
  })

  it('includes the Logo component with expected props', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    const logoComponent = wrapper.find(Logo)
    expect(logoComponent.prop('brand')).toEqual('search')
    expect(logoComponent.prop('includeText')).toBe(true)
    expect(logoComponent.prop('style')).toEqual({
      width: 116,
    })
  })

  it('sets a min-width on the entire page', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(
      wrapper.find('[data-test-id="search-page"]').prop('style')
    ).toHaveProperty('minWidth', 1100)
  })

  it('sets expected styling on the main search results column', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find('[data-test-id="search-primary-results-column"]')
        .prop('style')
    ).toMatchObject({
      marginLeft: 150,
      marginTop: 0,
      width: 620,
    })
  })

  it('sets a max-width on the search results', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find(SearchResultsQueryBing).prop('style')).toHaveProperty(
      'maxWidth',
      600
    )
  })

  it('sets expected styling on the search sidebar', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(
      wrapper.find('[data-test-id="search-sidebar"]').prop('style')
    ).toMatchObject({
      boxSizing: 'border-box',
      display: 'flex',
      maxWidth: 410,
      minWidth: 300,
    })
  })

  it('sets the "query" state to the value of the "q" URL param on mount', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location = {
      search: '?q=yumtacos',
    }
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.state('query')).toEqual('yumtacos')
  })

  it('does not set the "query" state to the value of the "q" URL param when prerendering with React Snap', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location = {
      search: '?q=yumtacos',
    }
    isReactSnapClient.mockReturnValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.state('query')).toEqual('')
  })

  it('sets the "page" state to the value of the "page" URL param on mount', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location = {
      search: '?page=14',
    }
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.state('page')).toEqual(14)
  })

  it('does not set the "page" state to the value of the "page" URL param when prerendering with React Snap', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location = {
      search: '?page=14',
    }
    isReactSnapClient.mockReturnValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.state('page')).toBeUndefined()
  })

  it('sets the "page" state to 1 if the value of the "page" URL param is not a valid integer', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location = {
      search: '?age=foo',
    }
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.state('page')).toEqual(1)
  })

  it('sets the "p" query parameter to the page number when clicking to a new results page', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location = {
      search: '?page=14',
    }
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    const onPageChangeHandler = wrapper
      .find(SearchResultsQueryBing)
      .prop('onPageChange')
    onPageChangeHandler(7)
    expect(modifyURLParams).toHaveBeenCalledWith({
      page: 7,
    })
    onPageChangeHandler(102)
    expect(modifyURLParams).toHaveBeenCalledWith({
      page: 102,
    })
  })

  it('shows the search text in the box when loading a previous search', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=blahblah'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find(Input).prop('value')).toBe('blahblah')
  })

  it('clicking the search button updates the "q" URL parameter, sets the page to 1, and sets the "src" to "self"', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = ''
    const wrapper = mount(<SearchPageComponent {...mockProps} />)
    const searchInput = wrapper
      .find(Input)
      .first()
      .find('input')

    // https://github.com/airbnb/enzyme/issues/76#issuecomment-189606849
    searchInput.simulate('change', { target: { value: 'free ice cream' } })

    wrapper.find(SearchIcon).simulate('click')
    expect(modifyURLParams).toHaveBeenCalledWith({
      q: 'free ice cream',
      page: 1,
      src: 'self',
    })
  })

  it('hitting enter in the search input updates the "q" URL parameter, sets the page to 1, and sets the "src" to "self"', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = ''
    const wrapper = mount(<SearchPageComponent {...mockProps} />)
    const searchInput = wrapper
      .find(Input)
      .first()
      .find('input')
    searchInput
      .simulate('change', { target: { value: 'register to vote' } })
      .simulate('keypress', { key: 'Enter' })
    expect(modifyURLParams).toHaveBeenCalledWith({
      q: 'register to vote',
      page: 1,
      src: 'self',
    })
  })

  it('does not update the "q" URL parameter if the search query is an empty string', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = ''
    const wrapper = mount(<SearchPageComponent {...mockProps} />)
    const searchInput = wrapper
      .find(Input)
      .first()
      .find('input')
    searchInput
      .simulate('change', { target: { value: '' } })
      .simulate('keypress', { key: 'Enter' })
    expect(modifyURLParams).not.toHaveBeenCalled()
  })

  it('contains all the expected search category tabs', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    const tabs = wrapper.find(Tabs)
    const expectedTabs = ['Web', 'Images', 'News', 'Videos', 'Maps']
    expectedTabs.forEach(tabText => {
      const tabExists =
        tabs.find(Tab).filterWhere(n => n.render().text() === tabText)
          .length === 1
      if (!tabExists) {
        throw new Error(
          `Expected to render a search category tab "${tabText}".`
        )
      }
    })
  })

  it('has the expected outbound link for the "Images" search category tab when there is a search query', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=mini%20golf'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    const tab = wrapper
      .find(Tabs)
      .find(Tab)
      .filterWhere(n => n.render().text() === 'Images')
    expect(tab.prop('href')).toBe(
      'https://www.google.com/search?q=mini%20golf&tbm=isch'
    )
  })

  it('has the expected outbound link for the "Images" search category tab when there is no search query', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = ''
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    const tab = wrapper
      .find(Tabs)
      .find(Tab)
      .filterWhere(n => n.render().text() === 'Images')
    expect(tab.prop('href')).toBe('https://images.google.com')
  })

  it('has the expected outbound link for the "News" search category tab when there is a search query', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=mini%20golf'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    const tab = wrapper
      .find(Tabs)
      .find(Tab)
      .filterWhere(n => n.render().text() === 'News')
    expect(tab.prop('href')).toBe(
      'https://www.google.com/search?q=mini%20golf&tbm=nws'
    )
  })

  it('has the expected outbound link for the "News" search category tab when there is no search query', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = ''
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    const tab = wrapper
      .find(Tabs)
      .find(Tab)
      .filterWhere(n => n.render().text() === 'News')
    expect(tab.prop('href')).toBe('https://www.google.com')
  })

  it('has the expected outbound link for the "Video" search category tab when there is a search query', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=mini%20golf'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    const tab = wrapper
      .find(Tabs)
      .find(Tab)
      .filterWhere(n => n.render().text() === 'Videos')
    expect(tab.prop('href')).toBe(
      'https://www.google.com/search?q=mini%20golf&tbm=vid'
    )
  })

  it('has the expected outbound link for the "Video" search category tab when there is no search query', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = ''
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    const tab = wrapper
      .find(Tabs)
      .find(Tab)
      .filterWhere(n => n.render().text() === 'Videos')
    expect(tab.prop('href')).toBe('https://www.google.com')
  })

  it('has the expected outbound link for the "Maps" search category tab when there is a search query', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=mini%20golf'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    const tab = wrapper
      .find(Tabs)
      .find(Tab)
      .filterWhere(n => n.render().text() === 'Maps')
    expect(tab.prop('href')).toBe('https://www.google.com/maps/?q=mini%20golf')
  })

  it('has the expected outbound link for the "Maps" search category tab when there is no search query', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = ''
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    const tab = wrapper
      .find(Tabs)
      .find(Tab)
      .filterWhere(n => n.render().text() === 'Maps')
    expect(tab.prop('href')).toBe('https://www.google.com/maps')
  })

  it('shows the "ad blocker enabled" message when we detect an ad blocker', async () => {
    expect.assertions(1)

    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    detectAdblocker.mockResolvedValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    await flushAllPromises()
    expect(
      wrapper.find('[data-test-id="search-prevented-warning"]').exists()
    ).toBe(true)
  })

  it('does not show the "ad blocker enabled" message when we do not detect an ad blocker', async () => {
    expect.assertions(1)

    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    detectAdblocker.mockResolvedValue(false)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    await flushAllPromises()
    expect(
      wrapper.find('[data-test-id="search-prevented-warning"]').exists()
    ).toBe(false)
  })

  it('calls console.error when the ad blocker detection throws', async () => {
    expect.assertions(1)

    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const mockErr = new Error('Oh nooooo')
    detectAdblocker.mockImplementation(() => Promise.reject(mockErr))
    const mockConsoleError = jest.fn()
    jest.spyOn(console, 'error').mockImplementationOnce(mockConsoleError)
    shallow(<SearchPageComponent {...mockProps} />).dive()
    await flushAllPromises()
    expect(mockConsoleError).toHaveBeenCalledWith(mockErr)
  })

  it('shows the expected "disable your ad blocker" message', async () => {
    expect.assertions(2)

    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    detectAdblocker.mockResolvedValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    await flushAllPromises()
    const messageElem = wrapper.find(
      '[data-test-id="search-prevented-warning"]'
    )
    expect(
      messageElem
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('Please disable your ad blocker')
    expect(
      messageElem
        .find(Typography)
        .at(1)
        .render()
        .text()
    ).toEqual(
      `We use search ads to raise money for charity. You'll likely need to whitelist Search for a Cause for search results to show.`
    )
  })

  it('shows the expected "show me how" button on the "disable ad blocker" message', async () => {
    expect.assertions(2)

    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    detectAdblocker.mockResolvedValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    await flushAllPromises()
    const messageElem = wrapper.find(
      '[data-test-id="search-prevented-warning"]'
    )
    expect(
      messageElem
        .find(Link)
        .first()
        .prop('to')
    ).toEqual(adblockerWhitelistingForSearchURL)
    expect(
      messageElem
        .find(Link)
        .first()
        .children()
        .find(Button)
        .render()
        .text()
    ).toEqual('Show me how')
  })

  it('shows the intro message if the user has not dismissed it', () => {
    hasUserDismissedSearchIntro.mockReturnValueOnce(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find('[data-test-id="search-intro-msg"]').exists()).toBe(
      true
    )
  })

  it('does not show the intro message if the user has already dismissed it', () => {
    hasUserDismissedSearchIntro.mockReturnValueOnce(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find('[data-test-id="search-intro-msg"]').exists()).toBe(
      false
    )
  })

  it('clicking the dismiss button on the intro message hides the intro message', () => {
    hasUserDismissedSearchIntro.mockReturnValueOnce(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find('[data-test-id="search-intro-msg"]').exists()).toBe(
      true
    )
    wrapper
      .find('[data-test-id="search-intro-msg"]')
      .find(Button)
      .first()
      .simulate('click')
    expect(wrapper.find('[data-test-id="search-intro-msg"]').exists()).toBe(
      false
    )
  })

  it('clicking the dismiss button sets the dismissal in local storage', () => {
    hasUserDismissedSearchIntro.mockReturnValueOnce(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    wrapper
      .find('[data-test-id="search-intro-msg"]')
      .find(Button)
      .first()
      .simulate('click')
    expect(setUserDismissedSearchIntro).toHaveBeenCalledTimes(1)
  })

  it('shows the expected intro message title', () => {
    hasUserDismissedSearchIntro.mockReturnValueOnce(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find('[data-test-id="search-intro-msg"]')
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('Your searches do good :)')
  })

  it('shows the expected intro message description', () => {
    hasUserDismissedSearchIntro.mockReturnValueOnce(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find('[data-test-id="search-intro-msg"]')
        .find(Typography)
        .at(1)
        .render()
        .text()
    ).toEqual(
      'When you search, you raise money for charity! The money comes from the ads in search results, and you decide where the money goes by donating your Hearts to your favorite nonprofit.'
    )
  })

  it('shows the expected intro message button text', () => {
    hasUserDismissedSearchIntro.mockReturnValueOnce(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find('[data-test-id="search-intro-msg"]')
        .find(Button)
        .first()
        .render()
        .text()
    ).toEqual('Great!')
  })

  it('does not show the intro message if prerendering with React Snap', () => {
    hasUserDismissedSearchIntro.mockReturnValueOnce(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    isReactSnapClient.mockReturnValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find('[data-test-id="search-intro-msg"]').exists()).toBe(
      false
    )
  })

  it('includes a feedback button', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    const feedbackLink = wrapper.find(Link)
    expect(feedbackLink.prop('to')).toEqual(searchBetaFeedback)
    expect(
      feedbackLink
        .find(Button)
        .first()
        .render()
        .text()
    ).toEqual('Feedback')
  })

  it('does not render the WikipediaQuery component if there is no query', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = ''
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find(WikipediaQuery).exists()).toBe(false)
  })

  it('passes the query to the WikipediaQuery component', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=big%20bad%20wolf'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find(WikipediaQuery).prop('query')).toEqual('big bad wolf')
  })

  it('wraps the WikipediaQuery component in an error boundary that swallows errors', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=big%20bad%20wolf'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find(WikipediaQuery)
        .parent()
        .type()
    ).toEqual(ErrorBoundary)
    expect(
      wrapper
        .find(WikipediaQuery)
        .parent()
        .prop('ignoreErrors')
    ).toBe(true)
  })
})

describe('Search results from Bing', () => {
  beforeEach(() => {
    getSearchProvider.mockReturnValue('bing')
  })

  it('[bing] passes the decoded query to the SearchResultsQueryBing component', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=foo&another=thing'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find(SearchResultsQueryBing).prop('query')).toEqual('foo')

    // Update the search parameter.
    wrapper.setProps(
      Object.assign({}, mockProps, {
        location: {
          search: '?q=something%20here',
        },
      })
    )
    expect(wrapper.find(SearchResultsQueryBing).prop('query')).toEqual(
      'something here'
    )
  })

  it('[bing] passes the page number to the SearchResultsQueryBing component', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=foo&page=12'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find(SearchResultsQueryBing).prop('page')).toBe(12)
  })

  it('[bing] passes "1" as the default page number to the SearchResultsQueryBing component when the "page" URL param is not set', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=foo'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find(SearchResultsQueryBing).prop('page')).toBe(1)
  })

  it('[bing] passes the search source to the SearchResultsQueryBing component when the "page" URL param is set', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=foo&src=some-source'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find(SearchResultsQueryBing).prop('searchSource')).toEqual(
      'some-source'
    )
  })

  it('[bing] passes null as the search source to the SearchResultsQueryBing component when the "src" URL param is not set', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=foo'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find(SearchResultsQueryBing).prop('searchSource')).toBeNull()
  })

  it('[bing] passes "self" as the "searchSource" the SearchResultsQueryBing component when entering a new search on the page', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = ''
    const wrapper = mount(<SearchPageComponent {...mockProps} />)
    expect(wrapper.find(SearchResultsQueryBing).prop('searchSource')).toBeNull()
    const searchInput = wrapper
      .find(Input)
      .first()
      .find('input')
    searchInput
      .simulate('change', { target: { value: 'register to vote' } })
      .simulate('keypress', { key: 'Enter' })
    expect(wrapper.find(SearchResultsQueryBing).prop('searchSource')).toEqual(
      'self'
    )
  })

  // This is important for prerendering scripts for search results.
  it('[bing] renders the SearchResultsQueryBing component on mount even if there is no query', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = ''
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find(SearchResultsQueryBing).exists()).toBe(true)
    expect(wrapper.find(SearchResultsQueryBing).prop('query')).toEqual('')
  })

  it('[bing] wraps the SearchResultsQueryBing component in an error boundary', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=big%20bad%20wolf'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(
      wrapper
        .find(SearchResultsQueryBing)
        .parent()
        .type()
    ).toEqual(ErrorBoundarySearchResults)
  })
})

describe('Search results from Yahoo', () => {
  beforeEach(() => {
    getSearchProvider.mockReturnValue('yahoo')
  })

  it('[yahoo] uses Bing if the searchProvider prop equals "bing" (overriding the default search provider)', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.searchProvider = 'bing'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find(SearchResults).exists()).toBe(false) // not using Yahoo
    expect(wrapper.find(SearchResultsQueryBing).exists()).toBe(true) // using Bing
  })

  it('[yahoo] uses Yahoo by default if the searchProvider prop is undefined', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.searchProvider = undefined
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find(SearchResults).exists()).toBe(true) // using Yahoo
    expect(wrapper.find(SearchResultsQueryBing).exists()).toBe(false) // not using Bing
  })

  it('[yahoo] passes the decoded query to the SearchResults component', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=foo&another=thing'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find(SearchResults).prop('query')).toEqual('foo')

    // Update the search parameter.
    wrapper.setProps(
      Object.assign({}, mockProps, {
        location: {
          search: '?q=something%20here',
        },
      })
    )
    expect(wrapper.find(SearchResults).prop('query')).toEqual('something here')
  })

  it('[yahoo] passes the page number to the SearchResults component', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=foo&page=12'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find(SearchResults).prop('page')).toBe(12)
  })

  it('[yahoo] passes "1" as the default page number to the SearchResults component when the "page" URL param is not set', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=foo'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find(SearchResults).prop('page')).toBe(1)
  })

  it('[yahoo] passes the search source to the SearchResults component when the "page" URL param is set', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=foo&src=some-source'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find(SearchResults).prop('searchSource')).toEqual(
      'some-source'
    )
  })

  it('[yahoo] passes null as the search source to the SearchResults component when the "src" URL param is not set', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=foo'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find(SearchResults).prop('searchSource')).toBeNull()
  })

  it('[yahoo] passes "self" as the "searchSource" the SearchResults component when entering a new search on the page', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = ''
    const wrapper = mount(<SearchPageComponent {...mockProps} />)
    expect(wrapper.find(SearchResults).prop('searchSource')).toBeNull()
    const searchInput = wrapper
      .find(Input)
      .first()
      .find('input')
    searchInput
      .simulate('change', { target: { value: 'register to vote' } })
      .simulate('keypress', { key: 'Enter' })
    expect(wrapper.find(SearchResults).prop('searchSource')).toEqual('self')
  })

  // This is important for prerendering scripts for search results.
  it('[yahoo] renders the SearchResults component on mount even if there is no query', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = ''
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    expect(wrapper.find(SearchResults).exists()).toBe(true)
    expect(wrapper.find(SearchResults).prop('query')).toEqual('')
  })

  it('[yahoo] passes "isAdBlockerEnabled = false" to the SearchResults component', async () => {
    expect.assertions(1)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    detectAdblocker.mockResolvedValue(false)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    await flushAllPromises()
    expect(wrapper.find(SearchResults).prop('isAdBlockerEnabled')).toBe(false)
  })

  it('[yahoo] passes "isAdBlockerEnabled = true" to the SearchResults component', async () => {
    expect.assertions(1)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    detectAdblocker.mockResolvedValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />).dive()
    await flushAllPromises()
    expect(wrapper.find(SearchResults).prop('isAdBlockerEnabled')).toBe(true)
  })
})
