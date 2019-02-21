/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import { mountWithHOC } from 'js/utils/test-utils'
import SettingsDropdown from 'js/components/Dashboard/SettingsDropdownComponent'
import { logout } from 'js/authentication/user'
import { goToLogin } from 'js/navigation/navigation'
import logger from 'js/utils/logger'

jest.mock('js/authentication/user')
jest.mock('js/navigation/navigation')
jest.mock('js/utils/logger')

const getMockProps = () => ({
  isUserAnonymous: false,
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SettingsButtonComponent', () => {
  it('renders without error', () => {
    const SettingsButtonComponent = require('js/components/Dashboard/SettingsButtonComponent')
      .default
    const mockProps = getMockProps()
    shallow(<SettingsButtonComponent {...mockProps} />).dive()
  })

  it('contains an ID for the new user tour (to showcase the settings button)', () => {
    const mockProps = getMockProps()
    const SettingsButtonComponent = require('js/components/Dashboard/SettingsButtonComponent')
      .default
    const wrapper = shallow(<SettingsButtonComponent {...mockProps} />).dive()

    // Important: other code relies on the data-tour-id to show the
    // new user tour. Do not change it without updating it elsewhere.
    expect(wrapper.find('[data-tour-id="settings-button"]').length).toBe(1)
  })

  it('is the expected color when not hovering', () => {
    const SettingsButtonComponent = require('js/components/Dashboard/SettingsButtonComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = mountWithHOC(<SettingsButtonComponent {...mockProps} />)
    const typographyComputedStyle = window.getComputedStyle(
      wrapper
        .find('[data-test-id="settings-button"]')
        .first()
        .getDOMNode()
    )
    expect(typographyComputedStyle).toHaveProperty(
      'color',
      'rgba(255, 255, 255, 0.8)'
    )
  })

  it('is the expected color when hovering', () => {
    const SettingsButtonComponent = require('js/components/Dashboard/SettingsButtonComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = mountWithHOC(<SettingsButtonComponent {...mockProps} />)

    // Simulate hover
    wrapper
      .find('[data-test-id="settings-button"]')
      .first()
      .simulate('mouseenter')
    const typographyComputedStyle = window.getComputedStyle(
      wrapper
        .find('[data-test-id="settings-button"]')
        .first()
        .getDOMNode()
    )
    expect(typographyComputedStyle).toHaveProperty('color', 'white')

    // Simulate end hovering
    wrapper
      .find('[data-test-id="settings-button"]')
      .first()
      .simulate('mouseleave')
    const typographyComputedStyleNoHover = window.getComputedStyle(
      wrapper
        .find('[data-test-id="settings-button"]')
        .first()
        .getDOMNode()
    )
    expect(typographyComputedStyleNoHover).toHaveProperty(
      'color',
      'rgba(255, 255, 255, 0.8)'
    )
  })

  it('is the expected color after clicking', () => {
    const SettingsButtonComponent = require('js/components/Dashboard/SettingsButtonComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = mountWithHOC(<SettingsButtonComponent {...mockProps} />)
    wrapper
      .find('[data-test-id="settings-button"]')
      .first()
      .simulate('click')
    const typographyComputedStyle = window.getComputedStyle(
      wrapper
        .find('[data-test-id="settings-button"]')
        .first()
        .getDOMNode()
    )
    expect(typographyComputedStyle).toHaveProperty('color', 'white')
  })

  it('opens the dropdown on click', () => {
    const SettingsButtonComponent = require('js/components/Dashboard/SettingsButtonComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = mountWithHOC(<SettingsButtonComponent {...mockProps} />)

    expect(wrapper.find(SettingsDropdown).prop('open')).toBe(false)
    wrapper
      .find('[data-test-id="settings-button"]')
      .first()
      .simulate('click')
    expect(wrapper.find(SettingsDropdown).prop('open')).toBe(true)
  })

  it('calls to log out when SettingsDropdown calls onLogoutClick', () => {
    const SettingsButtonComponent = require('js/components/Dashboard/SettingsButtonComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = mountWithHOC(<SettingsButtonComponent {...mockProps} />)

    const onLogoutClickFunc = wrapper
      .find(SettingsDropdown)
      .prop('onLogoutClick')
    onLogoutClickFunc()
    expect(logout).toHaveBeenCalled()
  })

  it('redirects to the login page on a successful logout', done => {
    const SettingsButtonComponent = require('js/components/Dashboard/SettingsButtonComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = mountWithHOC(<SettingsButtonComponent {...mockProps} />)

    logout.mockResolvedValueOnce(true)
    goToLogin.mockImplementationOnce(async () => {
      done()
    })
    const onLogoutClickFunc = wrapper
      .find(SettingsDropdown)
      .prop('onLogoutClick')
    onLogoutClickFunc()
  })

  it('logs an error on a failed logout', done => {
    const SettingsButtonComponent = require('js/components/Dashboard/SettingsButtonComponent')
      .default
    const mockProps = getMockProps()
    const wrapper = mountWithHOC(<SettingsButtonComponent {...mockProps} />)

    logout.mockImplementationOnce(async () => {
      throw new Error('Uh oh :(')
    })
    logger.error.mockImplementationOnce(async () => {
      done()
    })
    const onLogoutClickFunc = wrapper
      .find(SettingsDropdown)
      .prop('onLogoutClick')
    onLogoutClickFunc()
  })
})
