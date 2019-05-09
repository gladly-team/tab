/* eslint-env jest */
import React from 'react'

export default jest.fn(options => ChildComponent => props => (
  <ChildComponent
    authUser={{
      id: 'abc123xyz456',
      email: 'foo@example.com',
      username: 'example',
      isAnonymous: false,
      emailVerified: true,
    }}
    {...props}
  />
))
