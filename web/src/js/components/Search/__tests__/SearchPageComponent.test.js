/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import toJson from 'enzyme-to-json'
import { isSearchPageEnabled } from 'js/utils/feature-flags'
import {
  goTo,
  dashboardURL
} from 'js/navigation/navigation'

jest.mock('js/utils/feature-flags')
jest.mock('js/navigation/navigation')

const getMockProps = () => ({
  user: {
    id: 'some-user-id-here'
  },
  app: {}
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
})
