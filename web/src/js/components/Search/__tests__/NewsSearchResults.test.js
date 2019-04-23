/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { getMockBingNewsArticleResult } from 'js/utils/test-utils-search'
import Typography from '@material-ui/core/Typography'

const getMockProps = () => ({
  newsItems: [getMockBingNewsArticleResult(), getMockBingNewsArticleResult()],
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
