# Backend Services for Tab

The backend for Tab is implemented using the [Serverless](https://serverless.com/) framework on [AWS Lambda](https://aws.amazon.com/lambda/).

## Creating a new endpoint

0. Choose a name for your endpoint. (e.g. `hearts`)
1. Create a new folder for your endpoint's code: `mkdir hearts`
1. Create a root file with the same name as your endpoint: `touch hearts/hearts.js`
1. Add a `serverless_handler` function to your endpoint's exports:

```javascript
const handler = event => {
  return Promise.resolve({
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello world from hearts!",
      input: event,
    }),
  })
}

const serverlessHandler = (event, context, callback) => {
  handler(event).then(response => callback(null, response))
}
module.exports = {
  handler: handler,
  serverlessHandler: serverlessHandler,
}
```

Try to keep the `serverlessHandler` function as minimal as possible, so that your code remains testable and usable outside the serverless framework.
The endpoint should also present a promise-based, event-driven `handler` function which takes an event and provides a `JSON` response and a status code.

4. Hook up your new endpoint in `serverless.yml`

```yaml
functions:
  hearts:
    handler: hearts/hearts.serverlessHandler
    events:
      - http:
          path: hearts/
          method: get
```

Nice work!

## Testing

You can invoke your functions locally using the `serverless` CLI: `serverless invoke local --function hearts`

You should also add a `__tests__/` subdirectory to every endpoint module so that `npm test` can pick up and run your tests. (You did write tests, right?)
