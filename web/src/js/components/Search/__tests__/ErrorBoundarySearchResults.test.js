/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
// import Button from '@material-ui/core/Button'
import logger from 'js/utils/logger'
// import Link from 'js/components/General/Link'
// import { getUrlParameters } from 'js/utils/utils'

jest.mock('js/utils/logger')
jest.mock('js/components/General/Link')
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
})
