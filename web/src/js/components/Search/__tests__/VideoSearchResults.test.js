/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'
import MockDate from 'mockdate'
import {
  getMockBingVideosResult,
  getMockBingVideoItem,
} from 'js/utils/test-utils-search'
import Typography from '@material-ui/core/Typography'

const getMockProps = () => ({
  videoItems: getMockBingVideosResult().value,
})

const getMockNewsStoryProps = () => ({
  classes: {},
  item: getMockBingVideoItem(),
})

const mockNow = '2017-05-19T13:59:58.000Z'

beforeEach(() => {
  jest.clearAllMocks()
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  MockDate.reset()
})

describe('VideoSearchResults', () => {
  it('renders without error', () => {
    const VideoSearchResults = require('js/components/Search/VideoSearchResults')
      .default
    const mockProps = getMockProps()
    shallow(<VideoSearchResults {...mockProps} />).dive()
  })

  it('shows the "Top stories" label', () => {
    const VideoSearchResults = require('js/components/Search/VideoSearchResults')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<VideoSearchResults {...mockProps} />).dive()
    expect(
      wrapper
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('Videos')
  })

  it('only renders one video if only one is provided', () => {
    const VideoSearchResults = require('js/components/Search/VideoSearchResults')
      .default
    const {
      VideoSearchItem,
    } = require('js/components/Search/VideoSearchResults')
    const mockProps = getMockProps()
    mockProps.videoItems = [getMockBingVideoItem()]
    const wrapper = shallow(<VideoSearchResults {...mockProps} />).dive()
    expect(wrapper.find(VideoSearchItem).length).toEqual(1)
  })

  it('renders three videos if three are provided', () => {
    const VideoSearchResults = require('js/components/Search/VideoSearchResults')
      .default
    const {
      VideoSearchItem,
    } = require('js/components/Search/VideoSearchResults')
    const mockProps = getMockProps()
    mockProps.videoItems = [
      getMockBingVideoItem(),
      getMockBingVideoItem(),
      getMockBingVideoItem(),
    ]
    const wrapper = shallow(<VideoSearchResults {...mockProps} />).dive()
    expect(wrapper.find(VideoSearchItem).length).toEqual(3)
  })

  it('renders only three videos even if  more are provided', () => {
    const VideoSearchResults = require('js/components/Search/VideoSearchResults')
      .default
    const {
      VideoSearchItem,
    } = require('js/components/Search/VideoSearchResults')
    const mockProps = getMockProps()
    mockProps.videoItems = [
      getMockBingVideoItem(),
      getMockBingVideoItem(),
      getMockBingVideoItem(),
      getMockBingVideoItem(),
      getMockBingVideoItem(),
    ]
    const wrapper = shallow(<VideoSearchResults {...mockProps} />).dive()
    expect(wrapper.find(VideoSearchItem).length).toEqual(3)
  })

  it('passes the expected props to the videos components', () => {
    const VideoSearchResults = require('js/components/Search/VideoSearchResults')
      .default
    const {
      VideoSearchItem,
    } = require('js/components/Search/VideoSearchResults')
    const mockProps = getMockProps()
    mockProps.videoItems = [
      getMockBingVideoItem({
        hostPageUrl: 'https://example.com/just-a-fake-url/',
      }),
      getMockBingVideoItem({
        hostPageUrl: 'https://example.com/another-url/',
      }),
    ]
    const wrapper = shallow(<VideoSearchResults {...mockProps} />).dive()

    const firstNewsStory = wrapper.find(VideoSearchItem).first()
    expect(firstNewsStory.key()).toEqual('https://example.com/just-a-fake-url/')
    expect(firstNewsStory.prop('classes')).toEqual(expect.any(Object))
    expect(firstNewsStory.prop('item')).toEqual(mockProps.videoItems[0])

    const secondNewsStory = wrapper.find(VideoSearchItem).at(1)
    expect(secondNewsStory.key()).toEqual('https://example.com/another-url/')
    expect(secondNewsStory.prop('classes')).toEqual(expect.any(Object))
    expect(secondNewsStory.prop('item')).toEqual(mockProps.videoItems[1])
  })
})

describe('VideoSearchItem', () => {
  it('displays the title text', () => {
    const {
      VideoSearchItem,
    } = require('js/components/Search/VideoSearchResults')
    const mockProps = getMockNewsStoryProps()
    mockProps.item.name = 'This is A Nice Title'
    const wrapper = shallow(<VideoSearchItem {...mockProps} />).dive()
    const titleElem = wrapper.find('[data-test-id="search-result-video-title"]')
    expect(titleElem.text()).toEqual('This is A Nice Title')
    expect(titleElem.type()).toEqual('h3')
  })

  it('puts the title text in an anchor tag', () => {
    const {
      VideoSearchItem,
    } = require('js/components/Search/VideoSearchResults')
    const mockProps = getMockNewsStoryProps()
    mockProps.item.name = 'This is A Nice Title'
    mockProps.item.hostPageUrl = 'https://example.com/foobar/'
    const wrapper = shallow(<VideoSearchItem {...mockProps} />).dive()
    const titleElem = wrapper.find('[data-test-id="search-result-video-title"]')
    expect(titleElem.parent().type()).toEqual('a')
    expect(titleElem.parent().prop('href')).toEqual(
      'https://example.com/foobar/'
    )
  })

  it('crops the title text if it is too long', () => {
    const {
      VideoSearchItem,
    } = require('js/components/Search/VideoSearchResults')
    const mockProps = getMockNewsStoryProps()
    mockProps.item.name =
      'This is A Nice Title, But It is a Bit Wordy, Would You Not Agree? Especially This Last Part.'
    const wrapper = shallow(<VideoSearchItem {...mockProps} />).dive()
    const titleElem = wrapper.find('[data-test-id="search-result-video-title"]')
    expect(titleElem.text()).toEqual(
      'This is A Nice Title, But It is a Bit Wordy, Would You Not Agree? Especially ...'
    )
    expect(titleElem.type()).toEqual('h3')
  })

  it('displays the image content when an image exists', () => {
    const {
      VideoSearchItem,
    } = require('js/components/Search/VideoSearchResults')
    const mockProps = getMockNewsStoryProps()
    mockProps.item.image = {
      contentUrl: 'https://media.example.com/foo.png',
      thumbnail: {
        contentUrl: 'https://www.bing.com/some-url/',
        width: 700,
        height: 466,
      },
    }
    const wrapper = shallow(<VideoSearchItem {...mockProps} />).dive()
    const elem = wrapper.find(
      '[data-test-id="search-result-video-img-container"]'
    )
    expect(elem.exists()).toBe(true)
  })

  it('does not display the image content when an image does not exist', () => {
    const {
      VideoSearchItem,
    } = require('js/components/Search/VideoSearchResults')
    const mockProps = getMockNewsStoryProps()
    mockProps.item.thumbnailUrl = undefined
    const wrapper = shallow(<VideoSearchItem {...mockProps} />).dive()
    const elem = wrapper.find(
      '[data-test-id="search-result-video-img-container"]'
    )
    expect(elem.exists()).toBe(false)
  })

  it('displays the image in an anchor tag', () => {
    const {
      VideoSearchItem,
    } = require('js/components/Search/VideoSearchResults')
    const mockProps = getMockNewsStoryProps()
    mockProps.item.thumbnailUrl = 'https://www.bing.com/some-url/'
    mockProps.item.hostPageUrl = 'https://example.com/foobar/'
    const wrapper = shallow(<VideoSearchItem {...mockProps} />).dive()
    const elem = wrapper.find(
      '[data-test-id="search-result-video-img-container"]'
    )
    expect(elem.type()).toEqual('a')
    expect(elem.prop('href')).toEqual('https://example.com/foobar/')
  })

  it('displays the expected img element', () => {
    const {
      VideoSearchItem,
    } = require('js/components/Search/VideoSearchResults')
    const mockProps = getMockNewsStoryProps()
    mockProps.item.thumbnailUrl = 'https://www.bing.com/some-url/'
    const wrapper = shallow(<VideoSearchItem {...mockProps} />).dive()
    const elem = wrapper.find(
      '[data-test-id="search-result-video-img-container"]'
    )
    const imgElem = elem.find('img').first()
    expect(imgElem.prop('src')).toEqual(
      'https://www.bing.com/some-url/?w=200&h=100&c=7'
    )
    expect(imgElem.prop('alt')).toEqual('')
  })

  it('displays the first publisher name if one exists', () => {
    const {
      VideoSearchItem,
    } = require('js/components/Search/VideoSearchResults')
    const mockProps = getMockNewsStoryProps()
    mockProps.item.publisher = [
      {
        name: 'The YouTubes',
      },
    ]
    const wrapper = shallow(<VideoSearchItem {...mockProps} />).dive()
    const attributionElems = wrapper.find(
      '[data-test-id="search-result-video-attribution"]'
    )
    expect(attributionElems.exists()).toBe(true)
    expect(attributionElems.first().text()).toEqual('The YouTubes')
  })

  it('does not display the publisher name if none exists', () => {
    const {
      VideoSearchItem,
    } = require('js/components/Search/VideoSearchResults')
    const mockProps = getMockNewsStoryProps()
    mockProps.item.publisher = undefined
    const wrapper = shallow(<VideoSearchItem {...mockProps} />).dive()
    const attributionElems = wrapper.find(
      '[data-test-id="search-result-video-attribution"]'
    )
    expect(attributionElems.exists()).toBe(false)
  })

  // it('displays the "time since published" text if a date is provided', () => {
  //   const {
  //     VideoSearchItem,
  //   } = require('js/components/Search/VideoSearchResults')
  //   const mockProps = getMockNewsStoryProps()
  //   mockProps.item.datePublished = moment(
  //     '2017-05-19T11:30:00.000Z'
  //   ).toISOString()
  //   const wrapper = shallow(<VideoSearchItem {...mockProps} />).dive()
  //   const elem = wrapper.find('[data-test-id="search-result-video-time-since"]')
  //   expect(elem.exists()).toBe(true)
  // })

  // it('does not display the "time since published" text if no date is provided', () => {
  //   const {
  //     VideoSearchItem,
  //   } = require('js/components/Search/VideoSearchResults')
  //   const mockProps = getMockNewsStoryProps()
  //   mockProps.item.datePublished = undefined
  //   const wrapper = shallow(<VideoSearchItem {...mockProps} />).dive()
  //   const elem = wrapper.find('[data-test-id="search-result-video-time-since"]')
  //   expect(elem.exists()).toBe(false)
  // })

  // it('shows a seconds abbreviation in the "time since published" text if published a few seconds ago', () => {
  //   const {
  //     VideoSearchItem,
  //   } = require('js/components/Search/VideoSearchResults')
  //   const mockProps = getMockNewsStoryProps()
  //   mockProps.item.datePublished = moment(
  //     '2017-05-19T13:59:56.412Z'
  //   ).toISOString()
  //   const wrapper = shallow(<VideoSearchItem {...mockProps} />).dive()
  //   const elem = wrapper.find('[data-test-id="search-result-video-time-since"]')
  //   expect(elem.text()).toEqual(' · 2s')
  // })

  // it('shows a seconds abbreviation in the "time since published" text if published 40 seconds ago', () => {
  //   const {
  //     VideoSearchItem,
  //   } = require('js/components/Search/VideoSearchResults')
  //   const mockProps = getMockNewsStoryProps()
  //   mockProps.item.datePublished = moment(
  //     '2017-05-19T13:59:18.412Z'
  //   ).toISOString()
  //   const wrapper = shallow(<VideoSearchItem {...mockProps} />).dive()
  //   const elem = wrapper.find('[data-test-id="search-result-video-time-since"]')
  //   expect(elem.text()).toEqual(' · 40s')
  // })

  // it('shows a minute abbreviation in the "time since published" text if published almost 1 minute ago', () => {
  //   const {
  //     VideoSearchItem,
  //   } = require('js/components/Search/VideoSearchResults')
  //   const mockProps = getMockNewsStoryProps()
  //   mockProps.item.datePublished = moment(
  //     '2017-05-19T13:59:02.412Z'
  //   ).toISOString()
  //   const wrapper = shallow(<VideoSearchItem {...mockProps} />).dive()
  //   const elem = wrapper.find('[data-test-id="search-result-video-time-since"]')
  //   expect(elem.text()).toEqual(' · 1m')
  // })

  // it('shows a minute abbreviation in the "time since published" text if published ~30 minutes ago', () => {
  //   const {
  //     VideoSearchItem,
  //   } = require('js/components/Search/VideoSearchResults')
  //   const mockProps = getMockNewsStoryProps()
  //   mockProps.item.datePublished = moment(
  //     '2017-05-19T13:29:30.000Z'
  //   ).toISOString()
  //   const wrapper = shallow(<VideoSearchItem {...mockProps} />).dive()
  //   const elem = wrapper.find('[data-test-id="search-result-video-time-since"]')
  //   expect(elem.text()).toEqual(' · 30m')
  // })

  // it('shows an hour abbreviation in the "time since published" text if published ~50 minutes ago', () => {
  //   const {
  //     VideoSearchItem,
  //   } = require('js/components/Search/VideoSearchResults')
  //   const mockProps = getMockNewsStoryProps()
  //   mockProps.item.datePublished = moment(
  //     '2017-05-19T13:08:30.000Z'
  //   ).toISOString()
  //   const wrapper = shallow(<VideoSearchItem {...mockProps} />).dive()
  //   const elem = wrapper.find('[data-test-id="search-result-video-time-since"]')
  //   expect(elem.text()).toEqual(' · 1h')
  // })

  // it('shows an hour abbreviation in the "time since published" text if published ~18 hours ago', () => {
  //   const {
  //     VideoSearchItem,
  //   } = require('js/components/Search/VideoSearchResults')
  //   const mockProps = getMockNewsStoryProps()
  //   mockProps.item.datePublished = moment(
  //     '2017-05-18T19:59:41.000Z'
  //   ).toISOString()
  //   const wrapper = shallow(<VideoSearchItem {...mockProps} />).dive()
  //   const elem = wrapper.find('[data-test-id="search-result-video-time-since"]')
  //   expect(elem.text()).toEqual(' · 18h')
  // })

  // it('shows a days abbreviation in the "time since published" text if published ~2 days ago', () => {
  //   const {
  //     VideoSearchItem,
  //   } = require('js/components/Search/VideoSearchResults')
  //   const mockProps = getMockNewsStoryProps()
  //   mockProps.item.datePublished = moment(
  //     '2017-05-17T19:59:41.000Z'
  //   ).toISOString()
  //   const wrapper = shallow(<VideoSearchItem {...mockProps} />).dive()
  //   const elem = wrapper.find('[data-test-id="search-result-video-time-since"]')
  //   expect(elem.text()).toEqual(' · 2d')
  // })

  // it('shows a months abbreviation in the "time since published" text if published ~40 days ago', () => {
  //   const {
  //     VideoSearchItem,
  //   } = require('js/components/Search/VideoSearchResults')
  //   const mockProps = getMockNewsStoryProps()
  //   mockProps.item.datePublished = moment(
  //     '2017-04-11T19:59:41.000Z'
  //   ).toISOString()
  //   const wrapper = shallow(<VideoSearchItem {...mockProps} />).dive()
  //   const elem = wrapper.find('[data-test-id="search-result-video-time-since"]')
  //   expect(elem.text()).toEqual(' · 1M')
  // })
})
