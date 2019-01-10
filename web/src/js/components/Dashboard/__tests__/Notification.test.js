/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Link from 'js/components/General/Link'

const getMockProps = () => ({
  title: 'Message Title',
  message: 'Here is some additional information.',
  buttonText: 'Click Me',
  buttonURL: 'http://example.com/some-link/'
})

describe('Notification component', () => {
  it('renders without error', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent').default
    shallow(
      <Notification {...getMockProps()} />
    )
  })

  it('displays the notification title', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent').default
    const mockProps = getMockProps()
    mockProps.title = 'Some title!'
    const wrapper = shallow(
      <Notification {...mockProps} />
    )
    expect(
      wrapper.find(Typography)
        .first().children().text())
      .toBe(`Some title!`)
  })

  it('displays the notification message', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent').default
    const mockProps = getMockProps()
    mockProps.message = 'ABC 123 this is a message'
    const wrapper = shallow(
      <Notification {...mockProps} />
    )
    expect(
      wrapper.find(Typography)
        .at(1).children().text())
      .toBe(`ABC 123 this is a message`)
  })

  it('displays only the "dismiss" button when an action button is provided', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent').default
    const mockProps = getMockProps()
    delete mockProps.buttonURL
    const wrapper = shallow(
      <Notification {...mockProps} />
    )
    expect(wrapper.find(Button).length)
      .toBe(1)
    expect(wrapper.find(Button).first().render().text())
      .toBe(`Dismiss`)
  })

  it('displays two buttons when an action button is provided', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent').default
    const mockProps = getMockProps()
    mockProps.buttonURL = 'http://example.com'
    mockProps.buttonText = 'Do the thing'
    const wrapper = shallow(
      <Notification {...mockProps} />
    )
    expect(wrapper.find(Button).length)
      .toBe(2)
    expect(wrapper.find(Button).at(1).render().text())
      .toBe(`Do the thing`)
  })

  it('creates an outbound button link with the buttonURL', () => {
    const Notification = require('js/components/Dashboard/NotificationComponent').default
    const mockProps = getMockProps()
    mockProps.buttonURL = 'http://example.com'
    mockProps.buttonText = 'Do the thing'
    const wrapper = shallow(
      <Notification {...mockProps} />
    )
    expect(wrapper.find(Link).first().prop('to'))
      .toBe('http://example.com')
  })
})
