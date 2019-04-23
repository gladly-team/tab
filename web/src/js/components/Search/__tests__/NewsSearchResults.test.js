/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { getMockBingNewsArticleResult } from 'js/utils/test-utils-search'
import Typography from '@material-ui/core/Typography'

const getMockProps = () => ({
  newsItems: [getMockBingNewsArticleResult(), getMockBingNewsArticleResult()],
})

const getMockNewsStoryProps = () => ({
  classes: {},
  item: getMockBingNewsArticleResult(),
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('NewsSearchResults', () => {
  it('renders without error', () => {
    const NewsSearchResults = require('js/components/Search/NewsSearchResults')
      .default
    const mockProps = getMockProps()
    shallow(<NewsSearchResults {...mockProps} />).dive()
  })

  it('shows the "Top stories" label', () => {
    const NewsSearchResults = require('js/components/Search/NewsSearchResults')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<NewsSearchResults {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('Top stories')
  })

  it('only renders one news story if only one is provided', () => {
    const NewsSearchResults = require('js/components/Search/NewsSearchResults')
      .default
    const { NewsSearchItem } = require('js/components/Search/NewsSearchResults')
    const mockProps = getMockProps()
    mockProps.newsItems = [getMockBingNewsArticleResult()]
    const wrapper = shallow(<NewsSearchResults {...mockProps} />).dive()
    expect(wrapper.find(NewsSearchItem).length).toEqual(1)
  })

  it('renders three news story if three are provided', () => {
    const NewsSearchResults = require('js/components/Search/NewsSearchResults')
      .default
    const { NewsSearchItem } = require('js/components/Search/NewsSearchResults')
    const mockProps = getMockProps()
    mockProps.newsItems = [
      getMockBingNewsArticleResult(),
      getMockBingNewsArticleResult(),
      getMockBingNewsArticleResult(),
    ]
    const wrapper = shallow(<NewsSearchResults {...mockProps} />).dive()
    expect(wrapper.find(NewsSearchItem).length).toEqual(3)
  })

  it('renders only three news story even if  more are provided', () => {
    const NewsSearchResults = require('js/components/Search/NewsSearchResults')
      .default
    const { NewsSearchItem } = require('js/components/Search/NewsSearchResults')
    const mockProps = getMockProps()
    mockProps.newsItems = [
      getMockBingNewsArticleResult(),
      getMockBingNewsArticleResult(),
      getMockBingNewsArticleResult(),
      getMockBingNewsArticleResult(),
      getMockBingNewsArticleResult(),
    ]
    const wrapper = shallow(<NewsSearchResults {...mockProps} />).dive()
    expect(wrapper.find(NewsSearchItem).length).toEqual(3)
  })

  it('passes the expected props to the news story components', () => {
    const NewsSearchResults = require('js/components/Search/NewsSearchResults')
      .default
    const { NewsSearchItem } = require('js/components/Search/NewsSearchResults')
    const mockProps = getMockProps()
    mockProps.newsItems = [
      getMockBingNewsArticleResult({
        url: 'https://example.com/just-a-fake-url/',
      }),
      getMockBingNewsArticleResult({
        url: 'https://example.com/another-url/',
      }),
    ]
    const wrapper = shallow(<NewsSearchResults {...mockProps} />).dive()

    const firstNewsStory = wrapper.find(NewsSearchItem).first()
    expect(firstNewsStory.key()).toEqual('https://example.com/just-a-fake-url/')
    expect(firstNewsStory.prop('classes')).toEqual(expect.any(Object))
    expect(firstNewsStory.prop('item')).toEqual(mockProps.newsItems[0])

    const secondNewsStory = wrapper.find(NewsSearchItem).at(1)
    expect(secondNewsStory.key()).toEqual('https://example.com/another-url/')
    expect(secondNewsStory.prop('classes')).toEqual(expect.any(Object))
    expect(secondNewsStory.prop('item')).toEqual(mockProps.newsItems[1])
  })
})

describe('NewsSearchItem', () => {
  it('displays the title text', () => {
    const { NewsSearchItem } = require('js/components/Search/NewsSearchResults')
    const mockProps = getMockNewsStoryProps()
    mockProps.item.name = 'This is A Nice Title'
    const wrapper = shallow(<NewsSearchItem {...mockProps} />).dive()
    const titleElem = wrapper.find('[data-test-id="search-result-news-title"]')
    expect(titleElem.text()).toEqual('This is A Nice Title')
    expect(titleElem.type()).toEqual('h3')
  })

  it('puts the title text in an anchor tag', () => {
    const { NewsSearchItem } = require('js/components/Search/NewsSearchResults')
    const mockProps = getMockNewsStoryProps()
    mockProps.item.name = 'This is A Nice Title'
    mockProps.item.url = 'https://example.com/foobar/'
    const wrapper = shallow(<NewsSearchItem {...mockProps} />).dive()
    const titleElem = wrapper.find('[data-test-id="search-result-news-title"]')
    expect(titleElem.parent().type()).toEqual('a')
    expect(titleElem.parent().prop('href')).toEqual(
      'https://example.com/foobar/'
    )
  })

  it('displays the title text', () => {
    const { NewsSearchItem } = require('js/components/Search/NewsSearchResults')
    const mockProps = getMockNewsStoryProps()
    mockProps.item.name = 'This is A Nice Title'
    const wrapper = shallow(<NewsSearchItem {...mockProps} />).dive()
    const titleElem = wrapper.find('[data-test-id="search-result-news-title"]')
    expect(titleElem.text()).toEqual('This is A Nice Title')
    expect(titleElem.type()).toEqual('h3')
  })

  it('crops the title text if it is too long', () => {
    const { NewsSearchItem } = require('js/components/Search/NewsSearchResults')
    const mockProps = getMockNewsStoryProps()
    mockProps.item.name =
      'This is A Nice Title, But It is a Bit Wordy, Would You Not Agree? Especially This Last Part.'
    const wrapper = shallow(<NewsSearchItem {...mockProps} />).dive()
    const titleElem = wrapper.find('[data-test-id="search-result-news-title"]')
    expect(titleElem.text()).toEqual(
      'This is A Nice Title, But It is a Bit Wordy, Would You Not Agree? Especially ...'
    )
    expect(titleElem.type()).toEqual('h3')
  })

  it('displays the image content when an image exists', () => {
    const { NewsSearchItem } = require('js/components/Search/NewsSearchResults')
    const mockProps = getMockNewsStoryProps()
    mockProps.item.image = {
      contentUrl: 'https://media.example.com/foo.png',
      thumbnail: {
        contentUrl: 'https://www.bing.com/some-url/',
        width: 700,
        height: 466,
      },
    }
    const wrapper = shallow(<NewsSearchItem {...mockProps} />).dive()
    const elem = wrapper.find(
      '[data-test-id="search-result-news-img-container"]'
    )
    expect(elem.exists()).toBe(true)
  })

  it('does not display the image content when an image does not exist', () => {
    const { NewsSearchItem } = require('js/components/Search/NewsSearchResults')
    const mockProps = getMockNewsStoryProps()
    mockProps.item.image = undefined
    const wrapper = shallow(<NewsSearchItem {...mockProps} />).dive()
    const elem = wrapper.find(
      '[data-test-id="search-result-news-img-container"]'
    )
    expect(elem.exists()).toBe(false)
  })

  it('displays the image in an anchor tag', () => {
    const { NewsSearchItem } = require('js/components/Search/NewsSearchResults')
    const mockProps = getMockNewsStoryProps()
    mockProps.item.image = {
      contentUrl: 'https://media.example.com/foo.png',
      thumbnail: {
        contentUrl: 'https://www.bing.com/some-url/',
        width: 700,
        height: 466,
      },
    }
    mockProps.item.url = 'https://example.com/foobar/'
    const wrapper = shallow(<NewsSearchItem {...mockProps} />).dive()
    const elem = wrapper.find(
      '[data-test-id="search-result-news-img-container"]'
    )
    expect(elem.type()).toEqual('a')
    expect(elem.prop('href')).toEqual('https://example.com/foobar/')
  })

  it('displays the expected img element', () => {
    const { NewsSearchItem } = require('js/components/Search/NewsSearchResults')
    const mockProps = getMockNewsStoryProps()
    mockProps.item.image = {
      contentUrl: 'https://media.example.com/foo.png',
      thumbnail: {
        contentUrl: 'https://www.bing.com/some-url/',
        width: 700,
        height: 466,
      },
    }
    const wrapper = shallow(<NewsSearchItem {...mockProps} />).dive()
    const elem = wrapper.find(
      '[data-test-id="search-result-news-img-container"]'
    )
    const imgElem = elem.find('img').first()
    expect(imgElem.prop('src')).toEqual(
      'https://www.bing.com/some-url/?w=200&h=100&c=7'
    )
    expect(imgElem.prop('alt')).toEqual('')
  })
})
