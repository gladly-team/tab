/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const mockProps = {
  children: <div>hi</div>,
}

describe('SettingsChildWrapper', () => {
  it('renders without error', () => {
    const SettingsChildWrapper = require('js/components/Settings/SettingsChildWrapperComponent')
      .default
    shallow(<SettingsChildWrapper {...mockProps} />)
  })

  it('has the expected style for the root component', () => {
    const SettingsChildWrapper = require('js/components/Settings/SettingsChildWrapperComponent')
      .default
    const wrapper = shallow(<SettingsChildWrapper {...mockProps} />)
    expect(wrapper.at(0).prop('style')).toEqual({
      padding: 20,
      minHeight: 400,
    })
  })
})
