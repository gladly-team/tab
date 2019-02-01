/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import LogoWithText from 'js/components/Logo/LogoWithText'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {
  externalRedirect,
  externalContactUsURL,
} from 'js/navigation/navigation'
import logger from 'js/utils/logger'

jest.mock('js/components/Logo/LogoWithText')
jest.mock('js/navigation/navigation')
jest.mock('js/utils/logger')

const getMockProps = () => ({
  ignoreErrors: false,
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('ErrorBoundary', function() {
  it('renders without error', () => {
    const ErrorBoundary = require('js/components/General/ErrorBoundary').default
    const mockProps = getMockProps()
    shallow(<ErrorBoundary {...mockProps} />)
  })

  it('logs when an error is thrown', () => {
    const ErrorBoundary = require('js/components/General/ErrorBoundary').default
    const mockProps = getMockProps()
    const err = new Error('Uh oh.')
    const ProblemComponent = props => null
    const wrapper = mount(
      <ErrorBoundary {...mockProps}>
        <ProblemComponent />
      </ErrorBoundary>
    )
    wrapper.find(ProblemComponent).simulateError(err)
    expect(logger.error).toHaveBeenCalledWith(err)
  })

  it("does not return the UI, even when there's an error, if the ignoreErrors prop is true", () => {
    const ErrorBoundary = require('js/components/General/ErrorBoundary').default
    const mockProps = getMockProps()
    mockProps.ignoreErrors = true
    const ProblemComponent = props => <div>No problem here!</div>
    const wrapper = mount(
      <ErrorBoundary {...mockProps}>
        <ProblemComponent />
      </ErrorBoundary>
    )
    wrapper.find(ProblemComponent).simulateError(new Error('Oh no!'))
    wrapper.update()
    expect(wrapper.html()).toEqual('<div>No problem here!</div>')
  })

  it('returns the children until an error is thrown', () => {
    const ErrorBoundary = require('js/components/General/ErrorBoundary').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ErrorBoundary {...mockProps}>
        <div>hey there</div>
      </ErrorBoundary>
    )
    expect(
      wrapper
        .find('div')
        .first()
        .text()
    ).toBe('hey there')
    wrapper.setState({ hasError: true })
    expect(
      wrapper
        .find(Typography)
        .first()
        .text()
    ).toBe('Oops!')
    expect(
      wrapper
        .find(Typography)
        .at(1)
        .text()
    ).toBe(
      'There was an error on the page. Please try reloading, or contact us if the problem continues.'
    )
  })

  it('shows the logo', () => {
    const ErrorBoundary = require('js/components/General/ErrorBoundary').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ErrorBoundary {...mockProps}>
        <div>hey there</div>
      </ErrorBoundary>
    )
    wrapper.setState({ hasError: true })
    expect(wrapper.find(LogoWithText).length).toBe(1)
  })

  it('shows a button to contact us', () => {
    const ErrorBoundary = require('js/components/General/ErrorBoundary').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ErrorBoundary {...mockProps}>
        <div>hey there</div>
      </ErrorBoundary>
    )
    wrapper.setState({ hasError: true })
    expect(
      wrapper
        .find(Button)
        .filterWhere(node => node.render().text() === 'Contact us').length
    ).toBe(1)
  })

  it('sends the user to the contact page when they click the "contact us" button', () => {
    const ErrorBoundary = require('js/components/General/ErrorBoundary').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ErrorBoundary {...mockProps}>
        <div>hey there</div>
      </ErrorBoundary>
    )
    wrapper.setState({ hasError: true })
    const contactButton = wrapper
      .find(Button)
      .filterWhere(node => node.render().text() === 'Contact us')
      .first()
    contactButton.simulate('click')
    expect(externalRedirect).toHaveBeenCalledWith(externalContactUsURL)
  })

  it('shows a button to reload the page', () => {
    const ErrorBoundary = require('js/components/General/ErrorBoundary').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ErrorBoundary {...mockProps}>
        <div>hey there</div>
      </ErrorBoundary>
    )
    wrapper.setState({ hasError: true })
    expect(
      wrapper
        .find(Button)
        .filterWhere(node => node.render().text() === 'Reload').length
    ).toBe(1)
  })

  it('reloads the page when the user clicks the "reload" button', () => {
    const ErrorBoundary = require('js/components/General/ErrorBoundary').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ErrorBoundary {...mockProps}>
        <div>hey there</div>
      </ErrorBoundary>
    )
    window.location.reload = jest.fn()
    wrapper.setState({ hasError: true })
    const reloadButton = wrapper
      .find(Button)
      .filterWhere(node => node.render().text() === 'Reload')
      .first()
    reloadButton.simulate('click')
    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })
})
