/* eslint-env jest */

// Use our react-relay QR mock for now.
import { QueryRenderer } from 'react-relay'
jest.mock('react-relay')

export default QueryRenderer
