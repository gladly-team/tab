/* eslint-env jest */

import {
  createMockReactComponent
} from 'utils/test-utils'

export default createMockReactComponent('AuthUserComponent', {
  variables: {
    userId: 'abc123xyz456'
  }
})
