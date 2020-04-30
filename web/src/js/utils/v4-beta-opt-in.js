/* global fetch */

import { tabV4BetaOptInURL } from 'js/navigation/navigation'

/**
 * Calls an endpoint to set a cookie that opts the user
 * into Tab V4.
 */
const optIntoV4Beta = async () => {
  let response
  try {
    response = await fetch(tabV4BetaOptInURL, {
      method: 'POST',
      // eslint-disable-next-line no-undef
      headers: new Headers({
        // This custom header provides modest CSRF protection. See:
        // https://github.com/gladly-team/tab-web#authentication-approach
        'X-Gladly-Requested-By': 'tab-web-nextjs',
        'Content-Type': 'application/json',
      }),
      credentials: 'include',
      body: JSON.stringify({ optIn: true }),
    })
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    await response.json()
  } catch (e) {
    throw e
  }
  return response
}

export default optIntoV4Beta
