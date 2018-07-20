/* eslint-env jest */

import 'utils/jsdom-shims'
import React from 'react'
import moment from 'moment'
import MockDate from 'mockdate'
import { mount, shallow } from 'enzyme'

jest.mock('utils/local-bkg-settings')
jest.mock('mutations/SetBackgroundDailyImageMutation')

beforeEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('User background image component', function () {
  it('renders with a photo background', function () {
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

  it('renders with a daily photo background', function () {
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

  it('renders with a custom photo background', function () {
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
    wrapper.instance().onImgLoad() // mock img onload
    wrapper.update()
    const backgroundStyle = wrapper.find('[data-test-id="dashboard-background-img"]').prop('style')
    expect(backgroundStyle.backgroundImage).toBe('url(https://example.com/some-custom-photo.png)')
  })

  it('renders with a color background', function () {
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
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )
    const backgroundStyle = wrapper.find('[data-test-id="dashboard-background-img"]').prop('style')
    expect(backgroundStyle.backgroundColor).toBe('#FF0000')
    expect(backgroundStyle.backgroundImage).not.toBeDefined()
  })

  it('renders the default background if the color is missing', function () {
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

  it('renders the default background if the photo URL is missing', function () {
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

  it('renders the default background if the custom photo URL is missing', function () {
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

  it('renders the fallback background if the background option is not set', function () {
    // Mock the settings in local storage.
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

  it('falls back to default background on image load error', function () {
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

  it('calls to show an error message on image load error', function () {
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

  it('correctly determines whether background props are different from state', function () {
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

  it('sets state on mount using local storage values', function () {
    // Mock the settings in local storage.
    jest.mock('utils/local-bkg-settings', () => {
      return {
        getUserBackgroundOption: jest.fn(() => 'color'), // Different
        getUserBackgroundCustomImage: jest.fn(() => null),
        getUserBackgroundColor: jest.fn(() => '#FFF'),
        getUserBackgroundImageURL: jest.fn(() => 'https://example.com/pic.png'),
        setBackgroundSettings: jest.fn(),
        setExtensionBackgroundSettings: jest.fn()
      }
    })

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

  it('saves background settings to storage on mount (when the settings differ)', function () {
    // Mock the settings in local storage.
    jest.mock('utils/local-bkg-settings', () => {
      return {
        getUserBackgroundOption: jest.fn(() => 'color'), // Different
        getUserBackgroundCustomImage: jest.fn(() => null),
        getUserBackgroundColor: jest.fn(() => '#FFF'),
        getUserBackgroundImageURL: jest.fn(() => 'https://example.com/pic.png'),
        setBackgroundSettings: jest.fn(),
        setExtensionBackgroundSettings: jest.fn()
      }
    })

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
    const setBackgroundSettings = require('utils/local-bkg-settings')
      .setBackgroundSettings
    expect(setBackgroundSettings).toHaveBeenCalledTimes(1)
  })

  it('does not save background settings to storage on mount (when the settings are the same)', function () {
    // Mock the settings in local storage.
    jest.mock('utils/local-bkg-settings', () => {
      return {
        getUserBackgroundOption: jest.fn(() => 'photo'),
        getUserBackgroundCustomImage: jest.fn(() => null),
        getUserBackgroundColor: jest.fn(() => '#FF0000'),
        getUserBackgroundImageURL: jest.fn(() => 'https://example.com/pic.png'),
        setBackgroundSettings: jest.fn(),
        setExtensionBackgroundSettings: jest.fn()
      }
    })

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
    shallow(<UserBackgroundImageComponent user={user} />)
    const setBackgroundSettings = require('utils/local-bkg-settings')
      .setBackgroundSettings
    expect(setBackgroundSettings).not.toHaveBeenCalled()
  })

  it('saves the background settings on prop update (when the settings are different)', function () {
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

    const setBackgroundSettings = require('utils/local-bkg-settings')
      .setBackgroundSettings
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
    wrapper.setProps({ user: userUpdate }, () => {
      expect(setBackgroundSettings).toHaveBeenCalledTimes(1)
    })
  })

  it('does not save the background settings on prop update (when the settings are the same)', function () {
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

    const setBackgroundSettings = require('utils/local-bkg-settings')
      .setBackgroundSettings
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
    wrapper.setProps({ user: userUpdate }, () => {
      expect(setBackgroundSettings).not.toHaveBeenCalled()
    })
  })

  it('messages the parent frame on mount when there are settings in local storage', function () {
    // Mock the settings in local storage.
    jest.mock('utils/local-bkg-settings', () => {
      return {
        getUserBackgroundOption: jest.fn(() => 'photo'),
        getUserBackgroundCustomImage: jest.fn(() => 'https://example.com/some-custom-photo.png'),
        getUserBackgroundColor: jest.fn(() => '#FF0000'),
        getUserBackgroundImageURL: jest.fn(() => 'https://example.com/pic.png'),
        setBackgroundSettings: jest.fn(),
        setExtensionBackgroundSettings: jest.fn()
      }
    })
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    mount(
      <UserBackgroundImageComponent user={null} relay={{ environment: {} }} />
    )

    const setExtensionBackgroundSettings = require('utils/local-bkg-settings')
      .setExtensionBackgroundSettings
    expect(setExtensionBackgroundSettings).toHaveBeenCalledTimes(1)
  })

  it('does not message the parent frame on mount when there are not settings in local storage', function () {
    // Mock the settings in local storage.
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
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    mount(
      <UserBackgroundImageComponent user={null} relay={{ environment: {} }} />
    )

    const setExtensionBackgroundSettings = require('utils/local-bkg-settings')
      .setExtensionBackgroundSettings
    expect(setExtensionBackgroundSettings).not.toHaveBeenCalled()
  })

  it('sets the expected tint overlay for a photo background', function () {
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

  it('sets the expected tint overlay for a color background', function () {
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

  // FIXME: update to use "daily" logic
  it('fetches a new daily photo when one was last fetched yesterday (local time)', () => {
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
    const SetBackgroundDailyImageMutation = require('mutations/SetBackgroundDailyImageMutation').default

    // Current time is the day after the background image last changed.
    const mockNow = '2017-05-19T13:59:58.000Z'
    MockDate.set(moment(mockNow))
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    shallow(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )
    MockDate.reset()
    expect(SetBackgroundDailyImageMutation).toHaveBeenCalled()
  })

  // FIXME: update to use "daily" logic
  it('does not fetch a new daily photo when one was already fetched today (local time)', () => {
    const user = {
      id: 'abc-123',
      backgroundOption: 'daily',
      customImage: null,
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/something.png',
        timestamp: '2017-05-19T13:59:57.000Z'
      }
    }
    const SetBackgroundDailyImageMutation = require('mutations/SetBackgroundDailyImageMutation').default

    // Current time is the same day as when the background image last changed.
    const mockNow = '2017-05-19T13:59:51.000Z'
    MockDate.set(moment(mockNow))
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    shallow(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )
    MockDate.reset()
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
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    const SetBackgroundDailyImageMutation = require('mutations/SetBackgroundDailyImageMutation').default

    // Current time is the same day as when the background image last changed.
    const mockNow = '2018-07-02T18:00:00.000Z'
    MockDate.set(moment(mockNow))
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    shallow(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )
    MockDate.reset()
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
        timestamp: '2017-05-19T13:59:46.000Z'
      }
    }
    const SetBackgroundDailyImageMutation = require('mutations/SetBackgroundDailyImageMutation').default

    // Current time is the same day as when the background image last changed.
    const mockNow = '2018-07-02T18:00:00.000Z'
    MockDate.set(moment(mockNow))
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    shallow(
      <UserBackgroundImageComponent user={user} relay={{ environment: {} }} />
    )
    MockDate.reset()
    expect(SetBackgroundDailyImageMutation).not.toHaveBeenCalled()
  })
})
