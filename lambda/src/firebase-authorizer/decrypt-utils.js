/* eslint standard/no-callback-literal: 0, no-console: 0 */

import { KMSClient, DecryptCommand } from '@aws-sdk/client-kms'

const decryptValue = async encryptedKey => {
  // Decrypt code should run once and variables stored outside of the function
  // handler so that these are decrypted once per container
  const kms = new KMSClient()
  const decryptCommand = new DecryptCommand({
    CiphertextBlob: Buffer.from(encryptedKey, 'base64'),
  })
  try {
    const data = await kms.send(decryptCommand)
    // "When you use the HTTP API or the AWS CLI, the value is Base64-encoded.
    // Otherwise, it is not Base64-encoded."
    // https://docs.aws.amazon.com/kms/latest/APIReference/API_Decrypt.html#API_Decrypt_ResponseElements
    const privateKeyBase64Decoded = Buffer.from(data.Plaintext, 'base64')
    return privateKeyBase64Decoded.toString('ascii')
  } catch (err) {
    console.log('Decrypt error:', err)
    throw new Error('Error decrypting secure environnment variables.')
  }
}

export default decryptValue