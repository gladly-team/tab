/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'
import IconButton from '@material-ui/core/IconButton'
import SettingsPage from 'js/components/Settings/SettingsPageComponent'
import ErrorMessage from 'js/components/General/ErrorMessage'
import { goToDashboard } from 'js/navigation/navigation'

jest.mock('js/components/General/ErrorMessage')
jest.mock('js/components/Logo/Logo')
jest.mock('js/navigation/navigation')

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({
  mainContent: () => <div>hi</div>,
  sidebarContent: () => (
    <ul>
      <li>thing</li>
    </ul>
  ),
})

describe('SettingsPage', () => {
  it('renders without error', () => {
    const mockProps = getMockProps()
    shallow(<SettingsPage {...mockProps} />).dive()
  })

  it('displays an error message when a "mainContent" child calls the showError prop', () => {
    const mockProps = getMockProps()
    mockProps.mainContent = ({ showError }) => (
      <div id="main-content-error-test" showError={showError} />
    )
    const wrapper = shallow(<SettingsPage {...mockProps} />).dive()

    // We should not show an error message yet.
    expect(wrapper.find(ErrorMessage).prop('open')).toBe(false)

    wrapper.find('div#main-content-error-test').prop('showError')(
      'We made a mistake :('
    )
    expect(wrapper.find(ErrorMessage).prop('open')).toBe(true)
    expect(wrapper.find(ErrorMessage).prop('message')).toEqual(
      'We made a mistake :('
    )
  })

  it('displays an error message when a "sidebarContent" child calls the showError prop', () => {
    const mockProps = getMockProps()
    mockProps.sidebarContent = ({ showError }) => (
      <div id="sidebar-content-error-test" showError={showError} />
    )
    const wrapper = shallow(<SettingsPage {...mockProps} />).dive()

    // We should not show an error message yet.
    expect(wrapper.find(ErrorMessage).prop('open')).toBe(false)

    wrapper.find('div#sidebar-content-error-test').prop('showError')(
      'We made a mistake :('
    )
    expect(wrapper.find(ErrorMessage).prop('open')).toBe(true)
    expect(wrapper.find(ErrorMessage).prop('message')).toEqual(
      'We made a mistake :('
    )
  })

  it('goes to the Tab dashboard when clicking the close IconButton', () => {
    const mockProps = getMockProps()
    const wrapper = shallow(<SettingsPage {...mockProps} />).dive()
    expect(goToDashboard).not.toHaveBeenCalled()
    wrapper.find(IconButton).simulate('click')
    expect(goToDashboard).toHaveBeenCalled()
  })
})
