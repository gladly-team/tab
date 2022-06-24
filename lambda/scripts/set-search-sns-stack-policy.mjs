// Call with Node v13+:
// AWS_PROFILE=some-admin-profile node scripts/set-search-sns-stack-policy.mjs

import AWS from 'aws-sdk'
import inquirer from 'inquirer'

const setUpCreds = async () => {
  // Support MFA:
  // https://github.com/aws/aws-sdk-js/pull/2126#issue-199310808
  const tokenCodeFn = (serial, cb) => {
    const resp = inquirer
      .prompt({
        name: 'token',
        type: 'input',
        default: '',
        message: `MFA token for ${serial}:`,
      })
      .then(r => {
        cb(null, r.token)
      })
      .catch(e => {
        console.log('error:', e)
        cb(e)
      })
  }
  const creds = new AWS.SharedIniFileCredentials({
    tokenCodeFn,
  })
  try {
    await creds.getPromise()
    AWS.config.credentials = creds
  } catch (e) {
    console.error('MFA credentials error:', e)
  }
}

await setUpCreds()

// TODO
const main = async () => {
  const s3 = new AWS.S3()
  try {
    const data = await s3.listBuckets({}).promise()
    console.log(data)
  } catch (e) {
    console.error(e)
  }
}

await main()
