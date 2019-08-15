/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import Snackbar from '@material-ui/core/Snackbar'

const getMockProps = () => ({
  message: 'We kinda messed up.',
  open: true,
})

describe('ErrorMessage', () => {
  it('renders without error', () => {
    const ErrorMessage = require('js/components/General/ErrorMessage').default
    const mockProps = getMockProps()
    shallow(<ErrorMessage {...mockProps} />)
  })

  it('returns a Snackbar', () => {
    const ErrorMessage = require('js/components/General/ErrorMessage').default
    const mockProps = getMockProps()
    const wrapper = shallow(<ErrorMessage {...mockProps} />)
    expect(wrapper.type()).toEqual(Snackbar)
  })

  it('returns null if no message is set', () => {
    const ErrorMessage = require('js/components/General/ErrorMessage').default
    const mockProps = getMockProps()
    mockProps.open = true
    mockProps.message = undefined
    const wrapper = shallow(<ErrorMessage {...mockProps} />)
    expect(wrapper.type()).toBeNull()
  })

  it('passes the message to the Snackbar', () => {
    const ErrorMessage = require('js/components/General/ErrorMessage').default
    const mockProps = getMockProps()
    mockProps.message = 'Ohhhhh boy.'
    const wrapper = shallow(<ErrorMessage {...mockProps} />)
    expect(wrapper.find(Snackbar).prop('message')).toEqual('Ohhhhh boy.')
  })

  it('passes the "open" prop to the Snackbar', () => {
    const ErrorMessage = require('js/components/General/ErrorMessage').default
    const mockProps = getMockProps()
    mockProps.open = true
    const wrapper = shallow(<ErrorMessage {...mockProps} />)
    expect(wrapper.find(Snackbar).prop('open')).toBe(true)
    wrapper.setProps({ open: false })
    expect(wrapper.find(Snackbar).prop('open')).toBe(false)
  })

  it('sets the Snackbar to be open by default when no "open" prop is provided', () => {
    const ErrorMessage = require('js/components/General/ErrorMessage').default
    const mockProps = getMockProps()
    mockProps.open = undefined
    const wrapper = shallow(<ErrorMessage {...mockProps} />)
    expect(wrapper.find(Snackbar).prop('open')).toBe(true)
  })

  it('sets a data-test-id="error-message"', () => {
    const ErrorMessage = require('js/components/General/ErrorMessage').default
    const mockProps = getMockProps()
    const wrapper = shallow(<ErrorMessage {...mockProps} />)
    expect(wrapper.find(Snackbar).prop('data-test-id')).toEqual('error-message')
  })

  it('shows the Snackbar at bottom-center by default', () => {
    const ErrorMessage = require('js/components/General/ErrorMessage').default
    const mockProps = getMockProps()
    const wrapper = shallow(<ErrorMessage {...mockProps} />)
    expect(wrapper.find(Snackbar).prop('anchorOrigin')).toEqual({
      vertical: 'bottom',
      horizontal: 'center',
    })
  })

  it('sets the Snackbar autoHideDuration to 4000ms by default', () => {
    const ErrorMessage = require('js/components/General/ErrorMessage').default
    const mockProps = getMockProps()
    const wrapper = shallow(<ErrorMessage {...mockProps} />)
    expect(wrapper.find(Snackbar).prop('autoHideDuration')).toEqual(4000)
  })

  it('allows overriding most props and allows extending the style prop', () => {
    const ErrorMessage = require('js/components/General/ErrorMessage').default
    const mockProps = getMockProps()
    mockProps.anchorOrigin = {
      vertical: 'top',
      horizontal: 'left',
    }
    mockProps.style = { fontSize: 200 }
    mockProps['data-test-id'] = 'my-thing'
    mockProps.autoHideDuration = 1400
    const wrapper = shallow(<ErrorMessage {...mockProps} />)
    expect(wrapper.find(Snackbar).prop('anchorOrigin')).toEqual({
      vertical: 'top',
      horizontal: 'left',
    })
    expect(wrapper.find(Snackbar).prop('style')).toEqual({
      fontSize: 200,
    })
    expect(wrapper.find(Snackbar).prop('data-test-id')).toEqual('my-thing')
    expect(wrapper.find(Snackbar).prop('autoHideDuration')).toEqual(1400)
  })
})
