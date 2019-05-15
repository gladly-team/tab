/* eslint-env jest */
import React from 'react'

var mockAuthUser = {
  id: 'abc123xyz456',
  email: 'foo@example.com',
  username: 'example',
  isAnonymous: false,
  emailVerified: true,
}

export const __setMockAuthUser = newMockAuthUser => {
  mockAuthUser = newMockAuthUser
}

export const __mockWithUserWrappedFunction = jest.fn(
  ChildComponent => props => (
    <ChildComponent authUser={mockAuthUser} {...props} />
  )
)

export default jest.fn(options => __mockWithUserWrappedFunction)
