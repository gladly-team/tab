/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Input from '@material-ui/core/Input'
import SearchIcon from '@material-ui/icons/Search'
import Typography from '@material-ui/core/Typography'
import Link from 'js/components/General/Link'
import Button from '@material-ui/core/Button'
import { Helmet } from 'react-helmet'
import {
  isSearchPageEnabled,
  shouldRedirectSearchToThirdParty,
} from 'js/utils/feature-flags'
import {
  adblockerWhitelistingForSearchURL,
  dashboardURL,
  modifyURLParams,
  searchBetaFeedback,
  searchHomeURL,
} from 'js/navigation/navigation'
import { externalRedirect } from 'js/navigation/utils'
import SearchMenuQuery from 'js/components/Search/SearchMenuQuery'
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
import {
  getSearchProvider,
  isReactSnapClient,
  isSearchExtensionInstalled,
} from 'js/utils/search-utils'
import { detectSupportedBrowser } from 'js/utils/detectBrowser'
import logger from 'js/utils/logger'

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
jest.mock('js/utils/detectBrowser')
jest.mock('js/utils/logger')
jest.mock('js/components/General/withUser')

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
  isSearchExtensionInstalled.mockResolvedValue(false)
  detectSupportedBrowser.mockReturnValue('chrome')
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
    shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
  })

  it('renders without error when user and app props are not defined', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    delete mockProps.app
    delete mockProps.user
    shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
  })

  it('renders no DOM elements when the search page feature is not enabled', () => {
    isSearchPageEnabled.mockReturnValue(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(toJson(wrapper)).toEqual('')
  })

  it('renders no DOM elements when the third-party redirect is enabled', () => {
    shouldRedirectSearchToThirdParty.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(toJson(wrapper)).toEqual('')
  })

  it('redirects to the dashboard when the search page feature is not enabled', () => {
    isSearchPageEnabled.mockReturnValue(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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
    shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(externalRedirect).toHaveBeenCalledWith(
      'https://www.google.com/search?q=yumtacos'
    )
  })

  it('renders DOM elements when the search page feature is enabled', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(toJson(wrapper)).not.toEqual('')
  })

  it('does not redirect to the dashboard when the search page feature is enabled', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(externalRedirect).not.toHaveBeenCalled()
  })

  it('includes the Logo component with expected props', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    const logoComponent = wrapper.find(Logo)
    expect(logoComponent.prop('brand')).toEqual('search')
    expect(logoComponent.prop('includeText')).toBe(true)
    expect(logoComponent.prop('style')).toEqual({
      width: 116,
    })
  })

  it('links to the homepage from the Logo component', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    const logoComponentParent = wrapper.find(Logo).parent()
    expect(logoComponentParent.type()).toEqual(Link)
    expect(logoComponentParent.prop('to')).toEqual(searchHomeURL)
  })

  it('sets a min-width on the entire page', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(
      wrapper.find('[data-test-id="search-page"]').prop('style')
    ).toHaveProperty('minWidth', 1100)
  })

  it('sets the the page title with react-helmet when a query exists', async () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location = {
      search: '?q=i+like+food',
    }
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(
      wrapper
        .find(Helmet)
        .find('title')
        .first()
        .text()
    ).toEqual('i like food')
  })

  it('does not set the the page title with react-helmet when no query exists', async () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location = {
      search: '',
    }
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(
      wrapper
        .find(Helmet)
        .find('title')
        .exists()
    ).toBe(false)
  })

  it('sets expected styling on the main search results column', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(
      wrapper.find('[data-test-id="search-sidebar"]').prop('style')
    ).toMatchObject({
      boxSizing: 'border-box',
      display: 'flex',
      maxWidth: 410,
      minWidth: 300,
    })
  })

  it('sets the "p" query parameter to the page number when clicking to a new results page', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location = {
      search: '?page=14',
    }
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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

  it('auto-focuses to the search input', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=foo'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(Input).prop('autoFocus')).toBe(true)
  })

  it('shows the search text in the box when loading a previous search', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=blahblah'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(Input).prop('value')).toBe('blahblah')
  })

  it('updates the the search text in the box when the search query URL param value changes', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=blahblah'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(Input).prop('value')).toBe('blahblah')
    wrapper.setProps(
      Object.assign({}, mockProps, {
        location: {
          search: '?q=something%20here',
        },
      })
    )
    expect(wrapper.find(Input).prop('value')).toBe('something here')
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

  it('includes a feedback button', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    const feedbackLink = wrapper.find('[data-test-id="search-feedback"]')
    expect(feedbackLink.prop('to')).toEqual(searchBetaFeedback)
    expect(
      feedbackLink
        .find(Button)
        .first()
        .render()
        .text()
    ).toEqual('Feedback')
  })

  it('includes the SearchMenuQuery component', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    const elem = wrapper.find(SearchMenuQuery)
    expect(elem.exists()).toEqual(true)
  })

  it('passes the extension install state to the SearchMenuQuery component', async () => {
    expect.assertions(2)
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()

    isSearchExtensionInstalled.mockResolvedValue(false)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    expect(
      wrapper.find(SearchMenuQuery).prop('isSearchExtensionInstalled')
    ).toEqual(false)

    isSearchExtensionInstalled.mockResolvedValue(true)
    const newWrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    expect(
      newWrapper.find(SearchMenuQuery).prop('isSearchExtensionInstalled')
    ).toEqual(true)
  })

  it('does not log an error if detectAdblocker resolves after the component has unmounted', async () => {
    expect.assertions(1)
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()

    // Mock that the detection takes some time.
    jest.useFakeTimers()
    detectAdblocker.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true)
        }, 8e3)
      })
    })

    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()

    // Unmount
    wrapper.unmount()

    // Mock that the async function resolves.
    jest.advanceTimersByTime(10e3)
    await flushAllPromises()

    expect(logger.error).not.toHaveBeenCalled()
  })

  it('does not log an error if isSearchExtensionInstalled resolves after the component has unmounted', async () => {
    expect.assertions(1)
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()

    // Mock that the extension message response takes some time.
    jest.useFakeTimers()
    isSearchExtensionInstalled.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true)
        }, 8e3)
      })
    })

    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()

    // Unmount
    wrapper.unmount()

    // Mock that the async function resolves.
    jest.advanceTimersByTime(10e3)
    await flushAllPromises()

    expect(logger.error).not.toHaveBeenCalled()
  })
})

describe('Search page: search category tabs', () => {
  it('contains all the expected search category tabs', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    const tab = wrapper
      .find(Tabs)
      .find(Tab)
      .filterWhere(n => n.render().text() === 'Images')
    expect(tab.prop('href')).toBe('https://images.google.com')
  })

  it('does not include the search query in the "Images" search category tab outbound link when prerendering', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=mini%20golf'
    isReactSnapClient.mockReturnValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    const tab = wrapper
      .find(Tabs)
      .find(Tab)
      .filterWhere(n => n.render().text() === 'News')
    expect(tab.prop('href')).toBe('https://www.google.com')
  })

  it('does not include the search query in the "News" search category tab outbound link when prerendering', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=mini%20golf'
    isReactSnapClient.mockReturnValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    const tab = wrapper
      .find(Tabs)
      .find(Tab)
      .filterWhere(n => n.render().text() === 'Videos')
    expect(tab.prop('href')).toBe('https://www.google.com')
  })

  it('does not include the search query in the "Videos" search category tab outbound link when prerendering', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=mini%20golf'
    isReactSnapClient.mockReturnValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    const tab = wrapper
      .find(Tabs)
      .find(Tab)
      .filterWhere(n => n.render().text() === 'Maps')
    expect(tab.prop('href')).toBe('https://www.google.com/maps')
  })

  it('does not include the search query in the "Maps" search category tab outbound link when prerendering', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=mini%20golf'
    isReactSnapClient.mockReturnValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    const tab = wrapper
      .find(Tabs)
      .find(Tab)
      .filterWhere(n => n.render().text() === 'Maps')
    expect(tab.prop('href')).toBe('https://www.google.com/maps')
  })
})

describe('Search page: Wikipedia component', () => {
  it('does not render the WikipediaQuery component if there is no query', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = ''
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(WikipediaQuery).exists()).toBe(false)
  })

  it('passes the query to the WikipediaQuery component', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=big%20bad%20wolf'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(WikipediaQuery).prop('query')).toEqual('big bad wolf')
  })

  it('wraps the WikipediaQuery component in an error boundary that swallows errors', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=big%20bad%20wolf'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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

describe('Search page: ad blocker message', () => {
  it('shows the "ad blocker enabled" message when we detect an ad blocker', async () => {
    expect.assertions(1)

    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    detectAdblocker.mockResolvedValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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
    shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    expect(mockConsoleError).toHaveBeenCalledWith(mockErr)
  })

  it('shows the expected "disable your ad blocker" message', async () => {
    expect.assertions(2)

    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    detectAdblocker.mockResolvedValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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
      `We use search ads to raise money for charity! You'll likely need to whitelist Search for a Cause in your ad blocker to start doing good.`
    )
  })

  it('shows the expected "show me how" button on the "disable ad blocker" message', async () => {
    expect.assertions(2)

    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    detectAdblocker.mockResolvedValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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
})

describe('Search page: "add extension" button', () => {
  it('shows the "Add extension" button when the extension is not installed', async () => {
    expect.assertions(1)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    isSearchExtensionInstalled.mockResolvedValue(false)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    expect(
      wrapper.find('[data-test-id="search-add-extension-cta"]').exists()
    ).toBe(true)
  })

  it('does not show the "Add extension" button when the extension IS installed', async () => {
    expect.assertions(1)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    isSearchExtensionInstalled.mockResolvedValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    expect(
      wrapper.find('[data-test-id="search-add-extension-cta"]').exists()
    ).toBe(false)
  })

  it('the "Add extension" button says "Add to Chrome" when the browser is Chrome', async () => {
    expect.assertions(1)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    isSearchExtensionInstalled.mockResolvedValue(false)
    detectSupportedBrowser.mockReturnValue('chrome')
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    const button = wrapper
      .find('[data-test-id="search-add-extension-cta"]')
      .find(Button)
    expect(button.render().text()).toEqual('Add to Chrome')
  })

  it('the "Add extension" button says "Add to Firefox" when the browser is Firefox', async () => {
    expect.assertions(1)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    isSearchExtensionInstalled.mockResolvedValue(false)
    detectSupportedBrowser.mockReturnValue('firefox')
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    const button = wrapper
      .find('[data-test-id="search-add-extension-cta"]')
      .find(Button)
    expect(button.render().text()).toEqual('Add to Firefox')
  })

  it('the "Add extension" button links to the Chrome Web Store when the browser is Chrome', async () => {
    expect.assertions(1)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    isSearchExtensionInstalled.mockResolvedValue(false)
    detectSupportedBrowser.mockReturnValue('chrome')
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    const elem = wrapper
      .find('[data-test-id="search-add-extension-cta"]')
      .find(Link)
    expect(elem.prop('to')).toEqual(
      'https://chrome.google.com/webstore/detail/search-for-a-cause/eeiiknnphladbapfamiamfimnnnodife/'
    )
  })

  it('the "Add extension" button links to the Firefox Add-ons page when the browser is Firefox', async () => {
    expect.assertions(1)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    isSearchExtensionInstalled.mockResolvedValue(false)
    detectSupportedBrowser.mockReturnValue('firefox')
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    const elem = wrapper
      .find('[data-test-id="search-add-extension-cta"]')
      .find(Link)
    expect(elem.prop('to')).toEqual(
      'https://addons.mozilla.org/en-US/firefox/addon/search-for-a-cause/'
    )
  })

  it('does not render the "Add extension" button when prerendering with React Snap', async () => {
    expect.assertions(1)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    isSearchExtensionInstalled.mockResolvedValue(false)
    const mockProps = getMockProps()
    isReactSnapClient.mockReturnValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    expect(
      wrapper.find('[data-test-id="search-add-extension-cta"]').exists()
    ).toBe(false)
  })

  it('the "Add extension" button does not appear if the browser is not Chrome or Firefox', async () => {
    expect.assertions(1)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    isSearchExtensionInstalled.mockResolvedValue(false)
    detectSupportedBrowser.mockReturnValue('safari')
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    expect(
      wrapper.find('[data-test-id="search-add-extension-cta"]').exists()
    ).toBe(false)
  })
})

describe('Search page: intro message', () => {
  it('shows the intro message if the user has not dismissed it', () => {
    hasUserDismissedSearchIntro.mockReturnValueOnce(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find('[data-test-id="search-intro-msg"]').exists()).toBe(
      true
    )
  })

  it('does not show the intro message if the user has already dismissed it', () => {
    hasUserDismissedSearchIntro.mockReturnValueOnce(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find('[data-test-id="search-intro-msg"]').exists()).toBe(
      false
    )
  })

  it('clicking the dismiss button on the intro message hides the intro message', () => {
    hasUserDismissedSearchIntro.mockReturnValueOnce(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    wrapper
      .find('[data-test-id="search-intro-msg"]')
      .find(Button)
      .first()
      .simulate('click')
    expect(setUserDismissedSearchIntro).toHaveBeenCalledTimes(1)
  })

  it('does not show the intro message if prerendering with React Snap', () => {
    hasUserDismissedSearchIntro.mockReturnValueOnce(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    isReactSnapClient.mockReturnValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find('[data-test-id="search-intro-msg"]').exists()).toBe(
      false
    )
  })

  it('[extension installed] shows the expected intro message title', async () => {
    expect.assertions(1)
    isSearchExtensionInstalled.mockResolvedValue(true) // extension already installed
    hasUserDismissedSearchIntro.mockReturnValueOnce(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    expect(
      wrapper
        .find('[data-test-id="search-intro-msg"]')
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('Your searches do good!')
  })

  it('[extension installed] shows the expected intro message description', async () => {
    expect.assertions(2)
    isSearchExtensionInstalled.mockResolvedValue(true) // extension already installed
    hasUserDismissedSearchIntro.mockReturnValueOnce(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    expect(
      wrapper
        .find('[data-test-id="search-intro-msg"]')
        .find(Typography)
        .at(1)
        .render()
        .text()
    ).toEqual(
      "When you search, you're raising money for charity! Choose your cause, from protecting the rainforest to giving cash to people who need it most."
    )
    expect(
      wrapper.find('[data-test-id="search-intro-msg"]').find(Typography).length
    ).toBe(2)
  })

  it('[extension installed] shows the expected intro message button text', async () => {
    expect.assertions(1)
    isSearchExtensionInstalled.mockResolvedValue(true) // extension already installed
    hasUserDismissedSearchIntro.mockReturnValueOnce(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    expect(
      wrapper
        .find('[data-test-id="search-intro-msg"]')
        .find(Button)
        .first()
        .render()
        .text()
    ).toEqual('Great!')
  })

  it('[extension installed] does not show the "Add extension" button', async () => {
    expect.assertions(2)
    isSearchExtensionInstalled.mockResolvedValue(true) // extension already installed
    hasUserDismissedSearchIntro.mockReturnValueOnce(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    const introElem = wrapper.find('[data-test-id="search-intro-msg"]')
    expect(
      introElem.find('[data-test-id="search-intro-add-extension-cta"]').exists()
    ).toBe(false)
    expect(introElem.find(Button).length).toBe(1)
  })

  it('[not installed] shows the "Add extension" button when the extension is not installed', async () => {
    expect.assertions(2)
    isSearchExtensionInstalled.mockResolvedValue(false) // extension not installed
    hasUserDismissedSearchIntro.mockReturnValueOnce(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    const introElem = wrapper.find('[data-test-id="search-intro-msg"]')
    expect(
      introElem.find('[data-test-id="search-intro-add-extension-cta"]').exists()
    ).toBe(true)
    expect(introElem.find(Button).length).toBe(2)
  })

  it('[not installed] the "Add extension" button says "Add to Chrome" when the browser is Chrome', async () => {
    expect.assertions(1)
    isSearchExtensionInstalled.mockResolvedValue(false) // extension not installed
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    detectSupportedBrowser.mockReturnValue('chrome')
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    const introElem = wrapper.find('[data-test-id="search-intro-msg"]')
    const button = introElem.find(Button).at(1)
    expect(button.render().text()).toEqual('Add to Chrome')
  })

  it('[not installed] the "Add extension" button says "Add to Firefox" when the browser is Firefox', async () => {
    expect.assertions(1)
    isSearchExtensionInstalled.mockResolvedValue(false) // extension not installed
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    detectSupportedBrowser.mockReturnValue('firefox')
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    const introElem = wrapper.find('[data-test-id="search-intro-msg"]')
    const button = introElem.find(Button).at(1)
    expect(button.render().text()).toEqual('Add to Firefox')
  })

  it('[not installed] the "Add extension" button links to the Chrome Web Store when the browser is Chrome', async () => {
    expect.assertions(1)
    isSearchExtensionInstalled.mockResolvedValue(false) // extension not installed
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    detectSupportedBrowser.mockReturnValue('chrome')
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    const introElem = wrapper.find('[data-test-id="search-intro-msg"]')
    const elem = introElem.find(Link)
    expect(elem.prop('to')).toEqual(
      'https://chrome.google.com/webstore/detail/search-for-a-cause/eeiiknnphladbapfamiamfimnnnodife/'
    )
  })

  it('[not installed] the "Add extension" button links to the Firefox Add-ons page when the browser is Firefox', async () => {
    expect.assertions(1)
    isSearchExtensionInstalled.mockResolvedValue(false) // extension not installed
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    detectSupportedBrowser.mockReturnValue('firefox')
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    const introElem = wrapper.find('[data-test-id="search-intro-msg"]')
    const elem = introElem.find(Link)
    expect(elem.prop('to')).toEqual(
      'https://addons.mozilla.org/en-US/firefox/addon/search-for-a-cause/'
    )
  })

  it('[not installed] the "Add extension" button does not appear if the browser is not Chrome or Firefox', async () => {
    expect.assertions(1)
    isSearchExtensionInstalled.mockResolvedValue(false) // extension not installed
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    detectSupportedBrowser.mockReturnValue('safari')
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    const introElem = wrapper.find('[data-test-id="search-intro-msg"]')
    expect(
      introElem.find('[data-test-id="search-intro-add-extension-cta"]').exists()
    ).toBe(false)
  })

  it('[not installed] shows the expected intro message title', async () => {
    expect.assertions(1)
    isSearchExtensionInstalled.mockResolvedValue(false) // extension not installed
    hasUserDismissedSearchIntro.mockReturnValueOnce(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    expect(
      wrapper
        .find('[data-test-id="search-intro-msg"]')
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('Your searches do good!')
  })

  it('[not installed] shows the expected intro message description', async () => {
    expect.assertions(3)
    isSearchExtensionInstalled.mockResolvedValue(false) // extension not installed
    hasUserDismissedSearchIntro.mockReturnValueOnce(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    expect(
      wrapper.find('[data-test-id="search-intro-msg"]').find(Typography).length
    ).toBe(3)
    expect(
      wrapper
        .find('[data-test-id="search-intro-msg"]')
        .find(Typography)
        .at(1)
        .render()
        .text()
    ).toEqual(
      "When you search, you're raising money for charity! Choose your cause, from protecting the rainforest to giving cash to people who need it most."
    )
    expect(
      wrapper
        .find('[data-test-id="search-intro-msg"]')
        .find(Typography)
        .at(2)
        .render()
        .text()
    ).toEqual(
      'Make Search for a Cause your default search engine to change lives with every search.'
    )
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
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(SearchResultsQueryBing).prop('page')).toBe(12)
  })

  it('[bing] passes an empty "query" value to SearchResultsQueryBing when prerendering with React Snap', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location = {
      search: '?q=yumtacos',
    }
    isReactSnapClient.mockReturnValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(SearchResultsQueryBing).prop('query')).toEqual('')
  })

  it('[bing] passes a "page" value of 1 to to SearchResultsQueryBing when prerendering with React Snap', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location = {
      search: '?q=yumtacos&page=12',
    }
    isReactSnapClient.mockReturnValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(SearchResultsQueryBing).prop('page')).toEqual(1)
  })

  it('[bing] passes a "searchSource" value of null to to SearchResultsQueryBing when prerendering with React Snap', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location = {
      search: '?q=yumtacos&src=chrome',
    }
    isReactSnapClient.mockReturnValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(SearchResultsQueryBing).prop('searchSource')).toBeNull()
  })

  it('[bing] passes "1" as the default page number to the SearchResultsQueryBing component when the "page" URL param is not set', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=foo'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(SearchResultsQueryBing).prop('page')).toBe(1)
  })

  it('[bing] passes "1" as the default page number to the SearchResultsQueryBing component when the "page" URL param is not a valid integer', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=foo&page=hello'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(SearchResultsQueryBing).prop('page')).toBe(1)
  })

  it('[bing] passes the search source to the SearchResultsQueryBing component when the "src" URL param is set', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=foo&src=some-source'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(SearchResultsQueryBing).prop('searchSource')).toEqual(
      'some-source'
    )
  })

  it('[bing] passes null as the search source to the SearchResultsQueryBing component when the "src" URL param is not set', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=foo'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(SearchResultsQueryBing).prop('searchSource')).toBeNull()
  })

  it('[bing] passes the new "page" to the SearchResultsQueryBing component when the URL param changes', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=hello&page=34'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(SearchResultsQueryBing).prop('page')).toEqual(34)
    wrapper.setProps({
      ...mockProps,
      location: {
        ...mockProps.location,
        search: '?q=what+is+a+waffle+house&page=28',
      },
    })
    expect(wrapper.find(SearchResultsQueryBing).prop('page')).toEqual(28)
  })

  it('[bing] passes the new "src" to the SearchResultsQueryBing component when the URL param changes', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=hello&src=chrome'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(SearchResultsQueryBing).prop('searchSource')).toEqual(
      'chrome'
    )
    wrapper.setProps({
      ...mockProps,
      location: {
        ...mockProps.location,
        search: '?q=hello&src=ff',
      },
    })
    expect(wrapper.find(SearchResultsQueryBing).prop('searchSource')).toEqual(
      'ff'
    )
  })

  // This is important for prerendering scripts for search results.
  it('[bing] renders the SearchResultsQueryBing component on mount even if there is no query', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = ''
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(SearchResultsQueryBing).exists()).toBe(true)
    expect(wrapper.find(SearchResultsQueryBing).prop('query')).toEqual('')
  })

  it('[bing] wraps the SearchResultsQueryBing component in an error boundary', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=big%20bad%20wolf'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(SearchResults).exists()).toBe(false) // not using Yahoo
    expect(wrapper.find(SearchResultsQueryBing).exists()).toBe(true) // using Bing
  })

  it('[yahoo] uses Yahoo by default if the searchProvider prop is undefined', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.searchProvider = undefined
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(SearchResults).exists()).toBe(true) // using Yahoo
    expect(wrapper.find(SearchResultsQueryBing).exists()).toBe(false) // not using Bing
  })

  it('[yahoo] passes the decoded query to the SearchResults component', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=foo&another=thing'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
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
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(SearchResults).prop('page')).toBe(12)
  })

  it('[yahoo] passes "1" as the default page number to the SearchResults component when the "page" URL param is not set', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=foo'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(SearchResults).prop('page')).toBe(1)
  })

  it('[yahoo] passes the search source to the SearchResults component when the "page" URL param is set', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=foo&src=some-source'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(SearchResults).prop('searchSource')).toEqual(
      'some-source'
    )
  })

  it('[yahoo] passes null as the search source to the SearchResults component when the "src" URL param is not set', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=foo'
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(SearchResults).prop('searchSource')).toBeNull()
  })

  // This is important for prerendering scripts for search results.
  it('[yahoo] renders the SearchResults component on mount even if there is no query', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    mockProps.location.search = ''
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    expect(wrapper.find(SearchResults).exists()).toBe(true)
    expect(wrapper.find(SearchResults).prop('query')).toEqual('')
  })

  it('[yahoo] passes "isAdBlockerEnabled = false" to the SearchResults component', async () => {
    expect.assertions(1)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    detectAdblocker.mockResolvedValue(false)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    expect(wrapper.find(SearchResults).prop('isAdBlockerEnabled')).toBe(false)
  })

  it('[yahoo] passes "isAdBlockerEnabled = true" to the SearchResults component', async () => {
    expect.assertions(1)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent')
      .default
    const mockProps = getMockProps()
    detectAdblocker.mockResolvedValue(true)
    const wrapper = shallow(<SearchPageComponent {...mockProps} />)
      .dive()
      .dive()
    await flushAllPromises()
    expect(wrapper.find(SearchResults).prop('isAdBlockerEnabled')).toBe(true)
  })
})

describe('withUser HOC in SearchPageComponent', () => {
  beforeAll(() => {
    jest.mock('js/components/Search/SearchMenuQuery')
  })

  beforeEach(() => {
    jest.resetModules()
  })

  it('is called with the expected options', () => {
    const withUser = require('js/components/General/withUser').default

    /* eslint-disable-next-line no-unused-expressions */
    require('js/components/Search/SearchPageComponent').default
    expect(withUser).toHaveBeenCalledWith({
      app: 'search',
      createUserIfPossible: false,
      redirectToAuthIfIncomplete: true,
      renderIfNoUser: true,
      renderWhileDeterminingAuthState: true,
      setNullUserWhenPrerendering: true,
    })
  })

  it('wraps the SearchSettingsPage component', () => {
    const {
      __mockWithUserWrappedFunction,
    } = require('js/components/General/withUser')

    /* eslint-disable-next-line no-unused-expressions */
    require('js/components/Search/SearchPageComponent').default
    const wrappedComponent = __mockWithUserWrappedFunction.mock.calls[0][0]
    expect(wrappedComponent.name).toEqual('SearchPage')
  })
})
