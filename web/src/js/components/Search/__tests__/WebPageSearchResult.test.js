/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { getMockBingWebPageResult } from 'js/utils/test-utils-search'

// TODO: add tests

const getMockProps = () => ({
  item: getMockBingWebPageResult(),
})

beforeEach(() => {
  jest.clearAllMocks()

  // If we silenced console.error, restore it.
  if (console.error.mockRestore) {
    console.error.mockRestore()
  }
})

describe('WebPageSearchResult', () => {
  it('renders without error', () => {
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    shallow(<WebPageSearchResult {...mockProps} />)
  })

  it('returns null if the displayUrl is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    delete mockProps.item.displayUrl
    const wrapper = shallow(<WebPageSearchResult {...mockProps} />)
    expect(wrapper.html()).toBeNull()
  })

  it('returns null if the name is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    delete mockProps.item.name
    const wrapper = shallow(<WebPageSearchResult {...mockProps} />)
    expect(wrapper.html()).toBeNull()
  })

  it('returns null if the snippet is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    delete mockProps.item.snippet
    const wrapper = shallow(<WebPageSearchResult {...mockProps} />)
    expect(wrapper.html()).toBeNull()
  })

  it('returns null if the url is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    delete mockProps.item.url
    const wrapper = shallow(<WebPageSearchResult {...mockProps} />)
    expect(wrapper.html()).toBeNull()
  })
})
