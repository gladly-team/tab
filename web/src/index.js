import * as Sentry from '@sentry/browser'
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
  Sentry.init({
    dsn: sentryDSN,
    environment: process.env.REACT_APP_SENTRY_STAGE,
    debug: sentryDebug,
    // https://docs.sentry.io/clients/javascript/config/
    maxBreadcrumbs: sentryEnableAutoBreadcrumbs ? 100 : 0,
    ignoreErrors: [/^AbortError/],
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

// Add context to Sentry logs
// https://docs.sentry.io/clients/javascript/usage/#tracking-users
try {
  const username = getUsername()
  if (username) {
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
  if (rootElement.hasChildNodes()) {
    hydrate(<Root />, rootElement, () => {
      // Remove prerendered JSS.
      // https://github.com/stereobooster/react-snap/issues/99#issuecomment-355663842
      // https://material-ui.com/guides/server-rendering/#the-client-side
      try {
        Array.from(document.querySelectorAll('[data-jss-snap]')).forEach(elem =>
          elem.parentNode.removeChild(elem)
        )
      } catch (e) {
        console.error(e)
      }
    })
  } else {
    render(<Root />, rootElement)
  }
}

// Mark all prerendered JSS so we can remove it on mount.
// https://github.com/stereobooster/react-snap/issues/99#issuecomment-355663842
// https://material-ui.com/guides/server-rendering/#the-client-side
try {
  window.snapSaveState = () => {
    Array.from(document.querySelectorAll('[data-jss]')).forEach(elem =>
      elem.setAttribute('data-jss-snap', '')
    )
  }
} catch (e) {
  console.error(e)
}

initApp()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
