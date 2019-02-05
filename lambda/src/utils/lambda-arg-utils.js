// https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
export const getMockLambdaContext = () => ({
  functionName: 'lambda-dev-newtabAppLambdaEdge',
  functionVersion: '2',
  invokedFunctionArn:
    'arn:aws:lambda:us-east-1:123456789:function:lambda-dev-newtabAppLambdaEdge',
  memoryLimitInMB: '128',
  awsRequestId: 'abc-123',
  logGroupName: 'xyz-123',
  logStreamName: '111-222',
  callbackWaitsForEmptyEventLoop: false,
})

// CloudFront event object:
// https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-cloudfront
export const getMockCloudFrontEventObject = () => ({
  Records: [
    {
      cf: {
        config: {
          distributionId: 'EDFDVBD6EXAMPLE',
        },
        request: {
          clientIp: '1234:9876',
          method: 'GET',
          uri: '/some/url/',
          headers: {
            host: [
              {
                key: 'Host',
                value: 'd111111abcdef8.cloudfront.net',
              },
            ],
            'user-agent': [
              {
                key: 'User-Agent',
                value: 'curl/7.51.0',
              },
            ],
          },
        },
      },
    },
  ],
})
