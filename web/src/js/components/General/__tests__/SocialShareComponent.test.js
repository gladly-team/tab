/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  // PinterestShareButton,
  // RedditShareButton,
  // TumblrShareButton,
  // TwitterShareButton,
} from 'react-share'

const getMockProps = () => ({
  url: 'https://example.com/share-me/',
  EmailShareButtonProps: {
    subject: 'Hi there',
    body: 'This is where we say stuff!',
  },
  FacebookShareButtonProps: {
    quote: 'This is where we say stuff!',
  },
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SocialShare component', () => {
  it('renders without error', () => {
    const SocialShare = require('js/components/General/SocialShareComponent')
      .default
    const mockProps = getMockProps()
    shallow(<SocialShare {...mockProps} />).dive()
  })

  it('renders an EmailShareButton and EmailIcon when EmailShareButtonProps is provided', () => {
    const SocialShare = require('js/components/General/SocialShareComponent')
      .default
    const mockProps = {
      ...getMockProps(),
      EmailShareButtonProps: {
        subject: 'Hi there',
        body: 'This is where we say stuff!',
      },
    }
    const wrapper = shallow(<SocialShare {...mockProps} />).dive()
    expect(wrapper.find(EmailIcon).exists()).toBe(true)
    expect(wrapper.find(EmailShareButton).exists()).toBe(true)
    expect(wrapper.find(EmailShareButton).props()).toEqual({
      ...mockProps.EmailShareButtonProps,
      children: expect.any(Object),
      url: mockProps.url,
    })
  })

  it('does not render an EmailShareButton or EmailIcon when EmailShareButtonProps is not provided', () => {
    const SocialShare = require('js/components/General/SocialShareComponent')
      .default
    const mockProps = {
      ...getMockProps(),
      EmailShareButtonProps: undefined,
    }
    const wrapper = shallow(<SocialShare {...mockProps} />).dive()
    expect(wrapper.find(EmailIcon).exists()).toBe(false)
    expect(wrapper.find(EmailShareButton).exists()).toBe(false)
  })

  it('renders an FacebookShareButton and FacebookIcon when FacebookShareButtonProps is provided', () => {
    const SocialShare = require('js/components/General/SocialShareComponent')
      .default
    const mockProps = {
      ...getMockProps(),
      FacebookShareButtonProps: {
        quote: 'This is where we say stuff!',
      },
    }
    const wrapper = shallow(<SocialShare {...mockProps} />).dive()
    expect(wrapper.find(FacebookIcon).exists()).toBe(true)
    expect(wrapper.find(FacebookShareButton).exists()).toBe(true)
    expect(wrapper.find(FacebookShareButton).props()).toEqual({
      ...mockProps.FacebookShareButtonProps,
      children: expect.any(Object),
      url: mockProps.url,
    })
  })

  it('does not render an FacebookShareButton or FacebookIcon when FacebookShareButtonProps is not provided', () => {
    const SocialShare = require('js/components/General/SocialShareComponent')
      .default
    const mockProps = {
      ...getMockProps(),
      FacebookShareButtonProps: undefined,
    }
    const wrapper = shallow(<SocialShare {...mockProps} />).dive()
    expect(wrapper.find(FacebookIcon).exists()).toBe(false)
    expect(wrapper.find(FacebookShareButton).exists()).toBe(false)
  })
})
