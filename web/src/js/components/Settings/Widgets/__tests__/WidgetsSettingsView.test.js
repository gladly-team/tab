/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import { QueryRenderer } from 'react-relay'
import WidgetsSettingsView from 'js/components/Settings/Widgets/WidgetsSettingsView'
import WidgetsSettings from 'js/components/Settings/Widgets/WidgetsSettingsContainer'
import ErrorMessage from 'js/components/General/ErrorMessage'
import logger from 'js/utils/logger'

jest.mock('react-relay')
jest.mock('js/components/General/ErrorMessage')
jest.mock('js/components/General/withUser')
jest.mock('js/utils/logger')
jest.mock('js/components/Settings/Widgets/WidgetsSettingsContainer')

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({
  showError: jest.fn(),
})

describe('withUser HOC in WidgetsSettingsView', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('is called with the expected options', () => {
    const withUser = require('js/components/General/withUser').default

    /* eslint-disable-next-line no-unused-expressions */
    require('js/components/Settings/Widgets/WidgetsSettingsView').default
    expect(withUser).toHaveBeenCalledWith()
  })

  // TODO: test it actually wraps the WidgetsSettingsView component
})

describe('WidgetsSettingsView', () => {
  it('renders without error', () => {
    const mockProps = getMockProps()
    shallow(<WidgetsSettingsView {...mockProps} />).dive()
  })

  it('sets a root style of 100% width and height', () => {
    const mockProps = getMockProps()
    shallow(<WidgetsSettingsView {...mockProps} />).dive()
  })

  it('includes a QueryRenderer', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<WidgetsSettingsView {...mockProps} />).dive()
    expect(wrapper.find(QueryRenderer).exists()).toBe(true)
  })

  it('passes the expected variables to the QueryRenderer', () => {
    const mockProps = getMockProps()
    const wrapper = mount(<WidgetsSettingsView {...mockProps} />)
    expect(wrapper.find(QueryRenderer).prop('variables')).toEqual({
      userId: 'abc123xyz456', // default value in `withUser` mock
    })
  })

  it('does not render the child component before data has returned', () => {
    // No QueryRenderer response set.
    const mockProps = getMockProps()
    const wrapper = mount(<WidgetsSettingsView {...mockProps} />)
    expect(wrapper.find(WidgetsSettings).exists()).toBe(false)
  })

  it('does not render the child component when there is no data', () => {
    QueryRenderer.__setQueryResponse({
      error: null,
      props: null,
      retry: jest.fn(),
    })
    const mockProps = getMockProps()
    const wrapper = mount(<WidgetsSettingsView {...mockProps} />)
    expect(wrapper.find(WidgetsSettings).exists()).toBe(false)
  })

  it('passes the expected props to the child component', () => {
    const fakeQueryRendererProps = {
      app: {
        some: 'value',
      },
      user: {
        id: 'abc123xyz456',
        vc: 233,
      },
    }
    QueryRenderer.__setQueryResponse({
      error: null,
      props: fakeQueryRendererProps,
      retry: jest.fn(),
    })
    const mockProps = getMockProps()
    const wrapper = mount(<WidgetsSettingsView {...mockProps} />)
    expect(wrapper.find(WidgetsSettings).props()).toEqual({
      app: fakeQueryRendererProps.app,
      user: fakeQueryRendererProps.user,
      showError: mockProps.showError,
    })
  })

  it('logs an error and renders an ErrorMessage if unexpected QueryRenderer errors occur', () => {
    QueryRenderer.__setQueryResponse({
      error: {
        name: 'RelayNetwork',
        type: 'mustfix',
        framesToPop: 2,
        source: {
          errors: [
            {
              message: 'Something went horribly wrong.',
              locations: [
                {
                  line: 8,
                  column: 3,
                },
              ],
              path: ['user'],
              code: 'HORRIBLY_WRONG_ERROR',
            },
          ],
          operation: { foo: 'bar' },
          variables: { foo: 'baz' },
        },
      },
      props: null,
      retry: jest.fn(),
    })

    const mockProps = getMockProps()
    const wrapper = mount(<WidgetsSettingsView {...mockProps} />)

    // An error should render instead of the view.
    expect(wrapper.find(WidgetsSettings).length).toBe(0)
    expect(wrapper.find(ErrorMessage).exists()).toBe(true)
    expect(wrapper.find(ErrorMessage).prop('message')).toBe(
      'We had a problem loading the widget settings :('
    )
    expect(logger.error).toHaveBeenCalled()
  })
})
