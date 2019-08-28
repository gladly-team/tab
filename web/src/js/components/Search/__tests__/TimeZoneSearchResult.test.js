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

  it('returns null if primaryTimeZone.location is not provided', () => {
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneGeneralInfo,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.primaryTimeZone.location = undefined
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneGeneralInfo)
      .dive()
    expect(wrapper.at(0).type()).toBeNull()
  })

  it('returns null if primaryTimeZone.time is not provided', () => {
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneGeneralInfo,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.primaryTimeZone.time = undefined
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneGeneralInfo)
      .dive()
    expect(wrapper.at(0).type()).toBeNull()
  })

  it('returns null if primaryTimeZone.timeZoneName is not provided', () => {
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneGeneralInfo,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.primaryTimeZone.timeZoneName = undefined
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneGeneralInfo)
      .dive()
    expect(wrapper.at(0).type()).toBeNull()
  })

  it('returns null if primaryTimeZone.utcOffset is not provided', () => {
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneGeneralInfo,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.primaryTimeZone.utcOffset = undefined
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneGeneralInfo)
      .dive()
    expect(wrapper.at(0).type()).toBeNull()
  })

  it('displays the location and UTC offset as expected', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneGeneralInfo,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.primaryTimeZone.location = 'Washington, D.C., United States'
    mockProps.item.primaryTimeZone.utcOffset = 'UTC-4'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneGeneralInfo)
      .dive()
    const elem = wrapper.find(
      '[data-test-id="search-result-time-zone-info-location"]'
    )
    expect(elem.render().text()).toEqual(
      'Washington, D.C., United States (UTC-4)'
    )
    expect(elem.type()).toEqual(Typography)
    expect(elem.prop('variant')).toEqual('body2')
  })

  it('displays the time zone name as expected', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneGeneralInfo,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.primaryTimeZone.timeZoneName = 'Eastern Daylight Time'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneGeneralInfo)
      .dive()
    const elem = wrapper.find(
      '[data-test-id="search-result-time-zone-info-name"]'
    )
    expect(elem.render().text()).toEqual('Eastern Daylight Time')
    expect(elem.type()).toEqual(Typography)
    expect(elem.prop('variant')).toEqual('h4')
  })

  it('does not display a Divider or table if there are no other time zones to show', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneGeneralInfo,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.otherTimeZones = undefined
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneGeneralInfo)
      .dive()
    expect(wrapper.find(Divider).exists()).toBe(false)
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('displays a table of other time zones when they exist', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneGeneralInfo,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.otherTimeZones = [
      {
        location: 'Washington, D.C.',
        time: '2019-08-26T14:02:58.7860830Z',
        utcOffset: 'UTC-4',
        timeZoneName: 'Eastern Daylight Time',
      },
      {
        location: 'Chicago',
        time: '2019-08-26T13:02:58.7860830Z',
        utcOffset: 'UTC-5',
        timeZoneName: 'Central Daylight Time',
      },
    ]
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneGeneralInfo)
      .dive()
    const tableRows = wrapper
      .find('table')
      .children()
      .find('tr')
    expect(tableRows.length).toEqual(2)
    expect(
      tableRows
        .at(0)
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('UTC-4')
    expect(
      tableRows
        .at(0)
        .find(Typography)
        .at(1)
        .render()
        .text()
    ).toEqual('Washington, D.C. (Eastern Daylight Time)')
    expect(
      tableRows
        .at(1)
        .find(Typography)
        .first()
        .render()
        .text()
    ).toEqual('UTC-5')
    expect(
      tableRows
        .at(1)
        .find(Typography)
        .at(1)
        .render()
        .text()
    ).toEqual('Chicago (Central Daylight Time)')
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

  it('returns null if the description is not provided', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneDifference,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.description = undefined
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneDifference)
      .dive()
    expect(wrapper.at(0).type()).toBeNull()
  })

  it('displays the description text', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneDifference,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.description = 'Convert time zones!! :o'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneDifference)
      .dive()
    const elem = wrapper.find(
      '[data-test-id="search-result-time-zone-difference-description"]'
    )
    expect(elem.render().text()).toEqual('Convert time zones!! :o')
  })

  it('displays the description text as a h6 Typography element when there is no timeZoneDifference.text value or an h6 otherwise', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneDifference,
    } = require('js/components/Search/TimeZoneSearchResult')

    // Render without a timeZoneDifference.text value.
    const mockProps = getMockProps()
    mockProps.item.description = 'Convert time zones!!'
    delete mockProps.item.timeZoneDifference.text
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneDifference)
      .dive()
    const elem = wrapper.find(
      '[data-test-id="search-result-time-zone-difference-description"]'
    )
    expect(elem.type()).toEqual(Typography)
    expect(elem.prop('variant')).toEqual('h6')

    // Render with a timeZoneDifference.text value.
    wrapper.setProps({
      item: {
        ...mockProps.item,
        timeZoneDifference: {
          ...mockProps.item.timeZoneDifference,
          text: '32 days',
        },
      },
    })

    const elemAgain = wrapper.find(
      '[data-test-id="search-result-time-zone-difference-description"]'
    )
    expect(elemAgain.type()).toEqual(Typography)
    expect(elemAgain.prop('variant')).toEqual('body2')
  })

  it('displays the timeZoneDifference text as an h4 Typography element', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneDifference,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.timeZoneDifference.text = '423 years'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneDifference)
      .dive()
    const elem = wrapper.find(
      '[data-test-id="search-result-time-zone-difference-text"]'
    )
    expect(elem.render().text()).toEqual('423 years')
    expect(elem.type()).toEqual(Typography)
    expect(elem.prop('variant')).toEqual('h4')
  })

  it('sets a bottom gutter on the timeZoneDifference text if location data is provided and not otherwise', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneDifference,
    } = require('js/components/Search/TimeZoneSearchResult')

    // Render with location data.
    const mockProps = getMockProps()
    mockProps.item.timeZoneDifference.text = '423 years'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneDifference)
      .dive()
    expect(
      wrapper
        .find('[data-test-id="search-result-time-zone-difference-text"]')
        .prop('gutterBottom')
    ).toBe(true)

    // Render with some location data missing.
    wrapper.setProps({
      item: {
        ...mockProps.item,
        timeZoneDifference: {
          ...mockProps.item.timeZoneDifference,
          location1: undefined,
        },
      },
    })
    expect(
      wrapper
        .find('[data-test-id="search-result-time-zone-difference-text"]')
        .prop('gutterBottom')
    ).toBe(false)
  })

  it('displays the timeZoneDifference location data in a table when it exists', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneDifference,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = {
      ...getMockProps(),
      timeZoneDifference: {
        location1: {
          location: 'Eastern Daylight Time',
          time: '2019-08-26T15:00:00.0000000Z',
          utcOffset: 'UTC-4',
          timeZoneName: 'EDT',
        },
        location2: {
          location: 'China',
          time: '2019-08-27T03:00:00.0000000Z',
          utcOffset: 'UTC+8',
          timeZoneName: 'China Standard Time',
        },
        text: '',
      },
    }
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneDifference)
      .dive()
    const table = wrapper.find('table')
    expect(
      table
        .find(Typography)
        .at(0)
        .render()
        .text()
    ).toEqual('Eastern Daylight Time (EDT)')
    expect(
      table
        .find(Typography)
        .at(1)
        .render()
        .text()
    ).toEqual('China (China Standard Time)')
    expect(
      table
        .find(Typography)
        .at(2)
        .render()
        .text()
    ).toEqual('3:00 PM')
    expect(
      table
        .find(Typography)
        .at(3)
        .render()
        .text()
    ).toEqual('3:00 AM')
  })

  it('does not display a table when some timeZoneDifference location data is missing', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneDifference,
    } = require('js/components/Search/TimeZoneSearchResult')
    const initialProps = getMockProps()
    const mockProps = {
      ...initialProps,
      item: {
        ...initialProps.item,
        timeZoneDifference: {
          location1: {
            location: 'Eastern Daylight Time',
            // time: '2019-08-26T15:00:00.0000000Z', // missing
            utcOffset: 'UTC-4',
            timeZoneName: 'EDT',
          },
          location2: {
            // location: 'China', // missing
            time: '2019-08-27T03:00:00.0000000Z',
            utcOffset: 'UTC+8',
            timeZoneName: 'China Standard Time',
          },
          text: '',
        },
      },
    }
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneDifference)
      .dive()
    expect(wrapper.find('table').exists()).toBe(false)
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

  it('renders the expected main text', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneTimeBetween,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.primaryResponse = '14 days'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneTimeBetween)
      .dive()
    const typographyElem = wrapper.find(
      '[data-test-id="search-result-time-zone-primary-response"]'
    )
    expect(typographyElem.render().text()).toEqual('14 days')
    expect(typographyElem.type()).toEqual(Typography)
    expect(typographyElem.prop('variant')).toEqual('h4')
  })

  it('renders the expected description text', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const TimeZoneSearchResult = require('js/components/Search/TimeZoneSearchResult')
      .default
    const {
      TimeZoneTimeBetween,
    } = require('js/components/Search/TimeZoneSearchResult')
    const mockProps = getMockProps()
    mockProps.item.description =
      'There are 11 days from August 26, 2019 to September 6, 2019'
    const wrapper = shallow(<TimeZoneSearchResult {...mockProps} />)
      .dive()
      .find(TimeZoneTimeBetween)
      .dive()
    const typographyElem = wrapper.find(
      '[data-test-id="search-result-time-zone-description"]'
    )
    expect(typographyElem.render().text()).toEqual(
      'There are 11 days from August 26, 2019 to September 6, 2019'
    )
    expect(typographyElem.type()).toEqual(Typography)
    expect(typographyElem.prop('variant')).toEqual('body2')
  })
})
