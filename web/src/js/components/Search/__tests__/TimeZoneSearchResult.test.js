/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import {
  getMockBingTimeZoneConversionResult,
  getMockBingTimeZoneInfoMultipleZonesResult,
  getMockBingTimeZoneResult,
  getMockBingTimeZoneTimeBetweenResult,
} from 'js/utils/test-utils-search'

describe('TimeZoneSearchResult: TimeZoneCity', () => {
  const getMockProps = () => ({
    item: getMockBingTimeZoneResult(),
  })

  it('renders without error', () => {
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const mockProps = getMockProps()
    shallow(<TimeZoneSearchResult {...mockProps} />).dive()
  })

  it('returns the TimeZoneCity component type', () => {
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneCity,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />).dive()
    expect(wrapper.type()).toEqual(TimeZoneCity)
  })

  it('returns a Paper component as the root element', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneCity,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneCity)
      .dive()
    expect(wrapper.at(0).type()).toEqual(Paper)
  })

  it('returns null if the "primaryCityTime.location" value is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneCity,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    delete mockProps.item.primaryCityTime.location
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneCity)
      .dive()
    expect(wrapper.html()).toBeNull()
  })

  it('returns null if the "primaryCityTime.time" value is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneCity,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    delete mockProps.item.primaryCityTime.time
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneCity)
      .dive()
    expect(wrapper.html()).toBeNull()
  })

  it('returns null if the "primaryCityTime.utcOffset" value is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneCity,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    delete mockProps.item.primaryCityTime.utcOffset
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneCity)
      .dive()
    expect(wrapper.html()).toBeNull()
  })

  it('formats the time value as expected [test 1]', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneCity,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.primaryCityTime.time = '2015-10-23T15:27:59.8892745Z'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneCity)
      .dive()
    const elem = wrapper
      .find('[data-test-id="search-result-time-zone-time"]')
      .first()
    expect(elem.render().text()).toEqual('3:27 PM')
  })

  it('formats the time value as expected [test 2]', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneCity,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.primaryCityTime.time = '2019-06-25T05:59:53.0114595Z'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneCity)
      .dive()
    const elem = wrapper
      .find('[data-test-id="search-result-time-zone-time"]')
      .first()
    expect(elem.render().text()).toEqual('5:59 AM')
  })

  it('displays the time value in the expected Typography component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneCity,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.primaryCityTime.time = '2015-10-23T15:27:59.8892745Z'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneCity)
      .dive()
    const elem = wrapper
      .find('[data-test-id="search-result-time-zone-time"]')
      .first()
    expect(elem.type()).toEqual(Typography)
    expect(elem.prop('variant')).toEqual('h4')
  })

  it('formats the date as expected [test 1]', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneCity,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.primaryCityTime.time = '2015-10-23T15:27:59.8892745Z'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneCity)
      .dive()
    const elem = wrapper
      .find('[data-test-id="search-result-time-zone-date"]')
      .first()
    expect(elem.render().text()).toEqual('Friday, October 23, 2015')
  })

  it('formats the date as expected [test 2]', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneCity,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.primaryCityTime.time = '2019-06-25T05:59:53.0114595Z'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneCity)
      .dive()
    const elem = wrapper
      .find('[data-test-id="search-result-time-zone-date"]')
      .first()
    expect(elem.render().text()).toEqual('Tuesday, June 25, 2019')
  })

  it('displays the date in the expected Typography component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneCity,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.primaryCityTime.time = '2015-10-23T15:27:59.8892745Z'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneCity)
      .dive()
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
    const {
      TimeZoneCity,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.primaryCityTime.location = 'Washington, D.C., United States'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneCity)
      .dive()
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
    const {
      TimeZoneCity,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.primaryCityTime.location = 'Washington, D.C., United States'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneCity)
      .dive()
    const elem = wrapper
      .find('[data-test-id="search-result-time-zone-location"]')
      .first()
    expect(elem.type()).toEqual(Typography)
    expect(elem.prop('variant')).toEqual('body2')
  })

  it('does not display the "other cities" times when no other cities are provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneCity,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.otherCityTimes = undefined
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneCity)
      .dive()
    expect(
      wrapper
        .find('[data-test-id="search-result-time-zone-other-locations"]')
        .exists()
    ).toBe(false)
  })

  it('does not display the "other cities" times when the other cities data is an empty array', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneCity,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.otherCityTimes = []
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneCity)
      .dive()
    expect(
      wrapper
        .find('[data-test-id="search-result-time-zone-other-locations"]')
        .exists()
    ).toBe(false)
  })

  it('displays the "other cities" times when provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneCity,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.otherCityTimes = [
      {
        location: 'Honolulu',
        time: '2019-06-24T12:32:03.1293302Z',
        utcOffset: 'UTC-10',
      },
      {
        location: 'Anchorage',
        time: '2019-06-24T14:32:03.1283295Z',
        utcOffset: 'UTC-8',
      },
    ]
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneCity)
      .dive()
    expect(
      wrapper
        .find('[data-test-id="search-result-time-zone-other-locations"]')
        .exists()
    ).toBe(true)
  })

  it('separates the "other cities" times with a divider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneCity,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.otherCityTimes = [
      {
        location: 'Honolulu',
        time: '2019-06-24T12:32:03.1293302Z',
        utcOffset: 'UTC-10',
      },
      {
        location: 'Anchorage',
        time: '2019-06-24T14:32:03.1283295Z',
        utcOffset: 'UTC-8',
      },
    ]
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneCity)
      .dive()
    expect(
      wrapper
        .find('[data-test-id="search-result-time-zone-other-locations"]')
        .children()
        .first()
        .type()
    ).toEqual(Divider)
  })

  it('displays the "other cities" times as expected', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneCity,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.otherCityTimes = [
      {
        location: 'Honolulu',
        time: '2019-06-24T12:32:03.1293302Z',
        utcOffset: 'UTC-10',
      },
      {
        location: 'Anchorage',
        time: '2019-06-24T14:32:03.1283295Z',
        utcOffset: 'UTC-8',
      },
    ]
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneCity)
      .dive()
    const secondOtherCityTime = wrapper
      .find('[data-test-id="search-result-time-zone-other-locations"]')
      .children()
      .find('tr')
      .at(1)
    expect(
      secondOtherCityTime
        .children()
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('2:32 PM')
    expect(
      secondOtherCityTime
        .children()
        .find(Typography)
        .at(1)
        .render()
        .text()
    ).toEqual('Anchorage (UTC-8)')
  })
})

describe('TimeZoneSearchResult: TimeZoneGeneralInfo', () => {
  const getMockProps = () => ({
    // May also be structured like `getMockBingTimeZoneInfoResult`.
    item: getMockBingTimeZoneInfoMultipleZonesResult(),
  })

  it('renders without error', () => {
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const mockProps = getMockProps()
    shallow(<TimeZoneSearchResult {...mockProps} />).dive()
  })

  it('returns the TimeZoneGeneralInfo component type', () => {
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneGeneralInfo,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />).dive()
    expect(wrapper.type()).toEqual(TimeZoneGeneralInfo)
  })

  it('returns a Paper component as the root element', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneGeneralInfo,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneGeneralInfo)
      .dive()
    expect(wrapper.at(0).type()).toEqual(Paper)
  })
})

describe('TimeZoneSearchResult: TimeZoneDifference', () => {
  const getMockProps = () => ({
    // May also be structured like `getMockBingTimeZoneConversionNoSpecificTimeResult`.
    item: getMockBingTimeZoneConversionResult(),
  })

  it('renders without error', () => {
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const mockProps = getMockProps()
    shallow(<TimeZoneSearchResult {...mockProps} />).dive()
  })

  it('returns the TimeZoneDifference component type', () => {
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneDifference,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />).dive()
    expect(wrapper.type()).toEqual(TimeZoneDifference)
  })

  it('returns a Paper component as the root element', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneDifference,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneDifference)
      .dive()
    expect(wrapper.at(0).type()).toEqual(Paper)
  })
})

describe('TimeZoneSearchResult: TimeZoneTimeBetween', () => {
  const getMockProps = () => ({
    item: getMockBingTimeZoneTimeBetweenResult(),
  })

  it('renders without error', () => {
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const mockProps = getMockProps()
    shallow(<TimeZoneSearchResult {...mockProps} />).dive()
  })

  it('returns the TimeZoneTimeBetween component type', () => {
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneTimeBetween,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />).dive()
    expect(wrapper.type()).toEqual(TimeZoneTimeBetween)
  })

  it('returns a Paper component as the root element', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneTimeBetween,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneTimeBetween)
      .dive()
    expect(wrapper.at(0).type()).toEqual(Paper)
  })
})
