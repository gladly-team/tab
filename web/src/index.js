import Raven from 'raven-js'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Root from 'js/root'
import { initializeFirebase } from 'js/authentication/firebaseConfig'
import { getUsername } from 'js/authentication/user'

// Start Sentry logger
// https://docs.sentry.io/clients/javascript/config/
const sentryDSN = process.env.REACT_APP_SENTRY_DSN
const sentryDebug = process.env.REACT_APP_SENTRY_DEBUG === 'true'
const sentryEnableAutoBreadcrumbs = process.env.REACT_APP_SENTRY_ENABLE_AUTO_BREADCRUMBS === 'true'
try {
  Raven.config(sentryDSN, {
    environment: process.env.STAGE,
    debug: sentryDebug,
    // https://github.com/getsentry/raven-js/issues/723
    // https://docs.sentry.io/clients/javascript/config/
    autoBreadcrumbs: sentryEnableAutoBreadcrumbs,
    // Only log errors that originate in our JS files.
    whitelistUrls: [
      /tab\.gladly\.io\/newtab\/static/,
      /prod-tab2017\.gladly\.io\/newtab\/static/,
      /dev-tab2017\.gladly\.io\/newtab\/static/
    ]
  }).install()
} catch (e) {
  console.error(e)
}

// Add context to Sentry logs
// https://docs.sentry.io/clients/javascript/usage/#tracking-users
try {
  const username = getUsername()
  if (username) {
    Raven.setUserContext({
      username: username
    })
  }
} catch (e) {
  console.error(e)
}

const initApp = () => {
  // Init Firebase
  initializeFirebase()

  require('./index.css')

  const rootNode = document.createElement('div')
  document.body.appendChild(rootNode)

  const render = (Component) => {
    ReactDOM.render(
      <AppContainer >
        <Component />
      </AppContainer>,
      rootNode
    )
  }

  render(Root)

  // Hot Module Replacement API
  if (module.hot) {
    module.hot.accept('js/root', () => {
      render(Root)
    })
  }
}

try {
  Raven.context(() => {
    if (sentryDebug) {
      console.log(`Initialized Raven for Sentry DSN ${sentryDSN}`)
    }
    initApp()
  })
} catch (e) {
  console.error('Failed to wrap app in Raven.context', e)
  initApp()
}
