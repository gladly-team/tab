/* eslint-env jest */

import {
  checkDeployValidity,
  getServerlessStageName
} from '../deployHelpers'

describe('checkDeployValidity helper', () => {
  it('throws an error if the deployment stage is not valid', () => {
    expect(() => {
      checkDeployValidity('fish', 'true')
    }).toThrow()
  })

  it(' throws an error if the `CI` env var is not set', () => {
    expect(() => {
      checkDeployValidity('DEV', null)
    }).toThrow()
  })

  it(' throws an error if the `CI` env var is a string other than "true"', () => {
    expect(() => {
      checkDeployValidity('DEV', 'yes')
    }).toThrow()
  })

  it('succeeds as expected', () => {
    checkDeployValidity('DEV', 'true')
  })
})

describe('getServerlessStageName helper', () => {
  it('throws an error if the stage name is not valid', () => {
    expect(() => {
      getServerlessStageName('fish')
    }).toThrow()
  })

  it('succeeds as expected with "dev" stage', () => {
    checkDeployValidity('dev', 'true')
  })

  it('succeeds as expected with "prod" stage', () => {
    checkDeployValidity('prod', 'true')
  })

  it('is not case sensitive', () => {
    checkDeployValidity('DEV', 'true')
  })
})
