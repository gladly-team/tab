import React from 'react'
import { shallow, mount } from 'enzyme'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const mockOnClick = jest.fn()
const getMockProps = () => ({
  buttonOnClick: mockOnClick,
  buttonText: 'some text',
  text: <div>dummy text</div>,
})

describe('Notification component', () => {
  it('renders without error', () => {
    const Notification = require('js/components/Dashboard/NotificationV2')
      .default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<Notification {...mockProps} />)
    }).not.toThrow()
  })

  it('default buttonOnClick prop does nothing', () => {
    const Notification = require('js/components/Dashboard/NotificationV2')
      .default
    const mockProps = getMockProps()
    delete mockProps.buttonOnClick
    const wrapper = shallow(<Notification {...mockProps} />)
    const clickButton = wrapper.find(Button).first()
    expect(() => clickButton.simulate('click')).not.toThrow()
  })

  it('calls buttonOnClick prop when button is clicked', () => {
    const Notification = require('js/components/Dashboard/NotificationV2')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<Notification {...mockProps} />)
    const clickButton = wrapper.find(Button).first()
    expect(mockOnClick).not.toHaveBeenCalled()
    clickButton.simulate('click')
    expect(mockOnClick).toHaveBeenCalled()
  })

  it('renders the component passed into "text" prop', () => {
    const Notification = require('js/components/Dashboard/NotificationV2')
      .default
    const mockProps = {
      ...getMockProps(),
      text: <Typography>sameText</Typography>,
    }
    const wrapper = shallow(<Notification {...mockProps} />)
    const typography = wrapper.find(Typography).first()
    expect(typography.children().text()).toEqual('sameText')
  })

  it('renders the button text prop', () => {
    const Notification = require('js/components/Dashboard/NotificationV2')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<Notification {...mockProps} />)
    const clickButton = wrapper.find(Button).first()
    expect(clickButton.children().text()).toEqual('some text')
  })

  it('does not render a button if includeButton is set to false', () => {
    const Notification = require('js/components/Dashboard/NotificationV2')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <Notification {...mockProps} includeButton={false} />
    )
    expect(wrapper.find(Button).length).toBe(0)
  })

  it('does not render a second button if includeSecondaryButton is set to false/unset', () => {
    const Notification = require('js/components/Dashboard/NotificationV2')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<Notification {...mockProps} />)

    // Renders only the first button
    expect(wrapper.find(Button).length).toBe(1)
  })

  it('does render a second button if includeSecondaryButton is set to true', () => {
    const Notification = require('js/components/Dashboard/NotificationV2')
      .default
    const secondaryButtonOnClick = jest.fn()
    const mockProps = {
      ...getMockProps(),
      includeSecondaryButton: true,
      secondaryButtonOnClick,
      secondaryButtonText: 'secondButton',
    }
    const wrapper = shallow(<Notification {...mockProps} />)
    expect(wrapper.find(Button).length).toBe(2)
    const clickButton = wrapper.find(Button).first()
    expect(clickButton.children().text()).toEqual('secondButton')
  })

  it('calls secondaryButtonOnClick prop when second button is clicked', () => {
    const Notification = require('js/components/Dashboard/NotificationV2')
      .default
    const secondaryButtonOnClick = jest.fn()
    const mockProps = {
      ...getMockProps(),
      includeSecondaryButton: true,
      secondaryButtonOnClick,
      secondaryButtonText: 'secondButton',
    }
    const wrapper = shallow(<Notification {...mockProps} />)
    expect(wrapper.find(Button).length).toBe(2)
    const clickButton = wrapper.find(Button).first()
    expect(secondaryButtonOnClick).not.toHaveBeenCalled()
    clickButton.simulate('click')
    expect(secondaryButtonOnClick).toHaveBeenCalled()
  })

  it('calls secondaryButtonOnClick default value when second button is clicked', () => {
    const Notification = require('js/components/Dashboard/NotificationV2')
      .default
    const mockProps = {
      ...getMockProps(),
      includeSecondaryButton: true,
      secondaryButtonText: 'secondButton',
    }
    const wrapper = shallow(<Notification {...mockProps} />)
    expect(wrapper.find(Button).length).toBe(2)
    const clickButton = wrapper.find(Button).first()
    expect(() => clickButton.simulate('click')).not.toThrow()
  })

  it('renders buttons instead of built-in buttons if specified', () => {
    const Notification = require('js/components/Dashboard/NotificationV2')
      .default
    const mockProps = {
      ...getMockProps(),
      includeSecondaryButton: true,
      secondaryButtonText: 'secondButton',
      buttons: <Button key={1}>Other Test Button</Button>,
    }
    const wrapper = mount(<Notification {...mockProps} />)
    const buttons = wrapper.find(Button)

    // Assert only button is the one in the buttons key
    expect(buttons).toHaveLength(1)
    expect(buttons.first().text()).toEqual('Other Test Button')
  })

  it('renders null if not open', () => {
    const Notification = require('js/components/Dashboard/NotificationV2')
      .default
    const mockProps = {
      ...getMockProps(),
      open: false,
    }
    const wrapper = shallow(<Notification {...mockProps} />)
    expect(wrapper.type()).toEqual(null)
  })
})
