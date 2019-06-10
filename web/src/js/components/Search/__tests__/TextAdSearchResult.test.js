/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import {
  getMockBingTextAdResult,
  getMockBingTextAdSiteLink,
  getMockBingTextAdSiteLinkExtensionObject,
} from 'js/utils/test-utils-search'

const getMockProps = () => ({
  item: getMockBingTextAdResult(),
})

beforeEach(() => {
  jest.clearAllMocks()

  // If we silenced console.error, restore it.
  if (console.error.mockRestore) {
    console.error.mockRestore()
  }
})

describe('TextAdSearchResult', () => {
  it('renders without error', () => {
    const TextAdSearchResult = require('js/components/Search/TextAdSearchResult')
      .default
    const mockProps = getMockProps()
    shallow(<TextAdSearchResult {...mockProps} />).dive()
  })

  it('returns null if the displayUrl is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TextAdSearchResult = require('js/components/Search/TextAdSearchResult')
      .default
    const mockProps = getMockProps()
    delete mockProps.item.displayUrl
    const wrapper = shallow(<TextAdSearchResult {...mockProps} />).dive()
    expect(wrapper.html()).toBeNull()
  })

  it('returns null if the title is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TextAdSearchResult = require('js/components/Search/TextAdSearchResult')
      .default
    const mockProps = getMockProps()
    delete mockProps.item.title
    const wrapper = shallow(<TextAdSearchResult {...mockProps} />).dive()
    expect(wrapper.html()).toBeNull()
  })

  it('returns null if the url is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TextAdSearchResult = require('js/components/Search/TextAdSearchResult')
      .default
    const mockProps = getMockProps()
    delete mockProps.item.url
    const wrapper = shallow(<TextAdSearchResult {...mockProps} />).dive()
    expect(wrapper.html()).toBeNull()
  })

  it('displays the title in h3', () => {
    const TextAdSearchResult = require('js/components/Search/TextAdSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.title = 'I am an ad ad ad!'
    const wrapper = shallow(<TextAdSearchResult {...mockProps} />).dive()
    expect(
      wrapper
        .find('h3')
        .first()
        .text()
    ).toEqual('I am an ad ad ad!')
  })

  it('creates an anchor tag as the parent of the title, with a link to the URL', () => {
    const TextAdSearchResult = require('js/components/Search/TextAdSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.url = 'https://example.com/foo/bar/'
    const wrapper = shallow(<TextAdSearchResult {...mockProps} />).dive()
    const title = wrapper.find('h3').first()
    expect(title.parent().type()).toEqual('a')
    expect(title.parent().prop('href')).toEqual('https://example.com/foo/bar/')
  })

  it('displays the page URL', () => {
    const TextAdSearchResult = require('js/components/Search/TextAdSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.displayUrl = 'https://some.example.com'
    const wrapper = shallow(<TextAdSearchResult {...mockProps} />).dive()
    expect(
      wrapper
        .find('[data-test-id="search-result-webpage-url"]')
        .first()
        .text()
    ).toEqual('https://some.example.com')
  })

  it('displays the page snippet', () => {
    const TextAdSearchResult = require('js/components/Search/TextAdSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.description =
      'Hoof it to our website to shop dairy good electronics'
    const wrapper = shallow(<TextAdSearchResult {...mockProps} />).dive()
    expect(
      wrapper
        .find('[data-test-id="search-result-webpage-snippet"]')
        .first()
        .text()
    ).toEqual(mockProps.item.description)
  })
})

describe('TextAdSearchResult: site links', () => {
  it('[site link] does not create any site links when there is no site link data', () => {
    const TextAdSearchResult = require('js/components/Search/TextAdSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.extensions = []
    const wrapper = mount(<TextAdSearchResult {...mockProps} />)
    const siteLinkContainer = wrapper.find(
      '[data-test-id="search-result-webpage-deep-link-container"]'
    )
    expect(siteLinkContainer.exists()).toBe(false)
  })

  it('[site link] dislays the expected site link title', () => {
    const TextAdSearchResult = require('js/components/Search/TextAdSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.extensions = [
      getMockBingTextAdSiteLinkExtensionObject({
        sitelinks: [
          getMockBingTextAdSiteLink({
            text: 'I am a site link!',
          }),
        ],
      }),
    ]
    const wrapper = mount(<TextAdSearchResult {...mockProps} />)
    const siteLinkContainer = wrapper.find(
      '[data-test-id="search-result-webpage-deep-link-container"]'
    )
    expect(
      siteLinkContainer
        .find('h3')
        .first()
        .text()
    ).toEqual('I am a site link!')
  })

  it('[site link] creates an anchor tag as the parent of the title, with a link to the URL', () => {
    const TextAdSearchResult = require('js/components/Search/TextAdSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.extensions = [
      getMockBingTextAdSiteLinkExtensionObject({
        sitelinks: [
          getMockBingTextAdSiteLink({
            link: 'https://example.com/site-linky/',
          }),
        ],
      }),
    ]
    const wrapper = mount(<TextAdSearchResult {...mockProps} />)
    const siteLinkContainer = wrapper.find(
      '[data-test-id="search-result-webpage-deep-link-container"]'
    )
    expect(
      siteLinkContainer
        .find('h3')
        .first()
        .parent()
        .type()
    ).toEqual('a')
    expect(
      siteLinkContainer
        .find('h3')
        .first()
        .parent()
        .prop('href')
    ).toEqual('https://example.com/site-linky/')
  })

  it('[site link] dislays the description', () => {
    const TextAdSearchResult = require('js/components/Search/TextAdSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.extensions = [
      getMockBingTextAdSiteLinkExtensionObject({
        sitelinks: [
          getMockBingTextAdSiteLink({
            descriptionLine1: 'I am a site link description.',
            descriptionLine2: 'And I am the second part.',
          }),
        ],
      }),
    ]
    const wrapper = mount(<TextAdSearchResult {...mockProps} />)
    const siteLinkContainer = wrapper.find(
      '[data-test-id="search-result-webpage-deep-link-container"]'
    )
    expect(
      siteLinkContainer
        .find('div')
        .findWhere(elem => {
          return (
            elem.text() ===
            'I am a site link description. And I am the second part.'
          )
        })
        .exists()
    ).toBe(true)
  })
})
