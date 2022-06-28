import { get } from 'lodash/object'

exports.handler = async event => {
  const message = get(event, 'Records[0].Sns.Message')
  // TODO: remove when debugging
  // eslint-disable-next-line no-console
  console.log(message)
  return {
    some: 'stuff',
  }
}
