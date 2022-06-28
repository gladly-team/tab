import { get } from 'lodash/object'

exports.handler = async event => {
  const message = get(event, 'Records[0].Sns.Message')

  // TODO: Call the GraphQL service to log search. Use the appropriate
  //   endpoint for dev vs prod deployments.

  // TODO: remove when finished debugging
  // eslint-disable-next-line no-console
  console.log(message)

  return {
    some: 'stuff',
  }
}
