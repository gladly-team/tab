// Manage stack policies for all stack instances in the search-edge-request
// StackSet.
// Call with Node v13+:
// AWS_PROFILE=some-admin-profile node scripts/set-search-sns-stack-policy.mjs

/* eslint no-console: 0, import/no-extraneous-dependencies: 0 */

import inquirer from 'inquirer'
import {
  CloudFormationClient,
  ListStackInstancesCommand,
  SetStackPolicyCommand,
} from '@aws-sdk/client-cloudformation'
import { fromIni } from '@aws-sdk/credential-providers'

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

const mfaCodeProvider = async serial => {
  try {
    const result = await inquirer.prompt({
      name: 'token',
      type: 'input',
      default: '',
      message: `MFA token for ${serial}:`,
    })
    return result.token
  } catch (e) {
    console.log('error:', e)
    throw e
  }
}

const setStackPolicy = async () => {
  const credentials = fromIni({
    mfaCodeProvider,
  })
  const cloudformation = new CloudFormationClient({
    credentials,
    region: 'us-west-2',
  })
  const listStackInstancesCommand = new ListStackInstancesCommand({
    StackSetName: STACK_SET_NAME,
  })
  let stackInstanceData
  try {
    stackInstanceData = await cloudformation.send(listStackInstancesCommand)
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
      // Changing the region requires re-instantiating CloudFormation.
      const cloudformationRegion = new CloudFormationClient({
        credentials,
        region: instance.region,
      })
      const setStackPolicyCommand = new SetStackPolicyCommand({
        StackName: instance.stackName,
        StackPolicyBody: STACK_POLICY,
      })
      return cloudformationRegion
        .send(setStackPolicyCommand)
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
  await setStackPolicy()
  console.log('Done!')
}

;(async () => {
  await main()
})()
