/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Link from 'js/components/General/Link'
import { setNotificationDismissTime } from 'js/utils/local-user-data-mgr'

jest.mock('js/utils/local-user-data-mgr')

const getMockProps = () => ({
  title: 'Message Title',
  message: 'Here is some additional information.',
  buttonText: 'Click Me',
  buttonURL: 'http://example.com/some-link/',
  onClick: undefined,
  onDismiss: undefined,
  useGlobalDismissalTime: false,
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('Notification component', () => {
  it('renders without error', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent')
      .default
    shallow(<Notification {...getMockProps()} />)
  })

  it('displays the notification title', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent')
      .default
    const mockProps = getMockProps()
    mockProps.title = 'Some title!'
    const wrapper = shallow(<Notification {...mockProps} />)
    expect(
      wrapper
        .find(Typography)
        .first()
        .children()
        .text()
    ).toBe(`Some title!`)
  })

  it('displays the notification message as Typography when the message prop is a string', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent')
      .default
    const mockProps = getMockProps()
    mockProps.message = 'ABC 123 this is a message'
    const wrapper = shallow(<Notification {...mockProps} />)
    const notificationMsg = wrapper.find(
      '[data-test-id="notification-message"]'
    )
    expect(notificationMsg.type()).toEqual(Typography)
    expect(notificationMsg.children().text()).toBe(`ABC 123 this is a message`)
  })

  it('displays the notification message as a div with children when the message prop is a node', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent')
      .default
    const mockProps = getMockProps()
    mockProps.message = (
      <div>
        <p>
          This message is a little more <b>complicated</b>.
        </p>
        <p>Isn't it</p>
      </div>
    )
    const wrapper = shallow(<Notification {...mockProps} />)
    const notificationMsg = wrapper.find(
      '[data-test-id="notification-message"]'
    )
    expect(notificationMsg.type()).toEqual('div')
    expect(notificationMsg.children().html()).toEqual(
      `<div><p>This message is a little more <b>complicated</b>.</p><p>Isn&#x27;t it</p></div>`
    )
  })

  it('displays only the "dismiss" button when no action button is provided', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent')
      .default
    const mockProps = getMockProps()
    delete mockProps.buttonURL
    const wrapper = shallow(<Notification {...mockProps} />)
    expect(wrapper.find(Button).length).toBe(1)
    expect(
      wrapper
        .find(Button)
        .first()
        .render()
        .text()
    ).toBe(`Dismiss`)
  })

  it('displays two buttons when an action button is provided', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent')
      .default
    const mockProps = getMockProps()
    mockProps.buttonURL = 'http://example.com'
    mockProps.buttonText = 'Do the thing'
    const wrapper = shallow(<Notification {...mockProps} />)
    expect(wrapper.find(Button).length).toBe(2)
    expect(
      wrapper
        .find(Button)
        .at(1)
        .render()
        .text()
    ).toBe(`Do the thing`)
  })

  it('creates an outbound button link with the buttonURL', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent')
      .default
    const mockProps = getMockProps()
    mockProps.buttonURL = 'http://example.com'
    mockProps.buttonText = 'Do the thing'
    const wrapper = shallow(<Notification {...mockProps} />)
    expect(
      wrapper
        .find(Link)
        .first()
        .prop('to')
    ).toBe('http://example.com')
  })

  it('does not create an outbound button link when buttonText is not provided', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent')
      .default
    const mockProps = getMockProps()
    delete mockProps.buttonText
    mockProps.buttonURL = 'http://example.com'
    mockProps.onClick = jest.fn()
    const wrapper = shallow(<Notification {...mockProps} />)
    expect(
      wrapper
        .find(Link)
        .first()
        .exists()
    ).toBe(false)
  })

  it('does not create an outbound button link when neither buttonURL nor onClick is provided', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent')
      .default
    const mockProps = getMockProps()
    delete mockProps.buttonURL
    delete mockProps.onClick
    mockProps.buttonText = 'Do the thing'
    const wrapper = shallow(<Notification {...mockProps} />)
    expect(
      wrapper
        .find(Link)
        .first()
        .exists()
    ).toBe(false)
  })

  it('sets the dismiss time in local storage when clicking the "dismiss" button and the "useGlobalDismissalTime" prop is true', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent')
      .default
    const mockProps = getMockProps()
    mockProps.useGlobalDismissalTime = true
    const wrapper = shallow(<Notification {...mockProps} />)
    wrapper
      .find(Button)
      .first()
      .simulate('click')
    expect(setNotificationDismissTime).toHaveBeenCalled()
  })

  it('does not set the dismiss time in local storage when clicking the "dismiss" button if the "useGlobalDismissalTime" is false', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent')
      .default
    const mockProps = getMockProps()
    mockProps.useGlobalDismissalTime = false
    const wrapper = shallow(<Notification {...mockProps} />)
    wrapper
      .find(Button)
      .first()
      .simulate('click')
    expect(setNotificationDismissTime).not.toHaveBeenCalled()
  })

  it('calls the onDismiss prop when clicking the "dismiss" button', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent')
      .default
    const mockProps = getMockProps()
    mockProps.onDismiss = jest.fn()
    const wrapper = shallow(<Notification {...mockProps} />)
    wrapper
      .find(Button)
      .first()
      .simulate('click')
    expect(mockProps.onDismiss).toHaveBeenCalled()
  })

  it('displays two buttons when we provide an action button with "onClick"', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent')
      .default
    const mockProps = getMockProps()
    delete mockProps.buttonURL
    mockProps.buttonText = 'Click the button'
    mockProps.onClick = jest.fn()
    const wrapper = shallow(<Notification {...mockProps} />)
    expect(wrapper.find(Button).length).toBe(2)
    expect(
      wrapper
        .find(Button)
        .at(1)
        .render()
        .text()
    ).toBe(`Click the button`)
  })

  it('calls the onClick prop when clicking the action button with an onClick prop', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent')
      .default
    const mockProps = getMockProps()
    mockProps.buttonText = 'Click the button'
    delete mockProps.buttonURL
    mockProps.onClick = jest.fn()
    const wrapper = shallow(<Notification {...mockProps} />)
    wrapper
      .find(Button)
      .at(1)
      .simulate('click')
    expect(mockProps.onClick).toHaveBeenCalled()
  })

  it('creates an outbound button link with the "buttonURL" and calls "onClick" when both are provided', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent')
      .default
    const mockProps = getMockProps()
    mockProps.buttonURL = 'http://example.com'
    mockProps.buttonText = 'Do the thing'
    mockProps.onClick = jest.fn()
    const wrapper = shallow(<Notification {...mockProps} />)
    expect(
      wrapper
        .find(Link)
        .first()
        .prop('to')
    ).toBe('http://example.com')
    wrapper
      .find(Button)
      .at(1)
      .simulate('click')
    expect(mockProps.onClick).toHaveBeenCalled()
  })
})
