/* eslint-env jest */

import { getLambdasFromServerlessConfig } from '../getLambdas'

/* eslint-disable-next-line import/no-unresolved */
import example from '../example/example'
/* eslint-disable-next-line import/no-unresolved */
import someService from '../someService/someService'

jest.mock('yamljs')
jest.mock('../someService/someService', () => ({}), { virtual: true })
jest.mock('../example/example', () => ({}), { virtual: true })

describe('test lambda function loading from Serverless YAML', () => {
  test('it creates correct lambda info from serverless.yml with no events', () => {
    const lambdas = getLambdasFromServerlessConfig({
      service: 'lambda',
      provider: {
        name: 'aws',
        runtime: 'nodejs4.3',
      },
    })
    expect(lambdas).toEqual([])
  })

  test('it creates correct lambda info from serverless.yml with one "get" event', () => {
    const lambdas = getLambdasFromServerlessConfig({
      service: 'lambda',
      provider: {
        name: 'aws',
        runtime: 'nodejs4.3',
      },
      functions: {
        example: {
          handler: 'example/example.serverlessHandler',
          events: [
            {
              http: {
                path: 'example/',
                method: 'get',
              },
            },
          ],
        },
      },
    })

    expect(lambdas).toEqual([
      {
        name: 'example',
        path: 'example/',
        httpMethod: 'get',
        handler: example.handler,
      },
    ])
  })

  test('it creates correct lambda info from serverless.yml with multiple HTTP events', () => {
    const lambdas = getLambdasFromServerlessConfig({
      service: 'lambda',
      provider: {
        name: 'aws',
        runtime: 'nodejs4.3',
      },
      functions: {
        example: {
          handler: 'example/example.serverlessHandler',
          events: [
            {
              http: {
                path: 'example/',
                method: 'get',
              },
            },
            {
              http: {
                path: 'example/',
                method: 'post',
              },
            },
          ],
        },
        someService: {
          handler: 'someService/someService.serverlessHandler',
          events: [
            {
              http: {
                path: 'some-action/',
                method: 'post',
              },
            },
          ],
        },
      },
    })

    expect(lambdas).toEqual([
      {
        name: 'example',
        path: 'example/',
        httpMethod: 'get',
        handler: example.handler,
      },
      {
        name: 'example',
        path: 'example/',
        httpMethod: 'post',
        handler: example.handler,
      },
      {
        name: 'someService',
        path: 'some-action/',
        httpMethod: 'post',
        handler: someService.handler,
      },
    ])
  })

  test('it ignores lambda functions that are not HTTP events', () => {
    const lambdas = getLambdasFromServerlessConfig({
      service: 'lambda',
      provider: {
        name: 'aws',
        runtime: 'nodejs4.3',
      },
      functions: {
        example: {
          handler: 'example/example.serverlessHandler',
          events: [
            {
              s3: 'some-s3-bucket',
            },
            {
              http: {
                path: 'example/',
                method: 'get',
              },
            },
            {
              http: {
                path: 'example/',
                method: 'post',
              },
            },
          ],
        },
        someService: {
          handler: 'someService/someService.serverlessHandler',
          events: [
            {
              http: {
                path: 'some-action/',
                method: 'post',
              },
            },
            {
              schedule: 'rate(10 minutes)',
            },
          ],
        },
      },
    })

    expect(lambdas).toEqual([
      {
        name: 'example',
        path: 'example/',
        httpMethod: 'get',
        handler: example.handler,
      },
      {
        name: 'example',
        path: 'example/',
        httpMethod: 'post',
        handler: example.handler,
      },
      {
        name: 'someService',
        path: 'some-action/',
        httpMethod: 'post',
        handler: someService.handler,
      },
    ])
  })
})
