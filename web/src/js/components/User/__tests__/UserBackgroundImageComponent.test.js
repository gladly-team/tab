/* eslint-env jest */

import 'utils/jsdom-shims'
import React from 'react'
import moment from 'moment'
import MockDate from 'mockdate'
import { mount, shallow } from 'enzyme'
import {
  getUserBackgroundOption,
  getUserBackgroundCustomImage,
  getUserBackgroundColor,
  getUserBackgroundImageURL,
  setBackgroundSettings
} from 'utils/local-bkg-settings'

jest.mock('utils/local-bkg-settings', () => {
  return {
    getUserBackgroundOption: jest.fn(() => null),
    getUserBackgroundCustomImage: jest.fn(() => null),
    getUserBackgroundColor: jest.fn(() => null),
    getUserBackgroundImageURL: jest.fn(() => null),
    setBackgroundSettings: jest.fn(),
    setExtensionBackgroundSettings: jest.fn()
  }
})
jest.mock('js/mutations/SetBackgroundDailyImageMutation')

const mockNow = '2017-05-19T13:59:58.000Z'

beforeEach(() => {
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  jest.clearAllMocks()
  MockDate.reset()
})

describe('User background image component', () => {
  it('renders with a selected photo background', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'photo',
      customImage: null,
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png',
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )
    wrapper.instance().onImgLoad() // mock img onload
    wrapper.update()
    const backgroundStyle = wrapper.find('[data-test-id="dashboard-background-img"]').prop('style')
    expect(backgroundStyle.backgroundImage).toBe('url(https://example.com/pic.png)')
  })

  it('renders with a selected photo background (from localStorage only)', () => {
    // Set background settings in localStorage.
    getUserBackgroundOption.mockReturnValue('photo')
    getUserBackgroundCustomImage.mockReturnValue(null)
    getUserBackgroundColor.mockReturnValue('#FF0000')
    getUserBackgroundImageURL.mockReturnValue('https://example.com/pic.png')

    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={null} relay={{ environment: {} }} />
    )
    wrapper.instance().onImgLoad() // mock img onload
    wrapper.update()
    const backgroundStyle = wrapper.find('[data-test-id="dashboard-background-img"]').prop('style')
    expect(backgroundStyle.backgroundImage).toBe('url(https://example.com/pic.png)')
  })

  it('renders with a daily photo background', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'daily',
      customImage: null,
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/something.png',
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )
    wrapper.instance().onImgLoad() // mock img onload
    wrapper.update()
    const backgroundStyle = wrapper.find('[data-test-id="dashboard-background-img"]').prop('style')
    expect(backgroundStyle.backgroundImage).toBe('url(https://example.com/something.png)')
  })

  it('renders with a daily photo background (from localStorage only)', () => {
    // Set background settings in localStorage.
    getUserBackgroundOption.mockReturnValue('daily')
    getUserBackgroundCustomImage.mockReturnValue(null)
    getUserBackgroundColor.mockReturnValue('#FF0000')
    getUserBackgroundImageURL.mockReturnValue('https://example.com/something.png')

    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={null} relay={{ environment: {} }} />
    )
    wrapper.instance().onImgLoad() // mock img onload
    wrapper.update()
    const backgroundStyle = wrapper.find('[data-test-id="dashboard-background-img"]').prop('style')
    expect(backgroundStyle.backgroundImage).toBe('url(https://example.com/something.png)')
  })

  it('renders with a custom photo background', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'custom',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: null,
      backgroundImage: {
        imageURL: 'https://example.com/pic.png',
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )
    wrapper.instance().onImgLoad() // mock img onload
    wrapper.update()
    const backgroundStyle = wrapper.find('[data-test-id="dashboard-background-img"]').prop('style')
    expect(backgroundStyle.backgroundImage).toBe('url(https://example.com/some-custom-photo.png)')
  })

  it('renders with a custom photo background (from localStorage only)', () => {
    // Set background settings in localStorage.
    getUserBackgroundOption.mockReturnValue('custom')
    getUserBackgroundCustomImage.mockReturnValue('https://example.com/some-custom-photo.png')
    getUserBackgroundColor.mockReturnValue(null)
    getUserBackgroundImageURL.mockReturnValue('https://example.com/pic.png')

    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={null} relay={{ environment: {} }} />
    )
    wrapper.instance().onImgLoad() // mock img onload
    wrapper.update()
    const backgroundStyle = wrapper.find('[data-test-id="dashboard-background-img"]').prop('style')
    expect(backgroundStyle.backgroundImage).toBe('url(https://example.com/some-custom-photo.png)')
  })

  it('renders with a color background', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'color',
      customImage: null,
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png',
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )
    const backgroundStyle = wrapper.find('[data-test-id="dashboard-background-img"]').prop('style')
    expect(backgroundStyle.backgroundColor).toBe('#FF0000')
    expect(backgroundStyle.backgroundImage).not.toBeDefined()
  })

  it('renders with a color background (from localStorage only)', () => {
    // Set background settings in localStorage.
    getUserBackgroundOption.mockReturnValue('color')
    getUserBackgroundCustomImage.mockReturnValue(null)
    getUserBackgroundColor.mockReturnValue('#FF0000')
    getUserBackgroundImageURL.mockReturnValue('https://example.com/pic.png')

    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={null} relay={{ environment: {} }} />
    )
    const backgroundStyle = wrapper.find('[data-test-id="dashboard-background-img"]').prop('style')
    expect(backgroundStyle.backgroundColor).toBe('#FF0000')
    expect(backgroundStyle.backgroundImage).not.toBeDefined()
  })

  it('updates the color background when the setting on the server differs from localStorage', () => {
    // Set background settings in localStorage.
    getUserBackgroundOption.mockReturnValue('color')
    getUserBackgroundCustomImage.mockReturnValue(null)
    getUserBackgroundColor.mockReturnValue('#FF0000')
    getUserBackgroundImageURL.mockReturnValue('https://example.com/pic.png')

    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={null} relay={{ environment: {} }} />
    )
    const backgroundStyle = wrapper.find('[data-test-id="dashboard-background-img"]').prop('style')
    expect(backgroundStyle.backgroundColor).toBe('#FF0000')

    const updatedUser = {
      id: 'abc-123',
      backgroundOption: 'color',
      customImage: null,
      backgroundColor: '#EFEFEF', // changed
      backgroundImage: {
        imageURL: 'https://example.com/pic.png',
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    wrapper.setProps({ user: updatedUser })

    // The background should now be the new color.
    const newBackgroundStyle = wrapper.find('[data-test-id="dashboard-background-img"]').prop('style')
    expect(newBackgroundStyle.backgroundColor).toBe('#EFEFEF')
  })

  it('changes background types when the setting on the server differs from localStorage', () => {
    // Set background settings in localStorage.
    getUserBackgroundOption.mockReturnValue('color')
    getUserBackgroundCustomImage.mockReturnValue(null)
    getUserBackgroundColor.mockReturnValue('#FF0000')
    getUserBackgroundImageURL.mockReturnValue('https://example.com/pic.png')

    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={null} relay={{ environment: {} }} />
    )
    const backgroundStyle = wrapper.find('[data-test-id="dashboard-background-img"]').prop('style')
    expect(backgroundStyle.backgroundColor).toBe('#FF0000')
    expect(backgroundStyle.backgroundImage).not.toBeDefined()

    const updatedUser = {
      id: 'abc-123',
      backgroundOption: 'photo', // changed
      customImage: null,
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png',
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    wrapper.setProps({ user: updatedUser })
    wrapper.instance().onImgLoad() // mock img onload
    wrapper.update()

    // The background should now be a photo.
    const newBackgroundStyle = wrapper.find('[data-test-id="dashboard-background-img"]').prop('style')
    expect(newBackgroundStyle.backgroundColor).not.toBeDefined()
    expect(newBackgroundStyle.backgroundImage).toBe('url(https://example.com/pic.png)')
  })

  it('renders the default background if the color is missing', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'color',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: null,
      backgroundImage: {
        imageURL: 'https://example.com/pic.png',
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )
    const styleOnError = {
      backgroundColor: '#4a90e2'
    }
    const backgroundStyle = wrapper.find('[data-test-id="dashboard-background-img"]').prop('style')
    expect(backgroundStyle.backgroundColor).toBe(styleOnError.backgroundColor)
    expect(backgroundStyle.backgroundImage).not.toBeDefined()
  })

  it('renders the default background if the photo URL is missing', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'photo',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FFFFFF',
      backgroundImage: {
        imageURL: undefined,
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )
    const styleOnError = {
      backgroundColor: '#4a90e2'
    }
    const backgroundStyle = wrapper.find('[data-test-id="dashboard-background-img"]').prop('style')
    expect(backgroundStyle.backgroundColor).toBe(styleOnError.backgroundColor)
    expect(backgroundStyle.backgroundImage).not.toBeDefined()
  })

  it('renders the default background if the custom photo URL is missing', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'custom',
      customImage: null,
      backgroundColor: '#FFFFFF',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png',
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )
    const styleOnError = {
      backgroundColor: '#4a90e2'
    }
    const backgroundStyle = wrapper.find('[data-test-id="dashboard-background-img"]').prop('style')
    expect(backgroundStyle.backgroundColor).toBe(styleOnError.backgroundColor)
    expect(backgroundStyle.backgroundImage).not.toBeDefined()
  })

  it('renders the fallback background if the background option is not set', () => {
    // Mock the settings in local storage.
    getUserBackgroundOption.mockReturnValue(null)
    getUserBackgroundCustomImage.mockReturnValue(null)
    getUserBackgroundColor.mockReturnValue(null)
    getUserBackgroundImageURL.mockReturnValue(null)

    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={null} relay={{ environment: {} }} />
    )
    const fallbackStyle = {
      backgroundImage: 'none',
      backgroundColor: 'transparent'
    }
    const backgroundStyle = wrapper.find('[data-test-id="dashboard-background-img"]').prop('style')
    expect(backgroundStyle.background).toBe(fallbackStyle.background)
    expect(backgroundStyle.backgroundImage).toBe('none')
  })

  it('falls back to default background on image load error', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'custom',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png',
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )
    const styleOnError = {
      backgroundColor: '#4a90e2'
    }
    wrapper.instance().onImgError()
    wrapper.update()
    const backgroundStyle = wrapper.find('[data-test-id="dashboard-background-img"]').prop('style')
    expect(backgroundStyle.backgroundColor).toBe(styleOnError.backgroundColor)
    expect(backgroundStyle.backgroundImage).not.toBeDefined()
  })

  it('calls to show an error message on image load error', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'custom',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png',
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const showErrorHandler = jest.fn()
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} showError={showErrorHandler} relay={{ environment: {} }} />
    )
    wrapper.instance().onImgError()
    wrapper.update()
    expect(showErrorHandler).toHaveBeenCalledWith('We could not load your background image.')
  })

  it('correctly determines whether background props are different from state', () => {
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={null} relay={{ environment: {} }} />
    )
    var state
    var props

    // Fake state.
    var stateBackgroundOption = 'color'
    var stateCustomImage = 'https://example.com/some-custom-photo.png'
    var stateBackgroundColor = '#FF0000'
    var stateCustomImageURL = 'https://example.com/pic.png'
    state = {
      backgroundOption: stateBackgroundOption,
      customImage: stateCustomImage,
      backgroundColor: stateBackgroundColor,
      backgroundImageURL: stateCustomImageURL
    }

    // Fake props.
    var propsBackgroundOption = stateBackgroundOption
    var propsCustomImage = stateCustomImage
    var propsBackgroundColor = stateBackgroundColor
    var propsCustomImageURL = stateCustomImageURL
    props = {
      user: {
        backgroundOption: propsBackgroundOption,
        customImage: propsCustomImage,
        backgroundColor: propsBackgroundColor,
        backgroundImage: {
          imageURL: propsCustomImageURL,
          timestamp: '2017-05-19T13:59:46.000Z'
        }
      }
    }

    wrapper.setState(state)

    // State and props should be identical at this point.
    expect(wrapper.instance()
      .arePropsDifferentFromState(props))
      .toBe(false)

    propsCustomImageURL = 'https://example.com/something-else.png'
    props = {
      user: {
        backgroundOption: propsBackgroundOption,
        customImage: propsCustomImage,
        backgroundColor: propsBackgroundColor,
        backgroundImage: {
          imageURL: propsCustomImageURL,
          timestamp: '2017-05-19T13:59:46.000Z'
        }
      }
    }
    expect(wrapper.instance()
      .arePropsDifferentFromState(props))
      .toBe(true)

    propsCustomImageURL = stateCustomImageURL
    propsBackgroundOption = 'photo'
    props = {
      user: {
        backgroundOption: propsBackgroundOption,
        customImage: propsCustomImage,
        backgroundColor: propsBackgroundColor,
        backgroundImage: {
          imageURL: propsCustomImageURL,
          timestamp: '2017-05-19T13:59:46.000Z'
        }
      }
    }
    expect(wrapper.instance()
      .arePropsDifferentFromState(props))
      .toBe(true)
  })

  it('sets state on mount using local storage values', () => {
    // Mock the settings in local storage.
    getUserBackgroundOption.mockReturnValue('color') // Different
    getUserBackgroundCustomImage.mockReturnValue(null)
    getUserBackgroundColor.mockReturnValue('#FFF')
    getUserBackgroundImageURL.mockReturnValue('https://example.com/pic.png')

    // As if we have not yet fetched the user from the server.
    const user = null
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(<UserBackgroundImageComponent user={user} />)
    const state = wrapper.state()
    expect(state.backgroundOption).toEqual('color')
    expect(state.customImage).toEqual(null)
    expect(state.backgroundColor).toEqual('#FFF')
    expect(state.backgroundImageURL).toEqual('https://example.com/pic.png')
  })

  it('saves background settings to storage on mount (when the settings differ)', () => {
    // Mock the settings in local storage.
    getUserBackgroundOption.mockReturnValue('color') // Different
    getUserBackgroundCustomImage.mockReturnValue(null)
    getUserBackgroundColor.mockReturnValue('#FFF')
    getUserBackgroundImageURL.mockReturnValue('https://example.com/pic.png')

    const user = {
      id: 'abc-123',
      backgroundOption: 'photo',
      customImage: null,
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png',
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    shallow(<UserBackgroundImageComponent user={user} relay={{ environment: {} }} />)
    expect(setBackgroundSettings).toHaveBeenCalledTimes(1)
  })

  it('does not save background settings to storage on mount (when the settings are the same)', () => {
    // Mock the settings in local storage.
    getUserBackgroundOption.mockReturnValue('photo')
    getUserBackgroundCustomImage.mockReturnValue(null)
    getUserBackgroundColor.mockReturnValue('#FF0000')
    getUserBackgroundImageURL.mockReturnValue('https://example.com/pic.png')

    const user = {
      id: 'abc-123',
      backgroundOption: 'photo',
      customImage: null,
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png',
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    shallow(<UserBackgroundImageComponent user={user} relay={{ environment: {} }} />)
    expect(setBackgroundSettings).not.toHaveBeenCalled()
  })

  it('saves the background settings on prop update (when the settings are different)', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'photo',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png',
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = mount(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )

    // It saved background settings on mount. Clear that call.
    setBackgroundSettings.mockClear()

    // With an update to props, it should call to save settings.
    const userUpdate = {
      backgroundOption: 'color', // different
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png',
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    wrapper.setProps({ user: userUpdate })
    expect(setBackgroundSettings).toHaveBeenCalledTimes(1)
  })

  it('does not save the background settings on prop update (when the settings are the same)', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'photo',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png',
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = mount(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )

    // It saved background settings on mount. Clear that call.
    setBackgroundSettings.mockClear()

    // With an update to props, it should call to save settings.
    const userUpdate = {
      backgroundOption: 'photo',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png',
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    wrapper.setProps({ user: userUpdate })
    expect(setBackgroundSettings).not.toHaveBeenCalled()
  })

  it('sets the expected tint overlay for a photo background', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'photo',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png',
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = mount(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )
    wrapper.instance().onImgLoad() // mock img onload
    wrapper.update()
    const tintElem = wrapper
      .find('[data-test-id="background-tint-overlay"]').first()
    const tintColor = tintElem.props().style.backgroundColor
    expect(tintColor).toBe('rgba(0, 0, 0, 0.15)')
  })

  it('sets the expected tint overlay for a color background', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'color',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png',
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = mount(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )

    const tintElem = wrapper
      .find('[data-test-id="background-tint-overlay"]').first()
    const tintColor = tintElem.props().style.backgroundColor
    expect(tintColor).toBe('rgba(0, 0, 0, 0.03)')
  })

  it('fetches a new daily photo when one was last fetched yesterday (local time)', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'daily',
      customImage: null,
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/something.png',
        timestamp: '2017-05-18T19:01:03.000' // yesterday relative to current time; local time
      }
    }
    MockDate.set(moment('2017-05-19T13:59:58.000')) // local time
    const SetBackgroundDailyImageMutation = require('js/mutations/SetBackgroundDailyImageMutation').default

    // Current time is the day after the background image last changed.
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    shallow(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )
    expect(SetBackgroundDailyImageMutation).toHaveBeenCalled()
  })

  it('fetches a new daily photo immediately at midnight (local time)', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'daily',
      customImage: null,
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/something.png',
        timestamp: '2017-05-18T23:59:59.833' // < 2 seconds ago relative to current time; local time
      }
    }
    MockDate.set(moment('2017-05-19T00:00:00.581')) // just after midnight local time
    const SetBackgroundDailyImageMutation = require('js/mutations/SetBackgroundDailyImageMutation').default

    // Current time is the day after the background image last changed.
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    shallow(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )
    expect(SetBackgroundDailyImageMutation).toHaveBeenCalled()
  })

  it('fetches a new daily photo even when the props update and background settings have not changed from localStorage', () => {
    // Mock the settings in local storage.
    const backgroundOption = 'daily'
    const customImage = null
    const backgroundColor = '#FF0000'
    const backgroundImageURL = 'https://example.com/something.png'
    getUserBackgroundOption.mockReturnValue(backgroundOption)
    getUserBackgroundCustomImage.mockReturnValue(customImage)
    getUserBackgroundColor.mockReturnValue(backgroundColor)
    getUserBackgroundImageURL.mockReturnValue(backgroundImageURL)

    MockDate.set(moment('2017-05-19T13:59:58.000')) // local time

    const SetBackgroundDailyImageMutation = require('js/mutations/SetBackgroundDailyImageMutation').default

    // Current time is the day after the background image last changed.
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={null} relay={{ environment: {} }} />
    )

    // Important: these props are not different from the state that
    // the component loaded from localStorage.
    const userUpdate = {
      id: 'abc-123',
      backgroundOption: backgroundOption,
      customImage: customImage,
      backgroundColor: backgroundColor,
      backgroundImage: {
        imageURL: backgroundImageURL,
        timestamp: '2017-05-18T19:01:03.000' // yesterday relative to current time; local time
      }
    }
    expect(SetBackgroundDailyImageMutation).not.toHaveBeenCalled()
    wrapper.setProps({ user: userUpdate })
    expect(SetBackgroundDailyImageMutation).toHaveBeenCalled()
  })

  it('does not fetch a new daily photo when one was already fetched today (local time)', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'daily',
      customImage: null,
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/something.png',
        timestamp: '2017-05-19T02:28:40.000' // same day as current time; local time
      }
    }

    MockDate.set(moment('2017-05-19T13:59:58.000')) // local time

    const SetBackgroundDailyImageMutation = require('js/mutations/SetBackgroundDailyImageMutation').default
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    shallow(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )
    expect(SetBackgroundDailyImageMutation).not.toHaveBeenCalled()
  })

  it('does not fetch a new daily photo when the background option is a regular photo', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'photo',
      customImage: null,
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/something.png',
        timestamp: '2017-05-18T19:01:03.000' // yesterday relative to current time; local time
      }
    }
    MockDate.set(moment('2017-05-19T13:59:58.000')) // local time

    const SetBackgroundDailyImageMutation = require('js/mutations/SetBackgroundDailyImageMutation').default
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    shallow(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )
    expect(SetBackgroundDailyImageMutation).not.toHaveBeenCalled()
  })

  it('does not fetch a new daily photo when the background option is a color', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'photo',
      customImage: null,
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/something.png',
        timestamp: '2017-05-19T13:59:46.000' // yesterday relative to current time; local time
      }
    }

    MockDate.set(moment('2017-05-19T13:59:58.000')) // local time

    const SetBackgroundDailyImageMutation = require('js/mutations/SetBackgroundDailyImageMutation').default
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    shallow(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )
    expect(SetBackgroundDailyImageMutation).not.toHaveBeenCalled()
  })

  it('does not make more than one request at a time to get a new daily photo', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'daily',
      customImage: null,
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/something.png',
        timestamp: '2017-05-18T19:01:03.000' // yesterday relative to current time; local time
      }
    }
    MockDate.set(moment('2017-05-19T13:59:58.000')) // local time

    const SetBackgroundDailyImageMutation = require('js/mutations/SetBackgroundDailyImageMutation').default
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )

    // We expect one request
    expect(SetBackgroundDailyImageMutation).toHaveBeenCalledTimes(1)

    // Force props to update, which should not trigger new requests.
    wrapper.setProps({ user: Object.assign({}, user, { backgroundColor: '#CDCDCD' }) })
    wrapper.setProps({ user: Object.assign({}, user, { backgroundColor: '#EFEFEF' }) })
    expect(SetBackgroundDailyImageMutation).toHaveBeenCalledTimes(1)
  })
})
