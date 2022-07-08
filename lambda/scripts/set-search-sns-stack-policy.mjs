// Manage stack policies for all stack instances in the search-edge-request
// StackSet.
// Call with Node v13+:
// AWS_PROFILE=some-admin-profile node scripts/set-search-sns-stack-policy.mjs

/* eslint no-console: 0, import/no-extraneous-dependencies: 0 */

import AWS from 'aws-sdk'
import inquirer from 'inquirer'

// Change as needed.
const STACK_SET_NAME = 'dev-search-edge-request'

const stackPolicies = {
  DENY_ALL:
    '{"Statement":[{"Effect":"Deny","Principal":"*","Action":"Update:*","Resource":"*"}]}',
  ALLOW_MODIFY:
    '{"Statement":[{"Effect":"Allow","Principal":"*","Action":"Update:Modify","Resource":"*"}]}',
}

// Edit this to modify the policy you want to use.
const STACK_POLICY = stackPolicies.DENY_ALL

const setUpCreds = async () => {
  // Support MFA:
  // https://github.com/aws/aws-sdk-js/pull/2126#issue-199310808
  const tokenCodeFn = (serial, cb) => {
    inquirer
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
    AWS.config.update({ region: 'us-west-2' })
  } catch (e) {
    console.error('MFA credentials error:', e)
  }
}

const setStackPolicy = async () => {
  const cloudformation = new AWS.CloudFormation()
  let stackInstanceData
  try {
    stackInstanceData = await cloudformation
      .listStackInstances({
        StackSetName: STACK_SET_NAME,
      })
      .promise()
  } catch (e) {
    throw e
  }

  // AWS doesn't seem to return a stack name when usng listStackInstances.
  // Infer the stack names from stack IDs. Unsure if this is the best
  // approach but seems to work for stack sets.
  const getStackNameFromId = stackId => {
    return stackId.split('/')[1]
  }

  const stackInstances = stackInstanceData.Summaries.map(stackInstance => ({
    stackId: stackInstance.StackId,
    stackName: getStackNameFromId(stackInstance.StackId),
    region: stackInstance.Region,
  }))
  // console.log('=====')
  // console.log('All stack instance data:', stackInstanceData)
  // console.log('=====')
  // console.log('Stack instances:', stackInstances)
  // console.log('=====')

  // Update stack policies for all stack instances.
  await Promise.all(
    stackInstances.map(instance => {
      AWS.config.update({ region: instance.region })

      // Changing the region requires re-instantiating CloudFormation.
      const cloudformationRegion = new AWS.CloudFormation()
      return cloudformationRegion
        .setStackPolicy({
          StackName: instance.stackName,
          StackPolicyBody: STACK_POLICY,
        })
        .promise()
        .then(() => {
          console.log(
            `Successfully updated stack policy for ${instance.region}.`
          )
        })
        .catch(e => {
          console.error(
            `*** Failed to update stack policy for ${instance.region}.***`,
            e
          )
        })
    })
  )
}

const main = async () => {
  await setUpCreds()
  await setStackPolicy()
  console.log('Done!')
}

;(async () => {
  await main()
})()
