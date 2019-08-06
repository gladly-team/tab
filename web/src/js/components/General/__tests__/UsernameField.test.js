/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import TextField from '@material-ui/core/TextField'

const getMockProps = () => ({
  otherError: false,
  usernameDuplicate: false,
})

describe('UsernameField tests', function() {
  it('renders without error', function() {
    const UsernameField = require('js/components/General/UsernameField').default
    const mockProps = getMockProps()
    shallow(<UsernameField {...mockProps} />)
  })

  it('does not show any error text if there are no errors', function() {
    const UsernameField = require('js/components/General/UsernameField').default
    const mockProps = getMockProps()
    mockProps.otherError = false
    mockProps.usernameDuplicate = false
    const wrapper = shallow(<UsernameField {...mockProps} />)
    const textFieldElem = wrapper.find(TextField)
    expect(textFieldElem.prop('helperText')).toBeNull()
    expect(textFieldElem.prop('error')).toBe(false)
  })

  it('shows error text if the "usernameDuplicate" prop is true', function() {
    const UsernameField = require('js/components/General/UsernameField').default
    const mockProps = getMockProps()
    mockProps.usernameDuplicate = true
    const wrapper = shallow(<UsernameField {...mockProps} />)
    const textFieldElem = wrapper.find(TextField)
    expect(textFieldElem.prop('helperText')).toEqual(
      'Username is already taken. Please choose another.'
    )
    expect(textFieldElem.prop('error')).toBe(true)
  })

  it('shows error text if the "otherError" prop is true', function() {
    const UsernameField = require('js/components/General/UsernameField').default
    const mockProps = getMockProps()
    mockProps.otherError = true
    const wrapper = shallow(<UsernameField {...mockProps} />)
    const textFieldElem = wrapper.find(TextField)
    expect(textFieldElem.prop('helperText')).toEqual(
      'There was an error saving your username. Please try again later.'
    )
    expect(textFieldElem.prop('error')).toBe(true)
  })

  it('shows an error on validation if the username field has no value', function() {
    const UsernameField = require('js/components/General/UsernameField').default
    const mockProps = getMockProps()
    const wrapper = mount(<UsernameField {...mockProps} />)
    wrapper
      .find(TextField)
      .find('input')
      .instance().value = ''
    wrapper.instance().validate()
    wrapper.update()
    const textFieldElem = wrapper.find(TextField)
    expect(textFieldElem.prop('helperText')).toEqual(
      'Must be at least two characters.'
    )
    expect(textFieldElem.prop('error')).toBe(true)
  })

  it('shows an error on validation if the username is only one character', function() {
    const UsernameField = require('js/components/General/UsernameField').default
    const mockProps = getMockProps()
    const wrapper = mount(<UsernameField {...mockProps} />)
    wrapper
      .find(TextField)
      .find('input')
      .instance().value = 'y'
    wrapper.instance().validate()
    wrapper.update()
    const textFieldElem = wrapper.find(TextField)
    expect(textFieldElem.prop('helperText')).toEqual(
      'Must be at least two characters.'
    )
    expect(textFieldElem.prop('error')).toBe(true)
  })

  it('shows an error on validation if the username contains a space', function() {
    const UsernameField = require('js/components/General/UsernameField').default
    const mockProps = getMockProps()
    const wrapper = mount(<UsernameField {...mockProps} />)
    wrapper
      .find(TextField)
      .find('input')
      .instance().value = 'bad username'
    wrapper.instance().validate()
    wrapper.update()
    const textFieldElem = wrapper.find(TextField)
    expect(textFieldElem.prop('helperText')).toEqual('Cannot contain spaces.')
    expect(textFieldElem.prop('error')).toBe(true)
  })

  it('shows an error on validation if the username contains an "@" symbol', function() {
    const UsernameField = require('js/components/General/UsernameField').default
    const mockProps = getMockProps()
    const wrapper = mount(<UsernameField {...mockProps} />)
    wrapper
      .find(TextField)
      .find('input')
      .instance().value = 'badusername@example.com'
    wrapper.instance().validate()
    wrapper.update()
    const textFieldElem = wrapper.find(TextField)
    expect(textFieldElem.prop('helperText')).toEqual('Should not contain "@".')
    expect(textFieldElem.prop('error')).toBe(true)
  })

  it('removes the error after a second validation in which the username is valid', function() {
    const UsernameField = require('js/components/General/UsernameField').default
    const mockProps = getMockProps()
    const wrapper = mount(<UsernameField {...mockProps} />)
    wrapper
      .find(TextField)
      .find('input')
      .instance().value = 'y'
    wrapper.instance().validate()
    wrapper.update()
    expect(wrapper.find(TextField).prop('helperText')).not.toBeNull()
    expect(wrapper.find(TextField).prop('error')).toBe(true)

    // Fix the validation error.
    wrapper
      .find(TextField)
      .find('input')
      .instance().value = 'yay'
    wrapper.instance().validate()
    wrapper.update()
    expect(wrapper.find(TextField).prop('helperText')).toBeNull()
    expect(wrapper.find(TextField).prop('error')).toBe(false)
  })
})
