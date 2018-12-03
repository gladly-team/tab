/* eslint-env jest */
import React from 'react'

export default jest.fn(options => ChildComponent => props => (
  <ChildComponent userId={'abc123xyz456'} {...props} />
))
