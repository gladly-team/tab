import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import React from 'react'
import { hydrate, render } from 'react-dom'
import Root from 'js/root'
import { getUsername } from 'js/authentication/user'
import * as serviceWorker from 'js/serviceWorker'

// Start Sentry logger
// https://docs.sentry.io/clients/javascript/config/
const sentryDSN = process.env.REACT_APP_SENTRY_DSN
const sentryDebug = process.env.REACT_APP_SENTRY_DEBUG === 'true'
const sentryEnableAutoBreadcrumbs =
  process.env.REACT_APP_SENTRY_ENABLE_AUTO_BREADCRUMBS === 'true'
try {
  // Sentry also supports an "ignoreErrors" config option. We'll
  // try filtering manually because Sentry's ignoreErrors might not
  // support Regex.
  // https://docs.sentry.io/platforms/javascript/#decluttering-sentry
  const errorNamesToIgnore = [
    /^AbortError$/,
    /^GVLError$/, // tab-cmp (unhandled Quantcast rejection)
  ]
  const errorsMessagesToIgnore = [
    // FIXME: we should refactor to better handle network errors.
    /^Failed to fetch$/,
    /^Network Error$/,
    /^NetworkError when attempting to fetch resource.$/,
    /^A network error \(such as timeout, interrupted connection or unreachable host\)/,
    // This SecurityError occurs on Firefox when localStorage isn't available
    // in the new tab page context. We should handle this but will ignore
    // for now.
    /^The operation is insecure.$/,
    // Webpack chunk loading errors.
    /^Loading chunk/, // Webpack network error: "Loading CSS chunk [0] failed",
    /^Loading CSS chunk/, // Webpack network error: "Loading CSS chunk [0] failed",
    // tab-cmp (unhandled Quantcast rejection).
    /^Failed to read the 'localStorage' property from 'Window': Access is denied for this document.$/,
  ]

  Sentry.init({
    dsn: sentryDSN,
    environment: process.env.REACT_APP_SENTRY_STAGE,
    debug: sentryDebug,
    integrations: [new Integrations.ExtraErrorData()],
    // https://docs.sentry.io/clients/javascript/config/
    maxBreadcrumbs: sentryEnableAutoBreadcrumbs ? 100 : 0,
    // https://docs.sentry.io/error-reporting/configuration/filtering/?platform=browser#before-send
    beforeSend(event, hint) {
      const error = hint.originalException

      // Filter out errors with an undefined message.
      if (!error || !error.message) {
        return null
      }

      try {
        // Filter out ignored messages.
        if (
          errorNamesToIgnore.some(ignoredErr => ignoredErr.test(error.name)) ||
          errorsMessagesToIgnore.some(ignoredErr =>
            ignoredErr.test(error.message)
          )
        ) {
          return null
        }
      } catch (e) {
        console.error(e)
      }
      return event
    },
    // Only log errors that originate in our JS files.
    whitelistUrls: [
      /tab\.gladly\.io\/newtab\/static/,
      /prod-tab2017\.gladly\.io\/newtab\/static/,
      /dev-tab2017\.gladly\.io\/newtab\/static/,
      /tab\.gladly\.io\/search\/static/,
      /prod-tab2017\.gladly\.io\/search\/static/,
      /dev-tab2017\.gladly\.io\/search\/static/,
    ],
  })
} catch (e) {
  console.error(e)
}

// Add context to Sentry logs.
try {
  const username = getUsername()
  if (username) {
    // https://docs.sentry.io/platforms/javascript/#capturing-the-user
    Sentry.setUser({
      username: username,
    })
  }
} catch (e) {
  console.error(e)
}

const initApp = () => {
  require('./index.css')
  const rootElement = document.getElementById('root')
  if (rootElement && rootElement.hasChildNodes()) {
    hydrate(<Root />, rootElement, () => {})
  } else {
    render(<Root />, rootElement)
  }
}

initApp()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
