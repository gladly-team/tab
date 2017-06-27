/* eslint-env jest */

import { checkDeployValidity } from '../deployHelpers'

describe('deploy helpers', () => {
  it('validity check throws an error if the deployment stage is not valid', () => {
    expect(() => {
      checkDeployValidity('fish', 'true')
    }).toThrow()
  })

  it('validity check  throws an error if the `CI` env var is not set', () => {
    expect(() => {
      checkDeployValidity('DEV', null)
    }).toThrow()
  })

  it(' validity check throws an error if the `CI` env var is a string other than "true"', () => {
    expect(() => {
      checkDeployValidity('DEV', 'yes')
    }).toThrow()
  })

  it('validity check succeeds as expected', () => {
    checkDeployValidity('DEV', 'true')
  })
})
