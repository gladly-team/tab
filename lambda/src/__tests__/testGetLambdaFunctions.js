/* global jest describe expect test */
'use strict'

jest.mock('yamljs')
jest.mock('../email/email')
jest.mock('../hearts/hearts')

const YAML = require('yamljs')
const hearts = require('../hearts/hearts')
const email = require('../email/email')

jest.unmock('../lambdas')
const lambdas = require('../lambdas')

describe('test lambda function loading from Serverless YAML', () => {
  test('it creates correct lambda info from serverless.yml with no events', () => {
    const config = {
      '../serverless.yml': {
        service: 'lambda',
        provider: {
          name: 'aws',
          runtime: 'nodejs4.3'
        }
      }
    }

    YAML.__setMockYAML(config)
    expect(lambdas()).toEqual([])
  })

  test('it creates correct lambda info from serverless.yml with one "get" event', () => {
    const config = {
      '../serverless.yml': {
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
      }
    }

    YAML.__setMockYAML(config)
    expect(lambdas()).toEqual([
      {
        name: 'hearts',
        path: 'hearts/',
        httpMethod: 'get',
        handler: hearts.handler
      }
    ])
  })

  test('it creates correct lambda info from serverless.yml with multiple HTTP events', () => {
    const config = {
      '../serverless.yml': {
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
      }
    }

    YAML.__setMockYAML(config)
    expect(lambdas()).toEqual([
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
    const config = {
      '../serverless.yml': {
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
      }
    }

    YAML.__setMockYAML(config)
    expect(lambdas()).toEqual([
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
