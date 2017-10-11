/* eslint-env jest */

import 'utils/jsdom-shims'
import React from 'react'
import { mount, shallow } from 'enzyme'

jest.mock('utils/local-bkg-settings')

beforeEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('User background image component', function () {
  it('renders with a photo background', function () {
    const user = {
      backgroundOption: 'photo',
      customImage: null,
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} />
    )
    const wrapperStyle = wrapper.get(0).props.style
    expect(wrapperStyle.backgroundImage).toBe('url(https://example.com/pic.png)')

    // Image should not appear until it's loaded.
    expect(wrapperStyle.opacity).toBe(0)
    wrapper.instance().onImgLoad() // mock img onload
    expect(wrapper.get(0).props.style.opacity).toBe(1)
  })

  it('renders with a daily photo background', function () {
    const user = {
      backgroundOption: 'daily',
      customImage: null,
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/something.png'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} />
    )
    const wrapperStyle = wrapper.get(0).props.style
    expect(wrapperStyle.backgroundImage).toBe('url(https://example.com/something.png)')

    // Image should not appear until it's loaded.
    expect(wrapperStyle.opacity).toBe(0)
    wrapper.instance().onImgLoad() // mock img onload
    expect(wrapper.get(0).props.style.opacity).toBe(1)
  })

  it('renders with a custom photo background', function () {
    const user = {
      backgroundOption: 'custom',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} />
    )
    const wrapperStyle = wrapper.get(0).props.style
    expect(wrapperStyle.backgroundImage).toBe('url(https://example.com/some-custom-photo.png)')

    // Image should not appear until it's loaded.
    expect(wrapperStyle.opacity).toBe(0)
    wrapper.instance().onImgLoad() // mock img onload
    expect(wrapper.get(0).props.style.opacity).toBe(1)
  })

  it('renders with a color background', function () {
    const user = {
      backgroundOption: 'color',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} />
    )
    const wrapperStyle = wrapper.get(0).props.style
    expect(wrapperStyle.backgroundColor).toBe('#FF0000')
    expect(wrapperStyle.backgroundImage).not.toBeDefined()

    // Color background should appear immediately.
    expect(wrapperStyle.opacity).toBe(1)
  })

  it('renders the default background if the color is missing', function () {
    const user = {
      backgroundOption: 'color',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: null,
      backgroundImage: {
        imageURL: 'https://example.com/pic.png'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} />
    )
    const styleOnError = {
      backgroundColor: '#4a90e2'
    }
    const wrapperStyle = wrapper.get(0).props.style
    expect(wrapperStyle.backgroundColor).toBe(styleOnError.backgroundColor)
    expect(wrapperStyle.backgroundImage).not.toBeDefined()
  })

  it('renders the default background if the photo URL is missing', function () {
    const user = {
      backgroundOption: 'photo',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FFFFFF',
      backgroundImage: {
        imageURL: undefined
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} />
    )
    const styleOnError = {
      backgroundColor: '#4a90e2'
    }
    const wrapperStyle = wrapper.get(0).props.style
    expect(wrapperStyle.backgroundColor).toBe(styleOnError.backgroundColor)
    expect(wrapperStyle.backgroundImage).not.toBeDefined()
  })

  it('renders the default background if the custom photo URL is missing', function () {
    const user = {
      backgroundOption: 'custom',
      customImage: null,
      backgroundColor: '#FFFFFF',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} />
    )
    const styleOnError = {
      backgroundColor: '#4a90e2'
    }
    const wrapperStyle = wrapper.get(0).props.style
    expect(wrapperStyle.backgroundColor).toBe(styleOnError.backgroundColor)
    expect(wrapperStyle.backgroundImage).not.toBeDefined()
  })

  it('renders the fallback background if the background option is not set', function () {
    // Mock the settings in local storage.
    jest.mock('utils/local-bkg-settings', () => {
      return {
        getUserBackgroundOption: jest.fn(() => null),
        getUserBackgroundCustomImage: jest.fn(() => null),
        getUserBackgroundColor: jest.fn(() => null),
        getUserBackgroundImageURL: jest.fn(() => null),
        setBackgroundSettings: jest.fn()
      }
    })
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={null} />
    )
    const fallbackStyle = {
      background: 'none'
    }
    const wrapperStyle = wrapper.get(0).props.style
    expect(wrapperStyle.background).toBe(fallbackStyle.background)
    expect(wrapperStyle.backgroundImage).not.toBeDefined()
  })

  it('falls back to default background on image load error', function () {
    const user = {
      backgroundOption: 'custom',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} />
    )
    const styleOnError = {
      backgroundColor: '#4a90e2'
    }
    wrapper.instance().onImgError()
    const wrapperStyle = wrapper.get(0).props.style
    expect(wrapperStyle.backgroundColor).toBe(styleOnError.backgroundColor)
    expect(wrapperStyle.backgroundImage).not.toBeDefined()
  })

  it('calls to show an error message on image load error', function () {
    const user = {
      backgroundOption: 'custom',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const showErrorHandler = jest.fn()
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} showError={showErrorHandler} />
    )
    wrapper.instance().onImgError()
    expect(showErrorHandler).toHaveBeenCalledWith('We could not load your background image.')
  })

  it('correctly determines whether background props are different from state', function () {
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = shallow(
      <UserBackgroundImageComponent user={null} />
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
          imageURL: propsCustomImageURL
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
          imageURL: propsCustomImageURL
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
          imageURL: propsCustomImageURL
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
        setBackgroundSettings: jest.fn()
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
        setBackgroundSettings: jest.fn()
      }
    })

    const user = {
      backgroundOption: 'photo',
      customImage: null,
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    shallow(<UserBackgroundImageComponent user={user} />)
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
        setBackgroundSettings: jest.fn()
      }
    })

    const user = {
      backgroundOption: 'photo',
      customImage: null,
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png'
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
      backgroundOption: 'photo',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = mount(
      <UserBackgroundImageComponent user={user} />
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
        imageURL: 'https://example.com/pic.png'
      }
    }
    wrapper.setProps({ user: userUpdate }, () => {
      expect(setBackgroundSettings).toHaveBeenCalledTimes(1)
    })
  })

  it('does not save the background settings on prop update (when the settings are the same)', function () {
    const user = {
      backgroundOption: 'photo',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = mount(
      <UserBackgroundImageComponent user={user} />
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
        imageURL: 'https://example.com/pic.png'
      }
    }
    wrapper.setProps({ user: userUpdate }, () => {
      expect(setBackgroundSettings).not.toHaveBeenCalled()
    })
  })

  it('sets the expected tint overlay for a photo background', function () {
    const user = {
      backgroundOption: 'photo',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = mount(
      <UserBackgroundImageComponent user={user} />
    )

    const tintElem = wrapper
      .find('[data-test-id="background-tint-overlay"]').first()
    const tintColor = tintElem.props().style.backgroundColor
    expect(tintColor).toBe('rgba(0, 0, 0, 0.2)')
  })

  it('sets the expected tint overlay for a color background', function () {
    const user = {
      backgroundOption: 'color',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png'
      }
    }
    const UserBackgroundImageComponent = require('../UserBackgroundImageComponent').default
    const wrapper = mount(
      <UserBackgroundImageComponent user={user} />
    )

    const tintElem = wrapper
      .find('[data-test-id="background-tint-overlay"]').first()
    const tintColor = tintElem.props().style.backgroundColor
    expect(tintColor).toBe('rgba(0, 0, 0, 0.03)')
  })
})
