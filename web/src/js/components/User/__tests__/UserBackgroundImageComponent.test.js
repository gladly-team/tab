/* eslint-env jest */

import 'utils/jsdom-shims'
import React from 'react'
import { shallow } from 'enzyme'
import UserBackgroundImageComponent from '../UserBackgroundImageComponent'

jest.mock('utils/local-bkg-settings')

beforeEach(() => {
  jest.clearAllMocks()
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
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} />
    )
    const wrapperStyle = wrapper.get(0).props.style
    expect(wrapperStyle.backgroundImage).toBe('url(https://example.com/pic.png)')
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
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} />
    )
    const wrapperStyle = wrapper.get(0).props.style
    expect(wrapperStyle.backgroundImage).toBe('url(https://example.com/something.png)')
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
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} />
    )
    const wrapperStyle = wrapper.get(0).props.style
    expect(wrapperStyle.backgroundImage).toBe('url(https://example.com/some-custom-photo.png)')
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
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} />
    )
    const wrapperStyle = wrapper.get(0).props.style
    expect(wrapperStyle.backgroundColor).toBe('#FF0000')
    expect(wrapperStyle.backgroundImage).not.toBeDefined()
  })

  it('correctly determines whether background props change', function () {
    const user = {
      backgroundOption: 'color',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png'
      }
    }
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} />
    )

    const propsA = {
      user: {
        backgroundOption: 'photo',
        customImage: 'https://example.com/some-custom-photo.png',
        backgroundColor: '#FF0000',
        backgroundImage: {
          imageURL: 'https://example.com/pic.png'
        }
      }
    }
    const propsB = {
      user: {
        backgroundOption: 'color',
        customImage: 'https://example.com/some-custom-photo.png',
        backgroundColor: '#FF0000',
        backgroundImage: {
          imageURL: 'https://example.com/pic.png'
        }
      }
    }
    const propsC = {
      user: {
        backgroundOption: 'photo',
        customImage: 'https://example.com/some-custom-photo.png',
        backgroundColor: '#FF0000',
        backgroundImage: {
          imageURL: 'https://example.com/a-new-photo.png'
        }
      }
    }
    const propsD = {
      user: {
        backgroundOption: 'photo',
        customImage: 'https://example.com/some-custom-photo.png',
        backgroundColor: '#CDCDCD',
        backgroundImage: {
          imageURL: 'https://example.com/pic.png'
        }
      }
    }
    const propsAExtraneousChange = {
      user: {
        backgroundOption: 'photo',
        customImage: 'https://example.com/some-custom-photo.png',
        backgroundColor: '#FF0000',
        backgroundImage: {
          imageURL: 'https://example.com/pic.png'
        },
        someOtherProp: 'foo'
      }
    }
    expect(wrapper.instance()
      .hasBackgroundChanged(propsA, propsA)).toBe(false)
    expect(wrapper.instance()
      .hasBackgroundChanged(propsA, propsAExtraneousChange)).toBe(false)
    expect(wrapper.instance()
      .hasBackgroundChanged(propsA, propsB)).toBe(true)
    expect(wrapper.instance()
      .hasBackgroundChanged(propsA, propsC)).toBe(true)
    expect(wrapper.instance()
      .hasBackgroundChanged(propsA, propsD)).toBe(true)
  })

  it('calls to save background settings to storage on mount', function () {
    const user = {
      backgroundOption: 'photo',
      customImage: null,
      backgroundColor: '#FF0000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png'
      }
    }
    shallow(<UserBackgroundImageComponent user={user} />)
    const setBackgroundSettings = require('utils/local-bkg-settings')
      .setBackgroundSettings
    expect(setBackgroundSettings).toHaveBeenCalledTimes(1)
  })
})
