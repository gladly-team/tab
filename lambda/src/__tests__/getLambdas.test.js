/* eslint-env jest */
'use strict'

// import YAML from 'yamljs'
import hearts from '../hearts/hearts'
import email from '../email/email'
import { getLambdasFromServerlessConfig } from '../getLambdas'

jest.mock('yamljs')
jest.mock('../email/email')
jest.mock('../hearts/hearts')

describe('test lambda function loading from Serverless YAML', () => {
  test('it creates correct lambda info from serverless.yml with no events', () => {
    let lambdas = getLambdasFromServerlessConfig({
      service: 'lambda',
      provider: {
        name: 'aws',
        runtime: 'nodejs4.3'
      }
    })
    expect(lambdas).toEqual([])
  })

  test('it creates correct lambda info from serverless.yml with one "get" event', () => {
    let lambdas = getLambdasFromServerlessConfig({
      service: 'lambda',
      provider: {
        name: 'aws',
        runtime: 'nodejs4.3'
      },
      functions: {
        hearts: {
          handler: 'hearts/hearts.serverlessHandler',
          events: [
            {
              http: {
                path: 'hearts/',
                method: 'get'
              }
            }
          ]
        }
      }
    })

    expect(lambdas).toEqual([
      {
        name: 'hearts',
        path: 'hearts/',
        httpMethod: 'get',
        handler: hearts.handler
      }
    ])
  })

  test('it creates correct lambda info from serverless.yml with multiple HTTP events', () => {
    let lambdas = getLambdasFromServerlessConfig({
      service: 'lambda',
      provider: {
        name: 'aws',
        runtime: 'nodejs4.3'
      },
      functions: {
        hearts: {
          handler: 'hearts/hearts.serverlessHandler',
          events: [
            {
              http: {
                path: 'hearts/',
                method: 'get'
              }
            },
            {
              http: {
                path: 'hearts/',
                method: 'post'
              }
            }
          ]
        },
        email: {
          handler: 'email/email.serverlessHandler',
          events: [
            {
              http: {
                path: 'sendemail/',
                method: 'post'
              }
            }
          ]
        }
      }
    })

    expect(lambdas).toEqual([
      {
        name: 'hearts',
        path: 'hearts/',
        httpMethod: 'get',
        handler: hearts.handler
      },
      {
        name: 'hearts',
        path: 'hearts/',
        httpMethod: 'post',
        handler: hearts.handler
      },
      {
        name: 'email',
        path: 'sendemail/',
        httpMethod: 'post',
        handler: email.handler
      }
    ])
  })

  test('it ignores lambda functions that are not HTTP events', () => {
    let lambdas = getLambdasFromServerlessConfig({
      service: 'lambda',
      provider: {
        name: 'aws',
        runtime: 'nodejs4.3'
      },
      functions: {
        hearts: {
          handler: 'hearts/hearts.serverlessHandler',
          events: [
            {
              s3: 'some-s3-bucket'
            },
            {
              http: {
                path: 'hearts/',
                method: 'get'
              }
            },
            {
              http: {
                path: 'hearts/',
                method: 'post'
              }
            }
          ]
        },
        email: {
          handler: 'email/email.serverlessHandler',
          events: [
            {
              http: {
                path: 'sendemail/',
                method: 'post'
              }
            },
            {
              schedule: 'rate(10 minutes)'
            }
          ]
        }
      }
    })

    expect(lambdas).toEqual([
      {
        name: 'hearts',
        path: 'hearts/',
        httpMethod: 'get',
        handler: hearts.handler
      },
      {
        name: 'hearts',
        path: 'hearts/',
        httpMethod: 'post',
        handler: hearts.handler
      },
      {
        name: 'email',
        path: 'sendemail/',
        httpMethod: 'post',
        handler: email.handler
      }
    ])
  })
})
