/* eslint-env jest */

import React from 'react'
import {
  mount,
  shallow
} from 'enzyme'
import toJson from 'enzyme-to-json'
import {
  logout
} from 'js/authentication/user'
import {
  goTo,
  loginURL
} from 'js/navigation/navigation'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

jest.mock('js/authentication/user')
jest.mock('js/navigation/navigation')

afterEach(() => {
  jest.clearAllMocks()
})

describe('MissingEmailMessage tests', function () {
  it('renders without error', function () {
    const MissingEmailMessage = require('js/components/Authentication/MissingEmailMessage').default
    shallow(
      <MissingEmailMessage />
    )
  })

  it('restarts auth flow when clicking button', done => {
    const MissingEmailMessage = require('js/components/Authentication/MissingEmailMessage').default

    // @material-ui-1-todo: remove MuiThemeProvider wrapper
    const wrapper = mount(
      <MuiThemeProvider>
        <MissingEmailMessage />
      </MuiThemeProvider>
    )

    // @material-ui-1-todo: use specific selector
    const button = wrapper.find('[data-test-id="missing-email-message-button-container"] button')
    button.simulate('click')

    // Dealing with async methods triggered by `simulate`:
    // https://stackoverflow.com/a/43855794/1332513
    setImmediate(() => {
      expect(logout).toHaveBeenCalled()
      expect(goTo).toHaveBeenCalledWith(loginURL)
      done()
    })
  })

  it('matches expected snapshot', function () {
    const MissingEmailMessage = require('js/components/Authentication/MissingEmailMessage').default
    const wrapper = shallow(
      <MissingEmailMessage />
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
