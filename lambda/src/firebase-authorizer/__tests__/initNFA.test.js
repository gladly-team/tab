/* eslint-env jest */
import { init } from 'next-firebase-auth'
import initNFA from '../initNFA'

jest.mock('next-firebase-auth')

afterEach(() => {
  jest.clearAllMocks()
})

const getMockArgs = () => ({
  firebaseProjectId: 'some-project-id',
  firebasePrivateKey: 'fake-super-secret-key',
  firebaseClientEmail: 'some-client-email',
  firebaseDatabaseURL: 'some-database-url',
  firebasePublicAPIKey: 'some-public-api-key',
  cookieKeys: ['fake-key-1', 'another-fake-key'],
})

describe('initNFA', () => {
  it('calls next-firebase-auth init', () => {
    expect.assertions()
    const input = getMockArgs()
    initNFA(input)
    expect(init).toHaveBeenCalled()
  })
})
