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
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html#example-viewer-request
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
            'accept-language': [
              {
                key: 'Accept-Language',
                value: 'en-GB',
              },
            ],
            'cloudfront-viewer-country': [
              {
                key: 'CloudFront-Viewer-Country',
                value: 'UK',
              },
            ],
            cookie: [
              {
                key: 'Cookie',
                value:
                  'SomeCookie=ThisIsSomeCookieValue; another.cookie=abcdefghijklmnopqrstuvwxyz!',
              },
            ],
          },
          origin: {
            custom: {
              customHeaders: {},
              domainName: 'example.com',
              keepaliveTimeout: 5,
              path: '',
              port: 443,
              protocol: 'https',
              readTimeout: 30,
              sslProtocols: ['TLSv1', 'TLSv1.1', 'TLSv1.2'],
            },
          },
          querystring: '',
        },
      },
    },
  ],
})

// SNS event object
// https://docs.aws.amazon.com/lambda/latest/dg/with-sns.html
export const getMockSNSEventObject = () => ({
  Records: [
    {
      EventVersion: '1.0',
      EventSubscriptionArn:
        'arn:aws:sns:us-east-2:123456789012:sns-lambda:21be56ed-a058-49f5-8c98-aedd2564c486',
      EventSource: 'aws:sns',
      Sns: {
        SignatureVersion: '1',
        Timestamp: '2019-01-02T12:45:07.000Z',
        Signature:
          'tcc6faL2yUC6dgZdmrwh1Y4cGa/ebXEkAi6RibDsvpi+tE/1+82j...65r==',
        SigningCertUrl:
          'https://sns.us-east-2.amazonaws.com/SimpleNotificationService-ac565b8b1a6c5d002d285f9598aa1d9b.pem',
        MessageId: '95df01b4-ee98-5cb9-9903-4c221d41eb5e',
        Message: 'Hello from SNS!',
        MessageAttributes: {
          Test: {
            Type: 'String',
            Value: 'TestString',
          },
          TestBinary: {
            Type: 'Binary',
            Value: 'TestBinary',
          },
        },
        Type: 'Notification',
        UnsubscribeUrl:
          'https://sns.us-east-2.amazonaws.com/?Action=Unsubscribe&amp;SubscriptionArn=arn:aws:sns:us-east-2:123456789012:test-lambda:21be56ed-a058-49f5-8c98-aedd2564c486',
        TopicArn: 'arn:aws:sns:us-east-2:123456789012:sns-lambda',
        Subject: 'TestInvoke',
      },
    },
  ],
})
