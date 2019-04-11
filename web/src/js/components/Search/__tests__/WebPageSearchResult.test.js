/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import {
  getMockBingWebPageResult,
  getMockBingWebPageDeepLinkObject,
} from 'js/utils/test-utils-search'

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
    shallow(<WebPageSearchResult {...mockProps} />).dive()
  })

  it('returns null if the displayUrl is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    delete mockProps.item.displayUrl
    const wrapper = shallow(<WebPageSearchResult {...mockProps} />).dive()
    expect(wrapper.html()).toBeNull()
  })

  it('returns null if the name is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    delete mockProps.item.name
    const wrapper = shallow(<WebPageSearchResult {...mockProps} />).dive()
    expect(wrapper.html()).toBeNull()
  })

  it('returns null if the snippet is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    delete mockProps.item.snippet
    const wrapper = shallow(<WebPageSearchResult {...mockProps} />).dive()
    expect(wrapper.html()).toBeNull()
  })

  it('returns null if the url is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    delete mockProps.item.url
    const wrapper = shallow(<WebPageSearchResult {...mockProps} />).dive()
    expect(wrapper.html()).toBeNull()
  })

  it('displays the title in h3', () => {
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.name = 'Big Bad Wolf'
    const wrapper = shallow(<WebPageSearchResult {...mockProps} />).dive()
    expect(
      wrapper
        .find('h3')
        .first()
        .text()
    ).toEqual('Big Bad Wolf')
  })

  it('creates an anchor tag as the parent of the title, with a link to the URL', () => {
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.url = 'https://example.com/foo/bar/'
    const wrapper = shallow(<WebPageSearchResult {...mockProps} />).dive()
    const title = wrapper.find('h3').first()
    expect(title.parent().type()).toEqual('a')
    expect(title.parent().prop('href')).toEqual('https://example.com/foo/bar/')
  })

  it('displays the page URL', () => {
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.displayUrl = 'https://some.example.com'
    const wrapper = shallow(<WebPageSearchResult {...mockProps} />).dive()
    expect(
      wrapper
        .find('[data-test-id="search-result-webpage-url"]')
        .first()
        .text()
    ).toEqual('https://some.example.com')
  })

  it('displays the page snippet', () => {
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.snippet =
      'A wolf dresses up like a grandma in this thrilling tale.'
    const wrapper = shallow(<WebPageSearchResult {...mockProps} />).dive()
    expect(
      wrapper
        .find('[data-test-id="search-result-webpage-snippet"]')
        .first()
        .text()
    ).toEqual(mockProps.item.snippet)
  })

  it('creates no DeepLink elements when there are no deep links', () => {
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const { DeepLink } = require('js/components/Search/WebPageSearchResult')
    const mockProps = getMockProps()
    mockProps.item.deepLinks = []
    const wrapper = shallow(<WebPageSearchResult {...mockProps} />).dive()
    expect(wrapper.find(DeepLink).exists()).toBe(false)
  })

  it('creates DeepLink elements when the deep links exist', () => {
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const { DeepLink } = require('js/components/Search/WebPageSearchResult')
    const mockProps = getMockProps()
    mockProps.item.deepLinks = [
      getMockBingWebPageDeepLinkObject(),
      getMockBingWebPageDeepLinkObject(),
      getMockBingWebPageDeepLinkObject(),
    ]
    const wrapper = shallow(<WebPageSearchResult {...mockProps} />).dive()
    expect(wrapper.find(DeepLink).exists()).toBe(true)
    expect(wrapper.find(DeepLink).length).toEqual(3)
  })

  it('[deep link] dislays the expected deep link title', () => {
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.deepLinks = [
      getMockBingWebPageDeepLinkObject({
        name: 'I am a deep link!',
      }),
    ]
    const wrapper = mount(<WebPageSearchResult {...mockProps} />)
    const deepLinkContainer = wrapper.find(
      '[data-test-id="search-result-webpage-deep-link-container"]'
    )
    expect(
      deepLinkContainer
        .find('h3')
        .first()
        .text()
    ).toEqual('I am a deep link!')
  })

  it('[deep link] truncates the deep link title if it is long', () => {
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.deepLinks = [
      getMockBingWebPageDeepLinkObject({
        name:
          'I am a deep link title, but I am a bit too long for this world :(',
      }),
    ]
    const wrapper = mount(<WebPageSearchResult {...mockProps} />)
    const deepLinkContainer = wrapper.find(
      '[data-test-id="search-result-webpage-deep-link-container"]'
    )
    expect(
      deepLinkContainer
        .find('h3')
        .first()
        .text()
    ).toEqual('I am a deep link title, but  ...')
  })

  it('[deep link] creates an anchor tag as the parent of the title, with a link to the URL', () => {
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.deepLinks = [
      getMockBingWebPageDeepLinkObject({
        url: 'https://example.com/deep-linky/',
      }),
    ]
    const wrapper = mount(<WebPageSearchResult {...mockProps} />)
    const deepLinkContainer = wrapper.find(
      '[data-test-id="search-result-webpage-deep-link-container"]'
    )
    expect(
      deepLinkContainer
        .find('h3')
        .first()
        .parent()
        .type()
    ).toEqual('a')
    expect(
      deepLinkContainer
        .find('h3')
        .first()
        .parent()
        .prop('href')
    ).toEqual('https://example.com/deep-linky/')
  })

  it('[deep link] dislays the snippet', () => {
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.deepLinks = [
      getMockBingWebPageDeepLinkObject({
        snippet: 'I am a deep link snippet.',
      }),
    ]
    const wrapper = mount(<WebPageSearchResult {...mockProps} />)
    const deepLinkContainer = wrapper.find(
      '[data-test-id="search-result-webpage-deep-link-container"]'
    )
    expect(
      deepLinkContainer
        .find('div')
        .findWhere(elem => elem.text() === 'I am a deep link snippet.')
        .exists()
    ).toBe(true)
  })

  it('[deep link] truncates the snippet if it is long', () => {
    const WebPageSearchResult = require('js/components/Search/WebPageSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.deepLinks = [
      getMockBingWebPageDeepLinkObject({
        snippet:
          'I am a deep link snippet. However, I am quite long, which means they will cut me off with some ellipses, I know it!',
      }),
    ]
    const wrapper = mount(<WebPageSearchResult {...mockProps} />)
    const deepLinkContainer = wrapper.find(
      '[data-test-id="search-result-webpage-deep-link-container"]'
    )
    expect(
      deepLinkContainer
        .find('div')
        .at(2)
        .text()
    ).toEqual(
      'I am a deep link snippet. However, I am quite long, which means they will cu ...'
    )
  })
})
