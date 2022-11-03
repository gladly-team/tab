// Used in CloudFront origin response for tab-homepage.

import { get } from 'lodash/object'

const notFoundPaths = ['/404', '/404/', '/404.html']

exports.handler = (event, context, callback) => {
  const uri = get(event, 'Records[0].cf.request.uri', '')
  const { response } = event.Records[0].cf
  if (notFoundPaths.includes(uri)) {
    response.status = '404'
  }
  callback(null, response)
}
