/* eslint-env jest */

import React from 'react'
import {
  shallow
} from 'enzyme'
import {
  checkIfEmailVerified
} from 'authentication/helpers'
import toJson from 'enzyme-to-json'

jest.mock('mutations/LogEmailVerifiedMutation')
jest.mock('authentication/helpers')

const mockProps = {}

afterEach(() => {
  jest.clearAllMocks()
})

describe('FirebaseAuthenticationUIAction tests', function () {
  it('renders without error and does not have any DOM elements', () => {
    const FirebaseAuthenticationUIAction = require('../FirebaseAuthenticationUIAction').default
    const wrapper = shallow(
      <FirebaseAuthenticationUIAction {...mockProps} />
    )
    expect(toJson(wrapper)).toEqual('')
  })

  it('calls checkIfEmailVerified on mount', async () => {
    expect.assertions(1)

    const FirebaseAuthenticationUIAction = require('../FirebaseAuthenticationUIAction').default
    shallow(
      <FirebaseAuthenticationUIAction {...mockProps} />
    )
    expect(checkIfEmailVerified).toHaveBeenCalledTimes(1)
  })
})
