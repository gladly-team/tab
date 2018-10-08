/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import { cloneDeep } from 'lodash/lang'
import Joyride from 'react-joyride'
import Dialog from 'material-ui/Dialog'
import localStorageMgr from 'js/utils/localstorage-mgr'
import { STORAGE_NEW_USER_HAS_COMPLETED_TOUR } from '../../../constants'

jest.mock('js/utils/localstorage-mgr')

const mockProps = {
  user: {}
}

const numberOfJoyrideTourSteps = 3
const mockJoyrideCallbackData = {
  action: 'next',
  controlled: true,
  index: 1, // current step in the tour
  lifecycle: 'init',
  size: 3,
  status: 'running',
  step: {
    // step data here
  },
  type: 'step:before'
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

  it('does not run the Joyride tour until clicking through the first modal', () => {
    const NewUserTourComponent = require('../NewUserTourComponent').default
    const wrapper = shallow(
      <NewUserTourComponent {...mockProps} />
    )
    expect(wrapper.find(Joyride).first().prop('run')).toBe(false)

    // Mock a button click on the intro modal
    // It would be better to simulate a click on the button,
    // but that's difficult with the old Material UI dialog.
    // @material-ui-1-todo: find the dialog button and simulate a
    //   click instead of calling the method directly.
    wrapper.instance().introModalButtonClick()
    wrapper.update()
    expect(wrapper.find(Joyride).first().prop('run')).toBe(true)
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

  it('calls localStorage to mark that the user has completed the tour', () => {
    const NewUserTourComponent = require('../NewUserTourComponent').default
    const wrapper = shallow(
      <NewUserTourComponent {...mockProps} />
    )
    const joyrideComponent = wrapper.find(Joyride).first()
    const joyrideCallbackFn = joyrideComponent.prop('callback')

    // Mock that Joyride calls its callback to indicate the
    // tour is complete.
    const callbackData = cloneDeep(mockJoyrideCallbackData)
    callbackData.index = numberOfJoyrideTourSteps
    joyrideCallbackFn(callbackData)
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(STORAGE_NEW_USER_HAS_COMPLETED_TOUR, 'true')
  })
})
