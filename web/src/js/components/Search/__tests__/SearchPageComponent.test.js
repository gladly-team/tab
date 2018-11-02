/* eslint-env jest */

import React from 'react'
import {
  mount,
  shallow
} from 'enzyme'
import toJson from 'enzyme-to-json'
import Input from '@material-ui/core/Input'
import SearchIcon from '@material-ui/icons/Search'
import { isSearchPageEnabled } from 'js/utils/feature-flags'
import {
  goTo,
  dashboardURL,
  modifyURLParams
} from 'js/navigation/navigation'
import SearchResults from 'js/components/Search/SearchResults'

jest.mock('js/utils/feature-flags')
jest.mock('js/navigation/navigation')
jest.mock('js/components/Search/SearchResults')

const getMockProps = () => ({
  user: {
    id: 'some-user-id-here'
  },
  app: {},
  location: {
    search: ''
  }
})

beforeEach(() => {
  isSearchPageEnabled.mockReturnValue(true)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('Search page component', () => {
  it('renders without error', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent').default
    const mockProps = getMockProps()
    shallow(
      <SearchPageComponent {...mockProps} />
    ).dive()
  })

  it('renders no DOM elements when the search page feature is not enabled', () => {
    isSearchPageEnabled.mockReturnValue(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent').default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <SearchPageComponent {...mockProps} />
    ).dive()
    expect(toJson(wrapper)).toEqual('')
  })

  it('redirects to the dashboard when the search page feature is not enabled', () => {
    isSearchPageEnabled.mockReturnValue(false)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent').default
    const mockProps = getMockProps()
    shallow(
      <SearchPageComponent {...mockProps} />
    ).dive()
    expect(goTo).toHaveBeenCalledWith(dashboardURL)
  })

  it('renders DOM elements when the search page feature is enabled', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent').default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <SearchPageComponent {...mockProps} />
    ).dive()
    expect(toJson(wrapper)).not.toEqual('')
  })

  it('does not redirect to the dashboard when the search page feature is enabled', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent').default
    const mockProps = getMockProps()
    shallow(
      <SearchPageComponent {...mockProps} />
    ).dive()
    expect(goTo).not.toHaveBeenCalled()
  })

  it('shows the search text in the box when loading a previous search', () => {
    isSearchPageEnabled.mockReturnValue(true)
    const SearchPageComponent = require('js/components/Search/SearchPageComponent').default
    const mockProps = getMockProps()
    mockProps.location.search = '?q=blahblah'
    const wrapper = shallow(
      <SearchPageComponent {...mockProps} />
    ).dive()
    expect(wrapper.find(Input).prop('defaultValue')).toBe('blahblah')
  })

  it('clicking the search button updates the "q" URL parameter', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent').default
    const mockProps = getMockProps()
    mockProps.location.search = ''
    const wrapper = mount(
      <SearchPageComponent {...mockProps} />
    )
    const searchInput = wrapper.find(Input).first().find('input')

    // https://github.com/airbnb/enzyme/issues/76#issuecomment-189606849
    searchInput.simulate('change', { target: { value: 'free ice cream' } })

    wrapper.find(SearchIcon).simulate('click')
    expect(modifyURLParams).toHaveBeenCalledWith({
      q: 'free ice cream'
    })
  })

  it('hitting enter in the search input updates the "q" URL parameter', () => {
    const SearchPageComponent = require('js/components/Search/SearchPageComponent').default
    const mockProps = getMockProps()
    mockProps.location.search = ''
    const wrapper = mount(
      <SearchPageComponent {...mockProps} />
    )
    const searchInput = wrapper.find(Input).first().find('input')
    searchInput
      .simulate('change', { target: { value: 'register to vote' } })
      .simulate('keypress', { key: 'Enter' })
    expect(modifyURLParams).toHaveBeenCalledWith({
      q: 'register to vote'
    })
  })
})
