/* eslint-env jest */
import { init } from 'next-firebase-auth'
import initNFA from '../initNFA'

jest.mock('next-firebase-auth')

afterEach(() => {
  jest.clearAllMocks()
})

describe('initNFA', () => {
  it('calls next-firebase-auth init', () => {
    expect.assertions()
    initNFA()
    expect(init).toHaveBeenCalled()
  })
})
