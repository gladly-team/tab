import Raven from 'raven-js'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Root from './root'
import { initializeFirebase } from 'authentication/firebaseConfig'
import { getUsername } from 'authentication/user'

// Start Sentry logger
// https://docs.sentry.io/clients/javascript/config/
const sentryDSN = process.env.WEB_SENTRY_DSN
const sentryDebug = process.env.WEB_SENTRY_DEBUG === 'true'
const sentryEnableAutoBreadcrumbs = process.env.WEB_SENTRY_ENABLE_AUTO_BREADCRUMBS === 'true'
try {
  Raven.config(sentryDSN, {
    environment: process.env.STAGE,
    debug: sentryDebug,
    // https://github.com/getsentry/raven-js/issues/723
    // https://docs.sentry.io/clients/javascript/config/
    autoBreadcrumbs: sentryEnableAutoBreadcrumbs,
    whitelistUrls: [
      'tab.gladly.io',
      'prod-tab2017.gladly.io',
      'prod-tab2017-media.gladly.io',
      'dev-tab2017.gladly.io',
      'dev-tab2017-media.gladly.io'
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
    module.hot.accept('./root', () => {
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
