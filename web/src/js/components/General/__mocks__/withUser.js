/* eslint-env jest */
import React from 'react'

export const __mockWithUserWrappedFunction = jest.fn(
  ChildComponent => props => (
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
  )
)

export default jest.fn(options => __mockWithUserWrappedFunction)
