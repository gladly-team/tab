/* eslint-env jest */

import 'utils/jsdom-shims'
import React from 'react'
import { shallow } from 'enzyme'
import UserBackgroundImageComponent from '../UserBackgroundImageComponent'

describe('User background image component', function () {
  it('renders with a photo background', function () {
    const user = {
      backgroundOption: 'photo',
      customImage: null,
      backgroundColor: '#FF000',
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

  it('renders with a custom photo background', function () {
    const user = {
      backgroundOption: 'custom',
      customImage: 'https://example.com/some-custom-photo.png',
      backgroundColor: '#FF000',
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
      backgroundColor: '#FF000',
      backgroundImage: {
        imageURL: 'https://example.com/pic.png'
      }
    }
    const wrapper = shallow(
      <UserBackgroundImageComponent user={user} />
    )
    const wrapperStyle = wrapper.get(0).props.style
    expect(wrapperStyle.backgroundColor).toBe('#FF000')
    expect(wrapperStyle.backgroundImage).not.toBeDefined()
  })
})
