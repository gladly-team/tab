/* eslint-env jest */
import decryptValue from '../decrypt-utils'

jest.mock('@aws-sdk/client-kms')

afterEach(() => {
  jest.clearAllMocks()
})

describe('decryptValue', () => {
  it('returns converted value', async () => {
    const mockBuffer = Buffer.from('decrypted-firebase-key')
    const mockKMS = {
      send: jest.fn().mockReturnValue({
        Plaintext: mockBuffer,
      }),
    }
    const { KMSClient } = require('@aws-sdk/client-kms')
    KMSClient.mockImplementation(() => mockKMS)
    expect.assertions(1)
    expect(await decryptValue('encryptedKey')).toEqual('decrypted-firebase-key')
  })

  it('throws error if decrypting fails', async () => {
    const mockKMS = {
      send: jest.fn().mockRejectedValue('rejected'),
    }
    const { KMSClient } = require('@aws-sdk/client-kms')
    KMSClient.mockImplementation(() => mockKMS)
    expect.assertions(1)
    await expect(decryptValue('encryptedKey')).rejects.toThrow(
      'Error decrypting secure environnment variables.'
    )
  })
})
