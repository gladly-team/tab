/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import Dialog from 'material-ui/Dialog'

const mockProps = {
  user: {}
}

describe('New user tour component', () => {
  it('renders without error', () => {
    const NewUserTourComponent = require('../NewUserTourComponent').default
    shallow(
      <NewUserTourComponent {...mockProps} />
    )
  })

  it('shows the intro dialog', () => {
    const NewUserTourComponent = require('../NewUserTourComponent').default
    const wrapper = shallow(
      <NewUserTourComponent {...mockProps} />
    )
    const introModal = wrapper.find(Dialog).first()
    expect(introModal.prop('open')).toBe(true)
    expect(introModal.prop('title')).toBe('Your tabs are changing the world!')
  })

  it('does not initially show the final dialog', () => {
    const NewUserTourComponent = require('../NewUserTourComponent').default
    const wrapper = shallow(
      <NewUserTourComponent {...mockProps} />
    )
    const finalModal = wrapper.find(Dialog).last()
    expect(finalModal.prop('open')).toBe(false)
    expect(finalModal.prop('title')).toBe("We're thrilled to have you!")
  })
})
