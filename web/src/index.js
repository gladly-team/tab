import 'babel-polyfill'
import Raven from 'raven-js'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Root from './root'
import { initializeFirebase } from 'authentication/firebaseConfig'

// Start Sentry logger
// https://docs.sentry.io/clients/javascript/config/
const sentryDSN = process.env.WEB_SENTRY_DSN
const sentryDebug = process.env.WEB_SENTRY_DEBUG === 'true'
try {
  Raven.config(sentryDSN, {
    environment: process.env.STAGE,
    debug: sentryDebug
  }).install()
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
      render(root)
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
  console.error(e)
  initApp()
}
