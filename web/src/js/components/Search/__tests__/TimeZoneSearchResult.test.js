/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { getMockBingTimeZoneResult } from 'js/utils/test-utils-search'
import Typography from '@material-ui/core/Typography'

const getMockProps = () => ({
  item: getMockBingTimeZoneResult(),
})

describe('TimeZoneSearchResult', () => {
  it('renders without error', () => {
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const mockProps = getMockProps()
    shallow(<TimeZoneSearchResult {...mockProps} />).dive()
  })

  it('returns null if the "primaryCityTime.location" value is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const mockProps = getMockProps()
    delete mockProps.item.primaryCityTime.location
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />).dive()
    expect(wrapper.html()).toBeNull()
  })

  it('returns null if the "primaryCityTime.time" value is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const mockProps = getMockProps()
    delete mockProps.item.primaryCityTime.time
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />).dive()
    expect(wrapper.html()).toBeNull()
  })

  it('returns null if the "primaryCityTime.utcOffset" value is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const mockProps = getMockProps()
    delete mockProps.item.primaryCityTime.utcOffset
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />).dive()
    expect(wrapper.html()).toBeNull()
  })

  it('formats the time value as expected', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.primaryCityTime.time = '2015-10-23T15:27:59.8892745Z'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />).dive()
    const elem = wrapper
      .find('[data-test-id="search-result-time-zone-time"]')
      .first()
    expect(elem.render().text()).toEqual('8:27 AM')
  })

  it('displays the time value in the expected Typography component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.primaryCityTime.time = '2015-10-23T15:27:59.8892745Z'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />).dive()
    const elem = wrapper
      .find('[data-test-id="search-result-time-zone-time"]')
      .first()
    expect(elem.type()).toEqual(Typography)
    expect(elem.prop('variant')).toEqual('h4')
  })

  it('formats the date as expected', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.primaryCityTime.time = '2015-10-23T15:27:59.8892745Z'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />).dive()
    const elem = wrapper
      .find('[data-test-id="search-result-time-zone-date"]')
      .first()
    expect(elem.render().text()).toEqual('Monday, June 24, 2019')
  })

  it('displays the date in the expected Typography component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.primaryCityTime.time = '2015-10-23T15:27:59.8892745Z'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />).dive()
    const elem = wrapper
      .find('[data-test-id="search-result-time-zone-date"]')
      .first()
    expect(elem.type()).toEqual(Typography)
    expect(elem.prop('variant')).toEqual('body2')
  })

  it('formats the location text as expected', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.primaryCityTime.location = 'Washington, D.C., United States'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />).dive()
    const elem = wrapper
      .find('[data-test-id="search-result-time-zone-location"]')
      .first()
    expect(elem.render().text()).toEqual(
      'Time in Washington, D.C., United States (UTC-4)'
    )
  })

  it('displays the location text in the expected Typography component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const mockProps = getMockProps()
    mockProps.item.primaryCityTime.location = 'Washington, D.C., United States'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />).dive()
    const elem = wrapper
      .find('[data-test-id="search-result-time-zone-location"]')
      .first()
    expect(elem.type()).toEqual(Typography)
    expect(elem.prop('variant')).toEqual('body2')
  })
})
