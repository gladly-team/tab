/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import logger from 'js/utils/logger'
import SearchResultErrorMessage from 'js/components/Search/SearchResultErrorMessage'
import { getUrlParameters } from 'js/utils/utils'

jest.mock('js/utils/logger')
jest.mock('js/utils/utils')

const getMockProps = () => ({})

afterEach(() => {
  jest.clearAllMocks()
})

describe('ErrorBoundarySearchResults', function() {
  it('renders without error', () => {
    const ErrorBoundarySearchResults = require('js/components/Search/ErrorBoundarySearchResults')
      .default
    const mockProps = getMockProps()
    shallow(<ErrorBoundarySearchResults {...mockProps} />)
  })

  it('logs when an error is thrown', () => {
    const ErrorBoundarySearchResults = require('js/components/Search/ErrorBoundarySearchResults')
      .default
    const mockProps = getMockProps()
    const err = new Error('Uh oh.')
    const ProblemComponent = props => null
    const wrapper = mount(
      <ErrorBoundarySearchResults {...mockProps}>
        <ProblemComponent />
      </ErrorBoundarySearchResults>
    )
    wrapper.find(ProblemComponent).simulateError(err)
    expect(logger.error).toHaveBeenCalledWith(err)
  })

  it('returns the children until an error is thrown', () => {
    const ErrorBoundarySearchResults = require('js/components/Search/ErrorBoundarySearchResults')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ErrorBoundarySearchResults {...mockProps}>
        <div>hey there</div>
      </ErrorBoundarySearchResults>
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
    ).toBe('Unable to search at this time.')
  })

  it('returns a SearchResultErrorMessage when an error is thrown', () => {
    const ErrorBoundarySearchResults = require('js/components/Search/ErrorBoundarySearchResults')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <ErrorBoundarySearchResults {...mockProps}>
        <div>hey there</div>
      </ErrorBoundarySearchResults>
    )
    wrapper.setState({ hasError: true })
    expect(wrapper.at(0).type()).toEqual(SearchResultErrorMessage)
  })

  it('passes the query URL param value to the SearchResultErrorMessage if it exists', () => {
    getUrlParameters.mockReturnValue({
      q: 'cute floofer',
    })
    const ErrorBoundarySearchResults = require('js/components/Search/ErrorBoundarySearchResults')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <ErrorBoundarySearchResults {...mockProps}>
        <div>hey there</div>
      </ErrorBoundarySearchResults>
    )
    wrapper.setState({ hasError: true })
    expect(wrapper.find(SearchResultErrorMessage).prop('query')).toEqual(
      'cute floofer'
    )
  })

  it('passes a null query value to the SearchResultErrorMessage if no query exists', () => {
    getUrlParameters.mockReturnValue({})
    const ErrorBoundarySearchResults = require('js/components/Search/ErrorBoundarySearchResults')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(
      <ErrorBoundarySearchResults {...mockProps}>
        <div>hey there</div>
      </ErrorBoundarySearchResults>
    )
    wrapper.setState({ hasError: true })
    expect(wrapper.find(SearchResultErrorMessage).prop('query')).toBeNull()
  })
})
