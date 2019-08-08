/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { logout } from 'js/authentication/user'
import { goTo, loginURL } from 'js/navigation/navigation'

jest.mock('js/authentication/user')
jest.mock('js/navigation/navigation')

afterEach(() => {
  jest.clearAllMocks()
})

describe('MissingEmailMessage tests', function() {
  it('renders without error', function() {
    const MissingEmailMessage = require('js/components/Authentication/MissingEmailMessage')
      .default
    shallow(<MissingEmailMessage />)
  })

  it('restarts auth flow when clicking button', done => {
    const MissingEmailMessage = require('js/components/Authentication/MissingEmailMessage')
      .default

    const wrapper = mount(<MissingEmailMessage />)
    const button = wrapper
      .find('[data-test-id="missing-email-message-button"]')
      .first()
    button.simulate('click')

    // Dealing with async methods triggered by `simulate`:
    // https://stackoverflow.com/a/43855794/1332513
    setImmediate(() => {
      expect(logout).toHaveBeenCalled()
      expect(goTo).toHaveBeenCalledWith(loginURL, null, { keepURLParams: true })
      done()
    })
  })

  it('matches expected snapshot', function() {
    const MissingEmailMessage = require('js/components/Authentication/MissingEmailMessage')
      .default
    const wrapper = shallow(<MissingEmailMessage />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
